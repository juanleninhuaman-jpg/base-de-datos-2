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
        sqlRuta: 'https://drive.google.com/file/d/1Ruj3pEG7tOeME-mrFN859isBtd1nvv3F/view?usp=sharing',
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 02',
        pdfTitulo: "Modelado Informático y Editorial",
        pdfRuta: "https://drive.google.com/file/d/14KDGbasof50GCrwo6mq7eUgK0UJdfZYE/view?usp=sharing",
        sqlRuta: 'https://drive.google.com/file/d/1ESVYP5_0ODdxv3iSi_XDPJ_HNI7Ud6b6/view?usp=sharing',
        tipo: 'archivo'
      },
      {
        actividad: 'ACTIVIDAD 03',
        pdfTitulo: 'Modelamiento Físico y Mecanismos de Integración',
        pdfRuta: 'https://drive.google.com/file/d/1punNbWJKNX3z-cCZXepUaRtSYN6Bn9Ew/view?usp=sharing',
        tipo: 'archivo'
      }
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
      dropzone.style.background = 'rgba(0, 242, 254, 0.2)';
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.style.background = 'rgba(0, 242, 254, 0.04)';
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

  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }
});
