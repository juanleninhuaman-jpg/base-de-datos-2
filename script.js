// ==========================================
// 0. CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUBxcOogw_4kl907r8YCPGXGYBVi-7Gas",
  authDomain: "base-de-datos-2-8f3af.firebaseapp.com",
  projectId: "base-de-datos-2-8f3af",
  storageBucket: "base-de-datos-2-8f3af.firebasestorage.app",
  messagingSenderId: "170356526532",
  appId: "1:170356526532:web:6cb0b3283a239ba0e46891",
  measurementId: "G-WT433CHSMF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ==========================================
// 1. ESTRUCTURA DE DATOS BASE Y NUBE/LOCALSTORAGE
// ==========================================

const semanasInfoPredeterminadas = {
  'Semana 1': {
    tituloSemana: 'Formulación del Proyecto y Selección de la Arquitectura',
    actividades: [
      {
        actividad: 'ACTIVIDAD 01',
        pdfTitulo: 'Arquitectura de Base de Datos',
        pdfRuta: 'https://drive.google.com/file/d/1NPRs3-o-HmrYQu2CagkQ0Isp-4g1Xas3/view?usp=sharing',
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 02',
        pdfTitulo: 'Introduccion a la administracion de base de datos',
        pdfRuta: 'https://drive.google.com/file/d/1eGS3TZ--AYALcQrQ5moKMDciwCu8fk0F/view?usp=sharing',
        tipo: 'archivo'
      }
    ],
    geniallyTitulo: 'Resumen de Arquitectura de Base de Datos',
    geniallyLink: 'https://view.genially.com/6aa1b61aac454a031b87e6de'
  },
  'Semana 2': {
    tituloSemana: 'Despliegue y Configuración de Motores de Datos (DBMS)',
    actividades: [
      {
        actividad: 'ACTIVIDAD 01',
        pdfTitulo: 'Reglamento General de Grados y Títulos de Pregrado',
        pdfRuta: 'https://drive.google.com/file/d/13LwHMIb-DwGgyZL0KIX7OaQQSMFJDa24/view?usp=sharing',
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 02',
        pdfTitulo: 'Los Gestores de Base de Datos DBMS',
        pdfRuta: 'https://drive.google.com/file/d/1n4kpDW22UB9oHBbVRWj7X5Jt1DbJ_NKn/view?usp=sharing',
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 03',
        pdfTitulo: 'Manual de instalaciones de MS - SQL Server',
        pdfRuta: 'https://drive.google.com/file/d/1dcmkaa6Ydmz_4oPojTVz6pJtGDUoTw9w/view?usp=sharing',
        tipo: 'archivo'
      }
    ]
  },
  'Semana 3': {
    tituloSemana: 'Modelamiento Fisico y Mecanismo de Integracion',
    actividades: [
      {
        actividad: 'ACTIVIDAD 01',
        pdfTitulo: 'Modelado Grados y Títulos',
        pdfRuta: 'https://drive.google.com/file/d/1ixM3PPgXK9feaUABpBB5dNy-jlMq8FqM/view?usp=sharing',
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 02',
        pdfTitulo: "Modelado Informático y Editorial",
        pdfRuta: "https://drive.google.com/file/d/14KDGbasof50GCrwo6mq7eUgK0UJdfZYE/view?usp=sharing",
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 03',
        pdfTitulo: 'Modelamiento Físico y Mecanismos de Integración',
        pdfRuta: 'https://drive.google.com/file/d/1punNbWJKNX3z-cCZXepUaRtSYN6Bn9Ew/view?usp=sharing',
        tipo: 'archivo'
      }
    ]
  },
  'Semana 4': {
    tituloSemana: 'Sustentación y Validación de la Infraestructura de Datos',
    actividades: [
      {
        actividad: 'ACTIVIDAD 01',
        pdfTitulo: 'Preguntas del Cuestionario 1-39',
        pdfRuta: 'https://drive.google.com/file/d/1c2785BGKuErXfMNPsjTK_Pc5Ffcr82CO/view?usp=sharing',
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 01',
        pdfTitulo: "Informe de la Pregunta N° 40",
        pdfRuta: "...",
        tipo: 'archivo'
      },
    ]
  }
};

let semanasInfo = JSON.parse(localStorage.getItem('portafolio_semanas')) || semanasInfoPredeterminadas;
let unidadesInfo = JSON.parse(localStorage.getItem('portafolio_unidades')) || {};

// Guardar tanto en LocalStorage como en Firebase Firestore
async function guardarEnLocalStorage() {
  localStorage.setItem('portafolio_semanas', JSON.stringify(semanasInfo));
  localStorage.setItem('portafolio_unidades', JSON.stringify(unidadesInfo));

  try {
    await setDoc(doc(db, "portafolio", "datosGlobales"), {
      semanasInfo: semanasInfo,
      unidadesInfo: unidadesInfo
    });
  } catch (err) {
    console.error("Error sincronizando con Firestore: ", err);
  }
}

// Cargar desde Firestore si existe
async function cargarDesdeFirestore() {
  try {
    const docRef = doc(db, "portafolio", "datosGlobales");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.semanasInfo) semanasInfo = data.semanasInfo;
      if (data.unidadesInfo) unidadesInfo = data.unidadesInfo;

      localStorage.setItem('portafolio_semanas', JSON.stringify(semanasInfo));
      localStorage.setItem('portafolio_unidades', JSON.stringify(unidadesInfo));

      aplicarCambiosGuardadosUI();
      renderizarTablaDashboard();
      refrescarSQLAdmin();
    }
  } catch (err) {
    console.error("Error cargando desde Firestore: ", err);
  }
}

// Aplicar cambios guardados en la interfaz
function aplicarCambiosGuardadosUI() {
  Object.keys(unidadesInfo).forEach(unitId => {
    const data = unidadesInfo[unitId];
    if (data.titulo) {
      const h3 = document.querySelector(`#${unitId} .unit-info h3`);
      if (h3) h3.innerText = data.titulo;
    }
    if (data.desc) {
      const p = document.querySelector(`#${unitId} .unit-info p`);
      if (p) p.innerText = data.desc;
    }
  });

  const weekCards = document.querySelectorAll('.week-card');
  weekCards.forEach(card => {
    const badge = card.querySelector('.week-badge');
    if (badge) {
      const semKey = badge.innerText.trim();
      if (semanasInfo[semKey] && semanasInfo[semKey].tituloSemana) {
        let titleElem = card.querySelector('.titulo-semana');
        if (!titleElem) {
          titleElem = document.createElement('h3');
          titleElem.className = 'titulo-semana';
          card.insertBefore(titleElem, card.querySelector('.week-arrow-btn'));
        }
        titleElem.innerText = semanasInfo[semKey].tituloSemana;
      }
    }
  });
}

// ==========================================
// 1.5 CÓDIGO SQL (SQL SERVER): VISOR + EDITOR DEL PANEL
// ==========================================
// Cada actividad guarda sus scripts en  act.sqlCodigos = [{ nombre, archivo, codigo }]
//  - Si act.sqlCodigos tiene scripts con código  -> se muestra el botón "Código SQL"
//  - Si está vacío ([]) o nunca se configuró y no hay predeterminado -> NO hay botón
// Los predeterminados de abajo solo se usan mientras el panel no haya guardado nada para esa actividad.
const sqlPredeterminados = [
  { semana: 'Semana 3', patron: /grados y t[ií]tulos/i, scripts: [{ nombre: 'Modelo físico - Grados y Títulos', archivo: 'Codigo_SQL_Actividad1.sql', codigo: "-- ============================================================================\n-- CURSO: BASE DE DATOS II - UPLA\n-- ESTUDIANTE: HUAMAN QUISPE JUAN LENIN\n-- DOCENTE: MG. ING. RAÚL FERNÁNDEZ BEJARANO\n-- TEMA: ACTIVIDAD 01 - MODELO FÍSICO GRADOS Y TÍTULOS\n-- ============================================================================\n\n-- 1. CREACIÓN DE LA BASE DE DATOS\nIF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'GradosYTitulos')\nBEGIN\n    CREATE DATABASE GradosYTitulos;\nEND\nGO\n\nUSE GradosYTitulos;\nGO\n\n-- 2. CREACIÓN DE ESQUEMAS CORPORATIVOS (REQUERIMIENTO PASO 3 DE LA GUÍA)\nCREATE SCHEMA Catalogo;\nGO\nCREATE SCHEMA Academico;\nGO\nCREATE SCHEMA Tramite;\nGO\nCREATE SCHEMA Evaluacion;\nGO\n\n-- ============================================================================\n-- ESQUEMA: Catalogo (Tablas Parámetro y Maestras)\n-- ============================================================================\n\nCREATE TABLE Catalogo.TipoTramite (\n    IdTipoTramite TINYINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Descripcion VARCHAR(255) NULL,\n    CONSTRAINT PK_TipoTramite PRIMARY KEY (IdTipoTramite),\n    CONSTRAINT UQ_TipoTramite_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Catalogo.EstadoTramite (\n    IdEstadoTramite TINYINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Nombre VARCHAR(50) NOT NULL,\n    Descripcion VARCHAR(200) NULL,\n    CONSTRAINT PK_EstadoTramite PRIMARY KEY (IdEstadoTramite),\n    CONSTRAINT UQ_EstadoTramite_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Catalogo.LineaInvestigacion (\n    IdLineaInvestigacion SMALLINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Nombre VARCHAR(150) NOT NULL,\n    Activo BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_LineaInvestigacion PRIMARY KEY (IdLineaInvestigacion),\n    CONSTRAINT UQ_LineaInvestigacion_Codigo UNIQUE (Codigo)\n);\nGO\n\n-- ============================================================================\n-- ESQUEMA: Academico (Facultad, Programa, Personas y Docentes)\n-- ============================================================================\n\nCREATE TABLE Academico.Facultad (\n    IdFacultad TINYINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(10) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Estado BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_Facultad PRIMARY KEY (IdFacultad),\n    CONSTRAINT UQ_Facultad_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Academico.ProgramaEstudios (\n    IdPrograma SMALLINT IDENTITY(1,1) NOT NULL,\n    IdFacultad TINYINT NOT NULL,\n    Nombre VARCHAR(150) NOT NULL,\n    Modalidad VARCHAR(20) NOT NULL,\n    CONSTRAINT PK_ProgramaEstudios PRIMARY KEY (IdPrograma),\n    CONSTRAINT FK_ProgramaEstudios_Facultad FOREIGN KEY (IdFacultad) REFERENCES Academico.Facultad(IdFacultad),\n    CONSTRAINT CHK_Programa_Modalidad CHECK (Modalidad IN ('PRESENCIAL', 'SEMIPRESENCIAL'))\n);\nGO\n\nCREATE TABLE Academico.GradoTituloCatalogo (\n    IdGradoTitulo SMALLINT IDENTITY(1,1) NOT NULL,\n    IdPrograma SMALLINT NOT NULL,\n    Nombre VARCHAR(150) NOT NULL,\n    Tipo VARCHAR(20) NOT NULL,\n    CONSTRAINT PK_GradoTituloCatalogo PRIMARY KEY (IdGradoTitulo),\n    CONSTRAINT FK_GradoTitulo_Programa FOREIGN KEY (IdPrograma) REFERENCES Academico.ProgramaEstudios(IdPrograma),\n    CONSTRAINT CHK_GradoTitulo_Tipo CHECK (Tipo IN ('BACHILLER', 'TITULO PROFESIONAL'))\n);\nGO\n\nCREATE TABLE Academico.Persona (\n    IdPersona INT IDENTITY(1,1) NOT NULL,\n    DNI VARCHAR(15) NOT NULL,\n    Nombres VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    TipoPersona VARCHAR(20) NOT NULL,\n    CONSTRAINT PK_Persona PRIMARY KEY (IdPersona),\n    CONSTRAINT UQ_Persona_DNI UNIQUE (DNI),\n    CONSTRAINT CHK_Persona_Tipo CHECK (TipoPersona IN ('ESTUDIANTE', 'EGRESADO', 'DOCENTE', 'ADMINISTRATIVO'))\n);\nGO\n\nCREATE TABLE Academico.Docente (\n    IdDocente INT NOT NULL,\n    CodigoORCID VARCHAR(50) NULL,\n    TipoContrato VARCHAR(30) NOT NULL,\n    CONSTRAINT PK_Docente PRIMARY KEY (IdDocente),\n    CONSTRAINT FK_Docente_Persona FOREIGN KEY (IdDocente) REFERENCES Academico.Persona(IdPersona),\n    CONSTRAINT CHK_Docente_Contrato CHECK (TipoContrato IN ('NOMBRADO', 'CONTRATADO'))\n);\nGO\n\n-- ============================================================================\n-- ESQUEMA: Tramite (Proceso Administrativo y Proyectos)\n-- ============================================================================\n\nCREATE TABLE Tramite.Tramite (\n    IdTramite INT IDENTITY(1,1) NOT NULL,\n    IdPersona INT NOT NULL,\n    IdTipoTramite TINYINT NOT NULL,\n    IdEstadoTramite TINYINT NOT NULL,\n    FechaInicio DATETIME2 NOT NULL DEFAULT SYSDATETIME(),\n    Activo BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_Tramite PRIMARY KEY (IdTramite),\n    CONSTRAINT FK_Tramite_Persona FOREIGN KEY (IdPersona) REFERENCES Academico.Persona(IdPersona),\n    CONSTRAINT FK_Tramite_TipoTramite FOREIGN KEY (IdTipoTramite) REFERENCES Catalogo.TipoTramite(IdTipoTramite),\n    CONSTRAINT FK_Tramite_EstadoTramite FOREIGN KEY (IdEstadoTramite) REFERENCES Catalogo.EstadoTramite(IdEstadoTramite)\n);\nGO\n\nCREATE TABLE Tramite.Pago (\n    IdPago INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    NroRecibo VARCHAR(30) NOT NULL,\n    Monto DECIMAL(10,2) NOT NULL,\n    FechaPago DATETIME NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_Pago PRIMARY KEY (IdPago),\n    CONSTRAINT FK_Pago_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT CHK_Pago_Monto CHECK (Monto > 0)\n);\nGO\n\nCREATE TABLE Tramite.Fotografia (\n    IdFotografia INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    RutaArchivo VARCHAR(255) NOT NULL,\n    TamañoKb INT NOT NULL,\n    CONSTRAINT PK_Fotografia PRIMARY KEY (IdFotografia),\n    CONSTRAINT FK_Fotografia_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite)\n);\nGO\n\nCREATE TABLE Tramite.ComiteEticaRevision (\n    IdRevision INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    Dictamen VARCHAR(50) NOT NULL,\n    Fecha DATETIME NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_ComiteEticaRevision PRIMARY KEY (IdRevision),\n    CONSTRAINT FK_ComiteEtica_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT CHK_ComiteEtica_Dictamen CHECK (Dictamen IN ('APROBADO', 'OBSERVADO', 'RECHAZADO'))\n);\nGO\n\nCREATE TABLE Tramite.TrabajoInvestigacion (\n    IdTrabajo INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    Titulo VARCHAR(300) NOT NULL,\n    PorcentajeSimilitud DECIMAL(5,2) NULL, -- Antiplagio Turnitin (Máximo 30% según Art. 7°)\n    CONSTRAINT PK_TrabajoInvestigacion PRIMARY KEY (IdTrabajo),\n    CONSTRAINT FK_Trabajo_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT CHK_Similitud_Antiplagio CHECK (PorcentajeSimilitud >= 0.00 AND PorcentajeSimilitud <= 30.00)\n);\nGO\n\nCREATE TABLE Tramite.ProyectoAsesor (\n    IdProyectoAsesor INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    IdDocente INT NOT NULL,\n    FechaAsignacion DATE NOT NULL DEFAULT GETDATE(),\n    Activo BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_ProyectoAsesor PRIMARY KEY (IdProyectoAsesor),\n    CONSTRAINT FK_ProyectoAsesor_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo),\n    CONSTRAINT FK_ProyectoAsesor_Docente FOREIGN KEY (IdDocente) REFERENCES Academico.Docente(IdDocente)\n);\nGO\n\nCREATE TABLE Tramite.PlanTesis (\n    IdPlan INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    FechaAprobacion DATE NULL,\n    Estado VARCHAR(30) NOT NULL DEFAULT 'EN REVISIÓN',\n    CONSTRAINT PK_PlanTesis PRIMARY KEY (IdPlan),\n    CONSTRAINT FK_PlanTesis_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo)\n);\nGO\n\nCREATE TABLE Tramite.InformeFinal (\n    IdInforme INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    FechaPresentacion DATE NOT NULL DEFAULT GETDATE(),\n    Estado VARCHAR(30) NOT NULL DEFAULT 'PRESENTADO',\n    CONSTRAINT PK_InformeFinal PRIMARY KEY (IdInforme),\n    CONSTRAINT FK_InformeFinal_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo)\n);\nGO\n\nCREATE TABLE Tramite.CoordinacionGT (\n    IdCoordinacion INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    IdResponsable INT NOT NULL,\n    Estado VARCHAR(50) NOT NULL,\n    CONSTRAINT PK_CoordinacionGT PRIMARY KEY (IdCoordinacion),\n    CONSTRAINT FK_Coordinacion_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT FK_Coordinacion_Responsable FOREIGN KEY (IdResponsable) REFERENCES Academico.Persona(IdPersona)\n);\nGO\n\nCREATE TABLE Tramite.ResolucionFacultad (\n    IdResolucion INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    NumeroResolucion VARCHAR(50) NOT NULL,\n    FechaEmision DATE NOT NULL,\n    CONSTRAINT PK_ResolucionFacultad PRIMARY KEY (IdResolucion),\n    CONSTRAINT FK_Resolucion_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT UQ_NumeroResolucion UNIQUE (NumeroResolucion)\n);\nGO\n\nCREATE TABLE Tramite.ResolucionCU (\n    IdResolucionCU INT IDENTITY(1,1) NOT NULL,\n    IdResolucionFacultad INT NOT NULL,\n    NumeroResolucionCU VARCHAR(50) NOT NULL,\n    FechaEmision DATE NOT NULL,\n    CONSTRAINT PK_ResolucionCU PRIMARY KEY (IdResolucionCU),\n    CONSTRAINT FK_ResolucionCU_Facultad FOREIGN KEY (IdResolucionFacultad) REFERENCES Tramite.ResolucionFacultad(IdResolucion),\n    CONSTRAINT UQ_NumeroResolucionCU UNIQUE (NumeroResolucionCU)\n);\nGO\n\n-- ============================================================================\n-- ESQUEMA: Evaluacion (Jurados y Sustentación)\n-- ============================================================================\n\nCREATE TABLE Evaluacion.EvaluacionJurado (\n    IdEvaluacion INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    IdDocente INT NOT NULL,\n    Rol VARCHAR(30) NOT NULL,\n    Dictamen VARCHAR(50) NULL,\n    FechaEvaluacion DATE DEFAULT GETDATE(),\n    CONSTRAINT PK_EvaluacionJurado PRIMARY KEY (IdEvaluacion),\n    CONSTRAINT FK_Evaluacion_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo),\n    CONSTRAINT FK_Evaluacion_Docente FOREIGN KEY (IdDocente) REFERENCES Academico.Docente(IdDocente),\n    CONSTRAINT CHK_Jurado_Rol CHECK (Rol IN ('PRESIDENTE', 'SECRETARIO', 'VOCAL', 'SUPLENTE'))\n);\nGO\n\nCREATE TABLE Evaluacion.EvaluacionSustentacion (\n    IdSustentacion INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    FechaSustentacion DATETIME NOT NULL,\n    NotaPromedio DECIMAL(4,2) NOT NULL,\n    Resultado VARCHAR(30) NOT NULL,\n    CONSTRAINT PK_EvaluacionSustentacion PRIMARY KEY (IdSustentacion),\n    CONSTRAINT FK_Sustentacion_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo),\n    CONSTRAINT CHK_Sustentacion_Nota CHECK (NotaPromedio >= 0.00 AND NotaPromedio <= 20.00),\n    CONSTRAINT CHK_Sustentacion_Resultado CHECK (Resultado IN ('EXCELENTE', 'MUY BUENO', 'BUENO', 'REGULAR', 'DESAPROBADO'))\n);\nGO" }] },
  { semana: 'Semana 3', patron: /inform[aá]tico/i, scripts: [{ nombre: 'Modelo físico - Informático y Editorial', archivo: 'Codigo_SQL_Actividad2.sql', codigo: "-- ============================================================================\n-- CURSO: BASE DE DATOS II - UPLA\n-- ESTUDIANTE: HUAMAN QUISPE JUAN LENIN\n-- DOCENTE: MG. ING. RAÚL FERNÁNDEZ BEJARANO\n-- TEMA: ACTIVIDAD 02 - MATERIAL INFORMÁTICO Y CADENA EDITORIAL\n-- ============================================================================\n\n-- 1. CREACIÓN DE LA BASE DE DATOS\nIF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EmpresaYEditorialDB')\nBEGIN\n    CREATE DATABASE EmpresaYEditorialDB;\nEND\nGO\n\nUSE EmpresaYEditorialDB;\nGO\n\n-- 2. CREACIÓN DE ESQUEMAS SEPARADOS\nCREATE SCHEMA Empresa;\nGO\nCREATE SCHEMA Editorial;\nGO\n\n-- ============================================================================\n-- PARTE 1: EMPRESA DE MATERIAL INFORMÁTICO (Modelado de acuerdo a la imagen 01)\n-- ============================================================================\n\nCREATE TABLE Empresa.Seccion (\n    IdSeccion INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Descripcion VARCHAR(255) NULL,\n    CONSTRAINT PK_Empresa_Seccion PRIMARY KEY (IdSeccion)\n);\nGO\n\nCREATE TABLE Empresa.Empleado (\n    IdEmpleado INT IDENTITY(1,1) NOT NULL,\n    IdSeccion INT NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(15) NOT NULL,\n    CONSTRAINT PK_Empresa_Empleado PRIMARY KEY (IdEmpleado),\n    CONSTRAINT FK_Empleado_Seccion FOREIGN KEY (IdSeccion) REFERENCES Empresa.Seccion(IdSeccion),\n    CONSTRAINT UQ_Empleado_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Empresa.Cliente (\n    IdCliente INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Direccion VARCHAR(200) NOT NULL,\n    Telefono VARCHAR(20) NULL,\n    NIF VARCHAR(15) NOT NULL,\n    CONSTRAINT PK_Empresa_Cliente PRIMARY KEY (IdCliente),\n    CONSTRAINT UQ_Cliente_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Empresa.Equipo (\n    IdEquipo INT IDENTITY(1,1) NOT NULL,\n    Descripcion VARCHAR(255) NOT NULL,\n    Precio DECIMAL(10,2) NOT NULL,\n    Stock INT NOT NULL DEFAULT 0,\n    CONSTRAINT PK_Empresa_Equipo PRIMARY KEY (IdEquipo),\n    CONSTRAINT CHK_Equipo_Precio CHECK (Precio >= 0),\n    CONSTRAINT CHK_Equipo_Stock CHECK (Stock >= 0)\n);\nGO\n\nCREATE TABLE Empresa.Componente (\n    IdComponente INT IDENTITY(1,1) NOT NULL,\n    Descripcion VARCHAR(255) NOT NULL,\n    Precio DECIMAL(10,2) NOT NULL,\n    Stock INT NOT NULL DEFAULT 0,\n    CONSTRAINT PK_Empresa_Componente PRIMARY KEY (IdComponente),\n    CONSTRAINT CHK_Componente_Precio CHECK (Precio >= 0),\n    CONSTRAINT CHK_Componente_Stock CHECK (Stock >= 0)\n);\nGO\n\nCREATE TABLE Empresa.EquipoComponente (\n    IdEquipo INT NOT NULL,\n    IdComponente INT NOT NULL,\n    Cantidad INT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_EquipoComponente PRIMARY KEY (IdEquipo, IdComponente),\n    CONSTRAINT FK_EquipoComponente_Equipo FOREIGN KEY (IdEquipo) REFERENCES Empresa.Equipo(IdEquipo),\n    CONSTRAINT FK_EquipoComponente_Componente FOREIGN KEY (IdComponente) REFERENCES Empresa.Componente(IdComponente),\n    CONSTRAINT CHK_EquipoComp_Cantidad CHECK (Cantidad > 0)\n);\nGO\n\nCREATE TABLE Empresa.Compra (\n    IdCompra INT IDENTITY(1,1) NOT NULL,\n    IdCliente INT NOT NULL,\n    IdEmpleado INT NOT NULL, -- Empleado que atiende la venta (según enunciado/diagrama)\n    FechaCompra DATETIME NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_Empresa_Compra PRIMARY KEY (IdCompra),\n    CONSTRAINT FK_Compra_Cliente FOREIGN KEY (IdCliente) REFERENCES Empresa.Cliente(IdCliente),\n    CONSTRAINT FK_Compra_Empleado FOREIGN KEY (IdEmpleado) REFERENCES Empresa.Empleado(IdEmpleado)\n);\nGO\n\nCREATE TABLE Empresa.DetalleCompra (\n    IdDetalle INT IDENTITY(1,1) NOT NULL,\n    IdCompra INT NOT NULL,\n    IdEquipo INT NULL,       -- Soporta compra de equipos sueltos\n    IdComponente INT NULL,   -- Soporta compra de componentes sueltos\n    Cantidad INT NOT NULL,\n    Precio DECIMAL(10,2) NOT NULL,\n    CONSTRAINT PK_Empresa_DetalleCompra PRIMARY KEY (IdDetalle),\n    CONSTRAINT FK_Detalle_Compra FOREIGN KEY (IdCompra) REFERENCES Empresa.Compra(IdCompra),\n    CONSTRAINT FK_Detalle_Equipo FOREIGN KEY (IdEquipo) REFERENCES Empresa.Equipo(IdEquipo),\n    CONSTRAINT FK_Detalle_Componente FOREIGN KEY (IdComponente) REFERENCES Empresa.Componente(IdComponente),\n    CONSTRAINT CHK_Detalle_Cantidad CHECK (Cantidad > 0)\n);\nGO\n\n-- ============================================================================\n-- PARTE 2: CADENA EDITORIAL (Modelado de acuerdo a la imagen 02)\n-- ============================================================================\n\nCREATE TABLE Editorial.Sucursal (\n    IdSucursal INT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Domicilio VARCHAR(200) NOT NULL,\n    Telefono VARCHAR(20) NULL,\n    CONSTRAINT PK_Editorial_Sucursal PRIMARY KEY (IdSucursal),\n    CONSTRAINT UQ_Sucursal_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Editorial.Empleado (\n    IdEmpleado INT IDENTITY(1,1) NOT NULL,\n    IdSucursal INT NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(15) NOT NULL,\n    CONSTRAINT PK_Editorial_Empleado PRIMARY KEY (IdEmpleado),\n    CONSTRAINT FK_Empleado_Sucursal FOREIGN KEY (IdSucursal) REFERENCES Editorial.Sucursal(IdSucursal),\n    CONSTRAINT UQ_EditorialEmpleado_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Editorial.Revista (\n    IdRevista INT IDENTITY(1,1) NOT NULL,\n    Titulo VARCHAR(150) NOT NULL,\n    NRegistro VARCHAR(50) NOT NULL,\n    Periodicidad VARCHAR(50) NOT NULL,\n    Tipo VARCHAR(50) NOT NULL,\n    CONSTRAINT PK_Editorial_Revista PRIMARY KEY (IdRevista),\n    CONSTRAINT UQ_Revista_NRegistro UNIQUE (NRegistro)\n);\nGO\n\nCREATE TABLE Editorial.SucursalRevista (\n    IdSucursal INT NOT NULL,\n    IdRevista INT NOT NULL,\n    FechaInicio DATE NOT NULL DEFAULT GETDATE(),\n    Estado BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_SucursalRevista PRIMARY KEY (IdSucursal, IdRevista),\n    CONSTRAINT FK_SucursalRevista_Sucursal FOREIGN KEY (IdSucursal) REFERENCES Editorial.Sucursal(IdSucursal),\n    CONSTRAINT FK_SucursalRevista_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista)\n);\nGO\n\nCREATE TABLE Editorial.Periodista (\n    IdPeriodista INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(15) NOT NULL,\n    Especialidad VARCHAR(100) NOT NULL,\n    CONSTRAINT PK_Editorial_Periodista PRIMARY KEY (IdPeriodista),\n    CONSTRAINT UQ_Periodista_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Editorial.Articulo (\n    IdArticulo INT IDENTITY(1,1) NOT NULL,\n    IdPeriodista INT NOT NULL,\n    IdRevista INT NOT NULL,\n    Titulo VARCHAR(200) NOT NULL,\n    Fecha DATE NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_Editorial_Articulo PRIMARY KEY (IdArticulo),\n    CONSTRAINT FK_Articulo_Periodista FOREIGN KEY (IdPeriodista) REFERENCES Editorial.Periodista(IdPeriodista),\n    CONSTRAINT FK_Articulo_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista)\n);\nGO\n\nCREATE TABLE Editorial.SeccionFija (\n    IdSeccion INT IDENTITY(1,1) NOT NULL,\n    IdRevista INT NOT NULL,\n    Titulo VARCHAR(150) NOT NULL,\n    Extension VARCHAR(50) NOT NULL,\n    CONSTRAINT PK_Editorial_SeccionFija PRIMARY KEY (IdSeccion),\n    CONSTRAINT FK_SeccionFija_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista)\n);\nGO\n\nCREATE TABLE Editorial.Ejemplar (\n    IdEjemplar INT IDENTITY(1,1) NOT NULL,\n    IdRevista INT NOT NULL,\n    Fecha DATE NOT NULL,\n    Paginas INT NOT NULL,\n    Vendidos INT NOT NULL DEFAULT 0,\n    CONSTRAINT PK_Editorial_Ejemplar PRIMARY KEY (IdEjemplar),\n    CONSTRAINT FK_Ejemplar_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista),\n    CONSTRAINT CHK_Ejemplar_Paginas CHECK (Paginas > 0),\n    CONSTRAINT CHK_Ejemplar_Vendidos CHECK (Vendidos >= 0)\n);\nGO" }] },
  { semana: 'Semana 4', patron: /cadena editorial/i, scripts: [
    { nombre: '1. Creación de BD y Tablas', archivo: 'Creacion_BD_y_Tablas.sql', codigo: "-- ============================================================================\n-- CURSO: BASE DE DATOS II - UPLA\n-- ESTUDIANTE: HUAMAN QUISPE JUAN LENIN\n-- DOCENTE: MG. ING. RAÚL FERNÁNDEZ BEJARANO\n-- TEMA: SEMANA 04 - CASO DE ESTUDIO: CADENA EDITORIAL\n-- GESTOR: MICROSOFT SQL SERVER\n-- ============================================================================\n\nUSE master;\nGO\n\n-- 1. CREACIÓN DE LA BASE DE DATOS\nIF EXISTS (SELECT name FROM sys.databases WHERE name = N'CadenaEditorial')\nBEGIN\n    ALTER DATABASE CadenaEditorial SET SINGLE_USER WITH ROLLBACK IMMEDIATE;\n    DROP DATABASE CadenaEditorial;\nEND\nGO\n\nCREATE DATABASE CadenaEditorial\nON PRIMARY (\n    NAME = CadenaEditorial_Data,\n    FILENAME = 'D:\\BaseDatos2026\\CadenaEditorial_data.mdf', -- Ajustar ruta si es necesario\n    SIZE = 10MB,\n    MAXSIZE = 10GB,\n    FILEGROWTH = 5MB\n)\nLOG ON (\n    NAME = CadenaEditorial_Log,\n    FILENAME = 'D:\\BaseDatos2026\\CadenaEditorial_log.ldf',  -- Ajustar ruta si es necesario\n    SIZE = 3MB,\n    MAXSIZE = 3GB,\n    FILEGROWTH = 1MB\n);\nGO\n\nUSE CadenaEditorial;\nGO\n\n-- 2. TABLA SUCURSAL\nCREATE TABLE Sucursal (\n    IdSucursal INT IDENTITY(1,1) NOT NULL,\n    CodigoSucursal VARCHAR(10) NOT NULL,\n    Domicilio VARCHAR(150) NOT NULL,\n    Telefono VARCHAR(20) NOT NULL,\n    CONSTRAINT PK_Sucursal PRIMARY KEY (IdSucursal),\n    CONSTRAINT UQ_Sucursal_Codigo UNIQUE (CodigoSucursal)\n);\nGO\n\n-- 3. TABLA EMPLEADO\nCREATE TABLE Empleado (\n    IdEmpleado INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(50) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(20) NOT NULL,\n    Telefono VARCHAR(20) NOT NULL,\n    IdSucursal INT NOT NULL,\n    CONSTRAINT PK_Empleado PRIMARY KEY (IdEmpleado),\n    CONSTRAINT UQ_Empleado_NIF UNIQUE (NIF),\n    CONSTRAINT FK_Empleado_Sucursal FOREIGN KEY (IdSucursal) REFERENCES Sucursal(IdSucursal)\n);\nGO\n\n-- 4. TABLA REVISTA\nCREATE TABLE Revista (\n    IdRevista INT IDENTITY(1,1) NOT NULL,\n    Titulo VARCHAR(150) NOT NULL,\n    NumeroRegistro VARCHAR(30) NOT NULL,\n    Periodicidad VARCHAR(30) NOT NULL,\n    Tipo VARCHAR(50) NOT NULL,\n    CONSTRAINT PK_Revista PRIMARY KEY (IdRevista),\n    CONSTRAINT UQ_Revista_Registro UNIQUE (NumeroRegistro)\n);\nGO\n\n-- 5. TABLA SUCURSALREVISTA (Relación N:M entre Sucursal y Revista)\nCREATE TABLE SucursalRevista (\n    IdSucursal INT NOT NULL,\n    IdRevista INT NOT NULL,\n    CONSTRAINT PK_SucursalRevista PRIMARY KEY (IdSucursal, IdRevista),\n    CONSTRAINT FK_SucursalRevista_Sucursal FOREIGN KEY (IdSucursal) REFERENCES Sucursal(IdSucursal),\n    CONSTRAINT FK_SucursalRevista_Revista FOREIGN KEY (IdRevista) REFERENCES Revista(IdRevista)\n);\nGO\n\n-- 6. TABLA PERIODISTA\nCREATE TABLE Periodista (\n    IdPeriodista INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(50) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(20) NOT NULL,\n    Telefono VARCHAR(20) NOT NULL,\n    Especialidad VARCHAR(100) NOT NULL,\n    CONSTRAINT PK_Periodista PRIMARY KEY (IdPeriodista),\n    CONSTRAINT UQ_Periodista_NIF UNIQUE (NIF)\n);\nGO\n\n-- 7. TABLA ARTICULO (Relación entre Periodista y Revista)\nCREATE TABLE Articulo (\n    IdArticulo INT IDENTITY(1,1) NOT NULL,\n    Titulo VARCHAR(200) NOT NULL,\n    FechaPublicacion DATE NOT NULL,\n    IdPeriodista INT NOT NULL,\n    IdRevista INT NOT NULL,\n    CONSTRAINT PK_Articulo PRIMARY KEY (IdArticulo),\n    CONSTRAINT FK_Articulo_Periodista FOREIGN KEY (IdPeriodista) REFERENCES Periodista(IdPeriodista),\n    CONSTRAINT FK_Articulo_Revista FOREIGN KEY (IdRevista) REFERENCES Revista(IdRevista)\n);\nGO\n\n-- 8. TABLA SECCIONFIJA\nCREATE TABLE SeccionFija (\n    IdSeccion INT IDENTITY(1,1) NOT NULL,\n    Titulo VARCHAR(150) NOT NULL,\n    Extension INT NOT NULL,\n    IdRevista INT NOT NULL,\n    CONSTRAINT PK_SeccionFija PRIMARY KEY (IdSeccion),\n    CONSTRAINT FK_SeccionFija_Revista FOREIGN KEY (IdRevista) REFERENCES Revista(IdRevista),\n    CONSTRAINT CK_SeccionFija_Extension CHECK (Extension > 0)\n);\nGO\n\n-- 9. TABLA EJEMPLAR\nCREATE TABLE Ejemplar (\n    IdEjemplar INT IDENTITY(1,1) NOT NULL,\n    Fecha DATE NOT NULL,\n    NumeroPaginas INT NOT NULL,\n    EjemplaresVendidos INT NOT NULL,\n    IdRevista INT NOT NULL,\n    CONSTRAINT PK_Ejemplar PRIMARY KEY (IdEjemplar),\n    CONSTRAINT FK_Ejemplar_Revista FOREIGN KEY (IdRevista) REFERENCES Revista(IdRevista),\n    CONSTRAINT CK_Ejemplar_Paginas CHECK (NumeroPaginas > 0),\n    CONSTRAINT CK_Ejemplar_Vendidos CHECK (EjemplaresVendidos >= 0)\n);\nGO" },
    { nombre: '2. Carga de Datos Principales', archivo: 'Carga_Datos_Principales.sql', codigo: "USE CadenaEditorial;\nGO\n\n-- INSERCIÓN EN SUCURSAL (20 Registros)\nINSERT INTO Sucursal (CodigoSucursal, Domicilio, Telefono) VALUES\n('SUC001', 'Av. Arequipa 1010, Lima', '01-4101001'),\n('SUC002', 'Av. Brasil 1250, Lima', '01-4101002'),\n('SUC003', 'Av. Javier Prado 2200, Lima', '01-4101003'),\n('SUC004', 'Av. La Marina 1500, Lima', '01-4101004'),\n('SUC005', 'Av. Angamos 1800, Lima', '01-4101005'),\n('SUC006', 'Av. Colonial 1450, Callao', '01-4101006'),\n('SUC007', 'Av. Universitaria 3200, Lima', '01-4101007'),\n('SUC008', 'Av. Primavera 450, Lima', '01-4101008'),\n('SUC009', 'Av. Benavides 1750, Lima', '01-4101009'),\n('SUC010', 'Av. Alfonso Ugarte 950, Lima', '01-4101010'),\n('SUC011', 'Av. Grau 850, Lima', '01-4101011'),\n('SUC012', 'Av. Tacna 720, Lima', '01-4101012'),\n('SUC013', 'Av. Canadá 1250, Lima', '01-4101013'),\n('SUC014', 'Av. República de Panamá 3300, Lima', '01-4101014'),\n('SUC015', 'Av. Tomás Marsano 1800, Lima', '01-4101015'),\n('SUC016', 'Av. Caminos del Inca 650, Lima', '01-4101016'),\n('SUC017', 'Av. Petit Thouars 1450, Lima', '01-4101017'),\n('SUC018', 'Av. Prolongación Iquitos 900, Lima', '01-4101018'),\n('SUC019', 'Av. Nicolás de Piérola 1100, Lima', '01-4101019'),\n('SUC020', 'Av. Elmer Faucett 1200, Callao', '01-4101020');\nGO\n\n-- INSERCIÓN EN EMPLEADO\nINSERT INTO Empleado (Nombre, Apellidos, NIF, Telefono, IdSucursal) VALUES\n('Carlos', 'Ramirez Torres', 'NIF100001', '999100001', 1),\n('Ana', 'Flores Mendoza', 'NIF100002', '999100002', 1),\n('Luis', 'Gonzales Perez', 'NIF100003', '999100003', 2),\n('Maria', 'Quispe Rojas', 'NIF100004', '999100004', 2),\n('Jorge', 'Castillo Vargas', 'NIF100005', '999100005', 3),\n('Lucia', 'Fernandez Diaz', 'NIF100006', '999100006', 3),\n('Pedro', 'Sanchez Leon', 'NIF100007', '999100007', 4),\n('Rosa', 'Torres Silva', 'NIF100008', '999100008', 4),\n('Miguel', 'Herrera Campos', 'NIF100009', '999100009', 5),\n('Carmen', 'Vega Salazar', 'NIF100010', '999100010', 5),\n('Jose', 'Mendoza Ruiz', 'NIF100011', '999100011', 6),\n('Elena', 'Paredes Soto', 'NIF100012', '999100012', 7),\n('Daniel', 'Morales Castro', 'NIF100013', '999100013', 8),\n('Patricia', 'Navarro Cruz', 'NIF100014', '999100014', 9),\n('Fernando', 'Vargas Medina', 'NIF100015', '999100015', 10),\n('Silvia', 'Ramos Ortiz', 'NIF100016', '999100016', 11),\n('Ricardo', 'Salinas Peña', 'NIF100017', '999100017', 12),\n('Claudia', 'Molina Reyes', 'NIF100018', '999100018', 13),\n('Andres', 'Campos Herrera', 'NIF100019', '999100019', 14),\n('Gabriela', 'Ruiz Delgado', 'NIF100020', '999100020', 15);\nGO\n\n-- INSERCIÓN EN REVISTA (20 Registros)\nINSERT INTO Revista (Titulo, NumeroRegistro, Periodicidad, Tipo) VALUES\n('Tecnologia Hoy', 'REG001', 'Mensual', 'Tecnologia'),\n('Mundo Digital', 'REG002', 'Mensual', 'Tecnologia'),\n('Ciencia Actual', 'REG003', 'Mensual', 'Ciencia'),\n('Economia Global', 'REG004', 'Semanal', 'Economia'),\n('Salud y Vida', 'REG005', 'Mensual', 'Salud'),\n('Cultura Peruana', 'REG006', 'Mensual', 'Cultura'),\n('Actualidad Nacional', 'REG007', 'Semanal', 'Actualidad'),\n('Negocios 360', 'REG008', 'Quincenal', 'Negocios'),\n('Innovacion Tech', 'REG009', 'Mensual', 'Tecnologia'),\n('Educacion Hoy', 'REG010', 'Mensual', 'Educacion'),\n('Viajes y Turismo', 'REG011', 'Mensual', 'Turismo'),\n('Deportes Total', 'REG012', 'Semanal', 'Deportes'),\n('Historia Viva', 'REG013', 'Mensual', 'Historia'),\n('Arte y Diseño', 'REG014', 'Mensual', 'Arte'),\n('Finanzas Personales', 'REG015', 'Quincenal', 'Finanzas'),\n('Cocina Peruana', 'REG016', 'Mensual', 'Gastronomia'),\n('Mundo Empresarial', 'REG017', 'Semanal', 'Empresarial'),\n('Ciencia y Futuro', 'REG018', 'Mensual', 'Ciencia'),\n('Sociedad Hoy', 'REG019', 'Quincenal', 'Sociedad'),\n('Programacion Web', 'REG020', 'Mensual', 'Tecnologia');\nGO\n\n-- INSERCIÓN EN SUCURSALREVISTA\nINSERT INTO SucursalRevista (IdSucursal, IdRevista) VALUES\n(1, 1), (1, 2), (2, 3), (2, 4), (3, 5), (3, 6), (4, 7), (4, 8), (5, 9), (5, 10),\n(6, 11), (7, 12), (8, 13), (9, 14), (10, 15), (11, 16), (12, 17), (13, 18), (14, 19), (15, 20);\nGO\n\n-- INSERCIÓN EN PERIODISTA (20 Registros)\nINSERT INTO Periodista (Nombre, Apellidos, NIF, Telefono, Especialidad) VALUES\n('Alberto', 'Navarro Ruiz', 'NIF200001', '998200001', 'Tecnologia'),\n('Beatriz', 'Castro Leon', 'NIF200002', '998200002', 'Economia'),\n('Carlos', 'Mendoza Silva', 'NIF200003', '998200003', 'Politica'),\n('Diana', 'Flores Torres', 'NIF200004', '998200004', 'Ciencia'),\n('Eduardo', 'Ramirez Soto', 'NIF200005', '998200005', 'Deportes'),\n('Fabiola', 'Quispe Ramos', 'NIF200006', '998200006', 'Cultura'),\n('Gustavo', 'Herrera Diaz', 'NIF200007', '998200007', 'Salud'),\n('Helena', 'Vargas Cruz', 'NIF200008', '998200008', 'Educacion'),\n('Ivan', 'Morales Perez', 'NIF200009', '998200009', 'Tecnologia'),\n('Julia', 'Salazar Medina', 'NIF200010', '998200010', 'Turismo'),\n('Kevin', 'Paredes Leon', 'NIF200011', '998200011', 'Negocios'),\n('Laura', 'Sanchez Castro', 'NIF200012', '998200012', 'Arte'),\n('Manuel', 'Torres Vargas', 'NIF200013', '998200013', 'Historia'),\n('Natalia', 'Rojas Mendoza', 'NIF200014', '998200014', 'Gastronomia'),\n('Oscar', 'Vega Campos', 'NIF200015', '998200015', 'Finanzas'),\n('Paola', 'Molina Reyes', 'NIF200016', '998200016', 'Sociedad'),\n('Rafael', 'Ortega Ruiz', 'NIF200017', '998200017', 'Tecnologia'),\n('Sandra', 'Delgado Silva', 'NIF200018', '998200018', 'Ciencia'),\n('Tomas', 'Medina Flores', 'NIF200019', '998200019', 'Deportes'),\n('Veronica', 'Cruz Navarro', 'NIF200020', '998200020', 'Educacion');\nGO\n\n-- INSERCIÓN EN ARTICULO\nINSERT INTO Articulo (Titulo, FechaPublicacion, IdPeriodista, IdRevista) VALUES\n('El futuro de la inteligencia artificial', '2026-01-10', 1, 1),\n('Transformacion digital empresarial', '2026-01-15', 2, 4),\n('Nuevos avances cientificos', '2026-02-05', 4, 3),\n('Tecnologia y sociedad moderna', '2026-02-12', 9, 2),\n('Innovacion en las empresas', '2026-02-20', 11, 8),\n('El desarrollo de la ciencia peruana', '2026-03-01', 18, 18),\n('Educacion digital en el siglo XXI', '2026-03-08', 8, 10),\n('Turismo sostenible en el Peru', '2026-03-15', 10, 11),\n('Nuevas tendencias deportivas', '2026-03-20', 5, 12),\n('La cultura peruana contemporanea', '2026-03-25', 6, 6),\n('Historia de Lima moderna', '2026-04-01', 13, 13),\n('Diseño y creatividad digital', '2026-04-05', 12, 14),\n('Consejos para mejorar las finanzas', '2026-04-10', 15, 15),\n('Gastronomia peruana internacional', '2026-04-15', 14, 16),\n('Retos de la sociedad actual', '2026-04-20', 16, 19),\n('Programacion web moderna', '2026-05-01', 17, 20),\n('Salud y tecnologia', '2026-05-10', 7, 5),\n('Actualidad nacional', '2026-05-15', 3, 7),\n('Nuevos modelos de negocios', '2026-05-20', 2, 17),\n('Tecnologias emergentes', '2026-05-25', 20, 9);\nGO" },
    { nombre: '3. Seeding SeccionFija y Ejemplar', archivo: 'Seeding_SeccionFija_Ejemplar.sql', codigo: "USE CadenaEditorial;\nGO\n\n-- INSERCIÓN EN SECCIONFIJA\nINSERT INTO SeccionFija (Titulo, Extension, IdRevista) VALUES\n('Editorial', 2, 1), ('Noticias Tech', 8, 1), ('Investigacion Digital', 10, 1),\n('Editorial', 2, 2), ('Artículos Principales', 12, 2),\n('Editorial', 2, 3), ('Noticias de Ciencia', 6, 3), ('Avances Médicos', 9, 3),\n('Editorial', 2, 4), ('Economía Nacional', 5, 4),\n('Editorial', 2, 5), ('Cuidado e Higiene', 4, 5);\nGO\n\n-- INSERCIÓN EN EJEMPLAR\nINSERT INTO Ejemplar (Fecha, NumeroPaginas, EjemplaresVendidos, IdRevista) VALUES\n('2026-01-05', 80, 5200, 1),\n('2026-02-05', 84, 5600, 1),\n('2026-03-05', 88, 5900, 1),\n('2026-01-10', 60, 4800, 2),\n('2026-02-10', 64, 5100, 2),\n('2026-01-15', 70, 4300, 3),\n('2026-02-15', 72, 4600, 3),\n('2026-01-20', 50, 6000, 4),\n('2026-02-20', 52, 6200, 4),\n('2026-01-25', 65, 3900, 5);\nGO" }
  ] },
  { semana: 'Semana 4', patron: /cuestionario/i, scripts: [{ nombre: 'Resolución Preguntas 1 a 40', archivo: 'Resolucion_Cuestionario_1_a_40.sql', codigo: "USE CadenaEditorial;\nGO\n\n-- 1. ¿Cuáles son todas las sucursales de la cadena editorial?\nSELECT IdSucursal, CodigoSucursal, Domicilio, Telefono \nFROM Sucursal;\n\n-- 2. ¿Cuáles son las revistas registradas y cuál es su periodicidad?\nSELECT Titulo, Periodicidad \nFROM Revista \nORDER BY Titulo;\n\n-- 3. ¿Qué revistas tienen periodicidad mensual?\nSELECT Titulo, NumeroRegistro \nFROM Revista \nWHERE Periodicidad = 'Mensual';\n\n-- 4. ¿Qué empleados trabajan en la sucursal número 1?\nSELECT Nombre, Apellidos \nFROM Empleado \nWHERE IdSucursal = 1;\n\n-- 5. ¿Qué periodistas tienen especialidad en tecnología?\nSELECT Nombre, Apellidos, Especialidad \nFROM Periodista \nWHERE Especialidad = 'Tecnologia';\n\n-- 6. ¿Cómo se pueden listar las revistas ordenadas alfabéticamente?\nSELECT Titulo \nFROM Revista \nORDER BY Titulo ASC;\n\n-- 7. ¿Qué ejemplares registraron más de 5 000 unidades vendidas?\nSELECT r.Titulo, e.Fecha, e.EjemplaresVendidos \nFROM Ejemplar e\nINNER JOIN Revista r ON r.IdRevista = e.IdRevista\nWHERE e.EjemplaresVendidos > 5000;\n\n-- 8. ¿Qué secciones fijas tienen una extensión superior a 7 páginas?\nSELECT r.Titulo AS Revista, s.Titulo AS Seccion, s.Extension \nFROM SeccionFija s\nINNER JOIN Revista r ON r.IdRevista = s.IdRevista\nWHERE s.Extension > 7;\n\n-- 9. ¿Qué empleados trabajan en cada sucursal?\nSELECT s.CodigoSucursal, e.Nombre, e.Apellidos \nFROM Sucursal s\nINNER JOIN Empleado e ON e.IdSucursal = s.IdSucursal\nORDER BY s.CodigoSucursal;\n\n-- 10. ¿Qué revistas publica cada sucursal?\nSELECT s.CodigoSucursal, r.Titulo \nFROM Sucursal s\nINNER JOIN SucursalRevista sr ON sr.IdSucursal = s.IdSucursal\nINNER JOIN Revista r ON r.IdRevista = sr.IdRevista\nORDER BY s.CodigoSucursal;\n\n-- 11. ¿Quién escribió cada artículo y para qué revista?\nSELECT a.Titulo AS Articulo, p.Nombre + ' ' + p.Apellidos AS Periodista, r.Titulo AS Revista\nFROM Articulo a\nINNER JOIN Periodista p ON p.IdPeriodista = a.IdPeriodista\nINNER JOIN Revista r ON r.IdRevista = a.IdRevista;\n\n-- 12. ¿Cuántos empleados tiene cada sucursal?\nSELECT s.CodigoSucursal, COUNT(e.IdEmpleado) AS TotalEmpleados \nFROM Sucursal s\nLEFT JOIN Empleado e ON e.IdSucursal = s.IdSucursal\nGROUP BY s.CodigoSucursal\nORDER BY s.CodigoSucursal;\n\n-- 13. ¿Cuántas revistas publica cada sucursal?\nSELECT s.CodigoSucursal, COUNT(sr.IdRevista) AS TotalRevistas \nFROM Sucursal s\nLEFT JOIN SucursalRevista sr ON sr.IdSucursal = s.IdSucursal\nGROUP BY s.CodigoSucursal\nORDER BY s.CodigoSucursal;\n\n-- 14. ¿Cuál es el promedio de ejemplares vendidos por revista?\nSELECT r.Titulo, AVG(e.EjemplaresVendidos) AS PromedioVentas\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo;\n\n-- 15. ¿Cuántos ejemplares se han vendido en total de cada revista?\nSELECT r.Titulo, SUM(e.EjemplaresVendidos) AS TotalVendido\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo;\n\n-- 16. ¿Cuántos artículos ha escrito cada periodista?\nSELECT p.Nombre + ' ' + p.Apellidos AS Periodista, COUNT(a.IdArticulo) AS TotalArticulos\nFROM Periodista p\nLEFT JOIN Articulo a ON a.IdPeriodista = p.IdPeriodista \nGROUP BY p.IdPeriodista, p.Nombre, p.Apellidos\nORDER BY TotalArticulos DESC;\n\n-- 17. ¿Qué revistas tienen un promedio de ventas superior a 5 000 ejemplares?\nSELECT r.Titulo, AVG(e.EjemplaresVendidos) AS Promedio\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo\nHAVING AVG(e.EjemplaresVendidos) > 5000;\n\n-- 18. ¿Qué secciones fijas pertenecen a cada revista?\nSELECT r.Titulo AS Revista, s.Titulo AS Seccion, s.Extension\nFROM Revista r\nINNER JOIN SeccionFija s ON s.IdRevista = r.IdRevista\nORDER BY r.Titulo;\n\n-- 19. ¿Cuál es el total de páginas destinadas a las secciones fijas de cada revista?\nSELECT r.Titulo, SUM(s.Extension) AS TotalPaginasFijas\nFROM Revista r\nINNER JOIN SeccionFija s ON s.IdRevista = r.IdRevista\nGROUP BY r.Titulo;\n\n-- 20. ¿Cuántos ejemplares se han vendido en total en toda la cadena editorial?\nSELECT SUM(EjemplaresVendidos) AS TotalCadena \nFROM Ejemplar;\n\n-- 21. ¿Cuál es la revista que registra la mayor cantidad total de ejemplares vendidos?\nSELECT TOP 1 r.Titulo, SUM(e.EjemplaresVendidos) AS TotalVendido\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo\nORDER BY TotalVendido DESC;\n\n-- 22. ¿Cuál es la revista que registra la menor cantidad total de ejemplares vendidos?\nSELECT TOP 1 r.Titulo, SUM(e.EjemplaresVendidos) AS TotalVendido\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo\nORDER BY TotalVendido ASC;\n\n-- 23. ¿Qué revistas tienen un promedio de ventas superior al promedio general de todos los ejemplares?\nSELECT r.Titulo, AVG(e.EjemplaresVendidos) AS Promedio\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo\nHAVING AVG(e.EjemplaresVendidos) > (SELECT AVG(EjemplaresVendidos) FROM Ejemplar);\n\n-- 24. ¿Qué periodistas han escrito más de un artículo?\nSELECT p.Nombre + ' ' + p.Apellidos AS Periodista, COUNT(a.IdArticulo) AS TotalArticulos\nFROM Periodista p\nINNER JOIN Articulo a ON a.IdPeriodista = p.IdPeriodista \nGROUP BY p.IdPeriodista, p.Nombre, p.Apellidos\nHAVING COUNT(a.IdArticulo) > 1;\n\n-- 25. ¿Qué revistas no tienen ningún artículo registrado?\nSELECT r.Titulo\nFROM Revista r\nLEFT JOIN Articulo a ON a.IdRevista = r.IdRevista\nWHERE a.IdArticulo IS NULL;\n\n-- 26. ¿Qué periodistas todavía no tienen artículos registrados?\nSELECT p.Nombre + ' ' + p.Apellidos AS Periodista\nFROM Periodista p\nLEFT JOIN Articulo a ON a.IdPeriodista = p.IdPeriodista\nWHERE a.IdArticulo IS NULL;\n\n-- 27. ¿Qué sucursales no tienen empleados asignados?\nSELECT s.CodigoSucursal, s.Domicilio\nFROM Sucursal s\nLEFT JOIN Empleado e ON e.IdSucursal = s.IdSucursal\nWHERE e.IdEmpleado IS NULL;\n\n-- 28. ¿Qué sucursales publican más de una revista?\nSELECT s.CodigoSucursal, COUNT(*) AS TotalRevistas\nFROM Sucursal s\nINNER JOIN SucursalRevista sr ON sr.IdSucursal = s.IdSucursal\nGROUP BY s.CodigoSucursal\nHAVING COUNT(*) > 1;\n\n-- 29. ¿Cuál es la posición de cada revista según sus ventas totales?\nSELECT r.Titulo, SUM(e.EjemplaresVendidos) AS TotalVendido, \n       RANK() OVER (ORDER BY SUM(e.EjemplaresVendidos) DESC) AS Posicion\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo;\n\n-- 30. ¿Qué porcentaje de las ventas totales representa cada revista?\nSELECT r.Titulo, \n       CAST(100.0 * SUM(e.EjemplaresVendidos) / (SELECT SUM(EjemplaresVendidos) FROM Ejemplar) AS DECIMAL(5,2)) AS Porcentaje\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista \nGROUP BY r.Titulo\nORDER BY Porcentaje DESC;\n\n-- 31. Clasifique las revistas según su volumen total de ventas\nSELECT r.Titulo, SUM(e.EjemplaresVendidos) AS TotalVendido,\n       CASE NTILE(3) OVER (ORDER BY SUM(e.EjemplaresVendidos) DESC)\n            WHEN 1 THEN 'Alto' \n            WHEN 2 THEN 'Medio' \n            ELSE 'Bajo'\n       END AS Volumen\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo;\n\n-- 32. ¿Cuál es la evolución acumulada de ejemplares vendidos por fecha?\nSELECT Fecha, SUM(EjemplaresVendidos) AS VentasDelDia,\n       SUM(SUM(EjemplaresVendidos)) OVER (ORDER BY Fecha) AS Acumulado\nFROM Ejemplar\nGROUP BY Fecha\nORDER BY Fecha;\n\n-- 33. Muestre las revistas cuyo promedio de ventas supera 4 500 ejemplares\nSELECT r.Titulo, AVG(e.EjemplaresVendidos) AS Promedio\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo\nHAVING AVG(e.EjemplaresVendidos) > 4500;\n\n-- 34. ¿Cuál es la revista cuyo ejemplar tiene el mayor número de páginas?\nSELECT TOP 1 r.Titulo, e.Fecha, e.NumeroPaginas\nFROM Ejemplar e\nINNER JOIN Revista r ON r.IdRevista = e.IdRevista\nORDER BY e.NumeroPaginas DESC;\n\n-- 35. Muestre cada revista y determine si sus ventas están por encima, igual o por debajo del promedio general\nSELECT r.Titulo, AVG(e.EjemplaresVendidos) AS Promedio,\n       CASE \n            WHEN AVG(e.EjemplaresVendidos) > (SELECT AVG(EjemplaresVendidos) FROM Ejemplar) THEN 'Por encima'\n            WHEN AVG(e.EjemplaresVendidos) = (SELECT AVG(EjemplaresVendidos) FROM Ejemplar) THEN 'Igual'\n            ELSE 'Por debajo' \n       END AS Comparacion\nFROM Revista r\nINNER JOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo;\n\n-- 36. ¿Qué periodistas tienen especialidad en tecnología o ciencia?\nSELECT Nombre, Apellidos, Especialidad\nFROM Periodista\nWHERE Especialidad = 'Tecnologia' OR Especialidad = 'Ciencia';\n\n-- 37. Obtenga los periodistas cuya especialidad sea tecnología, ciencia, educación o economía\nSELECT Nombre, Apellidos, Especialidad\nFROM Periodista\nWHERE Especialidad IN ('Tecnologia', 'Ciencia', 'Educacion', 'Economia')\nORDER BY Especialidad;\n\n-- 38. ¿Cuál es la revista que posee mayor cantidad de secciones fijas?\nSELECT TOP 1 r.Titulo, COUNT(s.IdSeccion) AS TotalSecciones\nFROM Revista r\nINNER JOIN SeccionFija s ON s.IdRevista = r.IdRevista\nGROUP BY r.Titulo\nORDER BY TotalSecciones DESC;\n\n-- 39. ¿Cuántos ejemplares se vendieron durante cada mes?\nSELECT YEAR(Fecha) AS Anio, MONTH(Fecha) AS Mes, SUM(EjemplaresVendidos) AS TotalVendido\nFROM Ejemplar\nGROUP BY YEAR(Fecha), MONTH(Fecha)\nORDER BY Anio, Mes;\n\n-- 40. INFORME POR REVISTA:\n-- Genere un informe que muestre por cada revista: cantidad de artículos, cantidad de secciones, total de ventas y promedio de ventas.\nSELECT r.Titulo AS Revista,\n    (SELECT COUNT(*) FROM Articulo a WHERE a.IdRevista = r.IdRevista) AS CantidadArticulos,\n    (SELECT COUNT(*) FROM SeccionFija s WHERE s.IdRevista = r.IdRevista) AS CantidadSecciones,\n    ISNULL((SELECT SUM(e.EjemplaresVendidos) FROM Ejemplar e WHERE e.IdRevista = r.IdRevista), 0) AS TotalVentas,\n    ISNULL((SELECT AVG(e.EjemplaresVendidos) FROM Ejemplar e WHERE e.IdRevista = r.IdRevista), 0) AS PromedioVentas\nFROM Revista r\nORDER BY r.Titulo;" }] }
];

let sqlActual = { titulo: '', scripts: [], idx: 0 };

function sqlPredeterminadoPara(semana, act) {
  const titulo = (act && act.pdfTitulo ? act.pdfTitulo : '').trim();
  const hit = sqlPredeterminados.find(p => p.semana === semana && p.patron.test(titulo));
  return hit ? hit.scripts : [];
}

function obtenerScriptsSQL(semana, act) {
  if (!act) return [];
  const lista = Array.isArray(act.sqlCodigos) ? act.sqlCodigos : sqlPredeterminadoPara(semana, act);
  return lista.filter(s => s && typeof s.codigo === 'string' && s.codigo.trim() !== '');
}

function nombreArchivoSQL(s, i) {
  if (s.archivo) return s.archivo;
  const base = (s.nombre || `script_${i + 1}`).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return `${base || 'script'}.sql`;
}

function escaparHTML(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function resaltarSQL(codigo) {
  const reglas = /(--.*$)|('(?:[^']|'')*')|\b(CREATE|DATABASE|SCHEMA|TABLE|USE|GO|IF|NOT|EXISTS|BEGIN|END|SELECT|FROM|WHERE|NAME|CONSTRAINT|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|IDENTITY|NULL|IN|AND|OR|INSERT|INTO|VALUES|INNER|LEFT|RIGHT|JOIN|ON|GROUP|BY|ORDER|HAVING|AS|TOP|DESC|ASC|COUNT|SUM|AVG|RANK|OVER|NTILE|CASE|WHEN|THEN|ELSE|DROP|ALTER|SET|WITH|ROLLBACK|IMMEDIATE|SINGLE_USER|FILENAME|SIZE|MAXSIZE|FILEGROWTH|LOG|DISTINCT|UPDATE|DELETE|IS|LIKE|BETWEEN|UNION|ALL|CAST|ISNULL|YEAR|MONTH)\b|\b(INT|TINYINT|SMALLINT|BIT|VARCHAR|NVARCHAR|CHAR|DECIMAL|DATE|DATETIME|DATETIME2|GETDATE|SYSDATETIME)\b|\b(\d+(?:\.\d+)?)\b/gi;
  return codigo.split('\n').map(linea => {
    const seguro = escaparHTML(linea);
    const out = seguro.replace(reglas, (m, com, str, kw, ty, num) => {
      if (com) return `<span class="sql-com">${m}</span>`;
      if (str) return `<span class="sql-str">${m}</span>`;
      if (kw)  return `<span class="sql-kw">${m}</span>`;
      if (ty)  return `<span class="sql-ty">${m}</span>`;
      if (num) return `<span class="sql-num">${m}</span>`;
      return m;
    });
    return `<span class="sql-line">${out || ' '}</span>`;
  }).join('');
}

function mostrarScriptSQL(i) {
  const s = sqlActual.scripts[i];
  if (!s) return;
  sqlActual.idx = i;
  document.getElementById('sqlFileName').textContent = nombreArchivoSQL(s, i);
  document.getElementById('sqlCodeContent').innerHTML = resaltarSQL(s.codigo);
  document.querySelectorAll('#sqlTabs .sql-tab').forEach((b, n) => b.classList.toggle('active', n === i));
  const copyBtn = document.getElementById('sqlCopyBtn');
  if (copyBtn) copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
  const box = document.querySelector('#sqlModal .sql-code-box');
  if (box) { box.scrollTop = 0; box.scrollLeft = 0; }
}

function openSqlModal(semana, actIndex) {
  const act = semanasInfo[semana] && semanasInfo[semana].actividades ? semanasInfo[semana].actividades[actIndex] : null;
  const scripts = obtenerScriptsSQL(semana, act);
  const modal = document.getElementById('sqlModal');
  if (!modal || scripts.length === 0) return;

  sqlActual = { titulo: act.pdfTitulo, scripts, idx: 0 };
  document.getElementById('sqlModalTitle').textContent = `Código SQL · ${act.pdfTitulo}`;

  const tabs = document.getElementById('sqlTabs');
  tabs.innerHTML = '';
  if (scripts.length > 1) {
    scripts.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sql-tab';
      b.textContent = s.nombre || `Script ${i + 1}`;
      b.addEventListener('click', () => mostrarScriptSQL(i));
      tabs.appendChild(b);
    });
    tabs.style.display = 'flex';
  } else {
    tabs.style.display = 'none';
  }

  mostrarScriptSQL(0);
  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeSqlModal() {
  const modal = document.getElementById('sqlModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

async function copySqlCode() {
  const s = sqlActual.scripts[sqlActual.idx];
  if (!s) return;
  const btn = document.getElementById('sqlCopyBtn');
  try {
    await navigator.clipboard.writeText(s.codigo);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = s.codigo;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
    setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar'; }, 1800);
  }
}

function downloadSqlCode() {
  const s = sqlActual.scripts[sqlActual.idx];
  if (!s) return;
  const blob = new Blob([s.codigo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivoSQL(s, sqlActual.idx);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- EDITOR EN EL PANEL DE ADMINISTRACIÓN ----------
function actividadSQLAdminActual() {
  const semana = document.getElementById('sqlAdmSemana')?.value;
  const idx = parseInt(document.getElementById('sqlAdmActividad')?.value, 10);
  const act = semanasInfo[semana] && semanasInfo[semana].actividades ? semanasInfo[semana].actividades[idx] : null;
  return { semana, idx, act };
}

function refrescarSQLAdmin() {
  const selSem = document.getElementById('sqlAdmSemana');
  const selAct = document.getElementById('sqlAdmActividad');
  if (!selSem || !selAct) return;

  const previo = selAct.value;
  const acts = (semanasInfo[selSem.value] && semanasInfo[selSem.value].actividades) || [];
  selAct.innerHTML = '';
  if (acts.length === 0) {
    selAct.innerHTML = '<option value="">(Esta semana no tiene actividades)</option>';
  } else {
    acts.forEach((a, i) => {
      const o = document.createElement('option');
      o.value = i;
      o.textContent = `${a.actividad || 'ACTIVIDAD'} · ${a.pdfTitulo}`;
      selAct.appendChild(o);
    });
    if (previo !== '' && acts[parseInt(previo, 10)]) selAct.value = previo;
  }
  cargarScriptsSQLAdmin();
}

function cargarScriptsSQLAdmin() {
  const { semana, act } = actividadSQLAdminActual();
  const cont = document.getElementById('sqlAdmScripts');
  if (!cont) return;
  if (!act) {
    cont.innerHTML = '';
    actualizarEstadoSQLAdmin(0);
    return;
  }
  const lista = Array.isArray(act.sqlCodigos) ? act.sqlCodigos : sqlPredeterminadoPara(semana, act);
  const slots = lista.map(s => ({ nombre: s.nombre || '', archivo: s.archivo || '', codigo: s.codigo || '' }));
  if (slots.length === 0) slots.push({ nombre: '', archivo: '', codigo: '' });
  renderSlotsSQLAdmin(slots);
  actualizarEstadoSQLAdmin(obtenerScriptsSQL(semana, act).length);
}

function actualizarEstadoSQLAdmin(n) {
  const el = document.getElementById('sqlAdmEstado');
  if (!el) return;
  el.innerHTML = n > 0
    ? `<i class="fa-solid fa-circle-check"></i> Esta actividad muestra el botón <strong>Código SQL</strong> (${n} script${n > 1 ? 's' : ''}).`
    : `<i class="fa-regular fa-circle"></i> Esta actividad <strong>no muestra</strong> el botón Código SQL.`;
}

function renderSlotsSQLAdmin(slots) {
  const cont = document.getElementById('sqlAdmScripts');
  cont.innerHTML = '';
  slots.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'sql-adm-slot';
    div.innerHTML = `
      <div class="sql-adm-row">
        <input type="text" class="dash-input sql-adm-nombre" placeholder="Nombre del script (ej. Creación de tablas)" autocomplete="off">
        <label class="btn-card-action sql-adm-file"><i class="fa-solid fa-file-arrow-up"></i> Cargar archivo
          <input type="file" accept=".sql,.txt" style="display:none">
        </label>
        <button type="button" class="btn-delete-act" title="Quitar este script"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <textarea class="dash-input sql-adm-codigo" rows="8" spellcheck="false" placeholder="Pega aquí tu código SQL..."></textarea>`;
    div.querySelector('.sql-adm-nombre').value = s.nombre || '';
    div.querySelector('.sql-adm-codigo').value = s.codigo || '';
    div.dataset.archivo = s.archivo || '';
    div.querySelector('input[type=file]').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        div.querySelector('.sql-adm-codigo').value = String(reader.result).replace(/\r\n/g, '\n');
        const nom = div.querySelector('.sql-adm-nombre');
        if (!nom.value.trim()) nom.value = f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' ');
        div.dataset.archivo = /\.sql$/i.test(f.name) ? f.name : f.name.replace(/\.[^.]+$/, '') + '.sql';
      };
      reader.readAsText(f, 'utf-8');
      e.target.value = '';
    });
    div.querySelector('.btn-delete-act').addEventListener('click', () => quitarSlotSQLAdmin(i));
    cont.appendChild(div);
  });
}

function leerSlotsSQLAdmin() {
  return Array.from(document.querySelectorAll('#sqlAdmScripts .sql-adm-slot')).map(div => ({
    nombre: div.querySelector('.sql-adm-nombre').value.trim(),
    archivo: div.dataset.archivo || '',
    codigo: div.querySelector('.sql-adm-codigo').value
  }));
}

function agregarSlotSQLAdmin() {
  const slots = leerSlotsSQLAdmin();
  slots.push({ nombre: '', archivo: '', codigo: '' });
  renderSlotsSQLAdmin(slots);
}

function quitarSlotSQLAdmin(i) {
  const slots = leerSlotsSQLAdmin();
  slots.splice(i, 1);
  if (slots.length === 0) slots.push({ nombre: '', archivo: '', codigo: '' });
  renderSlotsSQLAdmin(slots);
}

async function guardarCodigoSQLDashboard() {
  const { semana, act } = actividadSQLAdminActual();
  if (!act) {
    alert('Selecciona una semana que tenga actividades.');
    return;
  }
  const llenos = leerSlotsSQLAdmin().filter(s => s.codigo.trim() !== '');
  act.sqlCodigos = llenos.map((s, i) => ({
    nombre: s.nombre || `Script ${i + 1}`,
    archivo: s.archivo,
    codigo: s.codigo.replace(/\r\n/g, '\n')
  }));
  await guardarEnLocalStorage();
  actualizarEstadoSQLAdmin(act.sqlCodigos.length);
  renderizarTablaDashboard();
  alert(act.sqlCodigos.length > 0
    ? `¡Código SQL guardado en ${semana}! El botón ya aparece en esa actividad.`
    : `Sin código: el botón "Código SQL" ya no aparece en esa actividad (${semana}).`);
}

// ==========================================
// 2. MODO NEÓN Y SABLE DE LUZ
// ==========================================
function toggleRedTheme() {
  document.body.classList.toggle('red-theme');
  document.body.classList.toggle('glow-red');

  const isRed = document.body.classList.contains('red-theme');
  
  const lightsabers = document.querySelectorAll('#glow-toggle, .lightsaber-toggle, #glow-toggle-dash');
  lightsabers.forEach(saber => {
    if (isRed) {
      saber.classList.add('active');
    } else {
      saber.classList.remove('active');
    }
  });

  localStorage.setItem('theme', isRed ? 'red' : 'blue');
}

// ==========================================
// 3. LOGIN Y NAVEGACIÓN
// ==========================================
function triggerHyperspaceLogin() {
  const overlay = document.getElementById('hyperspaceOverlay');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => {
      overlay.classList.remove('active');
      const loginModal = document.getElementById('loginModal');
      if (loginModal) loginModal.style.display = 'flex';
    }, 1100);
  }
}

function resetLoginForm() {
  const codeInput = document.getElementById('studentCode');
  const passInput = document.getElementById('studentPass');
  const errorMsg = document.getElementById('loginError');

  if (codeInput) codeInput.value = '';
  if (passInput) {
    passInput.value = '';
    passInput.type = 'password';
  }
  if (errorMsg) errorMsg.style.display = 'none';

  const toggleBtn = document.getElementById('togglePassBtn');
  if (toggleBtn) {
    toggleBtn.textContent = '👁️';
    toggleBtn.setAttribute('title', 'Mostrar contraseña');
  }
}

function closeLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) loginModal.style.display = 'none';
  resetLoginForm();
}

function validarLogin() {
  const codeInput = document.getElementById('studentCode');
  const passInput = document.getElementById('studentPass');
  const errorMsg = document.getElementById('loginError');

  if (!codeInput || !passInput) return;

  if (codeInput.value.trim() === 'T00047H' && passInput.value.trim() === 'sistemas') {
    if (errorMsg) errorMsg.style.display = 'none';
    resetLoginForm();
    closeLoginModal();

    document.querySelectorAll('header, section, footer').forEach(el => {
      if (el.parentElement.id !== 'dashboardView') el.style.display = 'none';
    });

    const dashboardView = document.getElementById('dashboardView');
    if (dashboardView) dashboardView.style.display = 'block';
  } else {
    if (errorMsg) errorMsg.style.display = 'block';
  }
}

function irAlPortal() {
  const dashboardView = document.getElementById('dashboardView');
  if (dashboardView) dashboardView.style.display = 'none';

  document.querySelectorAll('header, section, footer').forEach(el => {
    if (el.parentElement.id !== 'dashboardView') el.style.display = '';
  });

  resetLoginForm();
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('studentPass');
  const toggleBtn = document.getElementById('togglePassBtn');
  if (!passInput || !toggleBtn) return;

  if (passInput.type === 'password') {
    passInput.type = 'text';
    toggleBtn.textContent = '🙈';
  } else {
    passInput.type = 'password';
    toggleBtn.textContent = '👁️';
  }
}

// ==========================================
// 4. MODALES DE SEMANA Y FLIP 3D
// ==========================================
function toggleFlip(unitId) {
  const unit = document.getElementById(unitId);
  if (unit) unit.classList.toggle('flipped');
}

function openWeekModal(weekName) {
  const modal = document.getElementById('weekModal');
  const modalTitle = document.getElementById('modalWeekTitle');
  const modalDesc = document.getElementById('modalGeniallyDesc');

  if (modal && modalTitle) {
    modalTitle.textContent = weekName;

    if (semanasInfo[weekName]) {
      const info = semanasInfo[weekName];
      let contenidoHTML = `<div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">`;

      if (info.actividades && info.actividades.length > 0) {
        info.actividades.forEach((act, actIdx) => {
          const iconoClase = act.tipo === 'enlace' ? 'fa-link' : 'fa-file-pdf';
          const iconoColor = act.tipo === 'enlace' ? '#00f2fe' : '#ff4757';
          const tieneSQL = obtenerScriptsSQL(weekName, act).length > 0;
          const botonSQL = tieneSQL
            ? `<button type="button" class="btn-card-action btn-sql-code" onclick="openSqlModal('${weekName}', ${actIdx})"><i class="fa-solid fa-database"></i> Código SQL</button>`
            : '';
          
          contenidoHTML += `
            <div class="modal-card-box">
              <span class="activity-badge">${act.actividad || 'ACTIVIDAD'}</span>
              <p style="margin: 0 0 12px 0; font-weight: bold; font-size: 1rem; color: #ffffff; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid ${iconoClase}" style="color: ${iconoColor}; font-size: 1.2rem;"></i>
                ${act.pdfTitulo}
              </p>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="${act.pdfRuta}" target="_blank" rel="noopener noreferrer" class="btn-card-action">
                  <i class="fa-solid fa-eye"></i> Ver ${act.tipo === 'enlace' ? 'Enlace' : 'PDF'}
                </a>
                ${botonSQL}
              </div>
            </div>
          `;
        });
      }

      if (info.geniallyLink) {
        contenidoHTML += `
          <div class="modal-card-box">
            <p style="margin: 0 0 12px 0; font-weight: bold; font-size: 1rem; color: #ffffff; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-laptop-code" style="font-size: 1.2rem;"></i>
              ${info.geniallyTitulo}
            </p>
            <a href="${info.geniallyLink}" target="_blank" rel="noopener noreferrer" class="btn-card-action">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir en Genially
            </a>
          </div>
        `;
      }

      contenidoHTML += `</div>`;
      if (modalDesc) modalDesc.innerHTML = contenidoHTML;
    } else {
      if (modalDesc) modalDesc.innerHTML = `<i class="fa-regular fa-comment"></i> No hay contenido registrado para esta semana.`;
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function closeWeekModal() {
  const modal = document.getElementById('weekModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// ==========================================
// 5. CHATBOT R2-D2
// ==========================================
function toggleChatbot() {
  const win = document.getElementById('botChatWindow');
  if (win) win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
}

function appendBotMessage(text, isUser = false) {
  const box = document.getElementById('botMessages');
  if (!box) return;

  const msg = document.createElement('div');
  msg.className = `bot-msg ${isUser ? 'msg-user' : 'msg-bot'}`;
  msg.innerHTML = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

// ----- Ayudantes: el bot lee siempre las semanas reales del portafolio -----
function semanaTieneContenido(num) {
  const s = semanasInfo[`Semana ${num}`];
  return !!(s && ((s.actividades && s.actividades.length > 0) || s.geniallyLink));
}

function semanasDeUnidad(unidad) {
  const lista = [];
  for (let n = (unidad - 1) * 4 + 1; n <= unidad * 4; n++) {
    if (semanaTieneContenido(n)) lista.push(n);
  }
  return lista;
}

function botonesSemanasHTML(nums) {
  return `<div class="bot-week-list">` +
    nums.map(n => `<button type="button" class="bot-week-btn" onclick="botShowWeek(${n})">Semana ${n}</button>`).join('') +
    `</div>`;
}

function botSelectOption(tipo) {
  if (tipo === 'conceptos') {
    botEnviar('¿Qué es una base de datos?');
  } else if (tipo === 'sql') {
    botEnviar('¿Qué es SQL?');
  } else if (tipo === 'resumen') {
    const filas = [];
    for (let u = 1; u <= 4; u++) {
      const nums = semanasDeUnidad(u);
      if (nums.length > 0) {
        const totalActs = nums.reduce((t, n) => t + ((semanasInfo[`Semana ${n}`].actividades || []).length), 0);
        filas.push(`• <b>Unidad ${u}:</b> ${nums.length} semana${nums.length > 1 ? 's' : ''} con contenido (${totalActs} trabajo${totalActs !== 1 ? 's' : ''})`);
      }
    }
    appendBotMessage(filas.length > 0
      ? `📋 <b>Resumen actual del portafolio:</b><br>${filas.join('<br>')}`
      : '📋 Aún no hay semanas con contenido registrado en el portafolio.');
  }
}

function botSelectUnit(num) {
  appendBotMessage(`<b>Unidad ${num} seleccionada</b>`, true);
  const nums = semanasDeUnidad(num);
  if (nums.length > 0) {
    appendBotMessage(`✅ Abriendo Unidad ${num}:<br>Selecciona una semana:${botonesSemanasHTML(nums)}`);
  } else {
    appendBotMessage(`⚠️ La Unidad ${num} todavía no tiene semanas con contenido. Se mostrarán aquí apenas las agregues desde el panel.`);
  }
}

function botShowWeek(numSemana) {
  const clave = `Semana ${numSemana}`;
  const info = semanasInfo[clave];
  if (!info || (!(info.actividades && info.actividades.length) && !info.geniallyLink)) {
    appendBotMessage(`No hay archivos registrados para la ${clave}.`);
    return;
  }

  let r = `📄 <b>${clave}</b>`;
  if (info.tituloSemana) r += `<br><i>${escaparHTML(info.tituloSemana)}</i>`;
  r += '<br>';

  (info.actividades || []).forEach(act => {
    const tieneSQL = obtenerScriptsSQL(clave, act).length > 0;
    r += `• <a href="${act.pdfRuta}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color);">${escaparHTML(act.pdfTitulo || 'Archivo')}</a>${tieneSQL ? ' <span class="sql-badge"><i class="fa-solid fa-database"></i> SQL</span>' : ''}<br>`;
  });

  if (info.geniallyLink) {
    r += `• <a href="${info.geniallyLink}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color);">${escaparHTML(info.geniallyTitulo || 'Resumen en Genially')}</a><br>`;
  }

  r += `<div class="bot-week-list"><button type="button" class="bot-week-btn" onclick="openWeekModal('${clave}')">Abrir ${clave}</button></div>`;
  appendBotMessage(r);
}

// ==========================================
// 5.1 CEREBRO CONVERSACIONAL DE R2-D2
//     (sin servidores: funciona 100 % en tu página)
// ==========================================
const botCtx = { tema: null, modo: 'info', nombre: '', turnos: 0 };

function botNorm(t) {
  return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()"-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function botTiene(q, kw) {
  const esc = kw.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
  return new RegExp('(^|[^a-z0-9])' + esc + '(s|es)?([^a-z0-9]|$)').test(q);
}

function botCod(texto) {
  return `<pre class="bot-code">${escaparHTML(texto)}</pre>`;
}

function botElegir(v) {
  return Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v;
}

// Semanas con contenido y actividades con SQL (datos reales del portafolio)
function botSemanasConContenido() {
  const out = [];
  for (let n = 1; n <= 16; n++) if (semanaTieneContenido(n)) out.push(n);
  return out;
}

function botActividadesConSQL() {
  const lista = [];
  botSemanasConContenido().forEach(n => {
    const clave = `Semana ${n}`;
    ((semanasInfo[clave] && semanasInfo[clave].actividades) || []).forEach((act, i) => {
      const scripts = obtenerScriptsSQL(clave, act);
      if (scripts.length > 0) lista.push({ semana: n, clave, idx: i, titulo: act.pdfTitulo, total: scripts.length });
    });
  });
  return lista;
}

// ---------- BASE DE CONOCIMIENTO ----------
const botTemas = [
  // ===== Conversación básica =====
  { id: 'saludo', claves: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos'],
    info: () => botElegir([
      `¡Hola${botCtx.nombre ? ' ' + botCtx.nombre : ''}! Beep-boop 🤖 Soy R2-D2, el asistente de este portafolio. Pregúntame sobre bases de datos o pídeme una recomendación.`,
      `¡Hola${botCtx.nombre ? ' ' + botCtx.nombre : ''}! 🤖 ¿Quieres repasar algo de Base de Datos II o que te recomiende por dónde seguir?`
    ]),
    sug: ['¿Qué me recomiendas?', '¿Qué gestor uso?', 'Ayuda'] },
  { id: 'gracias', claves: ['gracias', 'te agradezco', 'muchas gracias', 'thanks'],
    info: () => botElegir(['¡De nada! Beep-boop 🤖 Aquí sigo si necesitas más.', '¡Con gusto! Si quieres, te recomiendo qué repasar después.']),
    sug: ['¿Qué me recomiendas?'] },
  { id: 'despedida', claves: ['chau', 'adios', 'hasta luego', 'nos vemos', 'bye', 'me voy'],
    info: () => '¡Hasta pronto! 👋 Que te vaya excelente con tus bases de datos. Beep-boop.' },
  { id: 'estado', claves: ['como estas', 'como andas', 'como te va', 'que haces'],
    info: () => 'Todos mis circuitos funcionan al 100 % ⚡ ¿Y tú? Cuéntame qué tema de bases de datos quieres ver.',
    sug: ['¿Qué me recomiendas?', 'Ayuda'] },
  { id: 'quien', claves: ['quien eres', 'como te llamas', 'que eres', 'tu nombre', 'r2d2', 'r2'],
    info: () => 'Soy <b>R2-D2</b> 🤖, el asistente del portafolio de <b>Juan Lenin Huaman Quispe</b> (Base de Datos II · UPLA). Converso de bases de datos y te recomiendo qué usar o estudiar.',
    sug: ['Ayuda', '¿Qué me recomiendas?'] },
  { id: 'autor', claves: ['juan', 'lenin', 'autor', 'creador', 'quien hizo', 'quien creo'],
    info: () => 'Este portafolio es de <b>Juan Lenin Huaman Quispe</b>, estudiante de V ciclo de Ingeniería de Sistemas y Computación en la UPLA. Aquí presenta sus trabajos de Base de Datos II.' },
  { id: 'chiste', claves: ['chiste', 'broma', 'chistoso', 'hazme reir'],
    info: () => botElegir([
      '¿Por qué el DBA dejó a su pareja? 💔 Porque tenía demasiadas relaciones <b>muchos a muchos</b>. Beep-boop.',
      'Un SQL entra a un bar, ve dos mesas y pregunta: «¿puedo hacerles <b>JOIN</b>?» 🍻',
      '¿Cuál es el colmo de una base de datos? Tener <b>NULL</b> ganas de trabajar. 😅'
    ]) },
  { id: 'ayuda', claves: ['ayuda', 'que puedes hacer', 'que sabes', 'opciones', 'menu', 'comandos', 'help'],
    info: () => `Puedo conversar y recomendarte sobre:<br>• 🗄️ Qué es una base de datos, tipos y arquitectura<br>• 🧰 Gestores (SQL Server, MySQL, PostgreSQL…)<br>• 🎓 Tus casos: Grados y Títulos, Informático y Editorial<br>• 💻 SQL: SELECT, JOIN, GROUP BY…<br>• 🧱 Modelo físico, claves y restricciones<br>• 📐 Normalización y modelo E-R<br>• ⚡ Índices, transacciones, backups<br>• 📚 Qué semana o código SQL repasar<br>Escribe <i>"semana 3"</i> o <i>"unidad 1"</i> para ver tus archivos.`,
    sug: ['¿Qué es una base de datos?', '¿Qué gestor me recomiendas?', 'Mis trabajos', '¿Cómo estudio mejor?'] },

  // ===== Gestores =====
  { id: 'sqlserver', claves: ['sql server', 'sqlserver', 'ssms', 'microsoft sql', 't sql', 'tsql', 'transact'],
    info: () => '<b>Microsoft SQL Server</b> es el gestor que usas en este curso 🪟. Se administra con <b>SSMS</b> y usa T-SQL. Trae <b>IDENTITY</b>, esquemas (<code>CREATE SCHEMA</code>), procedimientos, triggers y buen soporte de seguridad y backups.',
    reco: () => '✅ Para Base de Datos II te recomiendo <b>SQL Server Developer + SSMS</b>: es gratis para aprender y es justo lo que piden tus actividades. Practica con tus scripts de la Semana 3 y 4.',
    cuando: 'si es para tu curso o un entorno Microsoft (es el que usas en las actividades)',
    grupoReco: 'dbms',
    por: () => 'Porque tus actividades y el cuestionario 1-40 están hechos en T-SQL (<code>TOP</code>, <code>IDENTITY</code>, <code>ISNULL</code>…). Usar el mismo motor evita errores de sintaxis.',
    ejemplo: () => botCod("CREATE DATABASE MiBD;\nGO\nUSE MiBD;\nGO\nCREATE TABLE Cliente (\n  IdCliente INT IDENTITY(1,1) PRIMARY KEY,\n  Nombre VARCHAR(100) NOT NULL\n);"),
    sug: ['¿Cómo lo instalo?', 'Ejemplo', '¿Y MySQL?', '¿Y PostgreSQL?'] },
  { id: 'mysql', claves: ['mysql', 'mariadb'],
    info: () => '<b>MySQL</b> es un gestor open source muy usado en la web (WordPress, hostings económicos). Es rápido y sencillo, aunque tiene menos funciones avanzadas de T-SQL.',
    cuando: 'si harás una web o app sencilla con hosting económico',
    grupoReco: 'dbms',
    reco: () => '👍 Elige <b>MySQL</b> si harás una web o app sencilla con hosting económico. Para este curso, lo mejor sigue siendo SQL Server.',
    sug: ['¿Qué gestor me recomiendas?', '¿Y PostgreSQL?'] },
  { id: 'postgres', claves: ['postgres', 'postgresql'],
    info: () => '<b>PostgreSQL</b> es un gestor open source muy robusto: cumple bien el estándar SQL, soporta JSON, funciones de ventana y extensiones.',
    cuando: 'si quieres un proyecto serio, gratis y muy completo',
    grupoReco: 'dbms',
    reco: () => '👍 Elige <b>PostgreSQL</b> para proyectos serios sin pagar licencias. Si ya sabes SQL Server, migrar es fácil: casi todo cambia poco.',
    sug: ['¿Qué gestor me recomiendas?', '¿Y MySQL?'] },
  { id: 'oracle', claves: ['oracle', 'pl/sql', 'plsql'],
    info: () => '<b>Oracle Database</b> es un gestor empresarial (bancos, grandes corporaciones) con PL/SQL, alta disponibilidad y mucha escalabilidad. Es potente, pero de licencia costosa.',
    cuando: 'si tu empresa lo exige o necesitas escala corporativa',
    grupoReco: 'dbms',
    reco: () => '🏢 Te lo recomiendo solo si tu trabajo o empresa lo exige. Para aprender, SQL Server o PostgreSQL son más fáciles de instalar.',
    sug: ['¿Qué gestor me recomiendas?'] },
  { id: 'nosql', claves: ['nosql', 'mongo', 'mongodb', 'firebase', 'firestore', 'no relacional'],
    info: () => 'Las bases <b>NoSQL</b> (MongoDB, Firestore…) guardan documentos flexibles en vez de tablas. Esta misma página usa <b>Firestore</b> para guardar tus semanas 🔥.',
    cuando: 'si tus datos son flexibles o necesitas tiempo real',
    grupoReco: 'dbms',
    reco: () => '🤔 Usa <b>relacional</b> (SQL Server, PostgreSQL) cuando hay relaciones e integridad importantes: ventas, notas, trámites. Usa <b>NoSQL</b> para datos flexibles, tiempo real o prototipos rápidos.',
    sug: ['¿Qué gestor me recomiendas?'] },
  { id: 'dbms', claves: ['dbms', 'gestor', 'sgbd', 'motor', 'manejador', 'que base de datos', 'que gestor', 'que motor'],
    info: () => 'Un <b>DBMS / SGBD</b> es el software que administra tus datos: almacenamiento, seguridad, integridad, concurrencia y respaldos. Los más usados: <b>SQL Server, MySQL, PostgreSQL y Oracle</b>.',
    por: () => 'Porque cada gestor encaja mejor en un escenario: el costo, el hosting, el soporte y lo que pide tu curso o tu empresa cambian la mejor opción. Para <b>Base de Datos II</b>, SQL Server es la opción alineada con tus actividades.',
    reco: () => `Mi recomendación según tu caso:<br>• 🎓 <b>Curso / UPLA:</b> SQL Server<br>• 🌐 <b>Web económica:</b> MySQL<br>• 🛠️ <b>Proyecto serio gratis:</b> PostgreSQL<br>• 🏢 <b>Corporativo:</b> Oracle o SQL Server<br>• ⚡ <b>Prototipo en tiempo real:</b> Firestore`,
    obras: [/gestores|dbms/],
    sug: ['¿Por qué SQL Server?', '¿Y PostgreSQL?', '¿Cómo lo instalo?'] },

  // ===== Fundamentos de Base de Datos (según tus trabajos) =====
  { id: 'tipos', claves: ['tipos de base', 'tipo de base', 'relacional', 'relacionales', 'jerarquica', 'clave valor', 'grafos', 'documental', 'oltp', 'olap', 'data warehouse'],
    info: () => '📚 <b>Tipos de base de datos:</b><br>• <b>Relacional:</b> tablas + SQL (SQL Server, MySQL, PostgreSQL). Es el tipo que trabajas en el curso.<br>• <b>NoSQL:</b> documentos, clave-valor, columnas o grafos (MongoDB, Firestore).<br>• <b>OLTP:</b> operaciones diarias (ventas, trámites).<br>• <b>OLAP / Data Warehouse:</b> análisis de grandes volúmenes.',
    reco: () => '✅ Para sistemas con relaciones e integridad (trámites, ventas, notas) elige <b>relacional</b>. Para datos flexibles o tiempo real, <b>NoSQL</b>. Para reportes pesados, un <b>almacén de datos</b>.',
    sug: ['¿Qué gestor me recomiendas?', 'Tablas, filas y columnas'] },
  { id: 'administracion', claves: ['administracion', 'administrador', 'administrar', 'dba'],
    info: () => '🛠️ La <b>administración de base de datos</b> la hace el <b>DBA</b>: instala y configura el motor, crea bases y usuarios, define permisos, hace <b>backups</b>, monitorea el rendimiento (índices) y asegura que el servicio esté disponible. Es el tema de tu Semana 1.',
    reco: () => '✅ Buenas prácticas de un DBA: backups probados, permisos mínimos, monitoreo de rendimiento y documentar la configuración.',
    obras: [/administracion/],
    sug: ['Backups y seguridad', 'Índices', '¿Cómo lo instalo?'] },
  { id: 'arqbd', claves: ['arquitectura de base', 'arquitectura de bd', 'arquitectura de una base', 'niveles', 'nivel externo', 'nivel conceptual', 'nivel interno', 'ansi', 'independencia de datos'],
    info: () => '🏛️ La <b>arquitectura de una base de datos</b> (ANSI/SPARC) tiene 3 niveles:<br>• <b>Externo:</b> lo que ve cada usuario (vistas).<br>• <b>Conceptual:</b> el modelo lógico completo (entidades y relaciones).<br>• <b>Interno:</b> cómo se guarda físicamente (archivos, índices).<br>Esto da <b>independencia de datos</b>: cambias el nivel físico sin romper las aplicaciones. Es la base de tu Semana 1 (selección de la arquitectura).',
    reco: () => '✅ Para elegir arquitectura: <b>cliente-servidor en 3 capas</b> para aplicaciones web; <b>nube</b> si necesitas escalar rápido; <b>local</b> para aprender o si hay normas de datos estrictas.',
    obras: [/arquitectura/],
    sug: ['Arquitectura cliente-servidor', '¿Qué gestor me recomiendas?'] },
  { id: 'tablas', claves: ['tabla', 'tablas', 'fila', 'filas', 'columna', 'columnas', 'registro', 'campo', 'atributo', 'tupla'],
    info: () => '📋 En una base relacional los datos viven en <b>tablas</b>. Cada <b>fila</b> (registro o tupla) es un elemento, ej. un empleado; cada <b>columna</b> (campo o atributo) es una propiedad, ej. <code>Nombre</code> o <code>NIF</code>. Las tablas se enlazan con <b>claves primarias y foráneas</b>.',
    ejemplo: () => botCod("-- Tabla Empleado (fila = 1 empleado)\nIdEmpleado | Nombre | Apellidos | NIF\n1          | Carlos | Ramirez   | NIF100001\n2          | Ana    | Flores    | NIF100002"),
    sug: ['Ejemplo', 'Claves y restricciones', 'Modelo entidad-relación'] },
  { id: 'diseno', claves: ['diseno de base', 'fases de diseno', 'fases del diseno', 'diseno de bd', 'fases', 'diseno', 'ciclo de vida', 'modelo conceptual', 'modelo logico', 'conceptual', 'logico', 'proceso del curso', 'etapas'],
    info: () => '🧩 <b>Fases del diseño de una base de datos</b> y dónde las ves en tu portafolio:<br>1) <b>Requisitos y arquitectura</b> → Semana 1<br>2) <b>Despliegue del motor (DBMS)</b> → Semana 2<br>3) <b>Modelo conceptual → lógico → físico</b> → Semana 3 (Grados y Títulos, Informático y Editorial)<br>4) <b>Implementación, datos y validación</b> → Semana 4 (Cadena Editorial y cuestionario)',
    reco: () => '✅ Sigue siempre ese orden: no escribas tablas en SQL sin antes tener claras las entidades y relaciones.',
    sug: ['Modelo entidad-relación', 'Modelo físico', 'Mis trabajos'] },
  { id: 'grados', claves: ['grados y titulos', 'grado y titulo', 'bachiller', 'titulo profesional', 'tesis', 'turnitin', 'antiplagio', 'jurado', 'sustentacion', 'trabajo de investigacion', 'reglamento', 'tramite', 'resolucion', 'asesor'],
    info: () => '🎓 El caso <b>Grados y Títulos</b> (Semana 3, Act. 1) modela el trámite de bachiller y título en 4 esquemas:<br>• <b>Catalogo:</b> tipos y estados de trámite, líneas de investigación.<br>• <b>Academico:</b> facultad, programa, persona y docente.<br>• <b>Tramite:</b> pago, fotografía, trabajo de investigación, asesor, plan de tesis, informe final y resoluciones (Facultad y CU).<br>• <b>Evaluacion:</b> jurado y sustentación.<br>Son <b>21 tablas</b>. Aplica reglas del Reglamento, como <b>similitud ≤ 30 %</b> (Turnitin) con un <code>CHECK</code>, notas de 0 a 20 y jurado (Presidente, Secretario, Vocal, Suplente).',
    reco: () => '✅ Para entenderlo bien: lee primero el <b>Reglamento</b> (Semana 2), luego mira el modelo y por último revisa el <b>código SQL</b> con el visor.',
    por: () => 'Porque cada tabla y restricción del SQL nace de una regla del Reglamento: el CHECK de 30 % de similitud, los roles del jurado o la nota máxima de 20.',
    ejemplo: () => botCod("CONSTRAINT CHK_Similitud_Antiplagio\n  CHECK (PorcentajeSimilitud >= 0.00\n     AND PorcentajeSimilitud <= 30.00)"),
    obras: [/grados y titulos/, /reglamento/],
    sug: ['Ejemplo', 'Mecanismos de integración', 'Empresa de material informático'] },
  { id: 'empresa', claves: ['material informatico', 'empresa informatica', 'empresa de material', 'informatico', 'equipo', 'componente', 'equipocomponente', 'detalle de compra'],
    info: () => '🖥️ La <b>Empresa de Material Informático</b> (Semana 3, Act. 2) tiene <b>8 tablas</b> en el esquema <code>Empresa</code>: Seccion, Empleado, Cliente, Equipo, Componente, EquipoComponente, Compra y DetalleCompra.<br>• Un equipo se arma con varios componentes: relación <b>N:M</b> resuelta con <code>EquipoComponente</code> (clave compuesta).<br>• <code>DetalleCompra</code> permite comprar equipos o componentes sueltos.',
    reco: () => '✅ Es el mejor caso para practicar una <b>relación N:M</b> y los <b>CHECK</b> (precio ≥ 0, stock ≥ 0, cantidad > 0).',
    ejemplo: () => botCod("CREATE TABLE Empresa.EquipoComponente (\n  IdEquipo INT NOT NULL,\n  IdComponente INT NOT NULL,\n  Cantidad INT NOT NULL DEFAULT 1,\n  CONSTRAINT PK_EquipoComponente\n    PRIMARY KEY (IdEquipo, IdComponente)\n);"),
    obras: [/inform/],
    sug: ['Ejemplo', 'Modelo entidad-relación', 'Caso Cadena Editorial'] },
  { id: 'integridad', claves: ['mecanismos de integracion', 'mecanismo de integracion', 'integracion', 'integridad referencial', 'integridad de datos', 'integridad de entidad'],
    info: () => '🔗 Los <b>mecanismos de integridad</b> mantienen los datos correctos y conectados:<br>• <b>Entidad:</b> PRIMARY KEY + NOT NULL.<br>• <b>Referencial:</b> FOREIGN KEY entre tablas.<br>• <b>Dominio:</b> tipos de dato, CHECK y DEFAULT.<br>• <b>Unicidad:</b> UNIQUE.<br>Ejemplos de tus modelos: <code>FK_Tramite_Persona</code>, <code>UQ_Persona_DNI</code>, <code>CHK_Sustentacion_Nota</code> (0 a 20) y <code>CHK_Equipo_Precio</code> (≥ 0).',
    reco: () => '✅ Pon la regla en la base de datos (CHECK, FK, UNIQUE) y no solo en la aplicación: así ningún programa puede guardar datos inválidos.',
    obras: [/mecanismo|integracion/],
    sug: ['Claves y restricciones', 'Modelo físico'] },
  { id: 'trabajos', claves: ['mis trabajos', 'trabajos', 'que trabajos', 'archivos', 'actividades', 'entregables', 'lo que subi', 'que subi', 'que he subido', 'pdf', 'pdfs'],
    info: () => 'botListaTrabajos',
    reco: () => 'botListaTrabajos',
    sug: ['¿Cómo estudio mejor?', '¿Qué código SQL practico?'] },

  { id: 'basedatos', claves: ['base de datos', 'bases de datos', 'bd', 'database', 'que es un dato', 'que son los datos', 'definicion de base'],
    info: () => '🗄️ Una <b>base de datos</b> es un conjunto organizado de datos relacionados, guardados para consultarlos, actualizarlos y protegerlos de forma eficiente.<br><br>• <b>Dato:</b> hecho sin interpretar (ej. "Ana").<br>• <b>Información:</b> dato con significado (ej. "Ana trabaja en la sucursal 1").<br>• Se organiza en <b>tablas</b>, <b>filas</b> y <b>columnas</b> unidas por <b>claves</b>.<br>• La administra un <b>SGBD</b> (SQL Server, MySQL…).<br><br>En tu portafolio la aplicas en 3 casos: <b>Grados y Títulos</b>, <b>Empresa de Material Informático</b> y <b>Cadena Editorial</b>.',
    reco: () => '✅ Para entender una base de datos, parte de un caso real como los tuyos: identifica las <b>entidades</b>, relaciónalas, créalas en SQL Server y consúltalas. Empieza con la <b>Cadena Editorial</b>, que es el caso más completo.',
    obras: [/arquitectura de base/, /introduccion/],
    sug: ['¿Qué es un DBMS?', 'Tipos de base de datos', 'Mis trabajos'] },

  // ===== SQL =====
  { id: 'joins', claves: ['join', 'inner join', 'left join', 'combinar tablas', 'unir tablas', 'relacionar tablas'],
    info: () => 'Un <b>JOIN</b> combina filas de varias tablas por una columna relacionada. <b>INNER JOIN</b> trae solo coincidencias; <b>LEFT JOIN</b> trae todo lo de la izquierda aunque no tenga pareja.',
    reco: () => '👉 Usa <b>INNER JOIN</b> cuando necesitas datos que sí se relacionan, y <b>LEFT JOIN + IS NULL</b> para encontrar lo que <i>no</i> tiene relación (ej. revistas sin artículos, pregunta 25 de tu cuestionario).',
    ejemplo: () => botCod("SELECT r.Titulo, a.Titulo AS Articulo\nFROM Revista r\nLEFT JOIN Articulo a\n  ON a.IdRevista = r.IdRevista\nWHERE a.IdArticulo IS NULL;"),
    sug: ['Ejemplo', 'GROUP BY y HAVING', '¿Qué código SQL practico?'] },
  { id: 'agregacion', claves: ['group by', 'having', 'sum', 'avg', 'count', 'promedio', 'agrupar', 'agregacion', 'funciones de agregado'],
    info: () => '<b>GROUP BY</b> agrupa filas y las funciones <b>COUNT, SUM, AVG, MIN, MAX</b> calculan por grupo. <b>HAVING</b> filtra los grupos ya calculados (WHERE filtra filas antes de agrupar).',
    reco: () => '👉 Regla fácil: filtra filas con <b>WHERE</b>, filtra resultados agrupados con <b>HAVING</b>. Practícalo con las preguntas 14 a 20 del cuestionario.',
    ejemplo: () => botCod("SELECT r.Titulo, AVG(e.EjemplaresVendidos) AS Prom\nFROM Revista r\nJOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo\nHAVING AVG(e.EjemplaresVendidos) > 5000;"),
    sug: ['Ejemplo', 'JOIN', 'Funciones de ventana'] },
  { id: 'ventana', claves: ['rank', 'ntile', 'over', 'funcion de ventana', 'funciones de ventana', 'window', 'row_number'],
    info: () => 'Las <b>funciones de ventana</b> (RANK, NTILE, SUM() OVER) calculan sobre un conjunto de filas sin colapsarlas como GROUP BY. Sirven para rankings y acumulados.',
    reco: () => '👉 Para rankings usa <b>RANK()</b>; para dividir en grupos (alto/medio/bajo) usa <b>NTILE(3)</b>; para acumulados <b>SUM() OVER (ORDER BY …)</b>. Mira las preguntas 29 a 32 del cuestionario.',
    ejemplo: () => botCod("SELECT r.Titulo,\n  SUM(e.EjemplaresVendidos) AS Total,\n  RANK() OVER (ORDER BY SUM(e.EjemplaresVendidos) DESC) AS Pos\nFROM Revista r\nJOIN Ejemplar e ON e.IdRevista = r.IdRevista\nGROUP BY r.Titulo;"),
    sug: ['Ejemplo', 'GROUP BY y HAVING'] },
  { id: 'subconsulta', claves: ['subconsulta', 'subquery', 'anidada', 'consulta anidada'],
    info: () => 'Una <b>subconsulta</b> es un SELECT dentro de otro. Se usa en WHERE, HAVING o como columna calculada, por ejemplo para comparar contra el promedio general.',
    reco: () => '👉 Úsala cuando necesitas un valor intermedio (promedio general, máximo). Si se vuelve difícil de leer, prueba un <b>JOIN</b> o una <b>CTE</b> (<code>WITH</code>).',
    sug: ['JOIN', 'Funciones de ventana'] },
  { id: 'sql', claves: ['sql', 'consulta', 'select', 'query', 'ddl', 'dml', 'insert', 'update', 'delete'],
    info: () => '<b>SQL</b> es el lenguaje de las bases relacionales: <b>DDL</b> define (CREATE, ALTER, DROP), <b>DML</b> manipula (INSERT, UPDATE, DELETE, SELECT), <b>DCL</b> da permisos (GRANT, REVOKE) y <b>TCL</b> controla transacciones (COMMIT, ROLLBACK).',
    reco: () => '📚 Orden recomendado: 1) <b>SELECT/WHERE/ORDER BY</b>, 2) <b>JOIN</b>, 3) <b>GROUP BY/HAVING</b>, 4) <b>subconsultas</b>, 5) <b>funciones de ventana</b>. Practica con tu cuestionario 1-40.',
    ejemplo: () => botCod("SELECT Nombre, Apellidos\nFROM Empleado\nWHERE IdSucursal = 1\nORDER BY Apellidos;"),
    sug: ['JOIN', 'GROUP BY y HAVING', '¿Qué código SQL practico?'] },

  // ===== Diseño =====
  { id: 'claves', claves: ['clave primaria', 'primary key', 'pk', 'clave foranea', 'foreign key', 'fk', 'llave primaria', 'llave foranea', 'restriccion', 'constraint', 'unique', 'integridad', 'check'],
    info: () => '<b>PRIMARY KEY</b> identifica cada fila de forma única; <b>FOREIGN KEY</b> enlaza con otra tabla y garantiza integridad referencial; <b>UNIQUE</b> evita duplicados; <b>CHECK</b> valida reglas (ej. Precio ≥ 0); <b>DEFAULT</b> da un valor inicial.',
    reco: () => '✅ Buenas prácticas: usa <b>INT IDENTITY</b> como PK, nombra tus restricciones (<code>PK_</code>, <code>FK_</code>, <code>UQ_</code>, <code>CHK_</code>) y usa <b>CHECK</b> para reglas del negocio, como hiciste en tus modelos físicos.',
    por: () => 'Nombrarlas facilita leer los errores y modificar o borrar la restricción después.',
    ejemplo: () => botCod("CONSTRAINT PK_Cliente PRIMARY KEY (IdCliente),\nCONSTRAINT UQ_Cliente_NIF UNIQUE (NIF),\nCONSTRAINT CHK_Precio CHECK (Precio >= 0)"),
    sug: ['Ejemplo', 'Modelo físico', 'Normalización'] },
  { id: 'fisico', claves: ['modelo fisico', 'modelamiento fisico', 'modelado fisico', 'tipo de dato', 'tipos de datos', 'esquema', 'schema', 'create table', 'identity', 'autoincrement', 'modelamiento', 'modelado'],
    info: () => 'El <b>modelo físico</b> convierte tu diseño lógico en tablas reales del gestor: tipos de datos, claves, restricciones, índices y <b>esquemas</b> para organizar objetos (ej. <code>Catalogo</code>, <code>Academico</code>, <code>Tramite</code> en tu Actividad 1).',
    reco: () => '✅ Recomendaciones: elige el tipo más pequeño que alcance (<b>TINYINT</b> para catálogos, <b>INT</b> para entidades grandes), <b>DECIMAL(10,2)</b> para dinero, <b>VARCHAR</b> con longitud realista y separa por <b>esquemas</b>.',
    ejemplo: () => botCod("CREATE SCHEMA Empresa;\nGO\nCREATE TABLE Empresa.Equipo (\n  IdEquipo INT IDENTITY(1,1) NOT NULL,\n  Precio DECIMAL(10,2) NOT NULL,\n  CONSTRAINT PK_Equipo PRIMARY KEY (IdEquipo)\n);"),
    sug: ['Ejemplo', 'Claves y restricciones', 'Mecanismos de integración'] },
  { id: 'normalizacion', claves: ['normalizacion', 'normalizar', '1fn', '2fn', '3fn', 'forma normal', 'formas normales', 'bcnf', 'redundancia'],
    info: () => '<b>Normalizar</b> reduce la redundancia y evita anomalías. <b>1FN:</b> valores atómicos. <b>2FN:</b> sin dependencias parciales de la clave. <b>3FN:</b> sin dependencias transitivas.',
    reco: () => '✅ Normaliza hasta <b>3FN</b> en sistemas transaccionales. Solo desnormaliza con un motivo claro de rendimiento, por ejemplo reportes pesados.',
    sug: ['Modelo entidad-relación', 'Claves y restricciones'] },
  { id: 'er', claves: ['entidad relacion', 'modelo er', 'diagrama er', 'cardinalidad', 'relacion muchos', 'n m', 'uno a muchos', 'erd', 'diagrama entidad', 'muchos a muchos'],
    info: () => 'El <b>modelo entidad-relación</b> representa entidades, atributos y relaciones con su <b>cardinalidad</b> (1:1, 1:N, N:M). Una relación <b>N:M</b> se resuelve con una <b>tabla intermedia</b>, como <code>SucursalRevista</code> o <code>EquipoComponente</code> en tus actividades.',
    reco: () => '✅ Pasos: 1) identifica entidades, 2) define claves, 3) fija cardinalidades, 4) resuelve N:M con tabla intermedia, 5) pasa al modelo físico.',
    sug: ['Modelo físico', 'Normalización', 'Caso Cadena Editorial'] },
  { id: 'indices', claves: ['indice', 'index', 'rendimiento', 'optimizar', 'optimizacion', 'lento', 'performance'],
    info: () => 'Un <b>índice</b> acelera las búsquedas, como el índice de un libro 📖. Cuesta espacio y hace un poco más lentos los INSERT/UPDATE. SQL Server crea uno automático en cada PRIMARY KEY.',
    reco: () => '✅ Indexa columnas de <b>FOREIGN KEY</b>, de <b>WHERE</b> frecuentes y de <b>JOIN</b>. No indexes todo ni columnas que casi no se consultan.',
    ejemplo: () => botCod("CREATE INDEX IX_Articulo_IdRevista\n  ON Articulo (IdRevista);"),
    sug: ['Ejemplo', 'Transacciones'] },
  { id: 'programables', claves: ['vista', 'procedimiento almacenado', 'stored procedure', 'trigger', 'disparador', 'funcion almacenada', 'procedimientos'],
    info: () => '<b>Vista:</b> consulta guardada como tabla virtual. <b>Procedimiento almacenado:</b> bloque de código reutilizable. <b>Trigger:</b> código que se ejecuta solo ante un INSERT/UPDATE/DELETE.',
    reco: () => '✅ Vistas para simplificar reportes, procedimientos para lógica reutilizable y segura, triggers solo para auditoría o reglas que no se pueden hacer con restricciones.',
    sug: ['Índices', 'Transacciones'] },
  { id: 'transacciones', claves: ['transaccion', 'acid', 'commit', 'rollback', 'concurrencia'],
    info: () => 'Una <b>transacción</b> agrupa operaciones que se ejecutan completas o no se ejecutan (<b>COMMIT / ROLLBACK</b>). Cumple <b>ACID</b>: Atomicidad, Consistencia, Aislamiento y Durabilidad.',
    reco: () => '✅ Usa transacciones cuando varias tablas deben cambiar juntas (ej. una compra y su detalle). Mantenlas cortas para no bloquear a otros usuarios.',
    ejemplo: () => botCod("BEGIN TRANSACTION;\n  INSERT INTO Compra (...) VALUES (...);\n  INSERT INTO DetalleCompra (...) VALUES (...);\nCOMMIT;"),
    sug: ['Ejemplo', 'Backup'] },
  { id: 'seguridad', claves: ['backup', 'respaldo', 'restaurar', 'seguridad', 'login', 'permisos', 'usuarios', 'roles'],
    info: () => 'En SQL Server la seguridad usa <b>logins, usuarios y roles</b> con permisos GRANT/DENY. Los <b>backups</b> (completo, diferencial y de log) protegen tus datos ante fallos.',
    reco: () => '✅ Haz <b>backup completo</b> periódico, guárdalo fuera del servidor, prueba restaurarlo y da a cada usuario solo los permisos mínimos.',
    ejemplo: () => botCod("BACKUP DATABASE CadenaEditorial\n  TO DISK = 'D:\\Backups\\CadenaEditorial.bak';"),
    sug: ['Ejemplo', 'Transacciones'] },
  { id: 'arquitectura', claves: ['arquitectura', 'cliente servidor', 'capas', 'nube', 'on premise', 'cloud', 'azure', 'despliegue', 'infraestructura'],
    info: () => 'La arquitectura típica es <b>cliente-servidor en 3 capas</b>: presentación, lógica de negocio y datos. El motor puede estar <b>on-premise</b> (tu servidor) o en la <b>nube</b> (Azure SQL, AWS RDS).',
    reco: () => '✅ Para aprender: instala el motor <b>local</b>. Para producción: la <b>nube</b> da respaldos y escalabilidad automáticos; <b>on-premise</b> da más control y puede ser mejor si hay normas de datos estrictas.',
    sug: ['¿Qué gestor me recomiendas?', '¿Cómo lo instalo?'] },
  { id: 'instalacion', claves: ['instalar', 'instalacion', 'descargar', 'setup', 'configurar', 'entorno', 'instalo'],
    info: () => 'Para instalar SQL Server: descarga <b>SQL Server Developer</b>, instala el motor y luego <b>SSMS</b>. Conéctate con <code>localhost</code> o <code>.\\SQLEXPRESS</code> y prueba con <code>SELECT @@VERSION;</code>',
    reco: () => '✅ Instala <b>Developer</b> (gratis, completo) o <b>Express</b> si tu PC es modesta, y usa <b>SSMS</b> para administrar. Revisa el manual de instalación en tu Semana 2.',
    obras: [/instalacion|manual/],
    sug: ['Ver Semana 2', '¿Por qué SQL Server?'] },

  // ===== Curso y recomendaciones del portafolio =====
  { id: 'editorial', claves: ['cadena editorial', 'editorial', 'revista', 'revistas', 'caso de estudio', 'sucursal', 'periodista', 'articulo'],
    info: () => '📰 La <b>Cadena Editorial</b> (Semana 4) tiene <b>8 tablas</b>: Sucursal, Empleado, Revista, SucursalRevista, Periodista, Artículo, SeccionFija y Ejemplar. Una sucursal publica varias revistas y una revista se publica en varias sucursales: relación <b>N:M</b> con <code>SucursalRevista</code>.<br>Tus scripts crean la base <code>CadenaEditorial</code>, cargan datos (20 sucursales, empleados, revistas, periodistas y artículos; 12 secciones fijas y 10 ejemplares) y resuelven <b>40 preguntas</b> de consulta.',
    reco: () => '✅ Para dominarlo: crea la BD y las tablas, carga los datos (seeding) y resuelve las 40 preguntas del cuestionario en ese orden.',
    obras: [/cadena editorial/, /cuestionario/, /editorial/],
    sug: ['¿Qué código SQL practico?', 'Ver Semana 4'] },
  { id: 'estudiar', claves: ['estudiar', 'aprender', 'ruta', 'plan de estudio', 'como empiezo', 'principiante', 'por donde', 'empezar', 'repasar', 'estudio mejor'],
    info: () => 'botRutaEstudio',
    reco: () => 'botRutaEstudio',
    sug: ['¿Qué código SQL practico?', 'Ayuda'] },
  { id: 'practica', claves: ['cuestionario', 'practicar', 'ejercicios', 'preguntas', 'practica', 'codigo sql', 'scripts', 'ejemplos de codigo'],
    info: () => 'botCodigosSQL',
    reco: () => 'botCodigosSQL',
    sug: ['JOIN', 'GROUP BY y HAVING'] },
  { id: 'semanas', claves: ['semana', 'semanas', 'curso', 'unidad', 'temario', 'portafolio', 'contenido', 'que hay'],
    info: () => 'botListaSemanas',
    reco: () => 'botListaSemanas',
    sug: ['¿Cómo estudio mejor?'] }
];

// ---------- Respuestas dinámicas basadas en TU portafolio ----------
function botListaSemanas() {
  const nums = botSemanasConContenido();
  if (nums.length === 0) return { html: 'Aún no hay semanas con contenido en el portafolio.' };
  return {
    html: `📚 Semanas con contenido: <b>${nums.map(n => 'S' + n).join(', ')}</b>. Toca una para ver sus archivos:`,
    chips: nums.map(n => ({ label: `Semana ${n}`, fn: () => botShowWeek(n) }))
  };
}

function botCodigosSQL() {
  const lista = botActividadesConSQL();
  if (lista.length === 0) {
    return { html: '💻 Todavía no hay código SQL cargado en las actividades. Puedes agregarlo desde el panel de administrador.' };
  }
  return {
    html: `💻 Te recomiendo practicar con el código SQL de tus propias actividades. Toca uno para abrirlo con su visor:`,
    chips: lista.map(a => ({
      label: `S${a.semana} · ${a.titulo.length > 26 ? a.titulo.slice(0, 24) + '…' : a.titulo}`,
      fn: () => openSqlModal(a.clave, a.idx)
    }))
  };
}

function botRutaEstudio() {
  const nums = botSemanasConContenido();
  const ultima = nums.length ? nums[nums.length - 1] : null;
  const conSQL = botActividadesConSQL();
  let html = `🧭 <b>Ruta que te recomiendo:</b><br>1) Repasa el <b>modelo E-R</b> y la <b>normalización</b>.<br>2) Pasa al <b>modelo físico</b> (claves y restricciones).<br>3) Practica <b>SQL</b>: SELECT → JOIN → GROUP BY → ventanas.<br>4) Cierra con <b>índices, transacciones y backups</b>.`;
  if (ultima) html += `<br><br>📌 Tu contenido más reciente es la <b>Semana ${ultima}</b>: buen punto para repasar.`;
  if (conSQL.length) html += ` Y tienes ${conSQL.length} actividad${conSQL.length > 1 ? 'es' : ''} con código SQL para practicar.`;
  const chips = [];
  if (ultima) chips.push({ label: `Ver Semana ${ultima}`, fn: () => botShowWeek(ultima) });
  return { html, chips };
}


// ---------- Trabajos subidos al portafolio (datos reales) ----------
function botObras(patrones) {
  const out = [];
  botSemanasConContenido().forEach(n => {
    const clave = `Semana ${n}`;
    ((semanasInfo[clave] && semanasInfo[clave].actividades) || []).forEach((act, i) => {
      if (patrones.some(p => p.test(botNorm(act.pdfTitulo)))) out.push({ semana: n, clave, idx: i, act });
    });
  });
  return out;
}

function botChipsObras(patrones) {
  const chips = [];
  botObras(patrones).slice(0, 3).forEach(o => {
    const t = o.act.pdfTitulo || 'Archivo';
    chips.push({ label: `📄 S${o.semana} · ${t.length > 28 ? t.slice(0, 26) + '…' : t}`, fn: () => window.open(o.act.pdfRuta, '_blank', 'noopener') });
    if (obtenerScriptsSQL(o.clave, o.act).length > 0) {
      chips.push({ label: `💻 Código SQL S${o.semana}`, fn: () => openSqlModal(o.clave, o.idx) });
    }
  });
  return chips;
}

const botPalabrasVacias = ['que', 'como', 'cual', 'cuales', 'para', 'sobre', 'tengo', 'hay', 'mis', 'una', 'uno', 'los', 'las', 'del', 'con', 'por', 'base', 'bases', 'datos', 'quiero', 'saber', 'dime', 'explicame', 'hablame', 'tema', 'trabajo', 'semana', 'unidad', 'modelado', 'preguntas'];

function botBuscarObras(q) {
  const palabras = q.split(' ').filter(w => w.length >= 4 && !botPalabrasVacias.includes(w));
  if (palabras.length === 0) return [];
  const hallados = [];
  botSemanasConContenido().forEach(n => {
    const clave = `Semana ${n}`;
    ((semanasInfo[clave] && semanasInfo[clave].actividades) || []).forEach((act, i) => {
      const titulo = botNorm(act.pdfTitulo);
      const puntos = palabras.filter(w => titulo.includes(w.replace(/(es|s)$/, ''))).length;
      if (puntos > 0) hallados.push({ semana: n, clave, idx: i, act, puntos });
    });
  });
  return hallados.sort((a, b) => b.puntos - a.puntos).slice(0, 4);
}

function botListaTrabajos() {
  const nums = botSemanasConContenido();
  if (nums.length === 0) return { html: 'Aún no hay trabajos subidos al portafolio.' };
  let html = '📂 <b>Trabajos de tu portafolio:</b><br>';
  nums.forEach(n => {
    const info = semanasInfo[`Semana ${n}`];
    html += `<br><b>Semana ${n}</b>${info.tituloSemana ? ' · ' + escaparHTML(info.tituloSemana) : ''}<br>`;
    (info.actividades || []).forEach(a => {
      html += `• ${escaparHTML(a.pdfTitulo || 'Archivo')}${obtenerScriptsSQL(`Semana ${n}`, a).length ? ' 💻' : ''}<br>`;
    });
  });
  html += '<br>💻 = tiene código SQL. Toca una semana para abrirla:';
  return { html, chips: nums.map(n => ({ label: `Semana ${n}`, fn: () => botShowWeek(n) })) };
}

const botFuncionesDinamicas = { botListaSemanas, botCodigosSQL, botRutaEstudio, botListaTrabajos };

function botEvaluar(v) {
  const r = typeof v === 'function' ? v() : v;
  const base = botElegir(r);
  if (typeof base === 'string' && botFuncionesDinamicas[base]) return botFuncionesDinamicas[base]();
  return { html: base };
}

// ---------- Detección de tema + recomendación ----------
function botDetectarTema(q) {
  let mejor = null, mejorPuntos = 0;
  botTemas.forEach(t => {
    let p = 0;
    t.claves.forEach(k => { if (botTiene(q, k)) p += (k.length > 6 ? 2 : 1); });
    if (p > mejorPuntos) { mejorPuntos = p; mejor = t; }
  });
  return mejor;
}

function botPideRecomendacion(q) {
  return /recomien|recomend|sugier|sugerenc|aconsej|cual (es )?(el )?(mejor|me conviene|conviene)|que (me )?conviene|cual (usar|elegir|escoger|uso|elijo|escojo|debo)|que (uso|elijo|escojo|debo usar)|mejor opcion/.test(q);
}

function botMostrar(res, sug) {
  appendBotMessage(res.html);
  const chips = [];
  (res.chips || []).forEach(c => chips.push(c));
  (sug || []).forEach(s => chips.push({ label: s, fn: () => botEnviar(s), suave: true }));
  if (chips.length) botChips(chips);
}

function botChips(lista) {
  const box = document.getElementById('botMessages');
  if (!box) return;
  const cont = document.createElement('div');
  cont.className = 'bot-chips';
  lista.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'bot-week-btn' + (c.suave ? ' bot-chip-suave' : '');
    b.textContent = c.label;
    b.addEventListener('click', () => {
      cont.querySelectorAll('button').forEach(x => { x.disabled = true; });
      cont.classList.add('usado');
      c.fn();
    });
    cont.appendChild(b);
  });
  box.appendChild(cont);
  box.scrollTop = box.scrollHeight;
}

function botEscribiendo(on) {
  const box = document.getElementById('botMessages');
  if (!box) return;
  const previo = document.getElementById('botTyping');
  if (previo) previo.remove();
  if (!on) return;
  const d = document.createElement('div');
  d.id = 'botTyping';
  d.className = 'bot-msg msg-bot bot-typing';
  d.innerHTML = '<span></span><span></span><span></span>';
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function botResponder(txt) {
  const q = botNorm(txt);
  botCtx.turnos++;

  // Nombre
  const mNombre = q.match(/(?:me llamo|mi nombre es)\s+([a-z]+)/);
  if (mNombre) {
    botCtx.nombre = mNombre[1].charAt(0).toUpperCase() + mNombre[1].slice(1);
    appendBotMessage(`¡Mucho gusto, <b>${botCtx.nombre}</b>! 🤖 Cuéntame qué tema de bases de datos quieres ver o pídeme una recomendación.`);
    botChips([{ label: '¿Qué me recomiendas?', fn: () => botEnviar('¿Qué me recomiendas?'), suave: true }, { label: 'Ayuda', fn: () => botEnviar('Ayuda'), suave: true }]);
    return;
  }

  // Semana / unidad / resumen (datos reales)
  const mSemana = q.match(/semana\s*(\d{1,2})/);
  const mUnidad = q.match(/unidad\s*(\d)/);
  if (mSemana && +mSemana[1] >= 1 && +mSemana[1] <= 16) { botShowWeek(+mSemana[1]); return; }
  if (mUnidad && +mUnidad[1] >= 1 && +mUnidad[1] <= 4) {
    const u = +mUnidad[1];
    const nums = semanasDeUnidad(u);
    appendBotMessage(nums.length > 0
      ? `✅ Unidad ${u}: selecciona una semana:${botonesSemanasHTML(nums)}`
      : `⚠️ La Unidad ${u} todavía no tiene semanas con contenido.`);
    return;
  }
  if (/\bresumen\b/.test(q)) { botSelectOption('resumen'); return; }

  const ctxTema = botCtx.tema ? botTemas.find(t => t.id === botCtx.tema) : null;
  const pideReco = botPideRecomendacion(q);
  let tema = botDetectarTema(q);

  // Comparación entre 2 o más gestores (ej. "¿cuál es mejor, MySQL o PostgreSQL?")
  const gestores = ['sqlserver', 'mysql', 'postgres', 'oracle', 'nosql']
    .map(id => botTemas.find(t => t.id === id))
    .filter(t => t.claves.some(k => botTiene(q, k)));
  if (gestores.length >= 2) {
    const nombres = { sqlserver: 'SQL Server', mysql: 'MySQL', postgres: 'PostgreSQL', oracle: 'Oracle', nosql: 'NoSQL' };
    botCtx.tema = 'dbms';
    botMostrar({
      html: '⚖️ <b>Comparación rápida:</b><br>' +
        gestores.map(g => `• <b>${nombres[g.id]}</b>: elígelo ${g.cuando}.`).join('<br>') +
        '<br><br>Para <b>Base de Datos II</b> te recomiendo <b>SQL Server</b>; fuera del curso, depende de tu proyecto.'
    }, ['¿Qué gestor me recomiendas?', '¿Cómo lo instalo?']);
    return;
  }

  // Seguimientos: "por qué" y "ejemplo" (del tema actual o del que menciones)
  const refTema = (tema && tema.id !== 'saludo') ? tema : ctxTema;
  if (/^(y )?(por ?que|porque|y eso|como asi|a que se debe)/.test(q)) {
    const t = (tema && tema.por) ? tema : (ctxTema && ctxTema.por ? ctxTema : null);
    if (t) { botCtx.tema = t.id; botMostrar(botEvaluar(t.por), t.sug); return; }
  }
  if (/ejemplo|muestrame|demuestra|codigo de ejemplo|como se hace|como se escribe/.test(q)) {
    const t = (tema && tema.ejemplo) ? tema : (refTema && refTema.ejemplo ? refTema : null);
    if (t) {
      botCtx.tema = t.id;
      botMostrar({ html: 'Aquí tienes un ejemplo:' + botEvaluar(t.ejemplo).html }, t.sug);
      return;
    }
  }

  // Recomendación sin tema claro
  if (!tema && pideReco) {
    if (ctxTema && ctxTema.grupoReco) {
      tema = botTemas.find(t => t.id === ctxTema.grupoReco);
    } else if (ctxTema && ctxTema.reco) {
      tema = ctxTema;
    } else {
      appendBotMessage('Con gusto te recomiendo 😊 ¿Sobre qué área?');
      botChips([
        { label: 'Gestor de BD', fn: () => botEnviar('¿Qué gestor me recomiendas?') },
        { label: 'Qué estudiar', fn: () => botEnviar('¿Cómo estudio mejor?') },
        { label: 'Código SQL', fn: () => botEnviar('¿Qué código SQL practico?') },
        { label: 'Instalación', fn: () => botEnviar('¿Cómo lo instalo?') }
      ]);
      return;
    }
  }

  if (!tema) {
    const hallados = botBuscarObras(q);
    if (hallados.length > 0) {
      botMostrar({
        html: '🔎 Encontré esto en tus trabajos del portafolio:',
        chips: hallados.map(o => ({
          label: `📄 S${o.semana} · ${(o.act.pdfTitulo || 'Archivo').length > 28 ? o.act.pdfTitulo.slice(0, 26) + '…' : o.act.pdfTitulo}`,
          fn: () => window.open(o.act.pdfRuta, '_blank', 'noopener')
        }))
      }, ['Mis trabajos']);
      return;
    }
    appendBotMessage(botElegir([
      'Mmm, no estoy seguro de haberte entendido 🤔. Puedo hablar de gestores, SQL, claves, normalización, índices… o recomendarte qué estudiar.',
      'Beep-boop, esa no la tengo clara 🤖. Prueba preguntarme por un tema (ej. "JOIN", "SQL Server") o escribe "ayuda".'
    ]));
    botChips([
      { label: 'Ayuda', fn: () => botEnviar('Ayuda'), suave: true },
      { label: '¿Qué me recomiendas?', fn: () => botEnviar('¿Qué me recomiendas?'), suave: true }
    ]);
    return;
  }

  // Responder
  botCtx.tema = ['saludo', 'gracias', 'despedida', 'estado', 'chiste', 'autor', 'quien', 'ayuda'].includes(tema.id) ? botCtx.tema : tema.id;
  const usaReco = (pideReco || /cual (es )?mejor|conviene/.test(q)) && tema.reco;
  botCtx.modo = usaReco ? 'reco' : 'info';
  const res = botEvaluar(usaReco ? tema.reco : tema.info);
  if (tema.obras) res.chips = (res.chips || []).concat(botChipsObras(tema.obras));
  botMostrar(res, tema.sug);
}

function botEnviar(txt) {
  document.querySelectorAll('#botMessages .bot-chips').forEach(c => c.remove());
  appendBotMessage(escaparHTML(txt), true);
  botEscribiendo(true);
  setTimeout(() => {
    botEscribiendo(false);
    botResponder(txt);
  }, 450 + Math.floor(Math.random() * 450));
}

function sendBotUserMsg() {
  const input = document.getElementById('botInput');
  if (!input) return;
  const txt = input.value.trim();
  if (!txt) return;
  input.value = '';
  botEnviar(txt);
}

function handleBotKey(e) {
  if (e.key === 'Enter') sendBotUserMsg();
}

// ==========================================
// 6. SUBIDA Y GESTIÓN EN DASHBOARD (FIREBASE STORAGE & FIRESTORE)
// ==========================================
let tipoSubidaActual = 'archivo';

function cambiarTipoSubida(tipo) {
  tipoSubidaActual = tipo;
  const btnArc = document.getElementById('btn-tipo-archivo');
  const btnLnk = document.getElementById('btn-tipo-enlace');
  const areaArc = document.getElementById('dashAreaArchivo');
  const areaLnk = document.getElementById('dashAreaEnlace');

  if (tipo === 'archivo') {
    if (btnArc) btnArc.classList.add('active');
    if (btnLnk) btnLnk.classList.remove('active');
    if (areaArc) areaArc.style.display = 'block';
    if (areaLnk) areaLnk.style.display = 'none';
  } else {
    if (btnLnk) btnLnk.classList.add('active');
    if (btnArc) btnArc.classList.remove('active');
    if (areaArc) areaArc.style.display = 'none';
    if (areaLnk) areaLnk.style.display = 'block';
  }
}

function mostrarNombreArchivo(input) {
  const display = document.getElementById('dashFileNameDisplay');
  if (input.files && input.files[0] && display) {
    display.textContent = `📁 Seleccionado: ${input.files[0].name}`;
  }
}

function inicializarDragAndDrop() {
  const dropzone = document.getElementById('dashAreaArchivo');
  const fileInput = document.getElementById('dashFileInput');
  if (!dropzone || !fileInput) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.style.background = document.body.classList.contains('glow-red') ? 'rgba(255, 0, 60, 0.2)' : 'rgba(0, 242, 254, 0.2)';
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.style.background = '';
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      fileInput.files = files;
      mostrarNombreArchivo(fileInput);
    }
  }, false);
}

async function subirTrabajoDashboard() {
  const selectElem = document.getElementById('dashSelectUnidadSemana');
  if (!selectElem) return;

  const semana = selectElem.value;
  const desc = document.getElementById('dashInputDesc').value.trim();
  let tituloFinal = desc;
  let rutaFinal = '#';

  const btnSubir = document.getElementById('btnSubirDashboard');

  if (tipoSubidaActual === 'archivo') {
    const fileInput = document.getElementById('dashFileInput');
    
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Por favor selecciona un archivo haciendo clic en la casilla.');
      return;
    }
    
    const file = fileInput.files[0];
    if (!tituloFinal) tituloFinal = file.name;

    try {
      if (btnSubir) {
        btnSubir.disabled = true;
        btnSubir.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo a Firebase...';
      }

      // 1. Subir archivo físico a Firebase Storage
      const storageRef = ref(storage, `entregas/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      
      // 2. Obtener enlace web público
      rutaFinal = await getDownloadURL(snapshot.ref);

      await guardarActividad(semana, tituloFinal, rutaFinal, 'archivo');

    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al subir el archivo a Firebase.');
    } finally {
      if (btnSubir) {
        btnSubir.disabled = false;
        btnSubir.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket"></i> Subir Trabajo';
      }
    }

  } else {
    const urlInput = document.getElementById('dashInputUrl').value.trim();
    if (!urlInput) {
      alert('Por favor ingresa un enlace válido.');
      return;
    }
    if (!tituloFinal) tituloFinal = 'Enlace de recurso registrado';
    rutaFinal = urlInput;
    
    await guardarActividad(semana, tituloFinal, rutaFinal, 'enlace');
  }
}

async function guardarActividad(semana, titulo, ruta, tipo) {
  if (!semanasInfo[semana]) semanasInfo[semana] = { actividades: [] };
  if (!semanasInfo[semana].actividades) semanasInfo[semana].actividades = [];

  semanasInfo[semana].actividades.unshift({
    actividad: `ACTIVIDAD 0${semanasInfo[semana].actividades.length + 1}`,
    pdfTitulo: titulo,
    pdfRuta: ruta,
    tipo: tipo
  });

  await guardarEnLocalStorage();

  // Limpiar campos
  document.getElementById('dashInputDesc').value = '';
  document.getElementById('dashFileInput').value = '';
  const urlInput = document.getElementById('dashInputUrl');
  if (urlInput) urlInput.value = '';
  const displayFile = document.getElementById('dashFileNameDisplay');
  if (displayFile) displayFile.textContent = '';

  alert(`¡Trabajo subido con éxito a Firebase (${semana})!`);
  renderizarTablaDashboard();
  refrescarSQLAdmin();
}

function renderizarTablaDashboard() {
  const tbody = document.getElementById('dashTablaBody');
  const filtroElem = document.getElementById('dashFiltroSemana');
  if (!tbody || !filtroElem) return;

  const filtro = filtroElem.value;
  tbody.innerHTML = '';
  let totalSubidos = 0;

  Object.keys(semanasInfo).forEach(sem => {
    if (filtro === 'todas' || filtro === sem) {
      const info = semanasInfo[sem];
      if (info.actividades) {
        info.actividades.forEach((act, index) => {
          totalSubidos++;
          const tr = document.createElement('tr');
          const icono = act.tipo === 'enlace' ? '🔗' : '📄';
          const insigniaSQL = obtenerScriptsSQL(sem, act).length > 0
            ? ' <span class="sql-badge" title="Tiene código SQL"><i class="fa-solid fa-database"></i> SQL</span>' : '';
          
          tr.innerHTML = `
            <td><strong>${sem}</strong></td>
            <td>
              <a href="${act.pdfRuta}" target="_blank" rel="noopener noreferrer">
                ${icono} ${act.pdfTitulo}
              </a>${insigniaSQL}
            </td>
            <td style="text-align: center;">
              <button class="btn-delete-act" onclick="eliminarTrabajoDashboard('${sem}', ${index})" title="Eliminar trabajo">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }
    }
  });

  const totalDisplay = document.getElementById('dashTotalCount');
  const pendingDisplay = document.getElementById('dashPendingCount');

  if (totalDisplay) totalDisplay.textContent = totalSubidos;
  if (pendingDisplay) pendingDisplay.textContent = '0';
}

async function eliminarTrabajoDashboard(semana, index) {
  if (confirm(`¿Estás seguro de eliminar este trabajo de la ${semana}?`)) {
    if (semanasInfo[semana] && semanasInfo[semana].actividades) {
      semanasInfo[semana].actividades.splice(index, 1);
      await guardarEnLocalStorage();
      renderizarTablaDashboard();
      refrescarSQLAdmin();
    }
  }
}

// ==========================================
// 7. EDICIÓN DE NOMBRES CON GUARDADO PERMANENTE
// ==========================================
function cargarNombreEnInput() {
  const selectVal = document.getElementById('dashEditSelect').value;
  const inputTitulo = document.getElementById('dashInputNuevoTitulo');
  const inputDesc = document.getElementById('dashInputNuevaDesc');
  const groupDesc = document.getElementById('groupDescUnidad');

  if (selectVal.startsWith('U')) {
    groupDesc.style.display = 'block';
    const unitNum = selectVal.replace('U', '');
    const unitKey = `unit${unitNum}`;

    if (unidadesInfo[unitKey]) {
      inputTitulo.value = unidadesInfo[unitKey].titulo || '';
      inputDesc.value = unidadesInfo[unitKey].desc || '';
    } else {
      const h3Elem = document.querySelector(`#${unitKey} .unit-info h3`);
      const pElem = document.querySelector(`#${unitKey} .unit-info p`);
      inputTitulo.value = h3Elem ? h3Elem.innerText.trim() : '';
      inputDesc.value = pElem ? pElem.innerText.trim() : '';
    }
  } else {
    groupDesc.style.display = 'none';
    inputTitulo.value = (semanasInfo[selectVal] && semanasInfo[selectVal].tituloSemana) 
      ? semanasInfo[selectVal].tituloSemana 
      : '';
  }
}

async function guardarCambiosNombreDashboard() {
  const selectVal = document.getElementById('dashEditSelect').value;
  const nuevoTitulo = document.getElementById('dashInputNuevoTitulo').value.trim();
  const nuevaDesc = document.getElementById('dashInputNuevaDesc').value.trim();

  if (!nuevoTitulo) {
    alert('Por favor, ingresa un título válido.');
    return;
  }

  if (selectVal.startsWith('U')) {
    const unitNum = selectVal.replace('U', '');
    const unitKey = `unit${unitNum}`;

    unidadesInfo[unitKey] = { titulo: nuevoTitulo, desc: nuevaDesc };
    await guardarEnLocalStorage();
    aplicarCambiosGuardadosUI();

    alert(`¡Unidad ${unitNum} actualizada con éxito!`);
  } else {
    if (!semanasInfo[selectVal]) semanasInfo[selectVal] = { actividades: [] };
    semanasInfo[selectVal].tituloSemana = nuevoTitulo;

    await guardarEnLocalStorage();
    aplicarCambiosGuardadosUI();

    alert(`¡${selectVal} actualizada con éxito!`);
  }
}

// Exponer funciones globales al objeto window para ser llamadas desde los eventos onclick de HTML
window.triggerHyperspaceLogin = triggerHyperspaceLogin;
window.closeLoginModal = closeLoginModal;
window.validarLogin = validarLogin;
window.irAlPortal = irAlPortal;
window.togglePasswordVisibility = togglePasswordVisibility;
window.toggleRedTheme = toggleRedTheme;
window.openSqlModal = openSqlModal;
window.closeSqlModal = closeSqlModal;
window.copySqlCode = copySqlCode;
window.downloadSqlCode = downloadSqlCode;
window.toggleFlip = toggleFlip;
window.openWeekModal = openWeekModal;
window.closeWeekModal = closeWeekModal;
window.toggleChatbot = toggleChatbot;
window.botSelectOption = botSelectOption;
window.botSelectUnit = botSelectUnit;
window.botShowWeek = botShowWeek;
window.sendBotUserMsg = sendBotUserMsg;
window.handleBotKey = handleBotKey;
window.cambiarTipoSubida = cambiarTipoSubida;
window.mostrarNombreArchivo = mostrarNombreArchivo;
window.subirTrabajoDashboard = subirTrabajoDashboard;
window.renderizarTablaDashboard = renderizarTablaDashboard;
window.eliminarTrabajoDashboard = eliminarTrabajoDashboard;
window.cargarNombreEnInput = cargarNombreEnInput;
window.guardarCambiosNombreDashboard = guardarCambiosNombreDashboard;
window.refrescarSQLAdmin = refrescarSQLAdmin;
window.cargarScriptsSQLAdmin = cargarScriptsSQLAdmin;
window.agregarSlotSQLAdmin = agregarSlotSQLAdmin;
window.guardarCodigoSQLDashboard = guardarCodigoSQLDashboard;

// ==========================================
// 8. INICIALIZACIÓN
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // Cargar primero de la base de datos de Firebase
  cargarDesdeFirestore();

  const lightsabers = document.querySelectorAll('#glow-toggle, .lightsaber-toggle, #glow-toggle-dash');
  lightsabers.forEach(saber => {
    saber.addEventListener('click', toggleRedTheme);
  });

  if (localStorage.getItem('theme') === 'red') {
    document.body.classList.add('red-theme', 'glow-red');
    lightsabers.forEach(saber => saber.classList.add('active'));
  }

  aplicarCambiosGuardadosUI();
  renderizarTablaDashboard();
  refrescarSQLAdmin();
  inicializarDragAndDrop();

  const editSelect = document.getElementById('dashEditSelect');
  if (editSelect) cargarNombreEnInput();

  const studentCode = document.getElementById('studentCode');
  const studentPass = document.getElementById('studentPass');

  [studentCode, studentPass].forEach(input => {
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          validarLogin();
        }
      });
    }
  });

  // ESC cierra primero el visor SQL y luego el modal de semana
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const sql = document.getElementById('sqlModal');
    if (sql && sql.classList.contains('active')) closeSqlModal();
    else closeWeekModal();
  });

  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }
});
