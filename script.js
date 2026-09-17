// ==========================================
// 1. MODO NEÓN / SABLE DE LUZ
// ==========================================
const glowToggle = document.getElementById('glow-toggle');
if (glowToggle) {
  glowToggle.addEventListener('click', () => {
    document.body.classList.toggle('glow-red');
  });
}

// ==========================================
// 2. EFECTO HIPERESPACIO / LOGIN MODAL
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

// FUNCIÓN CORREGIDA: Cierra el modal y restablece el campo de contraseña
function closeLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) loginModal.style.display = 'none';

  // Oculta la contraseña y resetea el ojito al cerrar
  const passInput = document.getElementById('studentPass');
  const toggleBtn = document.getElementById('togglePassBtn');

  if (passInput) passInput.type = 'password';
  if (toggleBtn) {
    toggleBtn.textContent = '👁️';
    toggleBtn.setAttribute('title', 'Mostrar contraseña');
  }
}

// NUEVA FUNCIÓN: Ejecuta la rotación de pantalla completa y limpia la vista
function handleLoginSuccess() {
  closeLoginModal();

  // Aplica la animación CSS de giro a la derecha sobre todo el sitio
  document.body.classList.add('screen-flip-right');

  // Espera 1.2 segundos (duración de la vuelta) y vacía el contenedor
  setTimeout(() => {
    document.body.innerHTML = `
      <div id="empty-dashboard" style="min-height: 100vh; background: #0a0a12; color: #fff; display: flex; align-items: center; justify-content: center;">
        <!-- Pantalla vacía lista para el nuevo contenido -->
      </div>
    `;
    document.body.classList.remove('screen-flip-right');
  }, 1200);
}

// ==========================================
// 3. ROTACIÓN Y FLIP DE TARJETAS DE UNIDADES
// ==========================================
function toggleFlip(unitId) {
  const unit = document.getElementById(unitId);
  if (unit) unit.classList.toggle('flipped');
}

function flipCube(element) {
  if (element) element.classList.toggle('flipped');
}

function flipUnitCube(buttonElement) {
  const card = buttonElement.closest('.unit-cube-3d');
  if (card) card.classList.toggle('flipped');
}

function rotateUnitCube(cubeId) {
  const cube = document.getElementById(cubeId);
  if (cube) cube.classList.add('show-back');
}

function resetUnitCube(cubeId) {
  const cube = document.getElementById(cubeId);
  if (cube) cube.classList.remove('show-back');
}

function toggleWeeks(element) {
  const card = element.parentElement;
  if (card) card.classList.toggle('active');
}

// ==========================================
// 4. CONFIGURACIÓN Y VENTANA EMERGENTE (MODAL) DEL PDF Y GENIALLY
// ==========================================

const semanasInfo = {
  'Semana 1': {
    actividades: [
      {
        actividad: 'ACTIVIDAD 01',
        pdfTitulo: 'Arquitectura de Base de Datos',
        pdfRuta: 'https://drive.google.com/file/d/1NPRs3-o-HmrYQu2CagkQ0Isp-4g1Xas3/view?usp=sharing'
      },
      {
        actividad: 'ACTIVIDAD 02',
        pdfTitulo: 'Base de Datos',
        pdfRuta: 'https://drive.google.com/file/d/1eGS3TZ--AYALcQrQ5moKMDciwCu8fk0F/view?usp=sharing'
      }
    ],
    geniallyTitulo: 'Resumen de Arquitectura de Base de Datos',
    geniallyLink: 'https://view.genially.com/6aa1b61aac454a031b87e6de'
  },
  'Semana 2': {
    actividades: [
      {
        actividad: 'ACTIVIDAD 01',
        pdfTitulo: 'Reglamento General de Grados y Títulos de Pregrado',
        pdfRuta: 'https://drive.google.com/file/d/13LwHMIb-DwGgyZL0KIX7OaQQSMFJDa24/view?usp=sharing'
      },
      {
        actividad: 'ACTIVIDAD 02',
        pdfTitulo: 'Los Gestores de Base de Datos DBMS',
        pdfRuta: 'https://drive.google.com/file/d/1n4kpDW22UB9oHBbVRWj7X5Jt1DbJ_NKn/view?usp=sharing'
      },
      {
        actividad: 'ACTIVIDAD 03',
        pdfTitulo: 'Manual de instalaciones de MS - SQL Server',
        pdfRuta: 'https://drive.google.com/file/d/1dcmkaa6Ydmz_4oPojTVz6pJtGDUoTw9w/view?usp=sharing'
      }
    ]
  }
};

function openWeekModal(weekName) {
  const modal = document.getElementById('weekModal');
  const modalTitle = document.getElementById('modalWeekTitle');
  const modalDesc = document.getElementById('modalGeniallyDesc');
  const modalLink = document.getElementById('modalGeniallyLink');

  if (modal && modalTitle) {
    modalTitle.textContent = weekName.replace(/^📅\s*/, '');

    if (modalLink) modalLink.style.display = 'none';

    if (semanasInfo[weekName]) {
      const info = semanasInfo[weekName];
      let contenidoHTML = `<div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">`;

      // RECORRE Y CREA TODAS LAS ACTIVIDADES/PDFs DE LA SEMANA
      if (info.actividades && info.actividades.length > 0) {
        info.actividades.forEach(act => {
          contenidoHTML += `
            <div class="modal-card-box">
              <span class="activity-badge">${act.actividad || 'ACTIVIDAD'}</span>
              <p style="margin: 0 0 12px 0; font-weight: bold; font-size: 1rem; color: #ffffff; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-file-pdf" style="color: #ff4757; font-size: 1.2rem;"></i>
                ${act.pdfTitulo}
              </p>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="${act.pdfRuta}" target="_blank" rel="noopener noreferrer" class="btn-card-action">
                  <i class="fa-solid fa-eye"></i> Ver PDF
                </a>
              </div>
            </div>
          `;
        });
      }

      // TARJETA DE GENIALLY (Si existe)
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

      if (modalDesc) {
        modalDesc.innerHTML = contenidoHTML;
      }
    } else {
      if (modalDesc) {
        modalDesc.innerHTML = `<i class="fa-regular fa-comment"></i> No hay contenido registrado para esta semana.`;
      }
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
// 5. CERRAR MODALES AL HACER CLIC FUERA
// ==========================================
window.addEventListener('click', (event) => {
  const weekModal = document.getElementById('weekModal');
  const loginModal = document.getElementById('loginModal');

  if (event.target === weekModal) {
    closeWeekModal();
  }
  
  if (event.target === loginModal) {
    closeLoginModal();
  }
});

// ==========================================
// 6. MOVIMIENTO DE LUZ DEL CURSOR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }
});

// ==========================================
// 7. CONTROL DE SESIÓN Y VISTAS (LOGIN Y DASHBOARD)
// ==========================================
function validarLogin() {
  const codeInput = document.getElementById('studentCode');
  const passInput = document.getElementById('studentPass');
  const errorMsg = document.getElementById('loginError');

  if (!codeInput || !passInput) return;

  const code = codeInput.value.trim();
  const pass = passInput.value.trim();

  // Verificación de credenciales
  if (code === 'T00047H' && pass === 'sistemas') {
    if (errorMsg) errorMsg.style.display = 'none';

    // 1. Ocultar el modal de login
    closeLoginModal();

    // 2. Ocultar todas las secciones del Portafolio (Landing Page)
    document.querySelectorAll('header, section, footer').forEach(el => {
      if (el.parentElement.id !== 'dashboardView') {
        el.style.display = 'none';
      }
    });

    // 3. Mostrar el Dashboard de Administración
    const dashboardView = document.getElementById('dashboardView');
    if (dashboardView) {
      dashboardView.style.display = 'block';
    }
  } else {
    // Muestra mensaje de error en el modal
    if (errorMsg) {
      errorMsg.style.display = 'block';
    } else {
      alert('Código o contraseña incorrectos.');
    }
  }
}

function cerrarSesion() {
  // 1. Ocultar Dashboard
  const dashboardView = document.getElementById('dashboardView');
  if (dashboardView) dashboardView.style.display = 'none';

  // 2. Mostrar nuevamente todas las secciones de la Landing Page
  document.querySelectorAll('header, section, footer').forEach(el => {
    if (el.parentElement.id !== 'dashboardView') {
      el.style.display = '';
    }
  });

  // 3. Reabrir modal de Login
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'flex';
  }
}

function irAlPortal() {
  // Oculta Dashboard y regresa a la página inicial
  const dashboardView = document.getElementById('dashboardView');
  if (dashboardView) dashboardView.style.display = 'none';

  document.querySelectorAll('header, section, footer').forEach(el => {
    if (el.parentElement.id !== 'dashboardView') {
      el.style.display = '';
    }
  });
}

// ==========================================
// 8. CAMBIO DE TEMA Y PERSISTENCIA (AZUL / ROJO)
// ==========================================
function toggleRedTheme() {
  document.body.classList.toggle('red-theme');
  
  const isRed = document.body.classList.contains('red-theme');
  localStorage.setItem('theme', isRed ? 'red' : 'blue');
}

// Carga el tema guardado al abrir o recargar la página
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'red') {
    document.body.classList.add('red-theme');
  }
  
  // Asegurar la escucha para la espada del Dashboard
  const saberDash = document.getElementById('glow-toggle-dash');
  if (saberDash) {
    saberDash.addEventListener('click', toggleRedTheme);
  }
});

// ==========================================
// 9. ALTERNAR VISIBILIDAD DE CONTRASEÑA (OJITO)
// ==========================================
function togglePasswordVisibility() {
  const passInput = document.getElementById('studentPass');
  const toggleBtn = document.getElementById('togglePassBtn');

  if (!passInput || !toggleBtn) return;

  // Si es tipo password, lo cambia a text (muestra texto)
  if (passInput.type === 'password') {
    passInput.type = 'text';
    toggleBtn.textContent = '🙈'; // Cambia icono al presionar
    toggleBtn.setAttribute('title', 'Ocultar contraseña');
  } else {
    // Si es tipo text, vuelve a password (oculta texto con asteriscos)
    passInput.type = 'password';
    toggleBtn.textContent = '👁️';
    toggleBtn.setAttribute('title', 'Mostrar contraseña');
  }
}

// Limpiar inputs
// Agrega o asegúrate de tener esta función auxiliar para vaciar las cajas
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

// Actualiza closeLoginModal para que limpie los campos
function closeLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) loginModal.style.display = 'none';

  resetLoginForm(); // Limpia campos al cerrar
}

// Actualiza validarLogin para limpiar los campos si el acceso es correcto
function validarLogin() {
  const codeInput = document.getElementById('studentCode');
  const passInput = document.getElementById('studentPass');
  const errorMsg = document.getElementById('loginError');

  if (!codeInput || !passInput) return;

  const code = codeInput.value.trim();
  const pass = passInput.value.trim();

  if (code === 'T00047H' && pass === 'sistemas') {
    if (errorMsg) errorMsg.style.display = 'none';

    // 1. Limpiar inputs antes de ocultar
    resetLoginForm();

    // 2. Ocultar el modal de login
    closeLoginModal();

    // 3. Ocultar el resto del portafolio y mostrar Dashboard
    document.querySelectorAll('header, section, footer').forEach(el => {
      if (el.parentElement.id !== 'dashboardView') {
        el.style.display = 'none';
      }
    });

    const dashboardView = document.getElementById('dashboardView');
    if (dashboardView) {
      dashboardView.style.display = 'block';
    }
  } else {
    if (errorMsg) {
      errorMsg.style.display = 'block';
    } else {
      alert('Código o contraseña incorrectos.');
    }
  }
}

// Actualiza irAlPortal para limpiar el formulario cuando presionas Salir
function irAlPortal() {
  const dashboardView = document.getElementById('dashboardView');
  if (dashboardView) dashboardView.style.display = 'none';

  document.querySelectorAll('header, section, footer').forEach(el => {
    if (el.parentElement.id !== 'dashboardView') {
      el.style.display = '';
    }
  });

  resetLoginForm(); // Garantiza que si reabres la ventana esté vacía
}
// ==========================================
// CHATBOT FLOTANTE ARTUERITO (DATABOT R2)
// ==========================================
function toggleChatbot() {
  const win = document.getElementById('botChatWindow');
  if (win) {
    win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
  }
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
    appendBotMessage('📋 Resumen actual: Estás en la Unidad 1 (Arquitectura de Base de Datos) - Semanas 1 y 2.');
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
    } else if (query.includes('pdf') || query.includes('tarea') || query.includes('semana')) {
      appendBotMessage('Puedes revisar el material de las Semanas 1 y 2 seleccionando la Unidad 1 arriba.');
    } else {
      appendBotMessage('Procesando consulta... Te sugiero explorar las opciones de la Unidad 1.');
    }
  }, 600);
}

function handleBotKey(e) {
  if (e.key === 'Enter') sendBotUserMsg();
}
