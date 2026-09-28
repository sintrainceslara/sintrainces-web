/* SINTRAINCES ADMIN v1.48 */
/* SINTRAINCES v1.38.4 — módulo de dirigencia y CFS */
let sb = null;
let perfil = null;
let catalogos = { seccionales: [], cargos: [], estatus: [], cfs: [], motivosBaja: [] };

function cfg() {
  if (!window.SINTRAINCES_CONFIG) throw new Error("Falta config.js");
  sb = window.supabase.createClient(
    window.SINTRAINCES_CONFIG.SUPABASE_URL,
    window.SINTRAINCES_CONFIG.SUPABASE_PUBLISHABLE_KEY
  );
}

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function title(t, sub="") { return `<h1>${esc(t)}</h1><p>${esc(sub)}</p>`; }
function fechaLocalPDF(d){ return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`; }
function formatDate(value) { const s=String(value??"").slice(0,10); const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? `${m[3]}/${m[2]}/${m[1]}` : (value?esc(value):"—"); }
function isoDate(value) { return value ? String(value).slice(0,10) : ""; }
function calcAge(value) { if(!value)return null; const d=new Date(value+"T00:00:00"); if(Number.isNaN(d.getTime()))return null; const n=new Date(); let age=n.getFullYear()-d.getFullYear(); const m=n.getMonth()-d.getMonth(); if(m<0 || (m===0 && n.getDate()<d.getDate()))age--; return age>=0&&age<=130?age:null; }
function edadRangoFechas(min,max){
  const hoy=new Date();
  const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const out={};
  if(max!=="" && max!=null){ const d=new Date(hoy); d.setFullYear(d.getFullYear()-(Number(max)+1)); d.setDate(d.getDate()+1); out.desde=iso(d); }
  if(min!=="" && min!=null){ const d=new Date(hoy); d.setFullYear(d.getFullYear()-Number(min)); out.hasta=iso(d); }
  return out;
}
function edadActualRow(row){ return row?.fecha_nacimiento ? calcAge(row.fecha_nacimiento) : (row?.edad ?? null); }
function cedulaNum(v){const n=Number(String(v??"").replace(/[^0-9]/g,""));return Number.isFinite(n)?n:0;}
function sortCedula(rows){return [...rows].sort((a,b)=>cedulaNum(a.cedula)-cedulaNum(b.cedula));}
function showLoginMessage(message, error=true) {
  const el = $("loginMsg"); el.textContent = message || "";
  el.style.color = error ? "#b42318" : "#027a48"; el.style.display = message ? "block" : "none";
}
function clearLoginMessage() { const el=$("loginMsg"); el.textContent=""; el.style.display="none"; }
function roleLabel(rol) { return ({admin_nacional:"Administrador nacional",admin_seccional:"Administrador seccional",afiliado:"Afiliado"})[rol] || rol || "—"; }
function canManage() { return perfil && ["admin_nacional","admin_seccional"].includes(perfil.rol); }
function accessHeaders(extra={}) {
  return { "apikey": window.SINTRAINCES_CONFIG.SUPABASE_PUBLISHABLE_KEY, "Authorization": "Bearer " + window.SINTRAINCES_ACCESS_TOKEN, ...extra };
}
async function api(path, options={}) {
  const base = window.SINTRAINCES_CONFIG.SUPABASE_URL;
  const isGet = !options.method || String(options.method).toUpperCase() === "GET";
  const requestOptions = { ...options, headers: accessHeaders(options.headers || {}) };
  if (isGet) {
    requestOptions.cache = "no-store";
    requestOptions.headers = { ...requestOptions.headers, "Cache-Control": "no-cache", "Pragma": "no-cache" };
  }
  const res = await fetch(base + path, requestOptions);
  const text = await res.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.hint || data?.details || `Supabase HTTP ${res.status}`);
  return { data, response: res };
}

function fillSelect(id, items, placeholder="Todos") {
  const el=$(id); if (!el) return;
  el.innerHTML = `<option value="">${esc(placeholder)}</option>` + items.map(x=>`<option value="${esc(x.id)}">${esc(x.nombre)}</option>`).join("");
}

async function cargarMotivosBaja() {
  const {data}=await api("/rest/v1/motivos_baja?select=id,codigo,tipo&order=codigo.asc");
  catalogos.motivosBaja=Array.isArray(data)?data:[];
  return catalogos.motivosBaja;
}
function esBaja(id){
  const item=catalogos.estatus.find(x=>String(x.id)===String(id));
  return String(item?.nombre||"").trim().toUpperCase()==="BAJA";
}
function actualizarCamposBaja(prefix="e"){
  const baja=esBaja($(prefix+"Estatus")?.value);
  const wrap=$(prefix+"BajaDatos");
  if(wrap) wrap.classList.toggle("hidden",!baja);
  const motivo=$(prefix+"MotivoBaja"), fecha=$(prefix+"FechaBaja");
  if(motivo) motivo.required=baja;
  if(fecha) fecha.required=baja;
}
function fillMotivosBaja(id, value=""){
  const el=$(id); if(!el)return;
  el.innerHTML='<option value="">Seleccione motivo</option>'+catalogos.motivosBaja.map(x=>`<option value="${esc(x.id)}">${esc(x.codigo)} — ${esc(x.tipo)}</option>`).join("");
  if(value)el.value=String(value);
}
function cfsForSeccional(id) {
  const list = id ? catalogos.cfs.filter(x => String(x.seccional_id) === String(id)) : catalogos.cfs;
  fillSelect("fCfs", list, "Todos los CFS");
}

async function cargarCatalogos() {
  const [sec, cargos, estatus, cfs] = await Promise.all([
    api("/rest/v1/seccionales?select=id,nombre&order=nombre.asc"),
    api("/rest/v1/cargos?select=id,nombre&order=id.asc"),
    api("/rest/v1/estatus?select=id,nombre&order=id.asc"),
    api("/rest/v1/cfs?select=id,nombre,codigo,seccional_id&order=nombre.asc&limit=500")
  ]);
  catalogos.seccionales = sec.data || [];
  catalogos.cargos = cargos.data || [];
  catalogos.estatus = estatus.data || [];
  catalogos.cfs = cfs.data || [];
}

function applyRoleScope(params) {
  if (perfil?.rol === "admin_seccional" && perfil.seccional_id) params.set("seccional_id", `eq.${perfil.seccional_id}`);
}

async function continuarConSesion(session, userEmailOverride="") {
  const user = session?.user;
  if (!session?.access_token || !user?.id) throw new Error("Supabase no devolvió una sesión válida.");
  window.SINTRAINCES_ACCESS_TOKEN = session.access_token;
  window.SINTRAINCES_USER_ID = user.id;
  window.SINTRAINCES_EMAIL = userEmailOverride || user.email || "";
  showLoginMessage("Autenticación correcta. Verificando perfil…", false);
  const { data, error: profileError } = await sb.rpc("mi_perfil_actual");
  if (profileError) throw profileError;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("El usuario autenticado no tiene un perfil SINTRAINCES autorizado.");
  if (!row.activo) throw new Error("El perfil está inactivo.");
  if (!["admin_nacional", "admin_seccional", "afiliado"].includes(row.rol)) throw new Error("El perfil tiene un rol no autorizado.");
  clearLoginMessage();
  $("loginMsg").style.display = "none";
  perfil = row;
  $("login").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("userName").textContent = row.nombre_completo || window.SINTRAINCES_EMAIL;
  $("userRole").textContent = roleLabel(row.rol);
  hidePasswordPanel();
  if (row.debe_cambiar_clave === true) showPasswordPanel();
  if (!canManage()) await portalAfiliado();
  else {
    $("main").innerHTML = title("Panel administrativo", "Acceso correcto. Cargando resumen…");
    cargarInicioDirecto();
  }
}

async function login(ev) {
  ev.preventDefault();
  showLoginMessage("Conectando con Supabase…", false);
  const userEmail = $("loginUser").value.trim();
  const password = $("loginPassword").value;
  if (!userEmail || !password) return showLoginMessage("Escriba el correo y la contraseña.", true);
  try {
    const { data: authData, error: authError } = await sb.auth.signInWithPassword({email:userEmail,password});
    if (authError) throw authError;
    await continuarConSesion(authData?.session, userEmail);
  } catch (err) {
    console.error(err);
    window.SINTRAINCES_ACCESS_TOKEN = null;
    window.SINTRAINCES_USER_ID = null;
    window.SINTRAINCES_EMAIL = null;
    showLoginMessage(err?.message || "No se pudo iniciar sesión.", true);
  }
}
async function cargarInicioDirecto() {
  const m=$("main"), token=window.SINTRAINCES_ACCESS_TOKEN, base=window.SINTRAINCES_CONFIG.SUPABASE_URL, anon=window.SINTRAINCES_CONFIG.SUPABASE_PUBLISHABLE_KEY;
  const headers={"apikey":anon,"Authorization":"Bearer "+token,"Prefer":"count=exact"};
  try {
    const afiliadosUrl=perfil?.rol==="admin_seccional" && perfil?.seccional_id
      ? base+`/rest/v1/afiliados?select=id&activo=eq.true&seccional_id=eq.${encodeURIComponent(perfil.seccional_id)}&limit=1`
      : base+"/rest/v1/afiliados?select=id&activo=eq.true&limit=1";
    const [a,s,c]=await Promise.all([fetch(afiliadosUrl,{headers}),fetch(base+"/rest/v1/seccionales?select=id&limit=1",{headers}),fetch(base+"/rest/v1/cfs?select=id&limit=1",{headers})]);
    const getCount=r=>{const cr=r.headers.get("content-range");return cr?cr.split("/")[1]:"—";};
    m.innerHTML=title("Inicio","Resumen del sistema SINTRAINCES");
    m.innerHTML+=`<div class="grid"><div class="stat">Afiliados activos<b>${getCount(a)}</b></div><div class="stat">Seccionales<b>${getCount(s)}</b></div><div class="stat">CFS<b>${getCount(c)}</b></div><div class="stat">Rol<b>${esc(roleLabel(perfil?.rol))}</b></div></div><div class="panel"><b>Usuario:</b> ${esc(perfil?.nombre_completo)}<br><b>Seguridad:</b> los datos se consultan mediante autenticación y políticas RLS.</div>`;
  } catch(e) { m.innerHTML+=`<div class="panel"><b>Acceso correcto.</b><p>El resumen no pudo cargarse todavía.</p><p>${esc(e.message||e)}</p></div>`; }
}

async function render(view) {
  const m=$("main"); if(!canManage()) return;
  if(view==="inicio") { await cargarInicioDirecto(); }
  else if(view==="afiliados") await afiliados(m);
  else if(view==="reportes") reportes(m);
  else if(view==="reclamos") await reclamosAdmin(m);
  else if(view==="solicitudes") solicitudes(m);
  else if(view==="usuarios") usuarios(m);
  else if(view==="organizacion") await organizacion(m);
  else if(view==="auditoria") auditoria(m);
}

async function afiliados(m) {
  m.innerHTML=`<div class="section-head"><div>${title("Afiliados","Consulta de los registros según tu alcance administrativo.")}</div><button id="nuevoAfiliado">+ Nuevo afiliado</button></div><div class="panel">
    <div class="filters affiliates-filters">
      <label>Buscar por cédula, apellido o nombre<input id="fTexto" placeholder="Ej.: 1510512 o Pérez"></label>
      <label>Seccional<select id="fSeccional"></select></label>
      <label>CFS<select id="fCfs"></select></label>
      <label>Sexo<select id="fSexo"><option value="">Todos</option><option value="F">Femenino</option><option value="M">Masculino</option></select></label>
      <label>Cargo<select id="fCargo"></select></label>
      <label>Estatus<select id="fEstatus"></select></label>
      <label>Edad mínima<input id="fMin" type="number" min="0" max="120" placeholder="Desde"></label>
      <label>Edad máxima<input id="fMax" type="number" min="0" max="120" placeholder="Hasta"></label>
    </div>
    <div class="filter-actions"><button id="buscar">Buscar</button><button id="limpiar" class="secondary">Limpiar filtros</button><span id="resultadoInfo" class="muted"></span></div>
    <div id="tabla" class="tablewrap"><div class="loading">Cargando catálogo…</div></div>
  </div>
  <div id="ficha" class="panel hidden"></div>`;
  await cargarCatalogos();
  fillSelect("fSeccional", catalogos.seccionales, "Todas las seccionales");
  fillSelect("fCargo", catalogos.cargos, "Todos los cargos");
  fillSelect("fEstatus", catalogos.estatus, "Todos los estatus");
  cfsForSeccional("");
  if(perfil?.rol==="admin_seccional") { $("fSeccional").value=String(perfil.seccional_id||""); $("fSeccional").disabled=true; cfsForSeccional(perfil.seccional_id); }
  $("fSeccional").addEventListener("change",e=>cfsForSeccional(e.target.value));
  $("buscar").onclick=buscarAfiliados; $("limpiar").onclick=limpiarFiltros; $("nuevoAfiliado").onclick=()=>nuevoAfiliado();
  $("fTexto").addEventListener("keydown",e=>{if(e.key==="Enter") buscarAfiliados();});
  await buscarAfiliados();
}

function limpiarFiltros(){
  ["fTexto","fMin","fMax"].forEach(id=>{if($(id)) $(id).value="";});
  ["fSeccional","fCfs","fSexo","fCargo","fEstatus"].forEach(id=>{if($(id)) $(id).value="";});
  if(perfil?.rol==="admin_seccional") { $("fSeccional").value=String(perfil.seccional_id||""); cfsForSeccional(perfil.seccional_id); }
  else cfsForSeccional("");
  buscarAfiliados();
}

async function buscarAfiliados(){
  const tabla=$("tabla"); if(!tabla) return;
  tabla.innerHTML=`<div class="loading">Consultando afiliados…</div>`;
  const params=new URLSearchParams();
  params.set("select","id,nro,nacionalidad,cedula,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,sexo,edad,activo,seccional_id,fecha_nacimiento,fecha_ingreso,cargo_id,estatus_id,cfs_id,ciudad,telefono,correo_electronico,direccion,motivo_baja_id,fecha_baja,seccionales(nombre),cargos(nombre),estatus(nombre),cfs(nombre,codigo),motivos_baja(codigo,tipo)");
  params.set("order","primer_apellido.asc,primer_nombre.asc"); params.set("limit","100");
  const texto=$("fTexto")?.value.trim(), sec=$("fSeccional")?.value, cfs=$("fCfs")?.value, sexo=$("fSexo")?.value, cargo=$("fCargo")?.value, est=$("fEstatus")?.value, min=$("fMin")?.value, max=$("fMax")?.value;
  if(texto){const t=texto.replaceAll(","," ").replaceAll("("," ").replaceAll(")"," "); params.set("or",`(cedula.ilike.*${encodeURIComponent(t)}*,primer_apellido.ilike.*${encodeURIComponent(t)}*,segundo_apellido.ilike.*${encodeURIComponent(t)}*,primer_nombre.ilike.*${encodeURIComponent(t)}*,segundo_nombre.ilike.*${encodeURIComponent(t)}*)`);}
  if(sec) params.set("seccional_id",`eq.${sec}`);
  if(cfs) params.set("cfs_id",`eq.${cfs}`);
  if(sexo) params.set("sexo",`eq.${sexo}`);
  if(cargo) params.set("cargo_id",`eq.${cargo}`);
  if(est) params.set("estatus_id",`eq.${est}`);
  const rangoEdad=edadRangoFechas(min,max);
  if(rangoEdad.desde && rangoEdad.hasta){
    params.set("and",`(fecha_nacimiento.gte.${rangoEdad.desde},fecha_nacimiento.lte.${rangoEdad.hasta})`);
  } else if(rangoEdad.desde){
    params.set("fecha_nacimiento",`gte.${rangoEdad.desde}`);
  } else if(rangoEdad.hasta){
    params.set("fecha_nacimiento",`lte.${rangoEdad.hasta}`);
  }
  if(perfil?.rol==="admin_seccional") params.set("seccional_id",`eq.${perfil.seccional_id}`);
  try {
    const {data,response}=await api("/rest/v1/afiliados?"+params.toString(),{headers:{"Prefer":"count=exact"}});
    const rows=sortCedula((data||[]).map(r=>({...r,edad:edadActualRow(r)}))); const cr=response.headers.get("content-range"); const total=cr?cr.split("/")[1]:rows.length;
    $("resultadoInfo").textContent=`Mostrando ${rows.length} de ${total} registros (máximo 100 por consulta)`;
    if(!rows.length){tabla.innerHTML=`<div class="empty">No se encontraron afiliados con los filtros seleccionados.</div>`; $("ficha").classList.add("hidden"); return;}
    tabla.innerHTML=`<table><thead><tr><th>Cédula</th><th>Apellidos</th><th>Nombres</th><th>Sexo</th><th>Edad</th><th>Seccional</th><th>Cargo</th><th>Estatus</th><th>CFS</th><th>F. nacimiento</th><th>F. ingreso</th><th></th></tr></thead><tbody>${rows.map(a=>`<tr><td>${esc(a.cedula)}</td><td>${esc(`${a.primer_apellido||""} ${a.segundo_apellido||""}`.trim())}</td><td>${esc(`${a.primer_nombre||""} ${a.segundo_nombre||""}`.trim())}</td><td>${esc(a.sexo)}</td><td>${esc(a.edad)}</td><td>${esc(a.seccionales?.nombre)}</td><td>${esc(a.cargos?.nombre)}</td><td>${esc(a.estatus?.nombre)}</td><td>${esc(a.cfs?.nombre||"—")}</td><td>${formatDate(a.fecha_nacimiento)}</td><td>${formatDate(a.fecha_ingreso)}</td><td><button class="small" data-ficha="${esc(a.id)}">Ficha</button></td></tr>`).join("")}</tbody></table>`;
    tabla.querySelectorAll("[data-ficha]").forEach(b=>b.addEventListener("click",async()=>{const btn=b;const id=btn.dataset.ficha;btn.disabled=true;btn.textContent="Consultando…";try{const fresh=await obtenerAfiliado(id);if(!fresh)throw new Error("No se encontró el afiliado.");mostrarFicha(fresh);}catch(e){tabla.insertAdjacentHTML("beforeend",`<div class="msg">No fue posible abrir la ficha: ${esc(e.message||e)}</div>`);}finally{btn.disabled=false;btn.textContent="Ficha";}}));
  } catch(e){$("resultadoInfo").textContent="";tabla.innerHTML=`<div class="msg">No fue posible consultar los afiliados: ${esc(e.message)}</div>`;}
}

function mostrarFicha(a){
  const f=$("ficha"); if(!f||!a)return; f.classList.remove("hidden");
  f.innerHTML=`<div class="ficha-head"><div><h2>Ficha del afiliado</h2><p>Consulta y actualización de campos autorizados.</p></div><div class="ficha-actions"><button id="generarConstancia" ${esBaja(a.estatus_id)?'disabled title="No disponible para estatus Baja"':''}>Generar constancia PDF</button><button id="editarFicha">Editar ficha</button><button id="cerrarFicha" class="secondary">Cerrar</button></div></div>
  <div class="ficha-grid"><div><span>Cédula</span><b>${esc(a.cedula)}</b></div><div><span>Nacionalidad</span><b>${esc(a.nacionalidad||"—")}</b></div><div><span>Número</span><b>${esc(a.nro||"—")}</b></div><div><span>Sexo</span><b>${esc(a.sexo||"—")}</b></div><div><span>Nombres</span><b>${esc(`${a.primer_nombre||""} ${a.segundo_nombre||""}`.trim())}</b></div><div><span>Apellidos</span><b>${esc(`${a.primer_apellido||""} ${a.segundo_apellido||""}`.trim())}</b></div><div><span>Edad</span><b>${esc(a.edad??"—")}</b></div><div><span>Fecha de nacimiento</span><b>${formatDate(a.fecha_nacimiento)}</b></div><div><span>Seccional</span><b>${esc(a.seccionales?.nombre||"—")}</b></div><div><span>CFS</span><b>${esc(a.cfs?.nombre||"—")}</b></div><div><span>Cargo</span><b>${esc(a.cargos?.nombre||"—")}</b></div><div><span>Estatus</span><b>${esc(a.estatus?.nombre||"—")}</b></div><div><span>Ciudad</span><b>${esc(a.ciudad||"—")}</b></div><div><span>Teléfono</span><b>${esc(a.telefono||"—")}</b></div><div><span>Correo electrónico</span><b>${esc(a.correo_electronico||"—")}</b></div><div><span>Dirección</span><b>${esc(a.direccion||"—")}</b></div><div><span>Fecha de ingreso</span><b>${formatDate(a.fecha_ingreso)}</b></div>${esBaja(a.estatus_id)?`<div><span>Motivo de baja</span><b>${esc(a.motivos_baja?.tipo||"—")}</b></div><div><span>Fecha de baja</span><b>${formatDate(a.fecha_baja)}</b></div>`:""}<div><span>Estado del registro</span><b>${a.activo?"Activo":"Inactivo"}</b></div></div>`;
  $("generarConstancia")?.addEventListener("click",()=>generarConstancia(a.id)); $("cerrarFicha").onclick=()=>f.classList.add("hidden"); $("editarFicha").onclick=()=>editarFicha(a); f.scrollIntoView({behavior:"smooth",block:"start"});
}
async function editarFicha(a){
  const f=$("ficha"); const secId=String(a.seccional_id||"");
  await cargarMotivosBaja();
  f.innerHTML=`<div class="ficha-head"><div><h2>Actualizar ficha</h2><p>Cédula, nacionalidad y número quedan protegidos.</p></div><button id="cancelarEdicion" class="secondary">Cancelar</button></div><form id="editarAfiliadoForm" class="edit-grid">
  <label>Primer apellido<input id="ePrimerApellido" value="${esc(a.primer_apellido)}"></label><label>Segundo apellido<input id="eSegundoApellido" value="${esc(a.segundo_apellido)}"></label><label>Primer nombre<input id="ePrimerNombre" value="${esc(a.primer_nombre)}"></label><label>Segundo nombre<input id="eSegundoNombre" value="${esc(a.segundo_nombre)}"></label><label>Sexo<select id="eSexo"><option value="">Seleccione</option><option value="F">Femenino</option><option value="M">Masculino</option></select></label><label>Fecha de nacimiento<input id="eFechaNacimiento" type="date" value="${isoDate(a.fecha_nacimiento)}"></label><label>Seccional<select id="eSeccional"></select></label><label>CFS<select id="eCfs"></select></label><label>Cargo<select id="eCargo"></select></label><label>Estatus<select id="eEstatus"></select></label><label>Ciudad<input id="eCiudad" value="${esc(a.ciudad)}"></label><label>Teléfono<input id="eTelefono" type="tel" value="${esc(a.telefono)}"></label><label>Correo electrónico<input id="eCorreo" type="email" value="${esc(a.correo_electronico)}"></label><label>Dirección<textarea id="eDireccion" rows="2">${esc(a.direccion)}</textarea></label><label>Fecha de ingreso<input id="eFechaIngreso" type="date" value="${isoDate(a.fecha_ingreso)}"></label>
  <div id="eBajaDatos" class="baja-datos hidden"><strong>Datos de la baja</strong><label>Motivo de baja<select id="eMotivoBaja"></select></label><label>Fecha de baja<input id="eFechaBaja" type="date" value="${isoDate(a.fecha_baja)}"></label></div>
  <div class="edit-actions"><button>Guardar cambios</button><button type="button" id="cancelarEdicion2" class="secondary">Cancelar</button><span id="editMsg" class="muted"></span></div></form>`;
  fillSelect("eSeccional",catalogos.seccionales,"Seleccione seccional"); fillSelect("eCargo",catalogos.cargos,"Seleccione cargo"); fillSelect("eEstatus",catalogos.estatus,"Seleccione estatus"); fillMotivosBaja("eMotivoBaja",a.motivo_baja_id); $("eSexo").value=a.sexo||""; $("eSeccional").value=secId; $("eCargo").value=String(a.cargo_id||""); $("eEstatus").value=String(a.estatus_id||""); actualizarCamposBaja();
  const fillEditCfs=()=>{const id=$("eSeccional").value;const list=id?catalogos.cfs.filter(x=>String(x.seccional_id)===String(id)):[];fillSelect("eCfs",list,"Seleccione CFS");if(a.cfs_id&&list.some(x=>String(x.id)===String(a.cfs_id)))$("eCfs").value=String(a.cfs_id);}; fillEditCfs(); if(perfil?.rol==="admin_seccional")$("eSeccional").disabled=true; $("eSeccional").addEventListener("change",fillEditCfs); $("eEstatus").addEventListener("change",()=>actualizarCamposBaja());
  const cancel=()=>mostrarFicha(a); $("cancelarEdicion").onclick=cancel; $("cancelarEdicion2").onclick=cancel;
  $("editarAfiliadoForm").onsubmit=async ev=>{
    ev.preventDefault(); const msg=$("editMsg"); msg.textContent="Guardando…";
    const seccionalId=perfil?.rol==="admin_seccional"?perfil.seccional_id:Number($("eSeccional").value||0); const baja=esBaja($("eEstatus").value);
    if(!seccionalId){msg.textContent="Debe seleccionar una seccional.";return;}
    if(baja && (!$("eMotivoBaja").value || !$("eFechaBaja").value)){msg.textContent="Al seleccionar Baja debe indicar el motivo y la fecha de la baja.";return;}
    const payload={primer_apellido:$("ePrimerApellido").value.trim()||null,segundo_apellido:$("eSegundoApellido").value.trim()||null,primer_nombre:$("ePrimerNombre").value.trim()||null,segundo_nombre:$("eSegundoNombre").value.trim()||null,sexo:$("eSexo").value||null,fecha_nacimiento:$("eFechaNacimiento").value||null,edad:calcAge($("eFechaNacimiento").value),seccional_id:seccionalId,cfs_id:$("eCfs").value?Number($("eCfs").value):null,cargo_id:$("eCargo").value?Number($("eCargo").value):null,estatus_id:$("eEstatus").value?Number($("eEstatus").value):null,ciudad:$("eCiudad").value.trim()||null,telefono:$("eTelefono").value.trim()||null,correo_electronico:$("eCorreo").value.trim()||null,direccion:$("eDireccion").value.trim()||null,fecha_ingreso:$("eFechaIngreso").value||null,motivo_baja_id:baja&&$("eMotivoBaja").value?Number($("eMotivoBaja").value):null,fecha_baja:baja&&$("eFechaBaja").value?$("eFechaBaja").value:null,activo:!baja,updated_at:new Date().toISOString()};
    try{const result=await api(`/rest/v1/afiliados?id=eq.${encodeURIComponent(a.id)}`,{method:"PATCH",headers:{"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify(payload)});const saved=Array.isArray(result.data)?result.data[0]:result.data;if(!saved)throw new Error("Supabase no devolvió el registro actualizado.");const fresh=await obtenerAfiliado(a.id);if(fresh)mostrarFicha(fresh);else msg.textContent="Cambios guardados correctamente.";}catch(e){msg.textContent="No se pudieron guardar los cambios: "+(e.message||e);}
  };
}

async function nuevoAfiliado(){
  const f=$("ficha"); if(!f)return; await cargarCatalogos(); await cargarMotivosBaja();
  const secDefault=perfil?.rol==="admin_seccional"?String(perfil.seccional_id||""):"";
  const activoDefault=catalogos.estatus.find(x=>String(x.nombre).toUpperCase()==="ACTIVO");
  f.classList.remove("hidden"); f.innerHTML=`<div class="ficha-head"><div><h2>Registrar nuevo afiliado</h2><p>Alta administrativa directa. Este registro también quedará asentado en Auditoría.</p></div><button id="cancelarNuevo" class="secondary">Cancelar</button></div><form id="nuevoAfiliadoForm" class="edit-grid">
  <label>Número<input id="nNro" placeholder="Opcional"></label><label>Nacionalidad<input id="nNacionalidad" value="V"></label><label>Cédula<input id="nCedula" required></label><label>Primer apellido<input id="nPrimerApellido"></label><label>Segundo apellido<input id="nSegundoApellido"></label><label>Primer nombre<input id="nPrimerNombre"></label><label>Segundo nombre<input id="nSegundoNombre"></label><label>Sexo<select id="nSexo"><option value="">Seleccione</option><option value="F">Femenino</option><option value="M">Masculino</option></select></label><label>Fecha de nacimiento<input id="nFechaNacimiento" type="date"></label><label>Seccional<select id="nSeccional"></select></label><label>CFS<select id="nCfs"></select></label><label>Cargo<select id="nCargo"></select></label><label>Estatus<select id="nEstatus"></select></label><label>Ciudad<input id="nCiudad"></label><label>Teléfono<input id="nTelefono" type="tel"></label><label>Correo electrónico<input id="nCorreo" type="email"></label><label>Dirección<textarea id="nDireccion" rows="2"></textarea></label><label>Fecha de ingreso<input id="nFechaIngreso" type="date"></label>
  <div id="nBajaDatos" class="baja-datos hidden"><strong>Datos de la baja</strong><label>Motivo de baja<select id="nMotivoBaja"></select></label><label>Fecha de baja<input id="nFechaBaja" type="date"></label></div>
  <div class="edit-actions"><button>Registrar afiliado</button><button type="button" id="cancelarNuevo2" class="secondary">Cancelar</button><span id="newMsg" class="muted"></span></div></form>`;
  fillSelect("nSeccional",catalogos.seccionales,"Seleccione seccional"); fillSelect("nCargo",catalogos.cargos,"Seleccione cargo"); fillSelect("nEstatus",catalogos.estatus,"Seleccione estatus"); fillMotivosBaja("nMotivoBaja"); if(secDefault)$("nSeccional").value=secDefault; if(activoDefault)$("nEstatus").value=String(activoDefault.id); $("nSeccional").disabled=perfil?.rol==="admin_seccional"; actualizarCamposBaja("n");
  const fillNewCfs=()=>{const id=$("nSeccional").value;const list=id?catalogos.cfs.filter(x=>String(x.seccional_id)===String(id)):[];fillSelect("nCfs",list,"Seleccione CFS");}; fillNewCfs(); $("nSeccional").addEventListener("change",fillNewCfs); $("nEstatus").addEventListener("change",()=>actualizarCamposBaja("n"));
  const close=()=>f.classList.add("hidden"); $("cancelarNuevo").onclick=close; $("cancelarNuevo2").onclick=close;
  $("nFechaNacimiento").addEventListener("change",()=>{});
  $("nuevoAfiliadoForm").onsubmit=async ev=>{ev.preventDefault();const msg=$("newMsg");msg.textContent="Registrando…";const baja=esBaja($("nEstatus").value);const secId=perfil?.rol==="admin_seccional"?perfil.seccional_id:Number($("nSeccional").value||0);if(!secId){msg.textContent="Debe seleccionar una seccional.";return;}if(!$("nCedula").value.trim()){msg.textContent="La cédula es obligatoria.";return;}if(baja&&(!$("nMotivoBaja").value||!$("nFechaBaja").value)){msg.textContent="Al seleccionar Baja debe indicar el motivo y la fecha de la baja.";return;}const payload={nro:$("nNro").value.trim()||null,nacionalidad:$("nNacionalidad").value.trim()||null,cedula:$("nCedula").value.trim(),primer_apellido:$("nPrimerApellido").value.trim()||null,segundo_apellido:$("nSegundoApellido").value.trim()||null,primer_nombre:$("nPrimerNombre").value.trim()||null,segundo_nombre:$("nSegundoNombre").value.trim()||null,sexo:$("nSexo").value||null,fecha_nacimiento:$("nFechaNacimiento").value||null,edad:calcAge($("nFechaNacimiento").value),estatus_id:$("nEstatus").value?Number($("nEstatus").value):null,cargo_id:$("nCargo").value?Number($("nCargo").value):null,seccional_id:secId,cfs_id:$("nCfs").value?Number($("nCfs").value):null,ciudad:$("nCiudad").value.trim()||null,telefono:$("nTelefono").value.trim()||null,correo_electronico:$("nCorreo").value.trim()||null,direccion:$("nDireccion").value.trim()||null,fecha_ingreso:$("nFechaIngreso").value||null,motivo_baja_id:baja&&$("nMotivoBaja").value?Number($("nMotivoBaja").value):null,fecha_baja:baja&&$("nFechaBaja").value?$("nFechaBaja").value:null,activo:!baja};try{const result=await api("/rest/v1/afiliados",{method:"POST",headers:{"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify(payload)});const saved=Array.isArray(result.data)?result.data[0]:result.data;if(!saved)throw new Error("Supabase no devolvió el nuevo afiliado.");msg.textContent="Afiliado registrado correctamente.";setTimeout(()=>{f.classList.add("hidden");buscarAfiliados();},500);}catch(e){msg.textContent="No se pudo registrar el afiliado: "+(e.message||e);}};
  f.scrollIntoView({behavior:"smooth",block:"start"});
}
async function obtenerAfiliado(id){
  const p=new URLSearchParams();
  p.set("select","id,nro,nacionalidad,cedula,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,sexo,edad,fecha_nacimiento,estatus_id,cargo_id,seccional_id,cfs_id,fecha_ingreso,activo,ciudad,telefono,correo_electronico,direccion,motivo_baja_id,fecha_baja,seccionales(nombre),cargos(nombre),estatus(nombre),cfs(nombre,codigo),motivos_baja(codigo,tipo)");
  p.set("id",`eq.${id}`);
  p.set("limit","1");
  const {data}=await api("/rest/v1/afiliados?"+p.toString());
  const row=data?.[0];
  if(!row)return null;
  const cp=new URLSearchParams();
  cp.set("select","ciudad");
  cp.set("id",`eq.${id}`);
  cp.set("limit","1");
  const cityResult=await api("/rest/v1/afiliados?"+cp.toString());
  const cityRow=cityResult.data?.[0];
  row.ciudad=cityRow && Object.prototype.hasOwnProperty.call(cityRow,"ciudad") ? cityRow.ciudad : null;
  return row;
}


function assetUrl(name){ return new URL(`assets/constancia/${name}`, document.baseURI).href; }
async function blobDataUrl(url){ const r=await fetch(url,{cache:"no-store"}); if(!r.ok) throw new Error(`No se pudo cargar ${url}`); const b=await r.blob(); return await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=reject;fr.readAsDataURL(b);}); }
function fitImage(w,h,maxW,maxH){ const k=Math.min(maxW/w,maxH/h); return {w:w*k,h:h*k}; }
async function generarConstancia(afiliadoId){
  try{
    if(!window.jspdf?.jsPDF) throw new Error("No se cargó el generador PDF.");
    const {data}=await api("/rest/v1/rpc/crear_constancia_afiliacion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({p_afiliado_id:Number(afiliadoId)})});
    const c=Array.isArray(data)?data[0]:data; if(!c?.codigo) throw new Error("Supabase no devolvió el código de constancia.");
    const a=await obtenerAfiliado(afiliadoId); if(!a) throw new Error("No se encontró el afiliado.");
    await crearPdfConstancia(a,c);
  }catch(e){ alert("No se pudo generar la constancia: "+(e.message||e)); }
}
async function emitirConstanciaPropia(){
  try{
    if(!perfil?.afiliado_id) throw new Error("Tu usuario todavía no está vinculado a un afiliado.");
    const {data}=await api("/rest/v1/rpc/crear_constancia_afiliacion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({p_afiliado_id:null})});
    const c=Array.isArray(data)?data[0]:data; if(!c?.codigo) throw new Error("No se recibió el código de constancia.");
    const a=await obtenerAfiliado(perfil.afiliado_id); if(!a) throw new Error("No se encontró tu registro de afiliado.");
    await crearPdfConstancia(a,c);
  }catch(e){ alert("No se pudo generar la constancia: "+(e.message||e)); }
}
async function crearPdfConstancia(a,c){
  const [logo,asi,csi,csa,psi,firma,sello]=await Promise.all([
    blobDataUrl(assetUrl("sintrainces.png")),blobDataUrl(assetUrl("asi.png")),blobDataUrl(assetUrl("csi.png")),blobDataUrl(assetUrl("csa.png")),blobDataUrl(assetUrl("psi.png")),blobDataUrl(assetUrl("firma.png")),blobDataUrl(assetUrl("sello.png"))
  ]);
  const qrHost=document.createElement("div"); qrHost.style.position="fixed"; qrHost.style.left="-10000px"; qrHost.style.top="-10000px"; document.body.appendChild(qrHost);
  new QRCode(qrHost,{text:`https://sintrainceslara.github.io/sintrainces-web/verificar.html?codigo=${encodeURIComponent(c.codigo)}`,width:180,height:180,correctLevel:QRCode.CorrectLevel.M});
  await new Promise(r=>setTimeout(r,100)); const qrCanvas=qrHost.querySelector("canvas"); const qrData=qrCanvas?.toDataURL("image/png"); qrHost.remove();
  if(!qrData) throw new Error("No fue posible generar el QR.");
  const {jsPDF}=window.jspdf, doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,H=297,L=18,R=192;
  // Cabecera institucional aprobada: logo grande -> nombre del sindicato -> raya -> organizaciones.
  const logoIm=new Image(); logoIm.src=logo; await new Promise(r=>{logoIm.onload=r});
  const logoFit=fitImage(logoIm.naturalWidth,logoIm.naturalHeight,145,43);
  const logoX=(W-logoFit.w)/2;
  doc.addImage(logo,"PNG",logoX,14,logoFit.w,logoFit.h,undefined,"FAST");
  const nombreSindicato="SINDICATO NACIONAL DE TRABAJADORES DEL INCES";
  doc.setFont("helvetica","bold"); doc.setFontSize(11.5); doc.setTextColor(23,63,122);
  const nombreY=14+logoFit.h+8;
  doc.text(nombreSindicato,105,nombreY,{align:"center"});
  doc.setDrawColor(23,78,166); doc.setLineWidth(.55); doc.line(20,nombreY+7,190,nombreY+7);
  // Logos de las organizaciones: pequeños, alineados y muy próximos a la cabecera.
  const orgs=[{d:asi,maxW:24,maxH:16},{d:csi,maxW:18,maxH:17},{d:csa,maxW:22,maxH:17},{d:psi,maxW:18,maxH:17}];
  const loaded=[];
  for(const o of orgs){ const im=new Image(); im.src=o.d; await new Promise(r=>{im.onload=r}); loaded.push({...o,im,s:fitImage(im.naturalWidth,im.naturalHeight,o.maxW,o.maxH)}); }
  const gap=4; const total=loaded.reduce((n,o)=>n+o.s.w,0)+gap*(loaded.length-1);
  let x=(W-total)/2; const orgTop=nombreY+11;
  for(const o of loaded){ doc.addImage(o.d,"PNG",x,orgTop+(17-o.s.h)/2,o.s.w,o.s.h,undefined,"FAST"); x+=o.s.w+gap; }
  const logosBottom=orgTop+17;
  doc.setDrawColor(210,214,220); doc.setLineWidth(.3); doc.line(20,logosBottom+5,190,logosBottom+5);
  doc.setFont("helvetica","bold"); doc.setFontSize(17); doc.setTextColor(23,32,51); doc.text("CONSTANCIA DE AFILIACIÓN",105,logosBottom+22,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(10.5); doc.setTextColor(60,66,78);
  const nombre=`${a.primer_nombre||""} ${a.segundo_nombre||""} ${a.primer_apellido||""} ${a.segundo_apellido||""}`.replace(/\s+/g," ").trim();
  const sec=a.seccionales?.nombre||"—", cargo=a.cargos?.nombre||"—", est=a.estatus?.nombre||"—";
  const ingreso=formatDate(a.fecha_ingreso), emit= new Date(c.emitida_en).toLocaleDateString("es-VE"), vence=new Date(c.vence_en).toLocaleDateString("es-VE");
  doc.text("Por medio de la presente se hace constar que:",105,logosBottom+39,{align:"center"});
  doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.setTextColor(23,78,166); doc.text(nombre,105,logosBottom+54,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(10.5); doc.setTextColor(60,66,78);
  const par=`titular de la cédula de identidad ${a.nacionalidad||""}-${a.cedula||""}, se encuentra afiliado(a) a SINTRAINCES, adscrito(a) a la Seccional ${sec}, con cargo ${cargo} y estatus ${est}.`;
  doc.text(doc.splitTextToSize(par,168),105,logosBottom+66,{align:"center",maxWidth:168});
  doc.setFont("helvetica","bold"); doc.setTextColor(23,32,51); doc.text(`Fecha de afiliación: ${ingreso}`,30,logosBottom+80); doc.text(`Seccional: ${sec}`,30,logosBottom+92); doc.text(`Código de verificación: ${c.codigo}`,30,logosBottom+104);
  doc.setFont("helvetica","normal"); doc.setTextColor(60,66,78); doc.text(`Emitida: ${emit}`,30,logosBottom+116); doc.text(`Válida hasta: ${vence}`,30,logosBottom+128);
  doc.setDrawColor(225,228,233); doc.roundedRect(25,223,112,49,4,4,"S");
  doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.text("Firma autorizada",81,232,{align:"center"});
  doc.addImage(firma,"PNG",58,235,46,23,undefined,"FAST");
  // Sello conservando exactamente su relación de aspecto.
  const sealW=25, sealH=sealW*(429/293); doc.addImage(sello,"PNG",114,228,sealW,sealH,undefined,"FAST");
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(80,86,96); doc.text("Presidencia de SINTRAINCES",81,267,{align:"center"});
  doc.addImage(qrData,"PNG",149,224,40,40,undefined,"FAST"); doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.text("Verificación",169,268,{align:"center"}); doc.setFont("helvetica","normal"); doc.text("Escanee el QR",169,273,{align:"center"});
  doc.setFontSize(8); doc.setTextColor(100,106,116); doc.text("Esta constancia tiene una vigencia de 30 días desde su fecha de emisión.",105,282,{align:"center"}); doc.text("La autenticidad puede verificarse mediante el código y QR indicados.",105,288,{align:"center"});
  doc.setDrawColor(23,78,166); doc.setLineWidth(.8); doc.line(L,276,R,276);
  const safe=nombre.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]/g,"").trim().replace(/\s+/g,"_"); doc.save(`Constancia_SINTRAINCES_${safe||a.cedula}.pdf`);
}
async function portalAfiliado(){
  try{
    const a=await obtenerAfiliado(perfil.afiliado_id); if(!a) throw new Error("No se encontró tu registro de afiliado.");
    const m=$("main"); const nombre=`${a.primer_nombre||""} ${a.segundo_nombre||""} ${a.primer_apellido||""} ${a.segundo_apellido||""}`.replace(/\s+/g," ").trim();
    m.innerHTML=title("Mi portal de afiliado","Consulta tu información y genera tu constancia de afiliación.")+`<div class="panel"><div class="ficha-head"><div><h2>${esc(nombre)}</h2><p>Cédula: ${esc(a.nacionalidad||"")}-${esc(a.cedula||"")}</p></div><button id="miConstancia" ${esBaja(a.estatus_id)?"disabled":""}>Generar constancia PDF</button></div><div class="ficha-grid"><div><span>Seccional</span><b>${esc(a.seccionales?.nombre||"—")}</b></div><div><span>Cargo</span><b>${esc(a.cargos?.nombre||"—")}</b></div><div><span>Estatus</span><b>${esc(a.estatus?.nombre||"—")}</b></div><div><span>Fecha de afiliación</span><b>${formatDate(a.fecha_ingreso)}</b></div><div><span>Ciudad</span><b>${esc(a.ciudad||"—")}</b></div><div><span>Teléfono</span><b>${esc(a.telefono||"—")}</b></div><div><span>Correo</span><b>${esc(a.correo_electronico||"—")}</b></div><div><span>Dirección</span><b>${esc(a.direccion||"—")}</b></div></div></div><div class="panel"><h3>Corrección de datos</h3><p>En la siguiente etapa habilitaremos la solicitud formal de corrección para que los cambios queden registrados en Auditoría.</p></div>`;
    $("miConstancia")?.addEventListener("click",emitirConstanciaPropia);
  }catch(e){$("main").innerHTML=title("Mi portal","No fue posible cargar tu información.")+`<div class="panel"><div class="msg">${esc(e.message||e)}</div></div>`;}
}

async function reportes(m){
  m.innerHTML=title("Reportes y estadísticas","Consulta, combina filtros y obtén resúmenes de afiliación sin modificar registros.")+`<div class="panel">
    <div class="filters affiliates-filters">
      <label>Seccional<select id="rSeccional"></select></label>
      <label>CFS<select id="rCfs"></select></label>
      <label>Sexo<select id="rSexo"><option value="">Todos</option><option value="F">Femenino</option><option value="M">Masculino</option></select></label>
      <label>Cargo<select id="rCargo"></select></label>
      <label>Estatus<select id="rEstatus"></select></label>
      <label>Edad mínima<input id="rMin" type="number" min="0" max="120"></label>
      <label>Edad máxima<input id="rMax" type="number" min="0" max="120"></label>
      <label>Tipo de reporte<select id="rTipo"><option value="general">Resumen general</option><option value="seccional">Por seccional</option><option value="cargo">Por cargo</option><option value="estatus">Por estatus</option><option value="sexo">Por sexo</option><option value="edad">Por edad</option><option value="cfs">Por CFS</option><option value="dashboard">Dashboard (resumen)</option></select></label>
    </div>
    <div class="filter-actions"><button id="generarReporte">Aplicar filtros</button><button id="limpiarReporte" class="secondary">Limpiar selección</button><button id="imprimirReporte" class="secondary">Imprimir</button><button id="pdfReporte" class="secondary">Guardar PDF</button><span id="reporteInfo" class="muted"></span></div>
    <div id="reporteResumen"></div>
    <div id="reporteTabla" class="tablewrap"><div class="empty">Seleccione los filtros y genere el reporte.</div></div>
  </div>`;
  await cargarCatalogos();
  fillSelect("rSeccional",catalogos.seccionales,"Todas las seccionales");
  fillSelect("rCargo",catalogos.cargos,"Todos los cargos");
  fillSelect("rEstatus",catalogos.estatus,"Todos los estatus");
  cfsForReport("");
  if(perfil?.rol==="admin_seccional"){
    $("rSeccional").value=String(perfil.seccional_id||"");
    $("rSeccional").disabled=true;
    cfsForReport(perfil.seccional_id);
  }
  $("rSeccional").addEventListener("change",e=>cfsForReport(e.target.value));
  $("generarReporte").onclick=generarReporte;
  $("limpiarReporte").onclick=limpiarReporteFiltros;
  $("imprimirReporte").onclick=()=>window.print();
  $("pdfReporte").onclick=()=>guardarReportePDF();
  await generarReporte();
}
function cfsForReport(id){const list=id?catalogos.cfs.filter(x=>String(x.seccional_id)===String(id)):catalogos.cfs;fillSelect("rCfs",list,"Todos los CFS");}
function agrupar(rows,keyFn){const map=new Map();rows.forEach(r=>{const k=keyFn(r)||"Sin dato";map.set(k,(map.get(k)||0)+1);});return [...map.entries()].sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0]),"es"));}
function reportStats(rows){
  const byStatus=agrupar(rows,r=>r.estatus?.nombre);
  const byCargo=agrupar(rows,r=>r.cargos?.nombre);
  const bySex=agrupar(rows,r=>r.sexo==="F"?"Femenino":r.sexo==="M"?"Masculino":"Sin dato");
  const bySec=agrupar(rows,r=>r.seccionales?.nombre);
  const byCfs=agrupar(rows,r=>r.cfs?.nombre);
  const byAge=agrupar(rows,r=>r.edad==null?"Sin edad":String(r.edad));
  const activos=rows.filter(r=>String(r.estatus?.nombre||"").toUpperCase()==="ACTIVO").length;
  const jubilados=rows.filter(r=>String(r.estatus?.nombre||"").toUpperCase()==="JUBILADO").length;
  const pensionados=rows.filter(r=>String(r.estatus?.nombre||"").toUpperCase()==="PENSIONADO").length;
  const bajas=rows.filter(r=>String(r.estatus?.nombre||"").toUpperCase()==="BAJA" || r.activo===false).length;
  const avg=rows.length?Math.round((rows.reduce((n,r)=>n+(Number(r.edad)||0),0)/rows.length)*10)/10:0;
  const card=(label,value)=>`<div class="stat report-stat" style="min-width:0;width:100%;"><span>${esc(label)}</span><b>${esc(value)}</b></div>`;
  return {byStatus,byCargo,bySex,bySec,byCfs,byAge,activos,jubilados,pensionados,bajas,avg,card};
}
function distHtml(title,items,rows){
  return `<div class="report-dist"><h3>${esc(title)}</h3><table><thead><tr><th>Clasificación</th><th>Total</th><th>%</th></tr></thead><tbody>${items.map(([k,v])=>`<tr><td>${esc(k)}</td><td>${v}</td><td>${rows.length?((v*100/rows.length).toFixed(1)+"%"):"0%"}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderReporteEstadistico(rows,tipo){
  const st=reportStats(rows), c=st.card;
  // El Dashboard muestra todos los resúmenes estadísticos, pero nunca el listado individual.
  if(tipo==="dashboard"){
    return `<div class="report-stats" style="display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:row;gap:10px;width:100%;">${c("Afiliados",rows.length)}${c("Activos",st.activos)}${c("Jubilados",st.jubilados)}${c("Pensionados",st.pensionados)}${c("Bajas",st.bajas)}${c("Edad promedio",st.avg||"—")}</div><div class="report-dist-grid">${distHtml("Resumen por seccional",st.bySec,rows)}${distHtml("Resumen por cargo",st.byCargo,rows)}${distHtml("Resumen por estatus",st.byStatus,rows)}${distHtml("Resumen por sexo",st.bySex,rows)}${distHtml("Resumen por edad",st.byAge,rows)}${distHtml("Resumen por CFS",st.byCfs,rows)}</div>`;
  }
  let html=`<div class="report-stats" style="display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:row;gap:10px;width:100%;">${c("Afiliados",rows.length)}${c("Activos",st.activos)}${c("Jubilados",st.jubilados)}${c("Pensionados",st.pensionados)}${c("Bajas",st.bajas)}${c("Edad promedio",st.avg||"—")}</div>`;
  // En los reportes se conserva el listado detallado de la versión anterior.
  // El selector de tipo añade una vista estadística encima del listado.
  if(tipo==="seccional") html+=distHtml("Distribución por seccional",st.bySec,rows);
  else if(tipo==="cargo") html+=distHtml("Distribución por cargo",st.byCargo,rows);
  else if(tipo==="estatus") html+=distHtml("Distribución por estatus",st.byStatus,rows);
  else if(tipo==="sexo") html+=distHtml("Distribución por sexo",st.bySex,rows);
  else if(tipo==="edad") html+=distHtml("Distribución por edad",st.byAge,rows);
  else if(tipo==="cfs") html+=distHtml("Distribución por CFS",st.byCfs,rows);
  return html;
}
function limpiarReporteFiltros(){
  $("rSeccional").value=perfil?.rol==="admin_seccional"?String(perfil.seccional_id||""):"";
  $("rSexo").value=""; $("rCargo").value=""; $("rEstatus").value=""; $("rMin").value=""; $("rMax").value=""; $("rTipo").value="dashboard";
  cfsForReport($("rSeccional").value);
  generarReporte();
}
async function generarReporte(){
  const box=$("reporteTabla");if(!box)return;
  box.innerHTML=`<div class="loading">Generando reporte…</div>`;
  const q=new URLSearchParams();
  q.set("select","id,cedula,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,sexo,edad,fecha_nacimiento,fecha_ingreso,seccional_id,cfs_id,cargo_id,estatus_id,ciudad,activo,motivo_baja_id,fecha_baja,seccionales(nombre),cargos(nombre),estatus(nombre),cfs(nombre,codigo),motivos_baja(codigo,tipo)");
  const sec=$("rSeccional")?.value,cfs=$("rCfs")?.value,sexo=$("rSexo")?.value,cargo=$("rCargo")?.value,est=$("rEstatus")?.value,min=$("rMin")?.value,max=$("rMax")?.value;
  if(sec)q.set("seccional_id",`eq.${sec}`);if(cfs)q.set("cfs_id",`eq.${cfs}`);if(sexo)q.set("sexo",`eq.${sexo}`);if(cargo)q.set("cargo_id",`eq.${cargo}`);if(est)q.set("estatus_id",`eq.${est}`);
  const rangoEdad=edadRangoFechas(min,max);
  if(rangoEdad.desde && rangoEdad.hasta){
    q.set("and",`(fecha_nacimiento.gte.${rangoEdad.desde},fecha_nacimiento.lte.${rangoEdad.hasta})`);
  } else if(rangoEdad.desde){
    q.set("fecha_nacimiento",`gte.${rangoEdad.desde}`);
  } else if(rangoEdad.hasta){
    q.set("fecha_nacimiento",`lte.${rangoEdad.hasta}`);
  }
  if(perfil?.rol==="admin_seccional")q.set("seccional_id",`eq.${perfil.seccional_id}`);
  const all=[];
  try{for(let offset=0;;offset+=1000){const p=new URLSearchParams(q);p.set("limit","1000");p.set("offset",String(offset));const {data}=await api("/rest/v1/afiliados?"+p.toString());const rows=data||[];all.push(...rows);if(rows.length<1000)break;}}
  catch(e){box.innerHTML=`<div class="msg">No fue posible generar el reporte: ${esc(e.message)}</div>`;return;}
  const rows=sortCedula(all.map(r=>({...r,edad:edadActualRow(r)}))),tipo=$("rTipo").value;
  const names={general:"Resumen general",seccional:"Reporte por seccional",cargo:"Reporte por cargo",estatus:"Reporte por estatus",cfs:"Reporte por CFS",sexo:"Reporte por sexo",edad:"Reporte por edad",dashboard:"Dashboard (resumen)"};
  $("reporteInfo").textContent=`${rows.length} registros`;
  $("reporteResumen").innerHTML=renderReporteEstadistico(rows,tipo);
  const head=`<div class="report-head"><strong>${names[tipo]||"Reporte"}</strong><span>${rows.length} registros</span></div>`;
  if(tipo==="dashboard"){
    box.innerHTML=head+`<div class="empty">El Dashboard muestra únicamente el resumen general. Seleccione otro tipo de reporte para consultar el listado detallado.</div>`;return;
  }
  if(!rows.length){box.innerHTML=head+`<div class="empty">No hay registros con los filtros seleccionados.</div>`;return;}
  box.innerHTML=head+`<table><thead><tr><th>Cédula</th><th>Apellidos</th><th>Nombres</th><th>Sexo</th><th>Edad</th><th>F. nacimiento</th><th>F. ingreso</th><th>Seccional</th><th>Cargo</th><th>Estatus</th><th>CFS</th><th>Ciudad</th></tr></thead><tbody>${rows.map(a=>`<tr><td>${esc(a.cedula)}</td><td>${esc(`${a.primer_apellido||""} ${a.segundo_apellido||""}`.trim())}</td><td>${esc(`${a.primer_nombre||""} ${a.segundo_nombre||""}`.trim())}</td><td>${esc(a.sexo||"—")}</td><td>${esc(a.edad??"—")}</td><td>${formatDate(a.fecha_nacimiento)}</td><td>${formatDate(a.fecha_ingreso)}</td><td>${esc(a.seccionales?.nombre||"—")}</td><td>${esc(a.cargos?.nombre||"—")}</td><td>${esc(a.estatus?.nombre||"—")}</td><td>${esc(a.cfs?.nombre||"—")}</td><td>${esc(a.ciudad||"—")}</td></tr>`).join("")}</tbody></table>`;
}

function guardarReportePDF(){
  const jsPDF=window.jspdf?.jsPDF;if(!jsPDF){alert("No está disponible el generador PDF.");return;}
  const tabla=$("reporteTabla")?.querySelector("table");if(!tabla){alert("Primero genere un reporte.");return;}
  const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
  doc.setFontSize(16);doc.text("SINTRAINCES — Reporte de afiliados",14,14);
  doc.setFontSize(9);doc.text($("reporteInfo")?.textContent||"",14,20);
  const headers=[...tabla.querySelectorAll("thead th")].map(x=>x.textContent.trim());
  const body=[...tabla.querySelectorAll("tbody tr")].map(tr=>[...tr.children].map(td=>td.textContent.trim()));
  if(typeof doc.autoTable==="function") doc.autoTable({head:[headers],body,startY:25,styles:{fontSize:6,cellPadding:1.5},headStyles:{fontSize:6},margin:{left:10,right:10}});
  else {let y=28;doc.setFontSize(6);body.slice(0,45).forEach(r=>{doc.text(r.join(" | ").slice(0,180),10,y);y+=4;});doc.setFontSize(7);doc.text("Nota: para listados extensos use Imprimir → Guardar como PDF.",10,200);}
  doc.save(`Reporte_SINTRAINCES_${new Date().toISOString().slice(0,10)}.pdf`);
}


const RECLAMO_ESTADOS = [["recibido","Recibido"],["en_revision","En revisión"],["en_gestion","En gestión"],["resuelto","Resuelto"],["cerrado","Cerrado"]];
const RECLAMO_TIPOS = { reclamo:"Reclamo", sugerencia:"Sugerencia" };
const RECLAMO_CATEGORIAS = { laboral:"Laboral", salarial_beneficios:"Salarial / beneficios", contratacion_colectiva:"Contratación colectiva", seguridad_salud:"Seguridad y salud laboral", jornada_horario:"Jornada / horario", discriminacion_acoso:"Discriminación o acoso", jubilacion_pension:"Jubilación / pensión", otro:"Otro" };
function estadoReclamoLabel(v){return RECLAMO_ESTADOS.find(x=>x[0]===v)?.[1]||v||"—";}
function tipoReclamoLabel(v){return RECLAMO_TIPOS[v]||v||"—";}
function categoriaReclamoLabel(v){return RECLAMO_CATEGORIAS[v]||v||"—";}
function nombreAfiliado(a){return `${a?.primer_nombre||""} ${a?.segundo_nombre||""} ${a?.primer_apellido||""} ${a?.segundo_apellido||""}`.replace(/\s+/g," ").trim();}

async function reclamosAdmin(m){
  m.innerHTML=title("Reclamos y Sugerencias","Gestión de casos recibidos por SINTRAINCES según tu alcance administrativo.")+`<div class="panel">
    <div class="filters reclamos-filters">
      <label>Buscar por cédula o nombre<input id="qReclamo" placeholder="Ej.: 1510512 o Pérez"></label>
      <label>Seccional<select id="qReclamoSeccional"></select></label>
      <label>Tipo<select id="qReclamoTipo"><option value="">Todos</option><option value="reclamo">Reclamo</option><option value="sugerencia">Sugerencia</option></select></label>
      <label>Categoría<select id="qReclamoCategoria"><option value="">Todas</option>${Object.entries(RECLAMO_CATEGORIAS).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join("")}</select></label>
      <label>Estado<select id="qReclamoEstado"><option value="">Todos</option>${RECLAMO_ESTADOS.map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label>
    </div>
    <div class="filter-actions"><button id="buscarReclamos">Buscar</button><button id="limpiarReclamos" class="secondary">Limpiar filtros</button><span id="reclamosInfo" class="muted"></span></div>
    <div id="reclamosTabla" class="tablewrap"><div class="loading">Cargando reclamos y sugerencias…</div></div>
  </div><div id="reclamoDetalle" class="panel hidden"></div>`;
  await cargarCatalogos(); fillSelect("qReclamoSeccional",catalogos.seccionales,"Todas las seccionales");
  if(perfil?.rol==="admin_seccional"){ $("qReclamoSeccional").value=String(perfil.seccional_id||""); $("qReclamoSeccional").disabled=true; }
  $("buscarReclamos").onclick=cargarReclamosAdmin;
  $("limpiarReclamos").onclick=()=>{["qReclamo","qReclamoTipo","qReclamoCategoria","qReclamoEstado"].forEach(id=>$(id).value="");if(perfil?.rol==="admin_seccional")$("qReclamoSeccional").value=String(perfil.seccional_id||"");else $("qReclamoSeccional").value="";cargarReclamosAdmin();};
  await cargarReclamosAdmin();
}

async function cargarReclamosAdmin(){
  const box=$("reclamosTabla"); if(!box)return; box.innerHTML='<div class="loading">Consultando casos…</div>';
  const q=new URLSearchParams();
  q.set("select","id,afiliado_id,tipo,categoria,asunto,descripcion,fecha_hecho,cfs_id,ciudad,sugerencia,estado,respuesta,atendido_por,created_at,updated_at,afiliados(id,cedula,nacionalidad,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,seccional_id,seccionales(id,nombre)),cfs(id,nombre,codigo)");
  q.set("order","created_at.desc"); q.set("limit","1000");
  const sec=$("qReclamoSeccional")?.value, tipo=$("qReclamoTipo")?.value, cat=$("qReclamoCategoria")?.value, est=$("qReclamoEstado")?.value;
  if(sec)q.set("afiliados.seccional_id",`eq.${sec}`);
  if(tipo)q.set("tipo",`eq.${tipo}`); if(cat)q.set("categoria",`eq.${cat}`); if(est)q.set("estado",`eq.${est}`);
  if(perfil?.rol==="admin_seccional")q.set("afiliados.seccional_id",`eq.${perfil.seccional_id}`);
  try{
    const {data}=await api("/rest/v1/reclamos_sugerencias?"+q.toString());
    let rows=Array.isArray(data)?data:[]; const term=($("qReclamo")?.value||"").trim().toLowerCase();
    if(term)rows=rows.filter(r=>`${r.afiliados?.cedula||""} ${nombreAfiliado(r.afiliados)} ${r.asunto||""}`.toLowerCase().includes(term));
    $("reclamosInfo").textContent=`${rows.length} caso(s) mostrado(s)`;
    if(!rows.length){box.innerHTML='<div class="empty">No hay casos con los filtros seleccionados.</div>';return;}
    box.innerHTML=`<table><thead><tr><th>Fecha</th><th>Tipo</th><th>Afiliado</th><th>Seccional</th><th>Categoría</th><th>Asunto</th><th>Estado</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td>${formatDate(r.created_at)}</td><td>${esc(tipoReclamoLabel(r.tipo))}</td><td>${esc(nombreAfiliado(r.afiliados))}<br><span class="muted">${esc(r.afiliados?.nacionalidad||"")}-${esc(r.afiliados?.cedula||"—")}</span></td><td>${esc(r.afiliados?.seccionales?.nombre||"—")}</td><td>${esc(categoriaReclamoLabel(r.categoria))}</td><td>${esc(r.asunto)}</td><td><span class="status-pill status-${esc(r.estado)}">${esc(estadoReclamoLabel(r.estado))}</span></td><td><button class="small" data-reclamo="${esc(r.id)}">Ver / gestionar</button></td></tr>`).join("")}</tbody></table>`;
    box.querySelectorAll("[data-reclamo]").forEach(b=>b.addEventListener("click",()=>abrirReclamoAdmin(rows.find(r=>String(r.id)===String(b.dataset.reclamo)))));
  }catch(e){box.innerHTML=`<div class="msg">No se pudieron consultar los casos: ${esc(e.message||e)}</div>`;$("reclamosInfo").textContent="Error de consulta";}
}

function abrirReclamoAdmin(r){
  if(!r)return; const d=$("reclamoDetalle"); d.classList.remove("hidden"); d.innerHTML=`<div class="section-head"><div><h2>${esc(r.asunto)}</h2><p>${esc(tipoReclamoLabel(r.tipo))} · ${esc(categoriaReclamoLabel(r.categoria))} · recibido ${formatDate(r.created_at)}</p></div><button id="cerrarDetalleReclamo" class="secondary">Cerrar detalle</button></div>
  <div class="ficha-grid"><div><span>Afiliado</span><b>${esc(nombreAfiliado(r.afiliados))}</b></div><div><span>Cédula</span><b>${esc(r.afiliados?.nacionalidad||"")}-${esc(r.afiliados?.cedula||"—")}</b></div><div><span>Seccional</span><b>${esc(r.afiliados?.seccionales?.nombre||"—")}</b></div><div><span>CFS</span><b>${esc(r.cfs?.nombre||"—")}</b></div><div><span>Ciudad</span><b>${esc(r.ciudad||"—")}</b></div><div><span>Fecha del hecho</span><b>${formatDate(r.fecha_hecho)}</b></div></div>
  <div class="case-text"><h3>Descripción</h3><p>${esc(r.descripcion).replace(/\n/g,"<br>")}</p><h3>Sugerencia del afiliado</h3><p>${esc(r.sugerencia).replace(/\n/g,"<br>")}</p></div>
  <div class="edit-grid reclamo-edit"><label>Estado<select id="dReclamoEstado">${RECLAMO_ESTADOS.map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label><label>Respuesta de SINTRAINCES<textarea id="dReclamoRespuesta" rows="5" placeholder="Escriba la respuesta o gestión realizada"></textarea></label></div>
  <div class="filter-actions"><button id="guardarReclamo">Guardar gestión</button><span id="reclamoGuardado" class="muted"></span></div>`;
  $("dReclamoEstado").value=r.estado||"recibido"; $("dReclamoRespuesta").value=r.respuesta||"";
  $("cerrarDetalleReclamo").onclick=()=>d.classList.add("hidden"); $("guardarReclamo").onclick=()=>guardarReclamoAdmin(r.id);
  d.scrollIntoView({behavior:"smooth",block:"start"});
}

async function guardarReclamoAdmin(id){
  const msg=$("reclamoGuardado"); msg.textContent="Guardando…";
  try{
    const payload={estado:$("dReclamoEstado").value,respuesta:$("dReclamoRespuesta").value.trim()||null,atendido_por:window.SINTRAINCES_USER_ID,updated_at:new Date().toISOString()};
    await api(`/rest/v1/reclamos_sugerencias?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(payload)});
    msg.textContent="Gestión guardada correctamente."; msg.style.color="#027a48"; await cargarReclamosAdmin();
  }catch(e){msg.textContent="No se pudo guardar: "+(e.message||e);msg.style.color="#b42318";}
}

function solicitudes(m){m.innerHTML=title("Solicitudes","Aprobación de afiliaciones y atención de solicitudes.")+`<div class="panel"><p>El módulo se implementará después de completar la consulta y ficha de afiliados.</p></div>`;}
async function usuarios(m){
  if(perfil?.rol!=="admin_nacional"){
    m.innerHTML=title("Usuarios","Administración de usuarios y permisos.")+`<div class="panel"><div class="notice">Solo el Administrador nacional puede administrar usuarios y permisos.</div></div>`;
    return;
  }
  m.innerHTML=title("Usuarios y permisos","Administra cuentas, roles, seccionales y estado de acceso.")+`<div class="panel">
    <div class="section-head"><div><b>Usuarios registrados</b><p class="muted">Los administradores se crean aquí. La cuenta de autenticación se registra con el correo y contraseña temporal indicados.</p></div><button id="nuevoUsuario">+ Nuevo usuario</button></div>
    <div class="filters affiliates-filters" style="margin-top:10px">
      <label>Buscar<input id="uBuscar" placeholder="Nombre o correo"></label>
      <label>Rol<select id="uRolFiltro"><option value="">Todos</option><option value="admin_nacional">Administrador nacional</option><option value="admin_seccional">Administrador seccional</option><option value="afiliado">Afiliado</option></select></label>
      <label>Seccional<select id="uSecFiltro"></select></label>
      <label>Estado<select id="uEstadoFiltro"><option value="">Todos</option><option value="true">Activos</option><option value="false">Inactivos</option></select></label>
    </div>
    <div class="filter-actions"><button id="uBuscarBtn">Consultar</button><button id="uLimpiar" class="secondary">Limpiar</button><span id="uInfo" class="muted"></span></div>
    <div id="usuariosTabla" class="tablewrap"><div class="loading">Cargando usuarios…</div></div>
  </div>
  <div id="usuarioEditor" class="panel hidden"></div>`;
  const secs=await obtenerSeccionalesUsuarios();
  fillSelect("uSecFiltro",secs,"Todas las seccionales");
  $("uBuscarBtn").onclick=()=>cargarUsuariosAdmin();
  $("uLimpiar").onclick=()=>{ $("uBuscar").value=""; $("uRolFiltro").value=""; $("uSecFiltro").value=""; $("uEstadoFiltro").value=""; cargarUsuariosAdmin(); };
  $("uBuscar").addEventListener("keydown",e=>{if(e.key==="Enter")cargarUsuariosAdmin();});
  $("nuevoUsuario").onclick=()=>editorUsuario(null,secs);
  await cargarUsuariosAdmin();
}
async function obtenerSeccionalesUsuarios(){
  const {data}=await api("/rest/v1/seccionales?select=id,nombre&order=nombre.asc&limit=100");
  return Array.isArray(data)?data:[];
}
async function cargarUsuariosAdmin(){
  const box=$("usuariosTabla"); if(!box)return;
  box.innerHTML='<div class="loading">Consultando usuarios…</div>';
  const q=new URLSearchParams();
  q.set("select","id,nombre_completo,rol,seccional_id,afiliado_id,debe_cambiar_clave,activo,created_at,updated_at");
  q.set("order","created_at.desc"); q.set("limit","500");
  const rol=$("uRolFiltro")?.value, sec=$("uSecFiltro")?.value, est=$("uEstadoFiltro")?.value, txt=$("uBuscar")?.value.trim().toLowerCase();
  if(rol)q.set("rol",`eq.${rol}`); if(sec)q.set("seccional_id",`eq.${sec}`); if(est)q.set("activo",`eq.${est}`);
  try{
    const {data}=await api("/rest/v1/perfiles?"+q.toString());
    let rows=Array.isArray(data)?data:[];
    if(txt)rows=rows.filter(r=>String(r.nombre_completo||"").toLowerCase().includes(txt)||String(r.id||"").toLowerCase().includes(txt));
    const secs=catalogos.seccionales.length?catalogos.seccionales:await obtenerSeccionalesUsuarios();
    const secName=id=>secs.find(x=>String(x.id)===String(id))?.nombre||"—";
    $("uInfo").textContent=`${rows.length} usuario(s)`;
    if(!rows.length){box.innerHTML='<div class="empty">No hay usuarios con los filtros seleccionados.</div>';return;}
    box.innerHTML=`<table><thead><tr><th>Nombre</th><th>Rol</th><th>Seccional</th><th>Afiliado</th><th>Estado</th><th>Cambio de clave</th><th>Creado</th><th>Acciones</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.nombre_completo||"—")}</td><td>${esc(roleLabel(r.rol))}</td><td>${esc(secName(r.seccional_id))}</td><td>${r.afiliado_id?esc(r.afiliado_id):"—"}</td><td>${r.activo?"Activo":"Inactivo"}</td><td>${r.debe_cambiar_clave?"Pendiente":"Actualizada"}</td><td>${esc(formatDate(r.created_at))}</td><td><button class="small" data-edit-user="${esc(r.id)}">Editar</button></td></tr>`).join("")}</tbody></table>`;
    box.querySelectorAll("[data-edit-user]").forEach(b=>b.onclick=async()=>{const row=rows.find(x=>x.id===b.dataset.editUser);editorUsuario(row,secs);});
  }catch(e){box.innerHTML=`<div class="msg">No se pudieron consultar los usuarios: ${esc(e.message||e)}</div>`;$("uInfo").textContent="Error";}
}
function editorUsuario(row,secs){
  const box=$("usuarioEditor"); if(!box)return; box.classList.remove("hidden");
  const isNew=!row;
  box.innerHTML=`<div class="section-head"><div>${title(isNew?"Nuevo usuario":"Editar usuario",isNew?"Crea una cuenta administrativa con contraseña temporal.":"Actualiza rol, seccional o estado del perfil.")}</div><button id="cerrarEditorUsuario" class="secondary">Cerrar</button></div>
  ${isNew?`<div class="notice">La contraseña temporal debe tener al menos 8 caracteres. El usuario deberá cambiarla al ingresar por primera vez.</div>`:`<div class="notice">UUID: ${esc(row.id)}</div>`}
  <div class="edit-grid usuario-edit-grid">
    ${isNew?`<label>Correo electrónico<input id="uEmail" type="email" placeholder="usuario@correo.com" required></label><label>Contraseña temporal<input id="uPassword" type="password" minlength="8" required></label>`:`<label>Correo electrónico<input id="uEmail" value="" disabled></label>`}
    <label>Nombre completo<input id="uNombre" value="${esc(row?.nombre_completo||"")}" placeholder="Nombre y apellido"></label>
    <label>Rol<select id="uRol"><option value="admin_nacional">Administrador nacional</option><option value="admin_seccional">Administrador seccional</option><option value="afiliado">Afiliado</option></select></label>
    <label>Seccional<select id="uSec"></select></label>
    <label>Estado<select id="uActivo"><option value="true">Activo</option><option value="false">Inactivo</option></select></label>
    <label>Debe cambiar clave<select id="uCambio"><option value="true">Sí</option><option value="false">No</option></select></label>
  </div>
  <div class="filter-actions"><button id="guardarUsuario">${isNew?"Crear usuario":"Guardar cambios"}</button><span id="uEditorMsg" class="muted"></span></div>`;
  fillSelect("uSec",secs,"Sin seccional");
  if(row){$("uRol").value=row.rol||"admin_seccional";$("uSec").value=String(row.seccional_id||"");$("uActivo").value=String(row.activo!==false);$("uCambio").value=String(row.debe_cambiar_clave!==false);}
  const sync=()=>{const adminSec=$("uRol").value==="admin_seccional";$("uSec").disabled=!adminSec; if(!adminSec)$("uSec").value="";};
  $("uRol").onchange=sync;sync();
  $("cerrarEditorUsuario").onclick=()=>box.classList.add("hidden");
  $("guardarUsuario").onclick=()=>guardarUsuarioAdmin(row);
}
async function guardarUsuarioAdmin(row){
  const msg=$("uEditorMsg"); msg.textContent="Guardando…";
  try{
    const nombre=$("uNombre").value.trim(), rol=$("uRol").value, sec=$("uSec").value||null, activo=$("uActivo").value==="true", cambio=$("uCambio").value==="true";
    if(!nombre)throw new Error("Indique el nombre completo.");
    if(rol==="admin_seccional"&&!sec)throw new Error("Un administrador seccional debe tener una seccional.");
    if(row){
      const body={nombre_completo:nombre,rol,seccional_id:sec?Number(sec):null,activo,debe_cambiar_clave:cambio,updated_at:new Date().toISOString()};
      await api(`/rest/v1/perfiles?id=eq.${encodeURIComponent(row.id)}`,{method:"PATCH",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(body)});
      msg.textContent="Cambios guardados.";
    }else{
      const email=$("uEmail").value.trim(), password=$("uPassword").value;
      if(!email||!password)throw new Error("Indique correo y contraseña temporal.");
      if(password.length<8)throw new Error("La contraseña temporal debe tener al menos 8 caracteres.");
      // La creación administrativa ya no usa auth.signUp() desde el navegador.
      // Se realiza mediante una Edge Function segura para evitar el envío automático
      // de correos y mantener las credenciales privilegiadas fuera de GitHub Pages.
      const fnUrl=`${window.SINTRAINCES_CONFIG.SUPABASE_URL}/functions/v1/crear-usuario-admin`;
      const res=await fetch(fnUrl,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "apikey":window.SINTRAINCES_CONFIG.SUPABASE_PUBLISHABLE_KEY,
          "Authorization":"Bearer "+window.SINTRAINCES_ACCESS_TOKEN
        },
        body:JSON.stringify({email,password,nombre_completo:nombre,rol,seccional_id:sec?Number(sec):null})
      });
      const result=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(result?.message||result?.error||`Edge Function HTTP ${res.status}`);
      if(!result?.user_id)throw new Error("La función no devolvió el ID del usuario creado.");
      msg.textContent="Usuario creado correctamente. Debe cambiar la clave al ingresar.";
    }
    await cargarUsuariosAdmin();
  }catch(e){msg.textContent="No se pudo guardar: "+(e.message||e);msg.style.color="#b42318";}
}

async function organizacion(m){
  if(perfil?.rol!=="admin_nacional"){
    m.innerHTML=title("Organización sindical","Estructura de dirigencia y Centros de Formación del INCES.")+`<div class="panel"><div class="notice">Solo el Administrador nacional puede administrar la estructura sindical y los CFS.</div></div>`;
    return;
  }
  // Este módulo también debe cargar sus catálogos de forma independiente.
  // De lo contrario, si el usuario entra directamente a Organización sindical,
  // catalogos.seccionales puede estar vacío y el combo aparece sin opciones.
  await cargarCatalogos();
  m.innerHTML=title("Organización sindical","Administra CEN, Tribunal Disciplinario, directivas seccionales y CFS.")+`
    <div class="org-tabs">
      <button id="tabDirigencia">Dirigencia sindical</button>
      <button id="tabCfs" class="secondary">Centros de Formación (CFS)</button>
    </div>
    <div id="orgContenido"></div>`;
  $("tabDirigencia").onclick=()=>{ $("tabDirigencia").classList.remove("secondary"); $("tabCfs").classList.add("secondary"); cargarDirigencia(); };
  $("tabCfs").onclick=()=>{ $("tabCfs").classList.remove("secondary"); $("tabDirigencia").classList.add("secondary"); cargarGestionCfs(); };
  await cargarDirigencia();
}

async function cargarDirigencia(){
  const box=$("orgContenido"); if(!box)return;
  box.innerHTML=`<div class="panel"><div class="filters affiliates-filters">
    <label>Órgano<select id="dOrgan"><option value="">Todos</option><option value="CEN">Comité Ejecutivo Nacional</option><option value="TRIBUNAL">Tribunal Disciplinario</option><option value="SECCIONAL">Directivas seccionales</option></select></label>
    <label>Seccional<select id="dSeccional"></select></label>
    <label>Estado<select id="dEstado"><option value="">Todos</option><option value="ocupado">Ocupados</option><option value="vacante">Vacantes</option></select></label>
    <label>Buscar cargo o cédula<input id="dBuscar" placeholder="Ej.: Secretario o 9547380"></label>
  </div><div class="filter-actions"><button id="dConsultar">Consultar</button><button id="dLimpiar" class="secondary">Limpiar</button><button id="dNuevo" class="secondary">+ Nuevo cargo</button><span id="dInfo" class="muted"></span></div>
  <div id="dirigenciaTabla" class="tablewrap"><div class="loading">Consultando estructura…</div></div></div>
  <div id="dirigenciaEditor" class="panel hidden"></div>`;
  fillSelect("dSeccional",catalogos.seccionales,"Todas las seccionales");
  // La selección de seccional solo aplica a las Directivas seccionales.
  // Al elegir ese órgano, el filtro queda explícitamente habilitado;
  // para CEN y Tribunal se limpia y deshabilita para evitar filtros incoherentes.
  const syncDirigenciaSeccional=()=>{
    const esSeccional=$("dOrgan").value==="SECCIONAL";
    $("dSeccional").disabled=!esSeccional;
    if(!esSeccional) $("dSeccional").value="";
  };
  $("dOrgan").addEventListener("change",syncDirigenciaSeccional);
  syncDirigenciaSeccional();
  $("dConsultar").onclick=cargarDirigenciaTabla;
  $("dLimpiar").onclick=()=>{$("dOrgan").value="";$("dSeccional").value="";$("dEstado").value="";$("dBuscar").value="";cargarDirigenciaTabla();};
  $("dBuscar").addEventListener("keydown",e=>{if(e.key==="Enter")cargarDirigenciaTabla();});
  $("dNuevo").onclick=()=>editorDirigencia(null);
  await cargarDirigenciaTabla();
}

function nombreAfiliadoDir(a){ if(!a)return "—"; return `${a.primer_nombre||""} ${a.segundo_nombre||""} ${a.primer_apellido||""} ${a.segundo_apellido||""}`.replace(/\s+/g," ").trim()||"—"; }
function organLabel(o){return ({CEN:"Comité Ejecutivo Nacional",TRIBUNAL:"Tribunal Disciplinario",SECCIONAL:"Directiva seccional"})[o]||o||"—";}

// Orden institucional de presentación de la dirigencia sindical.
const ORDEN_CEN = [
  "Presidente",
  "Secretario General",
  "Coordinador Nacional de Organización y Finanzas",
  "Coordinador Nacional de Reclamos y Conflictos Laborales",
  "Coordinador Nacional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
  "Coordinador Nacional de Capacitación Laboral, Sindical y Formación Profesional",
  "Coordinador Nacional de Protección a la Mujer, a la Familia y Equidad de Genero",
  "Coordinador Nacional de Comunicación, Redes Sociales, Actas y Correspondencias",
  "Coordinador Nacional de Jubilados",
  "Primer Vocal",
  "Segundo Vocal"
];
const ORDEN_TRIBUNAL = ["Presidente", "Vicepresidente", "Secretario", "Suplente 1", "Suplente 2"];
const ORDEN_SECCIONAL = [
  "Secretario General Seccional",
  "Coordinador Seccional de Organización y Finanzas",
  "Coordinador Seccional de Reclamo y Conflictos Laborales",
  "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
  "Coordinador Seccional de jubilados",
  "Vocal"
];
function normalizaCargoOrden(v){
  return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim().toLowerCase();
}
function ordenCargoDirigencia(row){
  const listas = row.organ === "CEN" ? ORDEN_CEN : row.organ === "TRIBUNAL" ? ORDEN_TRIBUNAL : ORDEN_SECCIONAL;
  const cargo = normalizaCargoOrden(row.cargo);
  const idx = listas.findIndex(x => normalizaCargoOrden(x) === cargo);
  return idx >= 0 ? idx : 999;
}
function ordenarDirigencia(rows){
  const organOrden = {CEN:0, TRIBUNAL:1, SECCIONAL:2};
  return [...rows].sort((a,b)=>{
    const oa = organOrden[a.organ] ?? 99, ob = organOrden[b.organ] ?? 99;
    if(oa !== ob) return oa - ob;
    if(a.organ === "SECCIONAL" && b.organ === "SECCIONAL") {
      const sa = String(a.seccionales?.nombre||"").localeCompare(String(b.seccionales?.nombre||""),"es",{sensitivity:"base"});
      if(sa !== 0) return sa;
    }
    const ca = ordenCargoDirigencia(a), cb = ordenCargoDirigencia(b);
    if(ca !== cb) return ca - cb;
    return String(a.cargo||"").localeCompare(String(b.cargo||""),"es",{sensitivity:"base"});
  });
}

async function cargarDirigenciaTabla(){
  const box=$("dirigenciaTabla"); if(!box)return; box.innerHTML='<div class="loading">Consultando estructura…</div>';
  const q=new URLSearchParams();
  q.set("select","id,organ,seccional_id,cargo,afiliado_id,fecha_inicio_gestion,fecha_fin_gestion,activo,created_at,updated_at,seccionales(nombre),afiliados(id,cedula,nacionalidad,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,seccional_id,seccionales(nombre))");
  q.set("activo","eq.true"); q.set("order","organ.asc,seccional_id.asc,cargo.asc"); q.set("limit","500");
  const organ=$("dOrgan")?.value, sec=$("dSeccional")?.value, estado=$("dEstado")?.value, txt=$("dBuscar")?.value.trim().toLowerCase();
  if(organ)q.set("organ",`eq.${organ}`); if(sec)q.set("seccional_id",`eq.${sec}`);
  try{
    const {data}=await api("/rest/v1/dirigencia_sindical?"+q.toString()); let rows=ordenarDirigencia(Array.isArray(data)?data:[]);
    if(estado==="ocupado")rows=rows.filter(r=>r.afiliado_id);
    if(estado==="vacante")rows=rows.filter(r=>!r.afiliado_id);
    if(txt)rows=rows.filter(r=>String(r.cargo||"").toLowerCase().includes(txt)||String(r.afiliados?.cedula||"").toLowerCase().includes(txt)||nombreAfiliadoDir(r.afiliados).toLowerCase().includes(txt));
    $("dInfo").textContent=`${rows.length} cargo(s)`;
    if(!rows.length){box.innerHTML='<div class="empty">No hay cargos con los filtros seleccionados.</div>';return;}
    box.innerHTML=`<table><thead><tr><th>Órgano</th><th>Seccional</th><th>Cargo</th><th>Cédula</th><th>Dirigente</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${rows.map(r=>{
      const ocupado=!!r.afiliado_id; const secName=r.seccionales?.nombre||"—";
      return `<tr><td>${esc(organLabel(r.organ))}</td><td>${esc(secName)}</td><td>${esc(r.cargo)}</td><td>${esc(r.afiliados?.cedula||"—")}</td><td>${esc(nombreAfiliadoDir(r.afiliados))}</td><td>${ocupado?"Ocupado":"VACANTE"}</td><td><button class="small" data-ed-dir="${r.id}">${ocupado?"Gestionar":"Asignar"}</button>${ocupado?` <button class="small secondary" data-const-dir="${r.id}">Constancia</button>`:""}</td></tr>`;
    }).join("")}</tbody></table>`;
    box.querySelectorAll("[data-ed-dir]").forEach(b=>b.onclick=()=>{const r=rows.find(x=>String(x.id)===String(b.dataset.edDir));editorDirigencia(r);});
    box.querySelectorAll("[data-const-dir]").forEach(b=>b.onclick=()=>{const r=rows.find(x=>String(x.id)===String(b.dataset.constDir));generarConstanciaDirigente(r);});
  }catch(e){box.innerHTML=`<div class="msg">No se pudo consultar la dirigencia: ${esc(e.message||e)}</div>`;$("dInfo").textContent="Error";}
}

function editorDirigencia(row){
  const box=$("dirigenciaEditor"); if(!box)return; box.classList.remove("hidden");
  const isNew=!row, ocupado=!!row?.afiliado_id;
  const inicioActual=row?.fecha_inicio_gestion?String(row.fecha_inicio_gestion).slice(0,10):"";
  box.innerHTML=`<div class="section-head"><div>${title(isNew?"Nuevo cargo sindical":"Gestionar cargo sindical",isNew?"Crea una posición; si no se asigna afiliado quedará VACANTE.":"Asigna, actualiza o libera el dirigente vinculado a este cargo.")}</div><button id="cerrarDirEditor" class="secondary">Cerrar</button></div>
  <div class="edit-grid">
    <label>Órgano<select id="dEditOrgan"><option value="CEN">Comité Ejecutivo Nacional</option><option value="TRIBUNAL">Tribunal Disciplinario</option><option value="SECCIONAL">Directiva seccional</option></select></label>
    <label>Seccional<select id="dEditSec"></select></label>
    <label>Cargo<input id="dEditCargo" placeholder="Nombre del cargo"></label>
    ${isNew?`<label>Cédula del afiliado (opcional)<input id="dEditCedula" placeholder="Dejar vacío para VACANTE"></label>`:`<label>Cédula del afiliado<input id="dEditCedula" value="${esc(row.afiliados?.cedula||"")}" placeholder="Dejar vacío para VACANTE"></label>`}
    <label>Inicio de gestión<input id="dEditInicio" type="date" value="${esc(inicioActual)}" ${!ocupado&&isNew?'disabled':''}></label>
  </div>
  <div class="panel" style="margin-top:12px"><div id="dAfiliadoEncontrado" class="muted">${ocupado?`Dirigente actual: <b>${esc(nombreAfiliadoDir(row.afiliados))}</b> — C.I. ${esc(row.afiliados?.cedula||"")}<br>Inicio de gestión: <b>${esc(formatDate(row.fecha_inicio_gestion)||"No registrado")}</b>`:"Cargo actualmente VACANTE."}</div></div>
  <div class="filter-actions"><button id="dBuscarAfiliado">Buscar afiliado</button><button id="dGuardarCargo">${isNew?"Crear cargo":"Guardar cambios"}</button><button id="dLiberarCargo" class="secondary" ${isNew||!ocupado?"disabled":""}>Dejar VACANTE</button><span id="dEditorMsg" class="muted"></span></div>`;
  fillSelect("dEditSec",catalogos.seccionales,"Seleccione seccional");
  if(row){$("dEditOrgan").value=row.organ;$("dEditSec").value=String(row.seccional_id||"");$("dEditCargo").value=row.cargo||"";}
  const sync=()=>{const sec=$("dEditOrgan").value==="SECCIONAL";$("dEditSec").disabled=!sec;if(!sec)$("dEditSec").value="";};
  const syncFecha=()=>{const tiene=!!$("dEditCedula")?.value.trim();$("dEditInicio").disabled=!tiene;};
  $("dEditOrgan").onchange=sync; sync(); syncFecha();
  $("dEditCedula").addEventListener("input",syncFecha);
  $("cerrarDirEditor").onclick=()=>box.classList.add("hidden");
  $("dBuscarAfiliado").onclick=()=>buscarAfiliadoDir();
  $("dEditCedula").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();buscarAfiliadoDir();}});
  $("dGuardarCargo").onclick=()=>guardarDirigencia(row);
  $("dLiberarCargo").onclick=()=>liberarDirigencia(row);
}

async function guardarDirigencia(row){
  const msg=$("dEditorMsg"); msg.textContent="Guardando…";
  try{
    const organ=$("dEditOrgan").value, sec=$("dEditSec").value||null, cargo=$("dEditCargo").value.trim(), ced=$("dEditCedula").value.trim(), inicio=$("dEditInicio").value||null;
    if(!cargo)throw new Error("Indique el cargo."); if(organ==="SECCIONAL"&&!sec)throw new Error("Seleccione la seccional.");
    let afiliado_id=null;
    if(ced){ await buscarAfiliadoDir(); afiliado_id=window._dirAfiliadoEncontrado?.id||null; if(!afiliado_id)throw new Error("Debe indicar una cédula de afiliado válida."); if(!inicio)throw new Error("Indique la fecha de inicio de la gestión."); }
    const body={organ,seccional_id:organ==="SECCIONAL"?Number(sec):null,cargo,afiliado_id,fecha_inicio_gestion:afiliado_id?(inicio||(row?.fecha_inicio_gestion||null)):(row?.fecha_inicio_gestion||null),fecha_fin_gestion:afiliado_id?null:(row?.afiliado_id?new Date().toISOString().slice(0,10):(row?.fecha_fin_gestion||null)),activo:true,updated_at:new Date().toISOString()};
    if(row){
      if(!afiliado_id && row.afiliado_id) body.fecha_fin_gestion=new Date().toISOString().slice(0,10);
      await api(`/rest/v1/dirigencia_sindical?id=eq.${row.id}`,{method:"PATCH",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(body)});
      msg.textContent="Cargo actualizado correctamente.";
    }else{await api("/rest/v1/dirigencia_sindical",{method:"POST",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(body)});msg.textContent="Cargo creado correctamente.";}
    await cargarDirigenciaTabla();
  }catch(e){msg.textContent="No se pudo guardar: "+(e.message||e);msg.style.color="#b42318";}
}

async function liberarDirigencia(row){
  if(!row?.id)return; if(!confirm("¿Desea dejar este cargo en estado VACANTE? Se registrará hoy como fecha de fin de gestión."))return;
  const msg=$("dEditorMsg"); msg.textContent="Guardando…";
  try{await api(`/rest/v1/dirigencia_sindical?id=eq.${row.id}`,{method:"PATCH",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({afiliado_id:null,fecha_fin_gestion:new Date().toISOString().slice(0,10),updated_at:new Date().toISOString()})});msg.textContent="El cargo quedó VACANTE y se registró la fecha de fin de gestión.";await cargarDirigenciaTabla();}
  catch(e){msg.textContent="No se pudo liberar el cargo: "+(e.message||e);msg.style.color="#b42318";}
}

async function generarConstanciaDirigente(row){
  if(!row?.afiliado_id||!row.afiliados){alert("El cargo está VACANTE y no puede generar constancia.");return;}
  const {jsPDF}=window.jspdf||{}; if(!jsPDF){alert("No está disponible el generador PDF.");return;}
  if(!row.fecha_inicio_gestion){alert("Este dirigente no tiene registrada la fecha de inicio de gestión. Abra Gestionar y registrela antes de emitir la constancia.");return;}
  try{
    const {data:constData}=await api("/rest/v1/rpc/crear_constancia_dirigente",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({p_dirigencia_id:Number(row.id)})});
    const c=Array.isArray(constData)?constData[0]:constData;
    if(!c?.codigo) throw new Error("Supabase no devolvió el código de constancia de dirigente.");
    const [logo,asi,csi,csa,psi,firma,sello]=await Promise.all([
      blobDataUrl(assetUrl("sintrainces.png")),blobDataUrl(assetUrl("asi.png")),blobDataUrl(assetUrl("csi.png")),blobDataUrl(assetUrl("csa.png")),blobDataUrl(assetUrl("psi.png")),blobDataUrl(assetUrl("firma.png")),blobDataUrl(assetUrl("sello.png"))
    ]);
    const qrHost=document.createElement("div"); qrHost.style.position="fixed"; qrHost.style.left="-10000px"; qrHost.style.top="-10000px"; document.body.appendChild(qrHost);
    const qrTexto=`https://sintrainceslara.github.io/sintrainces-web/verificar.html?codigo=${encodeURIComponent(c.codigo)}`;
    new QRCode(qrHost,{text:qrTexto,width:180,height:180,correctLevel:QRCode.CorrectLevel.M});
    await new Promise(r=>setTimeout(r,100)); const qrCanvas=qrHost.querySelector("canvas"); const qrData=qrCanvas?.toDataURL("image/png"); qrHost.remove(); if(!qrData)throw new Error("No fue posible generar el QR.");
    const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"}); const W=210,L=18,R=192;
    const logoIm=new Image(); logoIm.src=logo; await new Promise(r=>{logoIm.onload=r}); const logoFit=fitImage(logoIm.naturalWidth,logoIm.naturalHeight,145,43); const logoX=(W-logoFit.w)/2;
    doc.addImage(logo,"PNG",logoX,14,logoFit.w,logoFit.h,undefined,"FAST");
    const nombreSindicato="SINDICATO NACIONAL DE TRABAJADORES DEL INCES"; doc.setFont("helvetica","bold");doc.setFontSize(11.5);doc.setTextColor(23,63,122); const nombreY=14+logoFit.h+8; doc.text(nombreSindicato,105,nombreY,{align:"center"});
    doc.setDrawColor(23,78,166);doc.setLineWidth(.55);doc.line(20,nombreY+7,190,nombreY+7);
    const orgs=[{d:asi,maxW:24,maxH:16},{d:csi,maxW:18,maxH:17},{d:csa,maxW:22,maxH:17},{d:psi,maxW:18,maxH:17}]; const loaded=[];
    for(const o of orgs){const im=new Image();im.src=o.d;await new Promise(r=>{im.onload=r});loaded.push({...o,im,s:fitImage(im.naturalWidth,im.naturalHeight,o.maxW,o.maxH)});} const gap=4,total=loaded.reduce((n,o)=>n+o.s.w,0)+gap*(loaded.length-1); let x=(W-total)/2; const orgTop=nombreY+11;
    for(const o of loaded){doc.addImage(o.d,"PNG",x,orgTop+(17-o.s.h)/2,o.s.w,o.s.h,undefined,"FAST");x+=o.s.w+gap;} const logosBottom=orgTop+17;
    doc.setDrawColor(210,214,220);doc.setLineWidth(.3);doc.line(20,logosBottom+5,190,logosBottom+5);
    doc.setFont("helvetica","bold");doc.setFontSize(17);doc.setTextColor(23,32,51);doc.text("CONSTANCIA DE DIRIGENTE SINDICAL",105,logosBottom+22,{align:"center"});
    const a=row.afiliados, nombre=nombreAfiliadoDir(a), sec=row.seccionales?.nombre||"—", organ=organLabel(row.organ), inicio=formatDate(row.fecha_inicio_gestion), emitida=formatDate(c.emitida_en);
    // La fecha de vencimiento se toma de Supabase. Como respaldo visual, si la respuesta no la trae,
    // se calcula un mes calendario desde la fecha de emisión, sin alterar el registro de Supabase.
    let vence=formatDate(c.vence_en);
    if(!c.vence_en && c.emitida_en){ const dv=new Date(c.emitida_en); dv.setMonth(dv.getMonth()+1); vence=fechaLocalPDF(dv); }
    doc.setFont("helvetica","normal");doc.setFontSize(10.5);doc.setTextColor(60,66,78);doc.text("Por medio de la presente se hace constar que:",105,logosBottom+39,{align:"center"});
    doc.setFont("helvetica","bold");doc.setFontSize(14);doc.setTextColor(23,78,166);doc.text(nombre,105,logosBottom+54,{align:"center",maxWidth:170});
    doc.setFont("helvetica","normal");doc.setFontSize(10.5);doc.setTextColor(60,66,78);
    const par=`titular de la cédula de identidad ${a.nacionalidad||""}-${a.cedula||"—"}, ha ocupado el cargo de ${row.cargo}, perteneciente al ${organ}${row.organ==="SECCIONAL"?` de la Seccional ${sec}`:""}, desde el ${inicio} hasta el presente, encontrándose actualmente en ejercicio de dicha responsabilidad sindical.`;
    const parLines=doc.splitTextToSize(par,168); doc.text(parLines,105,logosBottom+66,{align:"center",maxWidth:168});

    // Bloque de datos completamente separado del párrafo. El cargo nunca comparte línea con las fechas.
    const infoX=30, infoW=150;
    let iy=logosBottom+88;
    doc.setFont("helvetica","bold");doc.setTextColor(23,32,51);doc.setFontSize(9.8);
    doc.text("CARGO",infoX,iy); iy+=5;
    doc.setFont("helvetica","normal");doc.setTextColor(60,66,78);doc.setFontSize(10.2);
    const cargoLines=doc.splitTextToSize(row.cargo,infoW); doc.text(cargoLines,infoX,iy); iy += Math.max(1,cargoLines.length)*5.5 + 6;
    doc.setFont("helvetica","bold");doc.setTextColor(23,32,51);doc.setFontSize(9.8);doc.text("ÓRGANO",infoX,iy);iy+=5;
    doc.setFont("helvetica","normal");doc.setTextColor(60,66,78);doc.setFontSize(10.2);doc.text(organ,infoX,iy);iy+=9;
    doc.setFont("helvetica","bold");doc.setTextColor(23,32,51);doc.setFontSize(9.8);doc.text("SECCIONAL",infoX,iy);iy+=5;
    doc.setFont("helvetica","normal");doc.setTextColor(60,66,78);doc.setFontSize(10.2);doc.text(row.organ==="SECCIONAL"?sec:(a.seccionales?.nombre||"—"),infoX,iy);iy+=10;

    // Las tres fechas ocupan líneas exclusivas, con la vigencia resaltada.
    doc.setFont("helvetica","bold");doc.setTextColor(23,32,51);doc.setFontSize(9.8);doc.text("INICIO DE GESTIÓN",infoX,iy);doc.text("EMITIDA",112,iy);iy+=5;
    doc.setFont("helvetica","normal");doc.setTextColor(60,66,78);doc.setFontSize(10.2);doc.text(inicio,infoX,iy);doc.text(emitida,112,iy);iy+=10;
    doc.setFont("helvetica","bold");doc.setTextColor(23,78,166);doc.setFontSize(10.5);doc.text("VÁLIDA HASTA",infoX,iy);iy+=5;
    doc.setFont("helvetica","bold");doc.setFontSize(12);doc.text(vence,infoX,iy);
    doc.setFont("helvetica","normal");doc.setTextColor(80,86,96);doc.setFontSize(8.5);doc.text("Vigencia: un mes desde la fecha de emisión",105,iy+8,{align:"center"});

    // Zona inferior fija: firma, sello y QR, separada del bloque de fechas.
    doc.setDrawColor(225,228,233);doc.roundedRect(25,222,112,50,4,4,"S");doc.setFont("helvetica","bold");doc.setFontSize(10);doc.setTextColor(23,32,51);doc.text("Firma autorizada",81,231,{align:"center"});doc.addImage(firma,"PNG",58,234,46,23,undefined,"FAST"); const sealW=25,sealH=sealW*(429/293);doc.addImage(sello,"PNG",156,184,sealW,sealH,undefined,"FAST");doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor(80,86,96);doc.text("Presidencia de SINTRAINCES",81,267,{align:"center"});doc.addImage(qrData,"PNG",149,223,40,40,undefined,"FAST");doc.setFont("helvetica","bold");doc.setFontSize(8);doc.text("Código",169,268,{align:"center"});doc.setFont("helvetica","normal");doc.text(c.codigo,169,273,{align:"center"});
    doc.setFontSize(8);doc.setTextColor(100,106,116);doc.text("La autenticidad y vigencia pueden verificarse mediante el código y QR indicados.",105,282,{align:"center"});doc.setDrawColor(23,78,166);doc.setLineWidth(.8);doc.line(L,276,R,276);
    const safe=nombre.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]/g,"").trim().replace(/\s+/g,"_");doc.save(`Constancia_Dirigente_${safe||a.cedula}.pdf`);
  }catch(e){alert("No se pudo generar la constancia de dirigente: "+(e.message||e));}
}

async function buscarAfiliadoDir(){
  const ced=$("dEditCedula")?.value.trim(); const out=$("dAfiliadoEncontrado"); if(!ced){out.textContent="Deje vacío para mantener el cargo VACANTE."; return;}
  out.textContent="Buscando afiliado…";
  try{
    const q=new URLSearchParams({select:"id,cedula,nacionalidad,primer_apellido,segundo_apellido,primer_nombre,segundo_nombre,seccional_id,seccionales(nombre),activo",cedula:`eq.${ced}`,limit:"1"});
    const {data}=await api("/rest/v1/afiliados?"+q.toString()); const a=Array.isArray(data)?data[0]:null;
    if(!a){out.textContent="No se encontró un afiliado con esa cédula.";return;}
    if(!a.activo){out.textContent="El afiliado existe, pero su registro está inactivo. No se puede asignar este cargo.";return;}
    window._dirAfiliadoEncontrado=a;
    out.innerHTML=`<b>${esc(nombreAfiliadoDir(a))}</b> — C.I. ${esc(a.cedula)} — Seccional: ${esc(a.seccionales?.nombre||"—")}`;
  }catch(e){out.textContent="No se pudo buscar: "+(e.message||e);}
}

async function cargarGestionCfs(){
  const box=$("orgContenido"); if(!box)return;
  box.innerHTML=`<div class="panel"><div class="section-head"><div><h2>Centros de Formación del INCES (CFS)</h2><p class="muted">Crea, renombra o inactiva CFS. No se eliminan físicamente para proteger las fichas de afiliados.</p></div><button id="nuevoCfs">+ Nuevo CFS</button></div>
    <div class="filters affiliates-filters"><label>Seccional<select id="cfsGestSec"></select></label><label>Estado<select id="cfsGestEstado"><option value="">Todos</option><option value="true">Activos</option><option value="false">Inactivos</option></select></label><label>Buscar<input id="cfsGestBuscar" placeholder="Nombre o código"></label></div>
    <div class="filter-actions"><button id="cfsGestConsultar">Consultar</button><button id="cfsGestLimpiar" class="secondary">Limpiar</button><span id="cfsGestInfo" class="muted"></span></div>
    <div id="cfsGestTabla" class="tablewrap"><div class="loading">Consultando CFS…</div></div></div><div id="cfsEditor" class="panel hidden"></div>`;
  fillSelect("cfsGestSec",catalogos.seccionales,"Todas las seccionales"); $("cfsGestConsultar").onclick=cargarCfsGestTabla; $("cfsGestLimpiar").onclick=()=>{$("cfsGestSec").value="";$('cfsGestEstado').value="";$('cfsGestBuscar').value="";cargarCfsGestTabla();}; $("nuevoCfs").onclick=()=>editorCfs(null); await cargarCfsGestTabla();
}
async function cargarCfsGestTabla(){
  const box=$("cfsGestTabla"); if(!box)return; box.innerHTML='<div class="loading">Consultando CFS…</div>'; const q=new URLSearchParams({select:"id,nombre,codigo,seccional_id,activo,seccionales(nombre)",order:"nombre.asc",limit:"500"}); const sec=$("cfsGestSec")?.value, est=$("cfsGestEstado")?.value, txt=$("cfsGestBuscar")?.value.trim().toLowerCase(); if(sec)q.set("seccional_id",`eq.${sec}`);if(est)q.set("activo",`eq.${est}`);
  try{const {data}=await api("/rest/v1/cfs?"+q.toString());let rows=Array.isArray(data)?data:[];if(txt)rows=rows.filter(r=>String(r.nombre||"").toLowerCase().includes(txt)||String(r.codigo||"").toLowerCase().includes(txt));$("cfsGestInfo").textContent=`${rows.length} CFS`;if(!rows.length){box.innerHTML='<div class="empty">No hay CFS con los filtros seleccionados.</div>';return;}box.innerHTML=`<table><thead><tr><th>Código</th><th>CFS</th><th>Seccional</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.codigo||"—")}</td><td>${esc(r.nombre)}</td><td>${esc(r.seccionales?.nombre||"—")}</td><td>${r.activo?"Activo":"Inactivo"}</td><td><button class="small" data-ed-cfs="${r.id}">Editar</button></td></tr>`).join("")}</tbody></table>`;box.querySelectorAll("[data-ed-cfs]").forEach(b=>b.onclick=()=>editorCfs(rows.find(x=>String(x.id)===String(b.dataset.edCfs))));}catch(e){box.innerHTML=`<div class="msg">No se pudieron consultar los CFS: ${esc(e.message||e)}</div>`;}
}
function editorCfs(row){
  const box=$("cfsEditor");box.classList.remove("hidden");const isNew=!row;box.innerHTML=`<div class="section-head"><div>${title(isNew?"Nuevo CFS":"Editar CFS",isNew?"Registra un nuevo Centro de Formación.":"Puedes renombrar o inactivar el CFS; la eliminación física no se utiliza.")}</div><button id="cerrarCfs" class="secondary">Cerrar</button></div><div class="edit-grid"><label>Código<input id="cfsCodigo" value="${esc(row?.codigo||"")}" placeholder="Ej.: CFS-001"></label><label>Nombre del CFS<input id="cfsNombre" value="${esc(row?.nombre||"")}" required></label><label>Seccional<select id="cfsSec"></select></label><label>Estado<select id="cfsActivo"><option value="true">Activo</option><option value="false">Inactivo</option></select></label></div><div class="filter-actions"><button id="guardarCfs">${isNew?"Crear CFS":"Guardar cambios"}</button><span id="cfsEditorMsg" class="muted"></span></div>`;fillSelect("cfsSec",catalogos.seccionales,"Seleccione seccional");if(row){$("cfsCodigo").value=row.codigo||"";$("cfsSec").value=String(row.seccional_id||"");$("cfsActivo").value=String(row.activo!==false);}$("cfsSec").disabled=false;$("cerrarCfs").onclick=()=>box.classList.add("hidden");$("guardarCfs").onclick=()=>guardarCfs(row);
}
async function guardarCfs(row){const msg=$("cfsEditorMsg");msg.textContent="Guardando…";try{const nombre=$("cfsNombre").value.trim(),codigo=$("cfsCodigo").value.trim()||null,sec=Number($("cfsSec").value||0),activo=$("cfsActivo").value==="true";if(!nombre||!sec)throw new Error("Indique nombre y seccional.");const body={nombre,codigo,seccional_id:sec,activo};if(row)await api(`/rest/v1/cfs?id=eq.${row.id}`,{method:"PATCH",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(body)});else await api("/rest/v1/cfs",{method:"POST",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(body)});msg.textContent="CFS guardado correctamente.";await cargarCatalogos();await cargarCfsGestTabla();}catch(e){msg.textContent="No se pudo guardar: "+(e.message||e);msg.style.color="#b42318";}}

async function auditoria(m){
  m.innerHTML=title("Auditoría","Registro de cambios y movimientos realizados sobre afiliados y Reclamos y Sugerencias.")+`<div class="panel">
    <div class="grid">
      <div class="stat"><span>Estado</span><b style="font-size:18px">● Activa</b></div>
      <div class="stat"><span>Acceso</span><b style="font-size:18px">${esc(roleLabel(perfil?.rol))}</b></div>
    </div>
    <div class="filters affiliates-filters" style="margin-top:18px">
      <label>Cédula<input id="aCedula" placeholder="Ej.: 11713773"></label>
      <label>Acción<select id="aAccion"><option value="">Todas</option><option value="INSERT">Alta</option><option value="UPDATE">Actualización</option><option value="DELETE">Eliminación</option></select></label>
      <label>Desde<input id="aDesde" type="date"></label>
      <label>Hasta<input id="aHasta" type="date"></label>
      <label>Seccional<select id="aSeccional"><option value="">Todas</option></select></label>
    </div>
    <div class="filter-actions"><button id="aBuscar">Consultar auditoría</button><button id="aLimpiar" class="secondary">Limpiar</button><button id="aImprimir" class="secondary">Imprimir</button><span id="aInfo" class="muted"></span></div>
    <div id="auditoriaTabla" class="tablewrap"><div class="loading">Consultando auditoría…</div></div>
  </div>`;
  try{
    const {data:secs}=await api("/rest/v1/seccionales?select=id,nombre&order=nombre.asc&limit=100");
    const list=Array.isArray(secs)?secs:[];
    fillSelect("aSeccional",list,"Todas las seccionales");
    if(perfil?.rol==="admin_seccional"){ $("aSeccional").value=String(perfil.seccional_id||""); $("aSeccional").disabled=true; }
  }catch(e){ console.error("Auditoría seccionales",e); }
  $("aBuscar").onclick=()=>cargarAuditoriaReal();
  $("aLimpiar").onclick=()=>{["aCedula","aDesde","aHasta"].forEach(id=>$(id).value="");$("aAccion").value="";if(perfil?.rol==="admin_seccional")$("aSeccional").value=String(perfil.seccional_id||"");else $("aSeccional").value="";cargarAuditoriaReal();};
  $("aImprimir").onclick=()=>window.print();
  await cargarAuditoriaReal();
}
async function cargarAuditoriaReal(){
  const box=$("auditoriaTabla"); if(!box)return;
  box.innerHTML='<div class="loading">Consultando auditoría…</div>';
  const q=new URLSearchParams();
  q.set("select","id,usuario_id,accion,tabla,registro_id,seccional_id,detalle,created_at");
  q.set("order","id.desc"); q.set("limit","100");
  const ced=$("aCedula")?.value.trim(), accion=$("aAccion")?.value, desde=$("aDesde")?.value, hasta=$("aHasta")?.value, sec=$("aSeccional")?.value;
  if(accion)q.set("accion",`eq.${accion}`);
  if(sec)q.set("seccional_id",`eq.${sec}`);
  if(desde)q.set("created_at",`gte.${desde}T00:00:00`);
  if(hasta)q.set("created_at",`lte.${hasta}T23:59:59`);
  if(perfil?.rol==="admin_seccional")q.set("seccional_id",`eq.${perfil.seccional_id}`);
  try{
    const {data}=await api("/rest/v1/auditoria?"+q.toString());
    let rows=Array.isArray(data)?data:[];
    if(ced)rows=rows.filter(r=>String(r.detalle?.cedula||"").includes(ced));
    $("aInfo").textContent=`${rows.length} registro(s) mostrado(s)`;
    if(!rows.length){box.innerHTML='<div class="empty">No hay registros de auditoría con los filtros seleccionados.</div>';return;}
    box.innerHTML=`<table><thead><tr><th>Fecha</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>Módulo / tabla</th><th>Cédula</th><th>Seccional</th><th>Detalle</th></tr></thead><tbody>${rows.map(r=>{
      const d=r.detalle||{}; const cambios=d.cambios||{}; const cambio=Object.entries(cambios).map(([k,v])=>`${k}: ${v?.anterior??"—"} → ${v?.nuevo??"—"}`).join("; ");
      const secText=(d.seccional_anterior??r.seccional_id??"—")=== (d.seccional_nueva??r.seccional_id??"—") ? String(d.seccional_nueva??r.seccional_id??"—") : `${d.seccional_anterior??"—"} → ${d.seccional_nueva??"—"}`;
      return `<tr><td>${esc(new Date(r.created_at).toLocaleString("es-VE"))}</td><td>${esc(d.usuario_nombre||r.usuario_id||"—")}</td><td>${esc(d.usuario_rol||"—")}</td><td>${esc(r.accion||"—")}</td><td>${esc(r.tabla||"—")}</td><td>${esc(d.cedula||"—")}</td><td>${esc(secText)}</td><td>${esc(cambio||JSON.stringify(d))}</td></tr>`;
    }).join("")}</tbody></table>`;
  }catch(e){ box.innerHTML=`<div class="msg">No se pudo consultar la auditoría: ${esc(e.message||e)}</div>`; $("aInfo").textContent="Error de consulta"; }
}

function showPasswordPanel(){$("passwordPanel").classList.remove("hidden");$("newPassword").focus();}
function hidePasswordPanel(){$("passwordPanel").classList.add("hidden");$("passwordMsg").textContent="";$('changePasswordForm').reset();}
async function changePassword(ev){ev.preventDefault();const p1=$("newPassword").value,p2=$("confirmPassword").value;if(p1.length<8){$("passwordMsg").textContent="La nueva contraseña debe tener al menos 8 caracteres.";return;}if(p1!==p2){$("passwordMsg").textContent="Las contraseñas no coinciden.";return;}$("passwordMsg").textContent="Guardando…";const {error}=await sb.auth.updateUser({password:p1});if(error){$("passwordMsg").textContent=error.message;return;}const {error:profileError}=await sb.rpc("marcar_clave_actualizada");if(profileError){$("passwordMsg").textContent="Contraseña cambiada, pero no se pudo actualizar el estado del perfil: "+profileError.message;return;}perfil.debe_cambiar_clave=false;hidePasswordPanel();}
async function logout(){try{if(sb)await sb.auth.signOut({scope:"local"});}catch(e){}window.SINTRAINCES_ACCESS_TOKEN=null;location.reload();}

document.addEventListener("DOMContentLoaded",async()=>{
  try{cfg();}catch(e){showLoginMessage(e.message+" Copie config.example.js como config.js.");return;}
  $("loginForm").addEventListener("submit",login); $("logout").addEventListener("click",logout); $("changePasswordForm").addEventListener("submit",changePassword); $("cancelPassword").addEventListener("click",hidePasswordPanel);
  document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.view).catch(console.error);}));
  hidePasswordPanel(); $("app").classList.add("hidden"); $("login").classList.remove("hidden");
  sb.auth.onAuthStateChange((_event,session)=>{if(!session){perfil=null;hidePasswordPanel();$("app").classList.add("hidden");$("login").classList.remove("hidden");}});
  const existing = await sb.auth.getSession();
  if(existing?.data?.session){
    try { await continuarConSesion(existing.data.session); } catch(e) { console.warn("Sesión existente no válida para este panel", e); }
  }
});
