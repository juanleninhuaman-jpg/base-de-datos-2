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

function closeLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) loginModal.style.display = 'none';
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
        pdfTitulo: 'Infografía Arquitectura de Base de Datos',
        pdfRuta: 'https://drive.google.com/file/d/1NPRs3-o-HmrYQu2CagkQ0Isp-4g1Xas3/view?usp=sharing'
      },
      {
        actividad: 'ACTIVIDAD 02',
        pdfTitulo: 'Infografías Base de Datos SEM 1',
        pdfRuta: 'URL_DE_TU_SEGUNDO_PDF_EN_DRIVE'
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
                <a href="${act.pdfRuta}" download="${act.pdfTitulo}.pdf" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: linear-gradient(135deg, #ff4757, #ff6b81); color: white; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: bold; box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);">
                  <i class="fa-solid fa-download"></i> Descargar PDF
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
// 5. EVENTOS DE CIERRE GLOBAL (FORZADO PARA BOTÓN "X" Y CLIC FUERA)
// ==========================================
document.addEventListener('click', (event) => {
  const weekModal = document.getElementById('weekModal');
  const loginModal = document.getElementById('loginModal');

  // Cierra si hace clic en el botón X de la semana
  if (event.target.classList.contains('week-modal-close') || event.target.closest('.week-modal-close')) {
    closeWeekModal();
  }

  // Cierra si hace clic fuera del modal
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
