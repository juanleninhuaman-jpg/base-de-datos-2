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
// 1.5 CÓDIGO SQL (SQL SERVER) PARA EL VISOR
// ==========================================
const sqlCodigos = {
  actividad1: {
    titulo: 'Actividad 01 - Modelado Grados y Títulos',
    archivo: 'Codigo_SQL_Actividad1.sql',
    codigo: "-- ============================================================================\n-- CURSO: BASE DE DATOS II - UPLA\n-- ESTUDIANTE: HUAMAN QUISPE JUAN LENIN\n-- DOCENTE: MG. ING. RAÚL FERNÁNDEZ BEJARANO\n-- TEMA: ACTIVIDAD 01 - MODELO FÍSICO GRADOS Y TÍTULOS\n-- ============================================================================\n\n-- 1. CREACIÓN DE LA BASE DE DATOS\nIF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'GradosYTitulos')\nBEGIN\n    CREATE DATABASE GradosYTitulos;\nEND\nGO\n\nUSE GradosYTitulos;\nGO\n\n-- 2. CREACIÓN DE ESQUEMAS CORPORATIVOS (REQUERIMIENTO PASO 3 DE LA GUÍA)\nCREATE SCHEMA Catalogo;\nGO\nCREATE SCHEMA Academico;\nGO\nCREATE SCHEMA Tramite;\nGO\nCREATE SCHEMA Evaluacion;\nGO\n\n-- ============================================================================\n-- ESQUEMA: Catalogo (Tablas Parámetro y Maestras)\n-- ============================================================================\n\nCREATE TABLE Catalogo.TipoTramite (\n    IdTipoTramite TINYINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Descripcion VARCHAR(255) NULL,\n    CONSTRAINT PK_TipoTramite PRIMARY KEY (IdTipoTramite),\n    CONSTRAINT UQ_TipoTramite_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Catalogo.EstadoTramite (\n    IdEstadoTramite TINYINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Nombre VARCHAR(50) NOT NULL,\n    Descripcion VARCHAR(200) NULL,\n    CONSTRAINT PK_EstadoTramite PRIMARY KEY (IdEstadoTramite),\n    CONSTRAINT UQ_EstadoTramite_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Catalogo.LineaInvestigacion (\n    IdLineaInvestigacion SMALLINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Nombre VARCHAR(150) NOT NULL,\n    Activo BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_LineaInvestigacion PRIMARY KEY (IdLineaInvestigacion),\n    CONSTRAINT UQ_LineaInvestigacion_Codigo UNIQUE (Codigo)\n);\nGO\n\n-- ============================================================================\n-- ESQUEMA: Academico (Facultad, Programa, Personas y Docentes)\n-- ============================================================================\n\nCREATE TABLE Academico.Facultad (\n    IdFacultad TINYINT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(10) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Estado BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_Facultad PRIMARY KEY (IdFacultad),\n    CONSTRAINT UQ_Facultad_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Academico.ProgramaEstudios (\n    IdPrograma SMALLINT IDENTITY(1,1) NOT NULL,\n    IdFacultad TINYINT NOT NULL,\n    Nombre VARCHAR(150) NOT NULL,\n    Modalidad VARCHAR(20) NOT NULL,\n    CONSTRAINT PK_ProgramaEstudios PRIMARY KEY (IdPrograma),\n    CONSTRAINT FK_ProgramaEstudios_Facultad FOREIGN KEY (IdFacultad) REFERENCES Academico.Facultad(IdFacultad),\n    CONSTRAINT CHK_Programa_Modalidad CHECK (Modalidad IN ('PRESENCIAL', 'SEMIPRESENCIAL'))\n);\nGO\n\nCREATE TABLE Academico.GradoTituloCatalogo (\n    IdGradoTitulo SMALLINT IDENTITY(1,1) NOT NULL,\n    IdPrograma SMALLINT NOT NULL,\n    Nombre VARCHAR(150) NOT NULL,\n    Tipo VARCHAR(20) NOT NULL,\n    CONSTRAINT PK_GradoTituloCatalogo PRIMARY KEY (IdGradoTitulo),\n    CONSTRAINT FK_GradoTitulo_Programa FOREIGN KEY (IdPrograma) REFERENCES Academico.ProgramaEstudios(IdPrograma),\n    CONSTRAINT CHK_GradoTitulo_Tipo CHECK (Tipo IN ('BACHILLER', 'TITULO PROFESIONAL'))\n);\nGO\n\nCREATE TABLE Academico.Persona (\n    IdPersona INT IDENTITY(1,1) NOT NULL,\n    DNI VARCHAR(15) NOT NULL,\n    Nombres VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    TipoPersona VARCHAR(20) NOT NULL,\n    CONSTRAINT PK_Persona PRIMARY KEY (IdPersona),\n    CONSTRAINT UQ_Persona_DNI UNIQUE (DNI),\n    CONSTRAINT CHK_Persona_Tipo CHECK (TipoPersona IN ('ESTUDIANTE', 'EGRESADO', 'DOCENTE', 'ADMINISTRATIVO'))\n);\nGO\n\nCREATE TABLE Academico.Docente (\n    IdDocente INT NOT NULL,\n    CodigoORCID VARCHAR(50) NULL,\n    TipoContrato VARCHAR(30) NOT NULL,\n    CONSTRAINT PK_Docente PRIMARY KEY (IdDocente),\n    CONSTRAINT FK_Docente_Persona FOREIGN KEY (IdDocente) REFERENCES Academico.Persona(IdPersona),\n    CONSTRAINT CHK_Docente_Contrato CHECK (TipoContrato IN ('NOMBRADO', 'CONTRATADO'))\n);\nGO\n\n-- ============================================================================\n-- ESQUEMA: Tramite (Proceso Administrativo y Proyectos)\n-- ============================================================================\n\nCREATE TABLE Tramite.Tramite (\n    IdTramite INT IDENTITY(1,1) NOT NULL,\n    IdPersona INT NOT NULL,\n    IdTipoTramite TINYINT NOT NULL,\n    IdEstadoTramite TINYINT NOT NULL,\n    FechaInicio DATETIME2 NOT NULL DEFAULT SYSDATETIME(),\n    Activo BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_Tramite PRIMARY KEY (IdTramite),\n    CONSTRAINT FK_Tramite_Persona FOREIGN KEY (IdPersona) REFERENCES Academico.Persona(IdPersona),\n    CONSTRAINT FK_Tramite_TipoTramite FOREIGN KEY (IdTipoTramite) REFERENCES Catalogo.TipoTramite(IdTipoTramite),\n    CONSTRAINT FK_Tramite_EstadoTramite FOREIGN KEY (IdEstadoTramite) REFERENCES Catalogo.EstadoTramite(IdEstadoTramite)\n);\nGO\n\nCREATE TABLE Tramite.Pago (\n    IdPago INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    NroRecibo VARCHAR(30) NOT NULL,\n    Monto DECIMAL(10,2) NOT NULL,\n    FechaPago DATETIME NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_Pago PRIMARY KEY (IdPago),\n    CONSTRAINT FK_Pago_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT CHK_Pago_Monto CHECK (Monto > 0)\n);\nGO\n\nCREATE TABLE Tramite.Fotografia (\n    IdFotografia INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    RutaArchivo VARCHAR(255) NOT NULL,\n    TamañoKb INT NOT NULL,\n    CONSTRAINT PK_Fotografia PRIMARY KEY (IdFotografia),\n    CONSTRAINT FK_Fotografia_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite)\n);\nGO\n\nCREATE TABLE Tramite.ComiteEticaRevision (\n    IdRevision INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    Dictamen VARCHAR(50) NOT NULL,\n    Fecha DATETIME NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_ComiteEticaRevision PRIMARY KEY (IdRevision),\n    CONSTRAINT FK_ComiteEtica_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT CHK_ComiteEtica_Dictamen CHECK (Dictamen IN ('APROBADO', 'OBSERVADO', 'RECHAZADO'))\n);\nGO\n\nCREATE TABLE Tramite.TrabajoInvestigacion (\n    IdTrabajo INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    Titulo VARCHAR(300) NOT NULL,\n    PorcentajeSimilitud DECIMAL(5,2) NULL, -- Antiplagio Turnitin (Máximo 30% según Art. 7°)\n    CONSTRAINT PK_TrabajoInvestigacion PRIMARY KEY (IdTrabajo),\n    CONSTRAINT FK_Trabajo_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT CHK_Similitud_Antiplagio CHECK (PorcentajeSimilitud >= 0.00 AND PorcentajeSimilitud <= 30.00)\n);\nGO\n\nCREATE TABLE Tramite.ProyectoAsesor (\n    IdProyectoAsesor INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    IdDocente INT NOT NULL,\n    FechaAsignacion DATE NOT NULL DEFAULT GETDATE(),\n    Activo BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_ProyectoAsesor PRIMARY KEY (IdProyectoAsesor),\n    CONSTRAINT FK_ProyectoAsesor_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo),\n    CONSTRAINT FK_ProyectoAsesor_Docente FOREIGN KEY (IdDocente) REFERENCES Academico.Docente(IdDocente)\n);\nGO\n\nCREATE TABLE Tramite.PlanTesis (\n    IdPlan INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    FechaAprobacion DATE NULL,\n    Estado VARCHAR(30) NOT NULL DEFAULT 'EN REVISIÓN',\n    CONSTRAINT PK_PlanTesis PRIMARY KEY (IdPlan),\n    CONSTRAINT FK_PlanTesis_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo)\n);\nGO\n\nCREATE TABLE Tramite.InformeFinal (\n    IdInforme INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    FechaPresentacion DATE NOT NULL DEFAULT GETDATE(),\n    Estado VARCHAR(30) NOT NULL DEFAULT 'PRESENTADO',\n    CONSTRAINT PK_InformeFinal PRIMARY KEY (IdInforme),\n    CONSTRAINT FK_InformeFinal_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo)\n);\nGO\n\nCREATE TABLE Tramite.CoordinacionGT (\n    IdCoordinacion INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    IdResponsable INT NOT NULL,\n    Estado VARCHAR(50) NOT NULL,\n    CONSTRAINT PK_CoordinacionGT PRIMARY KEY (IdCoordinacion),\n    CONSTRAINT FK_Coordinacion_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT FK_Coordinacion_Responsable FOREIGN KEY (IdResponsable) REFERENCES Academico.Persona(IdPersona)\n);\nGO\n\nCREATE TABLE Tramite.ResolucionFacultad (\n    IdResolucion INT IDENTITY(1,1) NOT NULL,\n    IdTramite INT NOT NULL,\n    NumeroResolucion VARCHAR(50) NOT NULL,\n    FechaEmision DATE NOT NULL,\n    CONSTRAINT PK_ResolucionFacultad PRIMARY KEY (IdResolucion),\n    CONSTRAINT FK_Resolucion_Tramite FOREIGN KEY (IdTramite) REFERENCES Tramite.Tramite(IdTramite),\n    CONSTRAINT UQ_NumeroResolucion UNIQUE (NumeroResolucion)\n);\nGO\n\nCREATE TABLE Tramite.ResolucionCU (\n    IdResolucionCU INT IDENTITY(1,1) NOT NULL,\n    IdResolucionFacultad INT NOT NULL,\n    NumeroResolucionCU VARCHAR(50) NOT NULL,\n    FechaEmision DATE NOT NULL,\n    CONSTRAINT PK_ResolucionCU PRIMARY KEY (IdResolucionCU),\n    CONSTRAINT FK_ResolucionCU_Facultad FOREIGN KEY (IdResolucionFacultad) REFERENCES Tramite.ResolucionFacultad(IdResolucion),\n    CONSTRAINT UQ_NumeroResolucionCU UNIQUE (NumeroResolucionCU)\n);\nGO\n\n-- ============================================================================\n-- ESQUEMA: Evaluacion (Jurados y Sustentación)\n-- ============================================================================\n\nCREATE TABLE Evaluacion.EvaluacionJurado (\n    IdEvaluacion INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    IdDocente INT NOT NULL,\n    Rol VARCHAR(30) NOT NULL,\n    Dictamen VARCHAR(50) NULL,\n    FechaEvaluacion DATE DEFAULT GETDATE(),\n    CONSTRAINT PK_EvaluacionJurado PRIMARY KEY (IdEvaluacion),\n    CONSTRAINT FK_Evaluacion_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo),\n    CONSTRAINT FK_Evaluacion_Docente FOREIGN KEY (IdDocente) REFERENCES Academico.Docente(IdDocente),\n    CONSTRAINT CHK_Jurado_Rol CHECK (Rol IN ('PRESIDENTE', 'SECRETARIO', 'VOCAL', 'SUPLENTE'))\n);\nGO\n\nCREATE TABLE Evaluacion.EvaluacionSustentacion (\n    IdSustentacion INT IDENTITY(1,1) NOT NULL,\n    IdTrabajo INT NOT NULL,\n    FechaSustentacion DATETIME NOT NULL,\n    NotaPromedio DECIMAL(4,2) NOT NULL,\n    Resultado VARCHAR(30) NOT NULL,\n    CONSTRAINT PK_EvaluacionSustentacion PRIMARY KEY (IdSustentacion),\n    CONSTRAINT FK_Sustentacion_Trabajo FOREIGN KEY (IdTrabajo) REFERENCES Tramite.TrabajoInvestigacion(IdTrabajo),\n    CONSTRAINT CHK_Sustentacion_Nota CHECK (NotaPromedio >= 0.00 AND NotaPromedio <= 20.00),\n    CONSTRAINT CHK_Sustentacion_Resultado CHECK (Resultado IN ('EXCELENTE', 'MUY BUENO', 'BUENO', 'REGULAR', 'DESAPROBADO'))\n);\nGO"
  },
  actividad2: {
    titulo: 'Actividad 02 - Modelado Informático y Editorial',
    archivo: 'Codigo_SQL_Actividad2.sql',
    codigo: "-- ============================================================================\n-- CURSO: BASE DE DATOS II - UPLA\n-- ESTUDIANTE: HUAMAN QUISPE JUAN LENIN\n-- DOCENTE: MG. ING. RAÚL FERNÁNDEZ BEJARANO\n-- TEMA: ACTIVIDAD 02 - MATERIAL INFORMÁTICO Y CADENA EDITORIAL\n-- ============================================================================\n\n-- 1. CREACIÓN DE LA BASE DE DATOS\nIF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EmpresaYEditorialDB')\nBEGIN\n    CREATE DATABASE EmpresaYEditorialDB;\nEND\nGO\n\nUSE EmpresaYEditorialDB;\nGO\n\n-- 2. CREACIÓN DE ESQUEMAS SEPARADOS\nCREATE SCHEMA Empresa;\nGO\nCREATE SCHEMA Editorial;\nGO\n\n-- ============================================================================\n-- PARTE 1: EMPRESA DE MATERIAL INFORMÁTICO (Modelado de acuerdo a la imagen 01)\n-- ============================================================================\n\nCREATE TABLE Empresa.Seccion (\n    IdSeccion INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Descripcion VARCHAR(255) NULL,\n    CONSTRAINT PK_Empresa_Seccion PRIMARY KEY (IdSeccion)\n);\nGO\n\nCREATE TABLE Empresa.Empleado (\n    IdEmpleado INT IDENTITY(1,1) NOT NULL,\n    IdSeccion INT NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(15) NOT NULL,\n    CONSTRAINT PK_Empresa_Empleado PRIMARY KEY (IdEmpleado),\n    CONSTRAINT FK_Empleado_Seccion FOREIGN KEY (IdSeccion) REFERENCES Empresa.Seccion(IdSeccion),\n    CONSTRAINT UQ_Empleado_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Empresa.Cliente (\n    IdCliente INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Direccion VARCHAR(200) NOT NULL,\n    Telefono VARCHAR(20) NULL,\n    NIF VARCHAR(15) NOT NULL,\n    CONSTRAINT PK_Empresa_Cliente PRIMARY KEY (IdCliente),\n    CONSTRAINT UQ_Cliente_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Empresa.Equipo (\n    IdEquipo INT IDENTITY(1,1) NOT NULL,\n    Descripcion VARCHAR(255) NOT NULL,\n    Precio DECIMAL(10,2) NOT NULL,\n    Stock INT NOT NULL DEFAULT 0,\n    CONSTRAINT PK_Empresa_Equipo PRIMARY KEY (IdEquipo),\n    CONSTRAINT CHK_Equipo_Precio CHECK (Precio >= 0),\n    CONSTRAINT CHK_Equipo_Stock CHECK (Stock >= 0)\n);\nGO\n\nCREATE TABLE Empresa.Componente (\n    IdComponente INT IDENTITY(1,1) NOT NULL,\n    Descripcion VARCHAR(255) NOT NULL,\n    Precio DECIMAL(10,2) NOT NULL,\n    Stock INT NOT NULL DEFAULT 0,\n    CONSTRAINT PK_Empresa_Componente PRIMARY KEY (IdComponente),\n    CONSTRAINT CHK_Componente_Precio CHECK (Precio >= 0),\n    CONSTRAINT CHK_Componente_Stock CHECK (Stock >= 0)\n);\nGO\n\nCREATE TABLE Empresa.EquipoComponente (\n    IdEquipo INT NOT NULL,\n    IdComponente INT NOT NULL,\n    Cantidad INT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_EquipoComponente PRIMARY KEY (IdEquipo, IdComponente),\n    CONSTRAINT FK_EquipoComponente_Equipo FOREIGN KEY (IdEquipo) REFERENCES Empresa.Equipo(IdEquipo),\n    CONSTRAINT FK_EquipoComponente_Componente FOREIGN KEY (IdComponente) REFERENCES Empresa.Componente(IdComponente),\n    CONSTRAINT CHK_EquipoComp_Cantidad CHECK (Cantidad > 0)\n);\nGO\n\nCREATE TABLE Empresa.Compra (\n    IdCompra INT IDENTITY(1,1) NOT NULL,\n    IdCliente INT NOT NULL,\n    IdEmpleado INT NOT NULL, -- Empleado que atiende la venta (según enunciado/diagrama)\n    FechaCompra DATETIME NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_Empresa_Compra PRIMARY KEY (IdCompra),\n    CONSTRAINT FK_Compra_Cliente FOREIGN KEY (IdCliente) REFERENCES Empresa.Cliente(IdCliente),\n    CONSTRAINT FK_Compra_Empleado FOREIGN KEY (IdEmpleado) REFERENCES Empresa.Empleado(IdEmpleado)\n);\nGO\n\nCREATE TABLE Empresa.DetalleCompra (\n    IdDetalle INT IDENTITY(1,1) NOT NULL,\n    IdCompra INT NOT NULL,\n    IdEquipo INT NULL,       -- Soporta compra de equipos sueltos\n    IdComponente INT NULL,   -- Soporta compra de componentes sueltos\n    Cantidad INT NOT NULL,\n    Precio DECIMAL(10,2) NOT NULL,\n    CONSTRAINT PK_Empresa_DetalleCompra PRIMARY KEY (IdDetalle),\n    CONSTRAINT FK_Detalle_Compra FOREIGN KEY (IdCompra) REFERENCES Empresa.Compra(IdCompra),\n    CONSTRAINT FK_Detalle_Equipo FOREIGN KEY (IdEquipo) REFERENCES Empresa.Equipo(IdEquipo),\n    CONSTRAINT FK_Detalle_Componente FOREIGN KEY (IdComponente) REFERENCES Empresa.Componente(IdComponente),\n    CONSTRAINT CHK_Detalle_Cantidad CHECK (Cantidad > 0)\n);\nGO\n\n-- ============================================================================\n-- PARTE 2: CADENA EDITORIAL (Modelado de acuerdo a la imagen 02)\n-- ============================================================================\n\nCREATE TABLE Editorial.Sucursal (\n    IdSucursal INT IDENTITY(1,1) NOT NULL,\n    Codigo VARCHAR(20) NOT NULL,\n    Domicilio VARCHAR(200) NOT NULL,\n    Telefono VARCHAR(20) NULL,\n    CONSTRAINT PK_Editorial_Sucursal PRIMARY KEY (IdSucursal),\n    CONSTRAINT UQ_Sucursal_Codigo UNIQUE (Codigo)\n);\nGO\n\nCREATE TABLE Editorial.Empleado (\n    IdEmpleado INT IDENTITY(1,1) NOT NULL,\n    IdSucursal INT NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(15) NOT NULL,\n    CONSTRAINT PK_Editorial_Empleado PRIMARY KEY (IdEmpleado),\n    CONSTRAINT FK_Empleado_Sucursal FOREIGN KEY (IdSucursal) REFERENCES Editorial.Sucursal(IdSucursal),\n    CONSTRAINT UQ_EditorialEmpleado_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Editorial.Revista (\n    IdRevista INT IDENTITY(1,1) NOT NULL,\n    Titulo VARCHAR(150) NOT NULL,\n    NRegistro VARCHAR(50) NOT NULL,\n    Periodicidad VARCHAR(50) NOT NULL,\n    Tipo VARCHAR(50) NOT NULL,\n    CONSTRAINT PK_Editorial_Revista PRIMARY KEY (IdRevista),\n    CONSTRAINT UQ_Revista_NRegistro UNIQUE (NRegistro)\n);\nGO\n\nCREATE TABLE Editorial.SucursalRevista (\n    IdSucursal INT NOT NULL,\n    IdRevista INT NOT NULL,\n    FechaInicio DATE NOT NULL DEFAULT GETDATE(),\n    Estado BIT NOT NULL DEFAULT 1,\n    CONSTRAINT PK_SucursalRevista PRIMARY KEY (IdSucursal, IdRevista),\n    CONSTRAINT FK_SucursalRevista_Sucursal FOREIGN KEY (IdSucursal) REFERENCES Editorial.Sucursal(IdSucursal),\n    CONSTRAINT FK_SucursalRevista_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista)\n);\nGO\n\nCREATE TABLE Editorial.Periodista (\n    IdPeriodista INT IDENTITY(1,1) NOT NULL,\n    Nombre VARCHAR(100) NOT NULL,\n    Apellidos VARCHAR(100) NOT NULL,\n    NIF VARCHAR(15) NOT NULL,\n    Especialidad VARCHAR(100) NOT NULL,\n    CONSTRAINT PK_Editorial_Periodista PRIMARY KEY (IdPeriodista),\n    CONSTRAINT UQ_Periodista_NIF UNIQUE (NIF)\n);\nGO\n\nCREATE TABLE Editorial.Articulo (\n    IdArticulo INT IDENTITY(1,1) NOT NULL,\n    IdPeriodista INT NOT NULL,\n    IdRevista INT NOT NULL,\n    Titulo VARCHAR(200) NOT NULL,\n    Fecha DATE NOT NULL DEFAULT GETDATE(),\n    CONSTRAINT PK_Editorial_Articulo PRIMARY KEY (IdArticulo),\n    CONSTRAINT FK_Articulo_Periodista FOREIGN KEY (IdPeriodista) REFERENCES Editorial.Periodista(IdPeriodista),\n    CONSTRAINT FK_Articulo_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista)\n);\nGO\n\nCREATE TABLE Editorial.SeccionFija (\n    IdSeccion INT IDENTITY(1,1) NOT NULL,\n    IdRevista INT NOT NULL,\n    Titulo VARCHAR(150) NOT NULL,\n    Extension VARCHAR(50) NOT NULL,\n    CONSTRAINT PK_Editorial_SeccionFija PRIMARY KEY (IdSeccion),\n    CONSTRAINT FK_SeccionFija_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista)\n);\nGO\n\nCREATE TABLE Editorial.Ejemplar (\n    IdEjemplar INT IDENTITY(1,1) NOT NULL,\n    IdRevista INT NOT NULL,\n    Fecha DATE NOT NULL,\n    Paginas INT NOT NULL,\n    Vendidos INT NOT NULL DEFAULT 0,\n    CONSTRAINT PK_Editorial_Ejemplar PRIMARY KEY (IdEjemplar),\n    CONSTRAINT FK_Ejemplar_Revista FOREIGN KEY (IdRevista) REFERENCES Editorial.Revista(IdRevista),\n    CONSTRAINT CHK_Ejemplar_Paginas CHECK (Paginas > 0),\n    CONSTRAINT CHK_Ejemplar_Vendidos CHECK (Vendidos >= 0)\n);\nGO"
  }
};

// Relación: título del PDF -> código SQL (así funciona aunque los datos vengan de Firebase)
const sqlPorTituloPdf = {
  'Modelado Grados y Títulos': 'actividad1',
  'Modelado Informático y Editorial': 'actividad2'
};

let sqlActualKey = null;

function escaparHTML(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function resaltarSQL(codigo) {
  const reglas = /(--.*$)|('(?:[^']|'')*')|\b(CREATE|DATABASE|SCHEMA|TABLE|USE|GO|IF|NOT|EXISTS|BEGIN|END|SELECT|FROM|WHERE|NAME|CONSTRAINT|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|IDENTITY|NULL|IN|AND|OR)\b|\b(INT|TINYINT|SMALLINT|BIT|VARCHAR|DECIMAL|DATE|DATETIME|DATETIME2|GETDATE|SYSDATETIME)\b|\b(\d+(?:\.\d+)?)\b/gi;
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

function openSqlModal(key) {
  const data = sqlCodigos[key];
  const modal = document.getElementById('sqlModal');
  if (!data || !modal) return;
  sqlActualKey = key;
  document.getElementById('sqlModalTitle').textContent = data.titulo;
  document.getElementById('sqlFileName').textContent = data.archivo;
  document.getElementById('sqlCodeContent').innerHTML = resaltarSQL(data.codigo);
  const copyBtn = document.getElementById('sqlCopyBtn');
  if (copyBtn) copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
  modal.classList.add('active');
  modal.style.display = 'flex';
  const box = modal.querySelector('.sql-code-box');
  if (box) box.scrollTop = 0;
}

function closeSqlModal() {
  const modal = document.getElementById('sqlModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

async function copySqlCode() {
  if (!sqlActualKey) return;
  const btn = document.getElementById('sqlCopyBtn');
  try {
    await navigator.clipboard.writeText(sqlCodigos[sqlActualKey].codigo);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = sqlCodigos[sqlActualKey].codigo;
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
  if (!sqlActualKey) return;
  const data = sqlCodigos[sqlActualKey];
  const blob = new Blob([data.codigo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = data.archivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
        info.actividades.forEach(act => {
          const iconoClase = act.tipo === 'enlace' ? 'fa-link' : 'fa-file-pdf';
          const iconoColor = act.tipo === 'enlace' ? '#00f2fe' : '#ff4757';
          const claveSQL = sqlPorTituloPdf[(act.pdfTitulo || '').trim()];
          const botonSQL = claveSQL
            ? `<button type="button" class="btn-card-action btn-sql-code" onclick="openSqlModal('${claveSQL}')"><i class="fa-solid fa-database"></i> Código SQL</button>`
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

function botSelectOption(tipo) {
  if (tipo === 'conceptos') {
    appendBotMessage('🗂️ Conceptos: Los DBMS (Sistemas Gestores) administran almacenamiento, seguridad e integridad de datos.');
  } else if (tipo === 'sql') {
    appendBotMessage('&lt;/&gt; SQL: Lenguaje de consulta estructurado para definir (DDL) y manipular (DML) datos.');
  } else if (tipo === 'resumen') {
    appendBotMessage('📋 Resumen actual: Estás en la Unidad 1 (Arquitectura de Base de Datos) - Semanas 1 a 4.');
  }
}

function botSelectUnit(num) {
  appendBotMessage(`<b>Unidad ${num} seleccionada</b>`, true);
  if (num === 1) {
    appendBotMessage(`
      ✅ Abriendo Unidad 1:<br>
      Selecciona una semana:
      <div style="display:flex; gap:5px; margin-top:8px; flex-wrap:wrap;">
        <button onclick="botShowWeek(1)" style="padding:3px 8px; border-radius:6px; border:1px solid #00f2fe; background:transparent; color:#00f2fe; cursor:pointer;">Semana 1</button>
        <button onclick="botShowWeek(2)" style="padding:3px 8px; border-radius:6px; border:1px solid #00f2fe; background:transparent; color:#00f2fe; cursor:pointer;">Semana 2</button>
      </div>
    `);
  } else {
    appendBotMessage(`⚠️ Las semanas de la Unidad ${num} se habilitarán en las siguientes sesiones.`);
  }
}

function botShowWeek(numSemana) {
  const infoSemana = semanasInfo[`Semana ${numSemana}`];
  if (infoSemana && infoSemana.actividades) {
    let respuesta = `📄 <b>Archivos de la Semana ${numSemana}:</b><br>`;
    infoSemana.actividades.forEach(act => {
      respuesta += `• <a href="${act.pdfRuta}" target="_blank" style="color:#00f2fe;">${act.pdfTitulo}</a><br>`;
    });
    appendBotMessage(respuesta);
  } else {
    appendBotMessage(`No hay archivos registrados para la Semana ${numSemana}.`);
  }
}

function sendBotUserMsg() {
  const input = document.getElementById('botInput');
  if (!input) return;
  const txt = input.value.trim();
  if (!txt) return;

  appendBotMessage(txt, true);
  input.value = '';

  setTimeout(() => {
    const query = txt.toLowerCase();
    if (query.includes('hola') || query.includes('buenas')) {
      appendBotMessage('¡Hola! Beep-boop 🤖 ¿En qué te puedo colaborar hoy?');
    } else {
      appendBotMessage('Procesando consulta... Te sugiero explorar las opciones de las unidades.');
    }
  }, 600);
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
          
          tr.innerHTML = `
            <td><strong>${sem}</strong></td>
            <td>
              <a href="${act.pdfRuta}" target="_blank" rel="noopener noreferrer">
                ${icono} ${act.pdfTitulo}
              </a>
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
