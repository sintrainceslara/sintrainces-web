# SINTRAINCES — Integración pública + privada v1.49.2

Esta entrega agrega la entrada unificada al Portal SINTRAINCES y conserva separados los espacios de administración y afiliados.

## Archivos que deben quedar en la raíz del repositorio público
- `index.html` — versión pública con botón **Portal SINTRAINCES**.
- `portal.html` — pantalla única de acceso.
- `admin.html`, `admin.js`, `admin.css` — panel administrativo v1.49.2 con recuperación automática de sesión.
- `portal_afiliado.html` — portal de afiliados ya existente.
- `config.js` — configuración pública/anon de Supabase.
- `assets/constancia/*` — recursos usados para generar las constancias.

## Importante
NO sustituir el `verificar.html` público que ya está funcionando correctamente. El QR de las constancias seguirá apuntando a ese verificador público.

NO sustituir `app.js`, `style.css` ni la carpeta `assets/` pública existente, salvo agregar el subdirectorio `assets/constancia/` incluido aquí.

## Flujo de la prueba
1. Sitio público → **Portal SINTRAINCES**.
2. Pantalla única de acceso.
3. Administrador nacional/seccional → `admin.html`.
4. Afiliado → `portal_afiliado.html`.
5. Registro de afiliados continúa en el portal de afiliados.
6. La cuenta de dirigente permanece conceptualmente separada; el rol `dirigente` queda reservado para la siguiente etapa, sin alterar la estructura sindical actual.

## Nota sobre GitHub
La integración automática al repositorio no pudo ejecutarse porque la conexión de escritura de GitHub devolvió HTTP 403 (Resource not accessible by integration). Por eso esta entrega queda preparada para subir manualmente al repositorio `sintrainceslara/sintrainces-web`.
