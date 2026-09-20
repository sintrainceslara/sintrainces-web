const app = document.getElementById("app");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");

const comites = [
  {
    nombre: "Comité de Líderes Orgánicos",
    imagen: "assets/comite-lideres-organicos.jpeg",
    descripcion: "Espacio de participación y organización de líderes de SINTRAINCES."
  },
  {
    nombre: "Comité de Mujeres Trabajadoras",
    imagen: "assets/comite-mujeres-trabajadoras.jpeg",
    descripcion: "Espacio para la participación, organización y defensa de los derechos de las mujeres trabajadoras."
  },
  {
    nombre: "Comité de Trabajadores LGBTIQ",
    imagen: "assets/comite-trabajadores-lgbtiq.jpeg",
    descripcion: "Espacio de participación y promoción de la igualdad y no discriminación en el ámbito laboral."
  },
  {
    nombre: "Comité de Juventud Trabajadora",
    imagen: "assets/comite-juventud-trabajadora.jpeg",
    descripcion: "Espacio para la participación y formación de las nuevas generaciones de trabajadores."
  },
  {
    nombre: "Comité de Trabajadores con Discapacidad",
    imagen: "assets/comite-trabajadores-discapacidad.jpeg",
    descripcion: "Espacio para promover participación, inclusión y derechos laborales de trabajadores con discapacidad."
  }
];

const organizaciones = [
  {
    nombre: "Central de Trabajadores ASI Venezuela",
    imagen: "assets/logo-asi-venezuela.jpg",
    descripcion: "Central de trabajadores a la que pertenece SINTRAINCES."
  },
  {
    nombre: "Central Sindical de las Américas (CSA)",
    imagen: "assets/logo-csa.jpg",
    descripcion: "Organización sindical continental con la que se encuentra vinculada la organización."
  },
  {
    nombre: "Central Sindical Internacional (CSI)",
    imagen: "assets/logo-csi.png",
    descripcion: "Organización sindical internacional con la que se encuentra vinculada la organización."
  },
  {
    nombre: "Internacional de Servicios Públicos (ISP)",
    imagen: "assets/logo-psi.jpg",
    descripcion: "Organización internacional del sector de servicios públicos con la que se encuentra vinculada la organización."
  }
];

const destacadosData = [
  {
    nombreCorto: "ASI Venezuela",
    nombre: "Central de Trabajadores ASI Venezuela",
    imagen: "assets/logo-asi-venezuela.jpg",
    descripcion: "La Central de Trabajadores y Trabajadoras ASI Venezuela es una organización sindical independiente que defiende el trabajo decente, la libertad sindical y los derechos laborales, con sede en Caracas y presencia en todo el país.",
    tipo: "Central nacional",
    detalleTitulo: "¿Qué es y cuáles son sus principios?",
    detalle: "ASI Venezuela es parte de la Alianza Sindical Independiente de Venezuela, una herramienta de lucha de los trabajadores que promueve un sindicalismo auténtico de servicios, autonomía, solidaridad e independencia.",
    principios: [
      "Defensa del trabajo decente, desarrollo sostenible y justicia social.",
      "Respeto y cumplimiento de derechos humanos fundamentales.",
      "Promoción de la libertad sindical, contratación colectiva, huelga, protección social, empleo y diálogo social tripartito."
    ]
  },
  {
    nombreCorto: "CSA",
    nombre: "Central Sindical de las Américas",
    imagen: "assets/logo-csa.jpg",
    descripcion: "La Central Sindical de Trabajadores/as de las Américas (CSA-TUCA) es la principal organización sindical regional del continente americano, fundada en 2008 en Panamá, con 54 centrales afiliadas en 21 países y que representa a unos 55 millones de trabajadores/as.",
    tipo: "Red continental",
    detalleTitulo: "Historia y estructura",
    detalle: "La CSA se constituyó el 27 de marzo de 2008 en la Ciudad de Panamá, resultando de la unión de la Confederación Interamericana de Trabajadores (CIT) y la Central Latinoamericana de Trabajadores (CLAT). Es la organización regional de la Confederación Sindical Internacional (CSI) y tiene su sede central en Calle Buenos Aires 404/406, Montevideo, Uruguay."
  },
  {
    nombreCorto: "CSI",
    nombre: "Central Sindical Internacional",
    imagen: "assets/logo-csi.png",
    descripcion: "La Confederación Sindical Internacional (CSI) es la central sindical más grande del mundo, con sede en Bruselas (Bélgica) y que agrupa a más de 200 millones de trabajadores en 169 países y territorios, representados por 340 organizaciones afiliadas.",
    tipo: "Red internacional",
    detalleTitulo: "Origen y creación",
    detalle: "La CSI fue fundada el 1 de noviembre de 2006 mediante la fusión de la Confederación Internacional de Organizaciones Sindicales Libres (CIOSL) y la Confederación Mundial del Trabajo (CMT), junto con otras federaciones sindicales nacionales. El congreso fundacional se celebró en Viena, y la creación buscó unificar por primera vez a todas las organizaciones sindicales de estas dos grandes corrientes en una sola entidad mundial."
  },
  {
    nombreCorto: "ISP",
    nombre: "Internacional de Servicios Públicos (PSI)",
    imagen: "assets/logo-psi.jpg",
    descripcion: "La Internacional de Servicios Públicos (PSI) es una federación sindical mundial que agrupa a más de 700 sindicatos y representa a unos 30 millones de trabajadores en más de 150 países, defendiendo el acceso universal a servicios públicos de calidad y los derechos laborales.",
    tipo: "Servicios públicos"
  },
  { nombreCorto: "Líderes Orgánicos", nombre: "Comité de Líderes Orgánicos", imagen: "assets/comite-lideres-organicos.jpeg", descripcion: "Fortalece la participación y organización de líderes dentro de SINTRAINCES.", tipo: "Comité sindical" },
  { nombreCorto: "Mujeres Trabajadoras", nombre: "Comité de Mujeres Trabajadoras", imagen: "assets/comite-mujeres-trabajadoras.jpeg", descripcion: "Promueve la participación, organización e igualdad de las mujeres trabajadoras.", tipo: "Comité sindical" },
  { nombreCorto: "Juventud Trabajadora", nombre: "Comité de Juventud Trabajadora", imagen: "assets/comite-juventud-trabajadora.jpeg", descripcion: "Impulsa la participación, formación y liderazgo de las nuevas generaciones.", tipo: "Comité sindical" },
  { nombreCorto: "Trabajadores LGBTIQ", nombre: "Comité de Trabajadores LGBTIQ", imagen: "assets/comite-trabajadores-lgbtiq.jpeg", descripcion: "Promueve participación, igualdad y no discriminación en el ámbito laboral.", tipo: "Comité sindical" },
  { nombreCorto: "Trabajadores con Discapacidad", nombre: "Comité de Trabajadores con Discapacidad", imagen: "assets/comite-trabajadores-discapacidad.jpeg", descripcion: "Promueve inclusión, participación y derechos laborales de trabajadores con discapacidad.", tipo: "Comité sindical" }
];

const estructuraCEN = [
  ["Presidente", "Carmelo Sánchez", "assets/estructura/cen-1.jpg"],
  ["Secretario General", "María Figueroa", "assets/estructura/cen-2.jpg"],
  ["Coordinador Nacional de Organización y Finanzas", "Carlos Betancourt", "assets/estructura/cen-3.jpg"],
  ["Coordinador Nacional de Reclamos y Conflictos Laborales", "Silvana Forgione Franco", "assets/estructura/cen-4.jpg"],
  ["Coordinador Nacional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes", "Rommel García", "assets/estructura/cen-5.jpg"],
  ["Coordinador Nacional de Capacitación Laboral, Sindical y Formación Profesional", "Celina Humbría", "assets/estructura/cen-6.jpg"],
  ["Coordinador Nacional de Protección a la Mujer, a la Familia y Equidad de Genero", "Linda Reyes", "assets/estructura/cen-7.jpg"],
  ["Coordinador Nacional de Comunicación, Redes Sociales, Actas y Correspondencias", "José Aular", "assets/estructura/cen-8.jpg"],
  ["Coordinador Nacional de Jubilados", "Wolfgang Crespo", "assets/estructura/cen-9.jpg"],
  ["Primer Vocal", "Ydelmo Estrada", "assets/estructura/cen-10.jpg"],
  ["Segundo Vocal", "Estilito Flores", "assets/estructura/cen-11.jpg"]
].map(([cargo,nombre,foto]) => ({cargo,nombre,foto}));

const estructuraTribunal = [
  ["Presidente", "Juvenal Abad", "assets/estructura/tribunal-1.jpg"],
  ["Vicepresidente", "Francisco García", "assets/estructura/tribunal-2.jpg"],
  ["Secretario", "Osmari Pérez", "assets/estructura/tribunal-3.jpg"],
  ["Suplente 1", "Lisbeth Moreno", "assets/estructura/tribunal-4.jpg"],
  ["Suplente 2", "Lourdes Villegas", "assets/estructura/tribunal-5.jpg"]
].map(([cargo,nombre,foto]) => ({cargo,nombre,foto}));

const seccionales = [
  {
    nombre: "AMAZONAS",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Julisa Melgarejo",
        foto: "assets/estructura/seccionales/seccional-1-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Jesús Cabulla",
        foto: "assets/estructura/seccionales/seccional-1-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Belkis Correa",
        foto: "assets/estructura/seccionales/seccional-1-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Humberto Lopez",
        foto: "assets/estructura/seccionales/seccional-1-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Ramón González",
        foto: "assets/estructura/seccionales/seccional-1-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "María López",
        foto: "assets/estructura/seccionales/seccional-1-6.jpg"
      },
    ]
  },
  {
    nombre: "ANZOATEGUI",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Margarita Viviano",
        foto: "assets/estructura/seccionales/seccional-2-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Mariela Araguache",
        foto: "assets/estructura/seccionales/seccional-2-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Lismar Torres",
        foto: "assets/estructura/seccionales/seccional-2-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Luis Romero",
        foto: "assets/estructura/seccionales/seccional-2-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Nayedis Brazón",
        foto: "assets/estructura/seccionales/seccional-2-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Juanikarina Tovar",
        foto: "assets/estructura/seccionales/seccional-2-6.jpg"
      },
    ]
  },
  {
    nombre: "APURE",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Ana Hernández",
        foto: "assets/estructura/seccionales/seccional-3-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Juana Palma",
        foto: "assets/estructura/seccionales/seccional-3-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Mary Albornoz",
        foto: "assets/estructura/seccionales/seccional-3-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Omar Zarate",
        foto: "assets/estructura/seccionales/seccional-3-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Terrys Espinoza",
        foto: "assets/estructura/seccionales/seccional-3-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Ivan Vivas",
        foto: "assets/estructura/seccionales/seccional-3-6.jpg"
      },
    ]
  },
  {
    nombre: "ARAGUA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Carmen Araujo",
        foto: "assets/estructura/seccionales/seccional-4-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Karla Barcos",
        foto: "assets/estructura/seccionales/seccional-4-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Robert Vargas",
        foto: "assets/estructura/seccionales/seccional-4-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Engerbert Valera",
        foto: "assets/estructura/seccionales/seccional-4-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Jesús Arraiz",
        foto: "assets/estructura/seccionales/seccional-4-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Lilian Coronel",
        foto: "assets/estructura/seccionales/seccional-4-6.jpg"
      },
    ]
  },
  {
    nombre: "BARINAS",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Ramón Vásquez",
        foto: "assets/estructura/seccionales/seccional-5-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "María Hoyos",
        foto: "assets/estructura/seccionales/seccional-5-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Yelitza Zambrano",
        foto: "assets/estructura/seccionales/seccional-5-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Luis Torres",
        foto: "assets/estructura/seccionales/seccional-5-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Luinney Meza",
        foto: "assets/estructura/seccionales/seccional-5-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Dulce Paredez",
        foto: "assets/estructura/seccionales/seccional-5-6.jpg"
      },
    ]
  },
  {
    nombre: "BOLIVAR",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Trinidad Semprum",
        foto: "assets/estructura/seccionales/seccional-6-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Cesar Pulido",
        foto: "assets/estructura/seccionales/seccional-6-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Cruz >Gil",
        foto: "assets/estructura/seccionales/seccional-6-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Wilfredo Diaz",
        foto: "assets/estructura/seccionales/seccional-6-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Dalys Hernández",
        foto: "assets/estructura/seccionales/seccional-6-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Francisco Bruzual",
        foto: "assets/estructura/seccionales/seccional-6-6.jpg"
      },
    ]
  },
  {
    nombre: "CARABOBO",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Judith Subero",
        foto: "assets/estructura/seccionales/seccional-7-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Kherson Ruiz",
        foto: "assets/estructura/seccionales/seccional-7-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Miguel Jiménez",
        foto: "assets/estructura/seccionales/seccional-7-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Freddy Valdemar",
        foto: "assets/estructura/seccionales/seccional-7-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Edgar Polanco",
        foto: "assets/estructura/seccionales/seccional-7-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "José Castillo",
        foto: "assets/estructura/seccionales/seccional-7-6.jpg"
      },
    ]
  },
  {
    nombre: "CARACAS SEDE",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Norbelis Morillo",
        foto: "assets/estructura/seccionales/seccional-8-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Angela Ramos",
        foto: "assets/estructura/seccionales/seccional-8-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Luis Ojeda",
        foto: "assets/estructura/seccionales/seccional-8-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Lis Pineda",
        foto: "assets/estructura/seccionales/seccional-8-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Jackeline Sanchez",
        foto: "assets/estructura/seccionales/seccional-8-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Olga Pereira",
        foto: "assets/estructura/seccionales/seccional-8-6.jpg"
      },
    ]
  },
  {
    nombre: "COJEDES",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Antonio Gutierrez",
        foto: "assets/estructura/seccionales/seccional-9-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Betsy Villanueva",
        foto: "assets/estructura/seccionales/seccional-9-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "José Aguilera",
        foto: "assets/estructura/seccionales/seccional-9-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Pedro Torrealba",
        foto: "assets/estructura/seccionales/seccional-9-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "José Aguilera",
        foto: "assets/estructura/seccionales/seccional-9-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Yumarin Sandalio",
        foto: "assets/estructura/seccionales/seccional-9-6.jpg"
      },
    ]
  },
  {
    nombre: "DELTA AMACURO",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Yulitza Garmendia",
        foto: "assets/estructura/seccionales/seccional-10-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Indira Rodríguez",
        foto: "assets/estructura/seccionales/seccional-10-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Jorge Ramírez",
        foto: "assets/estructura/seccionales/seccional-10-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Jorge Bermudez",
        foto: "assets/estructura/seccionales/seccional-10-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Solmaris Zurita",
        foto: "assets/estructura/seccionales/seccional-10-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Margloris Mendoza",
        foto: "assets/estructura/seccionales/seccional-10-6.jpg"
      },
    ]
  },
  {
    nombre: "DISTRITO FEDERAL",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Adelmo Becerra",
        foto: "assets/estructura/seccionales/seccional-11-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Luis Sillet",
        foto: "assets/estructura/seccionales/seccional-11-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Joseph Sosa",
        foto: "assets/estructura/seccionales/seccional-11-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Lucas Ferrer",
        foto: "assets/estructura/seccionales/seccional-11-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Edilmar Pérez",
        foto: "assets/estructura/seccionales/seccional-11-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Chersayden Navarro",
        foto: "assets/estructura/seccionales/seccional-11-6.jpg"
      },
    ]
  },
  {
    nombre: "FALCON",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Carmen Quero",
        foto: "assets/estructura/seccionales/seccional-12-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Rodulfo Torres",
        foto: "assets/estructura/seccionales/seccional-12-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Guadnellys Alvarez",
        foto: "assets/estructura/seccionales/seccional-12-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Engelis Goitia",
        foto: "assets/estructura/seccionales/seccional-12-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Edith Hernández",
        foto: "assets/estructura/seccionales/seccional-12-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Epifania Bracho",
        foto: "assets/estructura/seccionales/seccional-12-6.jpg"
      },
    ]
  },
  {
    nombre: "GUARICO",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Arturo Jiménez",
        foto: "assets/estructura/seccionales/seccional-13-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Magalis Fernández",
        foto: "assets/estructura/seccionales/seccional-13-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Gloria Rivas",
        foto: "assets/estructura/seccionales/seccional-13-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "josé Perez",
        foto: "assets/estructura/seccionales/seccional-13-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Carlo Milano",
        foto: "assets/estructura/seccionales/seccional-13-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Keyla Villarroel",
        foto: "assets/estructura/seccionales/seccional-13-6.jpg"
      },
    ]
  },
  {
    nombre: "LA GUAIRA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Aristides José Basaldella Silva",
        foto: "assets/estructura/seccionales/seccional-14-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Gabriel Silva Camacaro",
        foto: "assets/estructura/seccionales/seccional-14-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Sixto Manuel Ruiz Ramos",
        foto: "assets/estructura/seccionales/seccional-14-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "José Armando Velasquez",
        foto: "assets/estructura/seccionales/seccional-14-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Yolimar Vásquez",
        foto: "assets/estructura/seccionales/seccional-14-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Mariseli Peraza",
        foto: "assets/estructura/seccionales/seccional-14-6.jpg"
      },
    ]
  },
  {
    nombre: "LARA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Aristides José Basaldella Silva",
        foto: "assets/estructura/seccionales/seccional-15-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Gabriel Silva Camacaro",
        foto: "assets/estructura/seccionales/seccional-15-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Sixto Manuel Ruiz Ramos",
        foto: "assets/estructura/seccionales/seccional-15-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "José Armando Velasquez",
        foto: "assets/estructura/seccionales/seccional-15-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Yolimar Vásquez",
        foto: "assets/estructura/seccionales/seccional-15-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Mariseli Peraza",
        foto: "assets/estructura/seccionales/seccional-15-6.jpg"
      },
    ]
  },
  {
    nombre: "MERIDA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Humberto Mendez",
        foto: "assets/estructura/seccionales/seccional-16-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Javier Diaz",
        foto: "assets/estructura/seccionales/seccional-16-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Rigoberto Lobo Mendez",
        foto: "assets/estructura/seccionales/seccional-16-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Alvaro Hajas",
        foto: "assets/estructura/seccionales/seccional-16-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Dora Dávila",
        foto: "assets/estructura/seccionales/seccional-16-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Carlos Sánchez",
        foto: "assets/estructura/seccionales/seccional-16-6.jpg"
      },
    ]
  },
  {
    nombre: "MIRANDA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Keyla Giménez",
        foto: "assets/estructura/seccionales/seccional-17-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Aracelys Bañez",
        foto: "assets/estructura/seccionales/seccional-17-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Luis Guerra",
        foto: "assets/estructura/seccionales/seccional-17-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Alfredo Otaiza",
        foto: "assets/estructura/seccionales/seccional-17-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Javier Henriquez",
        foto: "assets/estructura/seccionales/seccional-17-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Berta Tovar",
        foto: "assets/estructura/seccionales/seccional-17-6.jpg"
      },
    ]
  },
  {
    nombre: "MONAGAS",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Henry Rodríguez",
        foto: "assets/estructura/seccionales/seccional-18-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Minin Marval",
        foto: "assets/estructura/seccionales/seccional-18-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Alfredo Uzcategui",
        foto: "assets/estructura/seccionales/seccional-18-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Cruz Barreto",
        foto: "assets/estructura/seccionales/seccional-18-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Naivy Rodríguez",
        foto: "assets/estructura/seccionales/seccional-18-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Jorge Rincón",
        foto: "assets/estructura/seccionales/seccional-18-6.jpg"
      },
    ]
  },
  {
    nombre: "NUEVA ESPARTA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Carlos Velásquez",
        foto: "assets/estructura/seccionales/seccional-19-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Carlos Salazar",
        foto: "assets/estructura/seccionales/seccional-19-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Yanelys Marval",
        foto: "assets/estructura/seccionales/seccional-19-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Robert Briceño",
        foto: "assets/estructura/seccionales/seccional-19-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Carmen Ordaz",
        foto: "assets/estructura/seccionales/seccional-19-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Oswaldo Franco",
        foto: "assets/estructura/seccionales/seccional-19-6.jpg"
      },
    ]
  },
  {
    nombre: "PORTUGUESA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Miguel Villegas",
        foto: "assets/estructura/seccionales/seccional-20-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Omar Santeliz",
        foto: "assets/estructura/seccionales/seccional-20-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Omaira Lameda",
        foto: "assets/estructura/seccionales/seccional-20-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Johan Jiménez",
        foto: "assets/estructura/seccionales/seccional-20-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Solisbeth Pinto",
        foto: "assets/estructura/seccionales/seccional-20-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Guillermo Tovar",
        foto: "assets/estructura/seccionales/seccional-20-6.jpg"
      },
    ]
  },
  {
    nombre: "SUCRE",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Pedro Gómez",
        foto: "assets/estructura/seccionales/seccional-21-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Henry Suárez",
        foto: "assets/estructura/seccionales/seccional-21-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Carmen Rodríguez",
        foto: "assets/estructura/seccionales/seccional-21-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Juan Echenique",
        foto: "assets/estructura/seccionales/seccional-21-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Yaritza Alcalá",
        foto: "assets/estructura/seccionales/seccional-21-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Candida Romero",
        foto: "assets/estructura/seccionales/seccional-21-6.jpg"
      },
    ]
  },
  {
    nombre: "TACHIRA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Henry Sanguino",
        foto: "assets/estructura/seccionales/seccional-22-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Omar Delgado",
        foto: "assets/estructura/seccionales/seccional-22-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Tatiana Monsalve",
        foto: "assets/estructura/seccionales/seccional-22-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Gregory Colmenares",
        foto: "assets/estructura/seccionales/seccional-22-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Ana Arismendi",
        foto: "assets/estructura/seccionales/seccional-22-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Cesar Chacón",
        foto: "assets/estructura/seccionales/seccional-22-6.jpg"
      },
    ]
  },
  {
    nombre: "TRUJILLO",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Alexis Velazco",
        foto: "assets/estructura/seccionales/seccional-23-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Yuleidi Segovia",
        foto: "assets/estructura/seccionales/seccional-23-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "María Abreu",
        foto: "assets/estructura/seccionales/seccional-23-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Carlos Rivas",
        foto: "assets/estructura/seccionales/seccional-23-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Yoly Berrios",
        foto: "assets/estructura/seccionales/seccional-23-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Vianey Pérez",
        foto: "assets/estructura/seccionales/seccional-23-6.jpg"
      },
    ]
  },
  {
    nombre: "YARACUY",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "Ligia Marquez",
        foto: "assets/estructura/seccionales/seccional-24-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Ingrid Herrera",
        foto: "assets/estructura/seccionales/seccional-24-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "María Espino",
        foto: "assets/estructura/seccionales/seccional-24-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Dayana Carrillo",
        foto: "assets/estructura/seccionales/seccional-24-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Yarinez Blanco",
        foto: "assets/estructura/seccionales/seccional-24-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "Felix Gómez",
        foto: "assets/estructura/seccionales/seccional-24-6.jpg"
      },
    ]
  },
  {
    nombre: "ZULIA",
    integrantes: [
      {
        cargo: "Secretario General Seccional",
        nombre: "José Pineda",
        foto: "assets/estructura/seccionales/seccional-25-1.jpg"
      },
      {
        cargo: "Coordinador Seccional de Organización y Finanzas",
        nombre: "Wilfredo Acosta",
        foto: "assets/estructura/seccionales/seccional-25-2.jpg"
      },
      {
        cargo: "Coordinador Seccional de Reclamo y Conflictos Laborales",
        nombre: "Juan Andara",
        foto: "assets/estructura/seccionales/seccional-25-3.jpg"
      },
      {
        cargo: "Coordinador Seccional de Salud, Seguridad Laboral, Eventos, Cultura y Deportes",
        nombre: "Carlos García",
        foto: "assets/estructura/seccionales/seccional-25-4.jpg"
      },
      {
        cargo: "Coordinador Seccional de jubilados",
        nombre: "Julio Pirela",
        foto: "assets/estructura/seccionales/seccional-25-5.jpg"
      },
      {
        cargo: "Vocal",
        nombre: "María Pernalete",
        foto: "assets/estructura/seccionales/seccional-25-6.jpg"
      },
    ]
  },
];

const paginas = {
  inicio: `
    <section class="hero">
      <div class="hero-contenido">
        <div class="hero-texto">
          <span class="etiqueta">PORTAL INSTITUCIONAL</span>
          <h1>Sindicato Nacional de Trabajadores del INCES</h1>
          <div class="lema">DERECHO QUE NO SE DEFIENDE ES DERECHO QUE SE PIERDE</div>
          <p>Un espacio para informar, organizar, comunicar y fortalecer la participación de las trabajadoras y los trabajadores.</p>
          <div class="hero-botones">
            <button class="boton" onclick="mostrarPagina('organizacion')">Conoce SINTRAINCES</button>
            <button class="boton boton-secundario" onclick="mostrarPagina('noticias')">Ver noticias</button>
          </div>
        </div>
        <div class="hero-logo-wrap">
          <div class="hero-brillo"></div>
          <img class="logo-hero" src="assets/logo-sintrainces.jpg" alt="Logo SINTRAINCES">
          <span class="fundacion">Fundado el 06 de enero de 2006</span>
        </div>
      </div>
    </section>

    <section class="accesos">
      <div class="contenedor accesos-contenedor">
        <div class="accesos-intro">
          <span class="mini-etiqueta">ACCESOS PRINCIPALES</span>
          <h2>Todo SINTRAINCES en un solo lugar</h2>
          <p>Explora nuestra organización, estructura sindical, red de organizaciones, documentos, noticias y actividades.</p>
        </div>
        <div class="accesos-grid">
          <button class="acceso" onclick="mostrarPagina('organizacion')">
            <span class="acceso-icono">🏛️</span>
            <span><strong>La organización</strong><small>Conócenos</small></span>
          </button>
          <button class="acceso" onclick="mostrarPagina('comites')">
            <span class="acceso-icono">🤝</span>
            <span><strong>Nuestros comités</strong><small>Participación sindical</small></span>
          </button>
          <button class="acceso" onclick="mostrarPagina('organizaciones')">
            <span class="acceso-icono">🌎</span>
            <span><strong>Red sindical</strong><small>Organizaciones vinculadas</small></span>
          </button>
          <button class="acceso" onclick="mostrarPagina('documentos')">
            <span class="acceso-icono">📄</span>
            <span><strong>Documentos</strong><small>Normativa y convenios</small></span>
          </button>
          <button class="acceso" onclick="mostrarPagina('noticias')">
            <span class="acceso-icono">📰</span>
            <span><strong>Noticias</strong><small>Información sindical</small></span>
          </button>
          <button class="acceso" onclick="mostrarPagina('galeria')">
            <span class="acceso-icono">📸</span>
            <span><strong>Galería</strong><small>Actividades y jornadas</small></span>
          </button>
        </div>
      </div>
    </section>

    <section class="bienvenida-inicio">
      <div class="contenedor">
        <div class="bienvenida-inicio-panel">
          <div><strong>ORGANIZACIÓN NACIONAL</strong><span>Presencia a través de nuestras seccionales</span></div>
          <div><strong>PARTICIPACIÓN</strong><span>Comités y espacios de representación</span></div>
          <div><strong>INFORMACIÓN</strong><span>Documentos, noticias y actividades</span></div>
        </div>
      </div>
    </section>

    <section class="destacados">
      <div class="contenedor">
        <div class="destacados-cabecera">
          <div>
            <span class="mini-etiqueta">CONOCE NUESTRA RED</span>
            <h2 class="titulo-seccion">SINTRAINCES: organización, participación y articulación</h2>
            <p class="subtitulo">Desplázate por las organizaciones con las que estamos vinculados y por nuestros Comités. En cada ficha podremos incorporar posteriormente fotografías reales de actividades, noticias y experiencias.</p>
          </div>
          <div class="destacados-controles">
            <button class="control control-grande" onclick="cambiarDestacado(-1)" aria-label="Anterior">‹</button>
            <button class="control control-grande" onclick="cambiarDestacado(1)" aria-label="Siguiente">›</button>
          </div>
        </div>
        <div class="destacado-marco">
          <div id="destacadoVisual" class="destacado-visual"></div>
          <div class="destacado-info">
            <span id="destacadoTipo" class="destacado-tipo"></span>
            <h3 id="destacadoNombre"></h3>
            <p id="destacadoDescripcion"></p>
            <button class="boton boton-destacado" onclick="mostrarPagina('organizaciones')">Ver información</button>
          </div>
        </div>
        <div id="destacadoDots" class="destacado-dots"></div>
        <div class="destacado-ayuda">← Usa las flechas o desliza en el teléfono para explorar →</div>
      </div>
    </section>



    <section class="actividades">
      <div class="contenedor">
        <div class="actividades-cabecera">
          <div>
            <span class="mini-etiqueta">ACTIVIDADES SINTRAINCES</span>
            <h2 class="titulo-seccion">Nuestra organización en acción</h2>
            <p class="subtitulo">Fotografías reales compartidas para mostrar actividades, participación y momentos de organización de SINTRAINCES.</p>
          </div>
          <div class="actividades-controles">
            <button class="control control-grande" onclick="cambiarActividad(-1)" aria-label="Actividad anterior">‹</button>
            <button class="control control-grande" onclick="cambiarActividad(1)" aria-label="Actividad siguiente">›</button>
          </div>
        </div>
        <div id="actividadDestacada" class="actividad-destacada"></div>
        <div id="actividadDots" class="destacado-dots"></div>
      </div>
    </section>

    <section class="contenedor bienvenida">
      <div class="bienvenida-texto">
        <span class="mini-etiqueta">SINTRAINCES</span>
        <h2 class="titulo-seccion">Bienvenidos a nuestro portal</h2>
      <p class="subtitulo">Esta primera versión está pensada como portal informativo. La estructura queda preparada para incorporar posteriormente afiliados, formularios y un panel administrativo.</p>
        <div class="bienvenida-panel">
          <div>
            <strong>Fundación</strong>
            <span>06/01/2006</span>
          </div>
          <div>
            <strong>Teléfono</strong>
            <span>0212-632.69.59</span>
          </div>
          <div>
            <strong>Correo</strong>
            <span>sintrainces.lara1@gmail.com</span>
          </div>
        </div>
      </div>
    </section>
  `,

  organizacion: `
    <section class="contenedor pagina-texto">
      <h2 class="titulo-seccion">La organización</h2>
      <p class="subtitulo">Conoce quiénes somos, nuestra historia y la campaña editorial de SINTRAINCES.</p>
      <div class="organizacion-enlaces" aria-label="Secciones de La Organización">
        <button class="organizacion-enlace" type="button" onclick="abrirSeccionOrganizacion('quienesSomosSINTRAINCES')">
          <span class="organizacion-enlace-icono">◉</span><span><small>IDENTIDAD</small><strong>¿Quiénes somos?</strong><em>Conoce a SINTRAINCES y su razón de ser.</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace" type="button" onclick="abrirSeccionOrganizacion('misionSINTRAINCES')">
          <span class="organizacion-enlace-icono">◎</span><span><small>IDENTIDAD</small><strong>Misión</strong><em>Nuestro propósito y compromiso sindical.</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace" type="button" onclick="abrirSeccionOrganizacion('visionSINTRAINCES')">
          <span class="organizacion-enlace-icono">◌</span><span><small>IDENTIDAD</small><strong>Visión</strong><em>La proyección institucional de SINTRAINCES.</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace" type="button" onclick="abrirSeccionOrganizacion('objetivosSINTRAINCES')">
          <span class="organizacion-enlace-icono">◆</span><span><small>PLANIFICACIÓN</small><strong>Objetivos estratégicos</strong><em>Las principales líneas de acción sindical.</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace" type="button" onclick="abrirSeccionOrganizacion('principiosSINTRAINCES')">
          <span class="organizacion-enlace-icono">✦</span><span><small>VALORES</small><strong>Principios organizacionales</strong><em>Los valores que orientan nuestra actuación.</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace" type="button" onclick="abrirSeccionOrganizacion('historiaSINTRAINCES')">
          <span class="organizacion-enlace-icono">▤</span><span><small>HISTORIA</small><strong>SINTRAINCES y su historia</strong><em>Origen, antecedentes y conformación del sindicato.</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace" type="button" onclick="abrirSeccionOrganizacion('editorialSINTRAINCES')">
          <span class="organizacion-enlace-icono">▥</span><span><small>CAMPAÑA PERMANENTE</small><strong>Editorial</strong><em>“¡Rescatemos y salvemos al INCES!”</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace" type="button" onclick="mostrarPagina('estructura')">
          <span class="organizacion-enlace-icono">👥</span><span><small>ORGANIZACIÓN</small><strong>Estructura sindical</strong><em>Comité Ejecutivo, Tribunal y 25 seccionales.</em></span><b>→</b>
        </button>
        <button class="organizacion-enlace organizacion-enlace-secundario" type="button" onclick="mostrarPagina('organizaciones')">
          <span class="organizacion-enlace-icono">🌐</span><span><small>RED SINDICAL</small><strong>Organizaciones vinculadas</strong><em>ASI Venezuela, CSA, CSI e ISP.</em></span><b>→</b>
        </button>
      </div>

      <article id="quienesSomosSINTRAINCES" class="tarjeta organizacion-quienes">
        <div><span class="mini-etiqueta">QUIÉNES SOMOS</span><h2>SINTRAINCES</h2></div>
        <div><p>SINTRAINCES es el Sindicato Nacional de Trabajadores del INCES. Este espacio web presenta información institucional, documentos de interés, estructura de comités y canales de contacto.</p><p><strong>Fecha de registro legal:</strong> 05 de enero de 2006, según la historia suministrada por la organización.</p></div>
      </article>

      <div class="separador-seccion"></div>

      <div class="organizacion-documentos">
        <article class="tarjeta acordeon-card institucional-card">
          <div class="acordeon-resumen">
            <div>
              <span class="mini-etiqueta">IDENTIDAD INSTITUCIONAL</span>
              <h2>Misión</h2>
              <p>Conoce el propósito institucional de SINTRAINCES y su compromiso con los trabajadores del INCES.</p>
            </div>
            <button class="boton boton-acordeon" type="button" onclick="toggleAcordeon('misionSINTRAINCES', this)">＋ Expandir</button>
          </div>
          <div id="misionSINTRAINCES" class="acordeon-contenido">
            <article class="historia-bloque">
              <p>Representar, defender y velar de manera integral por el estricto cumplimiento de los derechos e intereses laborales, sociales y personales de los trabajadores del Inces en todo el territorio nacional. A través del diálogo, la negociación efectiva y la discusión de convenciones colectivas equitativas, garantizamos condiciones de trabajo dignas, contribuyendo al desarrollo personal y profesional de nuestra fuerza laboral y al fortalecimiento institucional.</p>
            </article>
          </div>
        </article>

        <article class="tarjeta acordeon-card institucional-card">
          <div class="acordeon-resumen">
            <div>
              <span class="mini-etiqueta">IDENTIDAD INSTITUCIONAL</span>
              <h2>Visión</h2>
              <p>La proyección de SINTRAINCES como organización sindical de referencia nacional.</p>
            </div>
            <button class="boton boton-acordeon" type="button" onclick="toggleAcordeon('visionSINTRAINCES', this)">＋ Expandir</button>
          </div>
          <div id="visionSINTRAINCES" class="acordeon-contenido">
            <article class="historia-bloque">
              <p>Ser consolidados como una organización sindical de referencia nacional por nuestra integridad, firmeza y capacidad de negociación en la defensa de la clase trabajadora. Aspiramos a consolidar un entorno de justicia social, estabilidad laboral y bienestar integral para todos los trabajadores del Inces, promoviendo el cumplimiento de la legislación vigente y asegurando convenciones colectivas modernas, inclusivas y protectoras que respondan a los retos del ámbito laboral en Venezuela.</p>
            </article>
          </div>
        </article>

        <article class="tarjeta acordeon-card institucional-card">
          <div class="acordeon-resumen">
            <div>
              <span class="mini-etiqueta">PLANIFICACIÓN</span>
              <h2>Objetivos Estratégicos</h2>
              <p>Las principales líneas de acción para la defensa y desarrollo de los trabajadores.</p>
            </div>
            <button class="boton boton-acordeon" type="button" onclick="toggleAcordeon('objetivosSINTRAINCES', this)">＋ Expandir</button>
          </div>
          <div id="objetivosSINTRAINCES" class="acordeon-contenido">
            <article class="historia-bloque">
              <h3>Defensa Integral del Trabajador</h3>
              <p>Garantizar el respeto de los derechos laborales, sociales y personales de los afiliados ante cualquier instancia, brindando asistencia y asesoría jurídica oportuna.</p>
              <h3>Negociación y Convención Colectiva</h3>
              <p>Discutir, redactar y supervisar la justa aplicación de la Convención Colectiva, asegurando beneficios salariales, sociales y condiciones de trabajo óptimas que respondan a la realidad del país.</p>
              <h3>Vigilancia Normativa</h3>
              <p>Velar por el cumplimiento estricto de la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT), la LOPCYMAT y demás reglamentos que rigen el entorno laboral dentro del Inces.</p>
              <h3>Salud y Seguridad Laboral</h3>
              <p>Promover ambientes de trabajo seguros y saludables, exigiendo el cumplimiento de las normas de prevención de riesgos y bioseguridad en todas las sedes nacionales.</p>
              <h3>Formación y Capacitación</h3>
              <p>Desarrollar programas de formación sindical, legal y desarrollo personal para los trabajadores, fortaleciendo sus capacidades y el conocimiento de sus derechos.</p>
            </article>
          </div>
        </article>

        <article class="tarjeta acordeon-card institucional-card">
          <div class="acordeon-resumen">
            <div>
              <span class="mini-etiqueta">VALORES</span>
              <h2>Principios Organizacionales</h2>
              <p>Los principios que orientan la actuación y el compromiso de SINTRAINCES.</p>
            </div>
            <button class="boton boton-acordeon" type="button" onclick="toggleAcordeon('principiosSINTRAINCES', this)">＋ Expandir</button>
          </div>
          <div id="principiosSINTRAINCES" class="acordeon-contenido">
            <article class="historia-bloque">
              <h3>Justicia Social y Equidad</h3>
              <p>Compromiso firme con la distribución justa de las condiciones laborales y el trato igualitario sin discriminación.</p>
              <h3>Integridad y Transparencia</h3>
              <p>Actuación ética, honesta y rindiendo cuentas claras a la base trabajadora en cada gestión o negociación realizada.</p>
              <h3>Solidaridad Laboral</h3>
              <p>Apoyo mutuo entre los trabajadores, extendiendo la cobertura sindical a la esfera personal y familiar ante contingencias o vulnerabilidades.</p>
              <h3>Autonomía e Independencia</h3>
              <p>Defensa de la soberanía de la organización sindical para tomar decisiones orientadas exclusivamente al bienestar de sus afiliados.</p>
              <h3>Diálogo Social y Fructífero</h3>
              <p>Priorización de la negociación colectiva y la vía concertada para la resolución de conflictos, manteniendo la firmeza en la defensa de las reivindicaciones.</p>
            </article>
          </div>
        </article>
      </div>

      <div class="separador-seccion"></div>
      <div class="organizacion-documentos">
        <article class="tarjeta acordeon-card">
          <div class="acordeon-resumen">
            <div>
              <span class="mini-etiqueta">HISTORIA</span>
              <h2>SINTRAINCES y su historia en el INCES</h2>
              <p>Conoce el origen, los antecedentes y las etapas que han marcado la historia de SINTRAINCES y su relación con el movimiento de trabajadores del INCES.</p>
            </div>
            <button class="boton boton-acordeon" type="button" onclick="toggleAcordeon('historiaSINTRAINCES', this)">＋ Expandir</button>
          </div>
          <div id="historiaSINTRAINCES" class="acordeon-contenido">
      <article class="tarjeta historia-bloque">
        <h3>SINTRAINCES y su historia en el INCES</h3>
        <p>Nuestra organización, el Sindicato Nacional de Trabajadores del INCES (SINTRAINCES), es registrada legalmente el 05 de Enero de 2006 durante la gestión del entonces Presidente institucional, Elías Jaua Milano, el cual simultáneamente era en la época Ministerio de la Economía Popular (ministerio de breve existencia), al cual nuestra institución estaba adscrita en aquel momento.</p>
        <p>Al presente el SINTRAINCES tiene 19 años de intensa e interesante historia en la cual se pueden identificar fases o etapas debido a la riqueza y complejidad de esta experiencia de organización de trabajadores como sindicato nacional y unitario de todas las categorías laborales del INCES, incluyendo su personal jubilado y pensionado.</p>
      </article>

      <article class="tarjeta historia-bloque">
        <h3>Antecedentes Históricos</h3>
        <p>Para conocer esta historia y tomar conciencia su importancia para la generación actual del personal del INCES, es necesario comprender que las organizaciones de trabajadores que hoy conocemos como sindicatos tienen un origen histórico internacional de luchas por mejores condiciones de trabajo, de salarios y de seguridad social.</p>
        <p>La historia del movimiento obrero y sindical es una consecuencia con la Revolución Industrial en Europa durante el siglo XVIII y la aparición del trabajo asalariado. La Revolución Francesa, afirmándose provocó la quiebra del Sistema Feudal y del trabajo servil y el reconocimiento por vez primera de ciertos derechos de la clase obrera asalariada. Por más de un siglo, la acción colectiva de lucha de los trabajadores (organizando los primeros sindicatos, impulsando huelgas, exigiendo acuerdos o convenios colectivos de trabajo, entre otros) fué considerada como un delito.</p>
        <p>En Inglaterra, donde surgen los primeros movimientos obreros, tales como el Ludismo conducido por Ned Ludd, destructores de máquinas que los reemplazan en sus labores (1810-1811). En 1824, por la fuerte presión popular el parlamento británico deroga las leyes que prohibían las organizaciones obreras (Combination Acts). En 1829, Robert Owen, uno de los fundadores del socialismo moderno, da a las primeras cooperativas, el carácter de "sociedades industriales de trabajadores". A partir de la década de 1840, los alemanes Carlos Marx y Federico Engels se instalan en Inglaterra, e influenciados por el surgimiento de los Sindicatos a los que consideraron "movimientos revolucionarios" por el hecho de proteger los intereses de los trabajadores y el derecho al trabajo, dan origen a un particular pensamiento obrero: Socialismo Científico y el Marxismo. Posteriormente publican "El Manifiesto Comunista". En 1864 se crea en Londres la Asociación Internacional de Trabajadores AIT, "La Internacional", primera central sindical mundial de la clase obrera. Ese mismo año, reconocen en Francia el derecho a la huelga como uno de los derechos fundamentales del individuo. En 1889 se funda la Segunda Internacional Socialista, cuyo primer congreso se celebra en París el 14 de julio de ese año. Este congreso declara al 1º de Mayo como Día Internacional de los Trabajadores.</p>
      </article>

      <article class="tarjeta historia-bloque">
        <h3>Antecedentes en Nuestro País</h3>
        <p>Los primeros sindicatos en la historia moderna de nuestro país aparecen en la industria petrolera que se instaló en tiempos de la dictadura de Juan Vicente Gómez y era controlada por empresas extrajeras principalmente de Estados Unidos e también de Inglaterra. Las primeras luchas eran por mejores condiciones de trabajo y salarios. En 1936 sucede la primera huelga petrolera en Venezuela y en ese marco nace la primer Ley Trabajo elaborada por Rafael Caldera.</p>
        <p>También durante los últimos años del gomecismo surgieron las primeras organizaciones gremiales de maestros como la Sociedad Venezolana de Maestros de Instrucción Primaria (SVMI) en 1932 que luego se denominaría Federación Venezolana de Maestros (FVM) desde 1936. En esa iniciativa fué protagonista fundamental Luis Beltrán Prieto Figueroa, quién luego sería fundador del INCE en 1959.</p>
      </article>

      <article class="tarjeta historia-bloque">
        <h3>Las organizaciones sindicales en el INCE</h3>
        <p>Aunque el INCE es creado en 1959, no es sino hasta 1969 que es fundado su primer sindicato denominado Sindicato Único de Obreros del INCE (SUOI), impulsado por el personal obrero del Distrito Federal y del Estado Miranda. El 17 de Julio de 1970 se firma el primer Contrato Colectivo del INCE que amparó a 592 obreros. Para el año de 1973, se hizo extensiva la contratación colectiva a todas las regiones del país.</p>
        <p>Es importante reseñar que el primer sindicato del INCE nace el mismo año 1969 que el magisterio venezolano realizó una huelga nacional por mejores condiciones de trabajo y salarios, logrando firmar una Acta Convenio con importantes reivindicaciones para los docentes del país. Entre los impulsores de dicha acción huelgaría estuvo Luis Beltrán Prieto Figueroa, quien era en esa época Presidente del Senado del entonces Congreso Nacional.</p>
        <p>Paulatinamente el movimiento gremial del INCE se fue ampliando, liderado por la Federación de Trabajadores del INCE (FETRAINCE), conformada por los sindicatos regionales de obreros y empleados (SUTRAINCE). Así mismo la conformación del Sindicato Único de Empleados del INCE (SUNEPINCE), integrado por los funcionarios públicos de la sede principal del INCE en Caracas (en la actualidad INCES Sede); del Sindicato Único de Trabajadores de la Docencia INCE (SUTDI), constituido por los formadores del Instituto; y el Sindicato de Trabajadores de la Formación Profesional (SINTRAFOR).</p>
        <p>En el caso de los jubilados, se organizaron en la Asociación Nacional de Jubilados del INCE (ANJI) y los profesionales y técnicos en la organización ASOPROTEC. La primera Caja de Ahorro creada en el instituto fue CATINCE (01/11/1964).</p>
        <p>Luego se crearían CAJINCE (07/06/1994) y CAFINCE (07/09/2001). Cada organización velando de manera separada por los intereses particulares de sus agremiados.</p>
        <p>En el año 2001, los sindicatos más representativos, FETRAINCE y SUNEP-INCE; acuerdan realizar una acción conjunta que deviene en una huelga general de quince días, por el reclamo de reivindicaciones laborales incumplidas. La huelga fue declarada “ilegal” por el Ministerio del Trabajo, y trajo como consecuencia el despido de los principales dirigentes de las Juntas directivas de cada sindicato, entre ellos a Luis Marcano (Secretario General) y Luis Felipe Mata (Secretario de Organización) de SUNEP-INCES; Lorenzo Urbáez (Secretario de Reclamos) de FETRAINCES; y la jubilación inmediata de Omar Román (Secretario General) e Iván Bermúdez (Secretario de Finanzas), de FETRAINCES.</p>
        <p>Este hecho ocasionó el debilitamiento de la clase trabajadora organizada, por cuanto el relevo forzoso de los dirigentes no pudo sortear la crisis de representatividad por la ausencia de sus máximos líderes; quedando los trabajadores, por un lapso aproximado de 5 años, prácticamente desamparados y sin mecanismos para la defensa de sus derechos.</p>
        <p>Esta situación ocasionó que la Convención Colectiva de obreros llegara a tener más de 7 años vencida, y la de funcionarios más de 3 años, lo que generaba beneficios dispares para cada grupo. Además de que los jubilados, pensionados y contratados, no tuvieran ningún beneficio en esas convenciones “devaluadas” por el tiempo; provocando la desprotección y la inequidad entre trabajadores de un mismo ente.</p>
      </article>

      <article class="tarjeta historia-bloque">
        <h3>La Conformación del SINTRAINCES</h3>
        <p>En vista de lo anterior, en el año 2005 se realizaron asambleas en las sedes de los INCE de todo el país, a fin de elegir democráticamente 60 delegados que reorganizaran el movimiento de los trabajadores del instituto.</p>
        <p>Luego de tres meses de arduos debates en mesas de trabajo, los delegados, reunidos en Caracas, deciden fundar un sindicato nuevo que cohesione la fuerza laboral, presentando un proyecto unitario de Convención Colectiva para unificar en un solo instrumento a funcionarios, obreros, contratados, jubilados y pensionados del instituto, sin exclusión lo cual significó un avance considerable en cuanto a cobertura y concepción unitaria como sindicato representativo de la clase trabajadora del INCE.</p>
        <p>En tal contexto, fue creado el Sindicato Nacional de Trabajadores del INCE SINTRAINCE (hoy SINTRAINCES); no solo como una organización de promoción y defensa de los derechos laborales de sus afiliados, sino además como articulador de las propuestas institucionales y formativas desde la base de los trabajadores hacia el país.</p>
        <p>Así apenas se iniciaba la historia del hoy sindicato mayoritario y legítimo del personal activo y jubilado del INCES. La lucha está vigente, es continua por las reivindicaciones laborales.</p>
      </article>

      <div class="separador-seccion"></div>

          </div>
        </article>

        <article class="tarjeta acordeon-card editorial-card">
          <div class="acordeon-resumen">
            <div>
              <span class="mini-etiqueta">CAMPAÑA PERMANENTE · EDITORIAL</span>
              <h2>¡RESCATEMOS Y SALVEMOS AL INCES!</h2>
              <p>Una reflexión institucional sobre la importancia histórica del INCES, su misión de formación y capacitación y el llamado expresado por SINTRAINCES para su recuperación y fortalecimiento.</p>
            </div>
            <button class="boton boton-acordeon" type="button" onclick="toggleAcordeon('editorialSINTRAINCES', this)">＋ Expandir</button>
          </div>
          <div id="editorialSINTRAINCES" class="acordeon-contenido">
            <article class="historia-bloque editorial-bloque">
              <p>Un 22 de Agosto de 1959, nace uno de los proyectos de mayor importancia y mejor concebido para el desarrollo del país: la creación del Instituto Nacional de Cooperación Educativa INCE, hoy Instituto Nacional de Capacitación y Educación Socialista "INCES", bajo la premisa fundamental de formar y de capacitar a la fuerza laboral venezolana.</p>
              <p>Esta iniciativa se la debemos a un visionario de ideas progresistas nacido en La Asunción, estado Nueva Esparta un 14 de marzo de 1902, llamado Luis Beltrán Prieto Figueroa, quien nos legó hace sesenta y cinco años, una institución con fines sociales que sería conocida como la "Universidad del Pueblo". Cabe destacar que el maestro Prieto, egreso en 1934 de la Universidad Central de Venezuela (UCV) como Dr. en Ciencias Políticas y Sociales, además de docente, político, periodista, jurisconsulto, poeta, y crítico literario fue pionero y defensor del gremialismo, fundo la Sociedad de Maestros de Instrucción Primaria, la Federación Venezolana de Maestros, el Consejo Nacional de Universidades (CNU).</p>
              <p>Luego de más de un tercio de siglo, el INCES ha formado a millones de venezolanos y venezolanas en los más de los 147 Centros de Formación distribuidos a lo largo y ancho del territorio nacional, desarrollando el Programa Nacional de Aprendizaje (PNA), régimen especial de formación y trabajo de adolescentes, de carácter obligatorio para el sector privado reconocido en el ámbito nacional e internacional. Fue el responsable de ejecutar la Misión Robinson, programa social bandera del gobierno de la época. Para el 28 de Octubre de 2005, la República Bolivariana de Venezuela fue declarada Territorio Libre de Analfabetismo por la Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO) al alfabetizar a más de 1.500.000 venezolanos. Igualmente, dio continuidad a la Programación Ordinaria y Extraordinaria de Cursos e implemento las misiones Vuelvan Caras 1 y II y Vuelvan Caras Jóvenes, que abrieron paso a la misión Che Guevara.</p>
              <p>Al paso del tiempo, el INCES ha logrado una especial identificación con los trabajadores, conocida como la "Gran Familia INCES". No obstante, con la transformación del Instituto Nacional de Cooperación Educativa INCE a Instituto Nacional de Capacitación y Educación Socialista, INCES, mediante Decreto Ley de fecha 23 de junio de 2008, se ha presenciado el decaimiento, reducción y deterioro de la Formación Profesional en todo el ámbito nacional. Los trabajadores han sido testigos del desplazamiento de la institución frente a otros organismos, de los innumerables reclamos por parte de los estudiantes participantes en relación a la falta de insumos y equipos para su aprendizaje, así como de la disminución de la Formación Teórico Práctica, "Aprender-Haciendo" a cambio de la Formación "Socio-Política-Ideológica", es el hecho que ha contribuido a la pérdida de la calidad y eficiencia práctica de la instrucción impartida.</p>
              <p>Aunado a lo anterior, los trabajadores funcionarios, obreros, contratados, jubilados y pensionados adscritos al INCES y SINTRAINCES han mantenido una constante lucha por los continuos retrocesos y desmejoras de derechos y beneficios laborales han sido conquistados a través de la lucha sindical de muchos años.</p>
              <p>Contradictoriamente, los últimos años han sido los de mayor recaudación financiera por parte del instituto. Por lo tanto, ¿No es acaso responsabilidad de todas y todos abocarnos a la recuperación del INCE de su futuro incierto? En tiempos de crisis económica mundial, donde los más afectados son siempre los más pobres, toma mayor relevancia la necesidad de formar al pueblo en oficios productivos e incorporar al campo laboral mano de obra calificada requerida en el mundo del trabajo actual.</p>
              <p>Estas razones son las que motivan al equipo que conforma la actual Junta Directiva del Sindicato Nacional de los Trabajadores del INCES “SINTRAINCES” a realizar la presente publicación en homenaje a la Institución que Capacita a la Más Grande de las Empresas: El País.</p>
              <p>Es propicia la ocasión para hacer un llamado de reflexión y con compromiso a los trabajadores, autoridades, participantes y a la comunidad en general, con el mismo ímpetu de reclamo que manifestara el Maestro Luís Beltrán Prieto, Figueroa, al entonces presidente de la República hace más de 64 años: "RESCATEMOS Y SALVEMOS AL INCES"</p>
            </article>
          </div>
        </article>
      </div>
    </section>
  `,

  estructura: `
    <section class="contenedor estructura-pagina">
      <div class="estructura-encabezado">
        <span class="mini-etiqueta">ESTRUCTURA SINDICAL</span>
        <h2 class="titulo-seccion">Comité Ejecutivo Nacional, Tribunal Disciplinario y Seccionales</h2>
        <p class="subtitulo">Conoce la estructura organizativa de SINTRAINCES. Las fotografías, cargos y nombres de los integrantes presentados aquí corresponden al archivo de estructura suministrado por la organización.</p>
      </div>

      <article class="tarjeta estructura-seccion">
        <div class="estructura-seccion-cabecera">
          <div><span class="mini-etiqueta">DIRECCIÓN NACIONAL</span><h3>Comité Ejecutivo Nacional</h3></div>
          <span class="estructura-contador">${estructuraCEN.length} integrantes</span>
        </div>
        <div class="directiva-grid">
          ${estructuraCEN.map(persona => `
            <article class="directivo-card">
              <div class="directivo-foto-wrap"><img src="${persona.foto}" alt="Fotografía de ${persona.nombre}" class="directivo-foto"></div>
              <div class="directivo-datos"><span class="directivo-cargo">${persona.cargo}</span><h4>${persona.nombre}</h4></div>
            </article>
          `).join('')}
        </div>
      </article>

      <article class="tarjeta estructura-seccion">
        <div class="estructura-seccion-cabecera">
          <div><span class="mini-etiqueta">ÓRGANO DISCIPLINARIO</span><h3>Tribunal Disciplinario</h3></div>
          <span class="estructura-contador">${estructuraTribunal.length} integrantes</span>
        </div>
        <div class="directiva-grid">
          ${estructuraTribunal.map(persona => `
            <article class="directivo-card">
              <div class="directivo-foto-wrap"><img src="${persona.foto}" alt="Fotografía de ${persona.nombre}" class="directivo-foto"></div>
              <div class="directivo-datos"><span class="directivo-cargo">${persona.cargo}</span><h4>${persona.nombre}</h4></div>
            </article>
          `).join('')}
        </div>
      </article>

      <article class="tarjeta estructura-seccion seccionales-seccion">
        <div class="estructura-seccion-cabecera">
          <div><span class="mini-etiqueta">ORGANIZACIÓN TERRITORIAL</span><h3>Seccionales de SINTRAINCES</h3></div>
          <span class="estructura-contador">${seccionales.length} seccionales</span>
        </div>
        <p class="estructura-nota">La información de las <strong>25 seccionales</strong> fue incorporada a partir del archivo de estructura suministrado por SINTRAINCES. Selecciona una seccional para consultar sus cargos, nombres y fotografías.</p>
        <div class="seccionales-grid">
          ${seccionales.map((s, i) => `
            <button class="seccional-selector activa" type="button" onclick="mostrarSeccional(${i})">
              <span class="seccional-numero">${String(i+1).padStart(2,'0')}</span>
              <span><strong>${s.nombre}</strong><small>Ver directiva</small></span>
              <span class="seccional-flecha">›</span>
            </button>
          `).join('')}
        </div>
        <div id="seccionalDetalle" class="seccional-detalle"></div>
      </article>
    </section>
  `,

  comites: `
    <section class="contenedor">
      <h2 class="titulo-seccion">Nuestros Comités</h2>
      <p class="subtitulo">Espacios de participación de SINTRAINCES.</p>
      <div class="grid">
        ${comites.map(c => `
          <article class="tarjeta">
            <img class="comite-logo" src="${c.imagen}" alt="${c.nombre}">
            <h3>${c.nombre}</h3>
            <p>${c.descripcion}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `,

  documentos: `
    <section class="contenedor documentos-pagina">
      <div class="documentos-hero">
        <div>
          <span class="eyebrow">SINTRAINCES · Biblioteca sindical</span>
          <h2 class="titulo-seccion">Centro de Documentación</h2>
          <p class="subtitulo">Consulta documentos institucionales y normas de interés para los trabajadores y trabajadoras del INCES.</p>
        </div>
        <div class="documentos-icono" aria-hidden="true">📚</div>
      </div>

      <div class="documentos-filtros">
        <button class="filtro-doc activo" onclick="filtrarDocumentos('todos', this)">Todos</button>
        <button class="filtro-doc" onclick="filtrarDocumentos('institucional', this)">Institucionales</button>
        <button class="filtro-doc" onclick="filtrarDocumentos('laboral', this)">Legislación laboral</button>
      </div>

      <div class="lista-documentos documentos-grid">
        <article class="documento-card" data-categoria="institucional">
          <div class="documento-icono">📘</div>
          <div class="documento-cuerpo">
            <span class="documento-etiqueta">INSTITUCIONAL</span>
            <h3>Convención Colectiva 2016–2018</h3>
            <p>Documento de negociación colectiva suministrado por SINTRAINCES para consulta.</p>
            <div class="documento-acciones"><a class="boton" href="documentos/convencion-colectiva-2016-2018.pdf" target="_blank" rel="noopener">Ver documento</a></div>
          </div>
        </article>

        <article class="documento-card" data-categoria="institucional">
          <div class="documento-icono">📜</div>
          <div class="documento-cuerpo">
            <span class="documento-etiqueta">INSTITUCIONAL</span>
            <h3>Reforma de Estatutos SINTRAINCES 2022</h3>
            <p>Documento estatutario suministrado por la organización para consulta.</p>
            <div class="documento-acciones"><a class="boton" href="documentos/estatutos-sintrainces-reforma-2022.pdf" target="_blank" rel="noopener">Ver documento</a></div>
          </div>
        </article>

        <article class="documento-card" data-categoria="laboral">
          <div class="documento-icono">⚖️</div>
          <div class="documento-cuerpo">
            <span class="documento-etiqueta">LEGISLACIÓN LABORAL</span>
            <h3>Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras</h3>
            <p>LOTTT 2012. Texto incorporado al centro documental.</p>
            <div class="documento-acciones"><a class="boton" href="documentos/lottt-2012.pdf" target="_blank" rel="noopener">Ver documento</a></div>
          </div>
        </article>

        <article class="documento-card" data-categoria="laboral">
          <div class="documento-icono">🦺</div>
          <div class="documento-cuerpo">
            <span class="documento-etiqueta">SEGURIDAD Y SALUD LABORAL</span>
            <h3>Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo</h3>
            <p>LOPCYMAT. Texto incorporado al centro documental.</p>
            <div class="documento-acciones"><a class="boton" href="documentos/lopcymat.pdf" target="_blank" rel="noopener">Ver documento</a></div>
          </div>
        </article>

        <article class="documento-card" data-categoria="laboral">
          <div class="documento-icono">🏛️</div>
          <div class="documento-cuerpo">
            <span class="documento-etiqueta">MARCO CONSTITUCIONAL</span>
            <h3>Constitución de la República Bolivariana de Venezuela</h3>
            <p>Texto constitucional de 1999 incorporado al centro documental.</p>
            <div class="documento-acciones"><a class="boton" href="documentos/constitucion-1999.pdf" target="_blank" rel="noopener">Ver documento</a></div>
          </div>
        </article>

        <article class="documento-card pendiente" data-categoria="laboral">
          <div class="documento-icono">📄</div>
          <div class="documento-cuerpo">
            <span class="documento-etiqueta">PENDIENTE</span>
            <h3>Convenios, acuerdos y otros instrumentos laborales</h3>
            <p>Esta sección queda preparada para incorporar nuevos documentos cuando sean suministrados por SINTRAINCES.</p>
            <div class="documento-acciones"><span class="estado-pendiente">Documento pendiente de incorporación</span></div>
          </div>
        </article>
      </div>

      <div class="documentos-nota">
        <strong>Nota documental:</strong> los archivos disponibles corresponden a los documentos suministrados para este portal. La publicación en esta sección no implica por sí misma una valoración sobre vigencia o aplicación jurídica.
      </div>
    </section>
  `,

  organizaciones: `
    <section class="contenedor">
      <h2 class="titulo-seccion">Organizaciones con las que estamos vinculados</h2>
      <p class="subtitulo">Presentación inicial de las organizaciones indicadas por SINTRAINCES.</p>
      <div class="grid">
        ${organizaciones.map(o => `
          <article class="tarjeta">
            <img class="tarjeta-logo" src="${o.imagen}" alt="${o.nombre}">
            <h3>${o.nombre}</h3>
            <p>${o.descripcion}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `,

  noticias: `
    <section class="contenedor pagina-noticias">
      <div class="pagina-cabecera">
        <span class="mini-etiqueta">INFORMACIÓN SINDICAL</span>
        <h2 class="titulo-seccion">Noticias y actividades</h2>
        <p class="subtitulo">Espacio para comunicar actividades, jornadas y acciones de SINTRAINCES. En esta primera versión se muestran contenidos basados en las fotografías suministradas por la organización.</p>
      </div>
      <div class="noticias-grid">
        <article class="noticia-card">
          <img src="assets/actividad-asamblea.jpg" alt="Asamblea y encuentro de trabajadores">
          <div class="noticia-contenido">
            <span class="destacado-tipo">Actividad sindical</span>
            <h3>Asamblea y encuentro de trabajadores</h3>
            <p>Registro fotográfico de una actividad grupal de trabajadores y trabajadoras de SINTRAINCES, en un espacio de participación y encuentro sindical.</p>
            <button class="boton boton-secundario" onclick="mostrarPagina('galeria')">Ver en la galería</button>
          </div>
        </article>
        <article class="noticia-card">
          <img src="assets/actividad-afiliacion.jpg" alt="Jornada de Afiliación y Actualización de Datos">
          <div class="noticia-contenido">
            <span class="destacado-tipo">Afiliación y actualización</span>
            <h3>Jornada de Afiliación y Actualización de Datos</h3>
            <p>Material gráfico correspondiente a una jornada de afiliación y actualización de datos de SINTRAINCES.</p>
            <button class="boton boton-secundario" onclick="mostrarPagina('galeria')">Ver en la galería</button>
          </div>
        </article>
      </div>
      <div class="noticias-nota">
        <strong>Sección preparada para crecer:</strong> aquí podremos incorporar posteriormente comunicados, convocatorias, noticias por seccional y publicaciones con fecha, título, imagen y contenido completo.
      </div>
    </section>
  `,

  galeria: `
    <section class="contenedor pagina-galeria">
      <div class="pagina-cabecera galeria-cabecera">
        <span class="mini-etiqueta">MEMORIA VISUAL</span>
        <h2 class="titulo-seccion">Galería de actividades</h2>
        <p class="subtitulo">Registro visual de actividades y materiales suministrados por SINTRAINCES para este portal.</p>
      </div>
      <div class="galeria-filtros" role="tablist" aria-label="Filtrar galería">
        <button class="filtro-galeria activo" onclick="filtrarGaleria('todos', this)">Todas</button>
        <button class="filtro-galeria" onclick="filtrarGaleria('actividad', this)">Actividades</button>
        <button class="filtro-galeria" onclick="filtrarGaleria('afiliacion', this)">Afiliación</button>
      </div>
      <div class="galeria-grid">
        <figure class="galeria-item galeria-ancha" data-categoria="actividad" onclick="abrirGaleria(this)">
          <img src="assets/actividad-asamblea.jpg" alt="Asamblea y encuentro de trabajadores">
          <figcaption><strong>Asamblea y encuentro de trabajadores</strong><small>Participación y encuentro sindical</small></figcaption>
        </figure>
        <figure class="galeria-item" data-categoria="afiliacion" onclick="abrirGaleria(this)">
          <img src="assets/actividad-afiliacion.jpg" alt="Jornada de Afiliación y Actualización de Datos">
          <figcaption><strong>Jornada de Afiliación y Actualización de Datos</strong><small>Afiliación y actualización</small></figcaption>
        </figure>
        <figure class="galeria-item" data-categoria="actividad" onclick="abrirGaleria(this)">
          <img src="assets/galeria-asamblea-2.jpg" alt="Actividad grupal de SINTRAINCES">
          <figcaption><strong>Actividad grupal de SINTRAINCES</strong><small>Encuentro de trabajadores</small></figcaption>
        </figure>
        <figure class="galeria-item" data-categoria="afiliacion" onclick="abrirGaleria(this)">
          <img src="assets/galeria-afiliacion-2.jpg" alt="Material de afiliación de SINTRAINCES">
          <figcaption><strong>Material de afiliación</strong><small>Comunicación y afiliación</small></figcaption>
        </figure>
      </div>
      <div class="galeria-nota"><strong>Galería en crecimiento.</strong> Se incorporarán nuevas fotografías conforme SINTRAINCES suministre registros de actividades, jornadas y encuentros.</div>
    </section>
    <div id="galeriaLightbox" class="galeria-lightbox" onclick="cerrarGaleria(event)" aria-hidden="true">
      <button class="galeria-cerrar" aria-label="Cerrar">×</button>
      <div class="galeria-lightbox-contenido" onclick="event.stopPropagation()">
        <img id="galeriaLightboxImg" src="" alt="">
        <div id="galeriaLightboxTexto"></div>
      </div>
    </div>
  `,

  contacto: `
    <section class="contenedor contacto-pagina">
      <div class="contacto-encabezado">
        <div>
          <span class="etiqueta-seccion">SINTRAINCES · CONTACTO</span>
          <h2 class="titulo-seccion">Estamos para atenderte</h2>
          <p class="subtitulo">Encuentra aquí nuestros canales institucionales de comunicación.</p>
        </div>
        <div class="contacto-sello" aria-hidden="true">☎</div>
      </div>

      <div class="contacto-grid-moderno">
        <article class="contacto-card contacto-card-principal">
          <div class="contacto-icono">📍</div>
          <div>
            <span class="contacto-label">Nuestra sede</span>
            <h3>Dirección</h3>
            <p>Avenida Nueva Granada con Avenida El Paseo, Edificio Arauca, Entrada “C”, Piso 3, Caracas, Venezuela.</p>
          </div>
        </article>

        <article class="contacto-card">
          <div class="contacto-icono">☎</div>
          <div>
            <span class="contacto-label">Llámanos</span>
            <h3>Teléfono</h3>
            <a class="contacto-accion" href="tel:+582126326959">0212-632.69.59</a>
            <p class="contacto-ayuda">Atención institucional.</p>
          </div>
        </article>

        <article class="contacto-card">
          <div class="contacto-icono">✉</div>
          <div>
            <span class="contacto-label">Escríbenos</span>
            <h3>Correo electrónico</h3>
            <a class="contacto-accion contacto-correo" href="mailto:sintrainces.lara1@gmail.com">sintrainces.lara1@gmail.com</a>
            <p class="contacto-ayuda">Canal para comunicaciones institucionales.</p>
          </div>
        </article>
      </div>

      <div class="contacto-redes">
        <div>
          <span class="etiqueta-seccion">REDES SOCIALES</span>
          <h3>Conecta con SINTRAINCES</h3>
          <p>Accede directamente a nuestras cuentas institucionales en redes sociales.</p>
        </div>
        <div class="redes-lista">
          <a class="red-social-pendiente" href="https://x.com/SintraincesLara" target="_blank" rel="noopener noreferrer">𝕏 · @SintraincesLara</a>
          <a class="red-social-pendiente" href="https://www.facebook.com/sintraince.lara" target="_blank" rel="noopener noreferrer">f · sintraince.lara</a>
          <a class="red-social-pendiente" href="https://www.instagram.com/sintrainceslara" target="_blank" rel="noopener noreferrer">◎ · sintrainceslara</a>
        </div>
      </div>

      <div class="contacto-futuro">
        <div class="contacto-futuro-icono">🤝</div>
        <div>
          <strong>Próximamente: Afiliación en línea</strong>
          <p>Esta sección quedará preparada para incorporar el formulario de afiliación y el acceso de afiliados.</p>
        </div>
      </div>
    </section>
  `};

function moverCarrusel(id, direccion) {
  const carrusel = document.getElementById(id);
  if (!carrusel) return;
  const paso = Math.min(carrusel.clientWidth * 0.82, 380);
  carrusel.scrollBy({ left: direccion * paso, behavior: "smooth" });
}

window.destacadosData = destacadosData;
let destacadoActual = 0;

function renderDestacado() {
  const item = window.destacadosData[destacadoActual];
  const visual = document.getElementById("destacadoVisual");
  const tipo = document.getElementById("destacadoTipo");
  const nombre = document.getElementById("destacadoNombre");
  const descripcion = document.getElementById("destacadoDescripcion");
  const dots = document.getElementById("destacadoDots");
  if (!visual || !item) return;

  visual.innerHTML = `
    <div class="actividad-placeholder">
      <div class="actividad-etiqueta">ORGANIZACIÓN VINCULADA</div>
      <div class="actividad-arte">
        <img src="${item.imagen}" alt="${item.nombre}" class="destacado-logo">
        <span>${item.nombreCorto}</span>
      </div>
      <div class="actividad-pie">Red sindical de SINTRAINCES</div>
    </div>`;
  tipo.textContent = item.tipo;
  nombre.textContent = item.nombre;
  descripcion.innerHTML = `
    <span class="destacado-resumen">${item.descripcion}</span>
    ${item.detalle ? `<span class="destacado-detalle-titulo">${item.detalleTitulo || 'Información'}</span><span class="destacado-detalle">${item.detalle}</span>` : ''}
    ${item.principios ? `<ul class="destacado-principios">${item.principios.map(principio => `<li>${principio}</li>`).join('')}</ul>` : ''}`;
  dots.innerHTML = window.destacadosData.map((_, i) => `<button class="destacado-dot ${i === destacadoActual ? 'activo' : ''}" onclick="irADestacado(${i})" aria-label="Ir a elemento ${i+1}"></button>`).join("");
}

function cambiarDestacado(direccion) {
  destacadoActual = (destacadoActual + direccion + window.destacadosData.length) % window.destacadosData.length;
  renderDestacado();
}

function irADestacado(indice) {
  destacadoActual = indice;
  renderDestacado();
}

function iniciarDestacado() {
  renderDestacado();
  setInterval(() => {
    const seccion = document.querySelector('.destacados');
    if (seccion && document.visibilityState === 'visible') cambiarDestacado(1);
  }, 7000);
}

window.actividadesData = [
  {
    titulo: 'Asamblea y encuentro de trabajadores',
    imagen: 'assets/actividad-asamblea.jpg',
    descripcion: 'Fotografía grupal de una actividad de trabajadores y trabajadoras de SINTRAINCES, con el mensaje institucional de la organización presente en la jornada.',
    etiqueta: 'Actividad sindical'
  },
  {
    titulo: 'Jornada de Afiliación y Actualización de Datos',
    imagen: 'assets/actividad-afiliacion.jpg',
    descripcion: 'Material gráfico de una jornada de afiliación y actualización de datos de SINTRAINCES. La pieza conserva la información y fechas que aparecen en la imagen original.',
    etiqueta: 'Afiliación y actualización'
  }
];

let actividadActual = 0;

function renderActividad() {
  const item = window.actividadesData[actividadActual];
  const contenedor = document.getElementById('actividadDestacada');
  const dots = document.getElementById('actividadDots');
  if (!contenedor || !item) return;

  contenedor.innerHTML = `
    <article class="actividad-card">
      <div class="actividad-foto-wrap">
        <img src="${item.imagen}" alt="${item.titulo}" class="actividad-foto">
        <img src="assets/logo-sintrainces.jpg" alt="Logo SINTRAINCES" class="actividad-logo-superpuesto">
      </div>
      <div class="actividad-texto">
        <span class="destacado-tipo">${item.etiqueta}</span>
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
      </div>
    </article>`;

  dots.innerHTML = window.actividadesData.map((_, i) =>
    `<button class="destacado-dot ${i === actividadActual ? 'activo' : ''}" onclick="irAActividad(${i})" aria-label="Ir a actividad ${i+1}"></button>`
  ).join('');
}

function cambiarActividad(direccion) {
  actividadActual = (actividadActual + direccion + window.actividadesData.length) % window.actividadesData.length;
  renderActividad();
}

function irAActividad(indice) {
  actividadActual = indice;
  renderActividad();
}

function iniciarActividades() {
  renderActividad();
  setInterval(() => {
    const seccion = document.querySelector('.actividades');
    if (seccion && document.visibilityState === 'visible') cambiarActividad(1);
  }, 8000);
}

function mostrarSeccional(indice) {
  const seleccion = seccionales[indice];
  const contenedor = document.getElementById('seccionalDetalle');
  if (!seleccion || !contenedor) return;
  contenedor.innerHTML = `
    <div class="seccional-detalle-cabecera">
      <div><span class="mini-etiqueta">SECCIONAL ${String(indice + 1).padStart(2,'0')}</span><h3>Seccional ${seleccion.nombre}</h3></div>
      <button class="boton boton-acordeon" type="button" onclick="document.getElementById('seccionalDetalle').innerHTML=''">Cerrar</button>
    </div>
    <div class="directiva-grid seccional-directiva-grid">
      ${seleccion.integrantes.map(persona => `
        <article class="directivo-card">
          <div class="directivo-foto-wrap"><img src="${persona.foto}" alt="Fotografía de ${persona.nombre}" class="directivo-foto"></div>
          <div class="directivo-datos"><span class="directivo-cargo">${persona.cargo}</span><h4>${persona.nombre}</h4></div>
        </article>
      `).join('')}
    </div>`;
  contenedor.scrollIntoView({behavior:'smooth', block:'start'});
}

function abrirSeccionOrganizacion(id) {
  const contenido = document.getElementById(id);
  if (!contenido) return;
  if (contenido.classList.contains('acordeon-contenido')) {
    if (!contenido.classList.contains('abierto')) contenido.classList.add('abierto');
    const boton = contenido.parentElement?.querySelector('.boton-acordeon');
    if (boton) boton.innerHTML = '− Cerrar';
  }
  contenido.scrollIntoView({behavior:'smooth', block:'start'});
}

function toggleAcordeon(id, boton) {
  const contenido = document.getElementById(id);
  if (!contenido) return;
  const abierto = contenido.classList.toggle("abierto");
  boton.innerHTML = abierto ? "− Cerrar" : "＋ Expandir";
}


function filtrarDocumentos(categoria, boton) {
  document.querySelectorAll('.filtro-doc').forEach(b => b.classList.remove('activo'));
  if (boton) boton.classList.add('activo');
  document.querySelectorAll('.documento-card').forEach(card => {
    card.style.display = (categoria === 'todos' || card.dataset.categoria === categoria) ? '' : 'none';
  });
}

function filtrarGaleria(categoria, boton) {
  document.querySelectorAll('.filtro-galeria').forEach(b => b.classList.remove('activo'));
  if (boton) boton.classList.add('activo');
  document.querySelectorAll('.galeria-item').forEach(item => {
    item.style.display = (categoria === 'todos' || item.dataset.categoria === categoria) ? '' : 'none';
  });
}

function abrirGaleria(item) {
  const modal = document.getElementById('galeriaLightbox');
  const img = item.querySelector('img');
  const texto = item.querySelector('figcaption');
  if (!modal || !img) return;
  document.getElementById('galeriaLightboxImg').src = img.src;
  document.getElementById('galeriaLightboxImg').alt = img.alt;
  document.getElementById('galeriaLightboxTexto').innerHTML = texto ? texto.innerHTML : '';
  modal.classList.add('abierto');
  modal.setAttribute('aria-hidden', 'false');
}

function cerrarGaleria(event) {
  if (event && event.target && !event.target.classList.contains('galeria-lightbox') && !event.target.classList.contains('galeria-cerrar')) return;
  const modal = document.getElementById('galeriaLightbox');
  if (!modal) return;
  modal.classList.remove('abierto');
  modal.setAttribute('aria-hidden', 'true');
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') cerrarGaleria({target: document.querySelector('.galeria-lightbox')});
});

function mostrarPagina(nombre) {
  if (!paginas[nombre]) return;
  app.innerHTML = paginas[nombre];
  window.scrollTo({ top: 0, behavior: "smooth" });
  menu.classList.remove("abierto");
}

document.querySelectorAll("[data-pagina]").forEach(boton => {
  boton.addEventListener("click", () => mostrarPagina(boton.dataset.pagina));
});

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("abierto");
});

mostrarPagina("inicio");

// Inicia los carruseles después de renderizar la página inicial.
// Esto evita depender de DOMContentLoaded, ya que el contenido se carga dinámicamente.
iniciarDestacado();
iniciarActividades();
