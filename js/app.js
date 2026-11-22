/**
 * BUILDCRAFT - Interactive Application Script
 */

(function () {
  'use strict';

  // Fallback data check
  const data = typeof BUILDCRAFT_DATA !== 'undefined' ? BUILDCRAFT_DATA : {
    studioInfo: {
      phone: '+880 1540-053889',
      phoneRaw: '+8801540053889',
      whatsappUrl: 'https://wa.me/8801540053889'
    },
    exterior: [],
    interior: []
  };

  const STUDIO_PHONE = data.studioInfo.phone || '+880 1540-053889';
  const STUDIO_PHONE_RAW = data.studioInfo.phoneRaw || '+8801540053889';
  const WA_BASE_URL = `https://wa.me/${STUDIO_PHONE_RAW.replace(/[^0-9]/g, '')}`;

  // State
  let currentCategory = 'all'; // 'all' | 'exterior' | 'interior'
  let currentSubTag = 'all';
  let activeProject = null;
  let activeImageIndex = 0;

  // DOM Elements
  const projectsGrid = document.getElementById('projects-grid');
  const switcherButtons = document.querySelectorAll('.switcher-btn');
  const subfilterContainer = document.getElementById('subfilter-container');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-sub');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxMainImg = document.getElementById('lightbox-main-img');
  const lightboxFilmstrip = document.getElementById('lightbox-filmstrip');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxWaBtn = document.getElementById('lightbox-wa-btn');
  const lightboxCallBtn = document.getElementById('lightbox-call-btn');
  const contactForm = document.getElementById('quick-consult-form');

  // Utility to safely encode image paths
  function safePath(imgPath) {
    if (!imgPath) return '';
    return encodeURI(imgPath);
  }

  // Get combined projects list
  function getAllProjects() {
    return [...data.exterior, ...data.interior];
  }

  // Filter projects by current state
  function getFilteredProjects() {
    let list = [];
    if (currentCategory === 'exterior') {
      list = [...data.exterior];
    } else if (currentCategory === 'interior') {
      list = [...data.interior];
    } else {
      list = getAllProjects();
    }

    if (currentSubTag !== 'all') {
      list = list.filter(p => p.tag === currentSubTag);
    }

    return list;
  }

  // Render Sub-filter tags
  function renderSubFilterTags() {
    if (!subfilterContainer) return;

    let availableTags = new Set();
    const sourceList = currentCategory === 'exterior' 
      ? data.exterior 
      : currentCategory === 'interior' 
        ? data.interior 
        : getAllProjects();

    sourceList.forEach(p => {
      if (p.tag) availableTags.add(p.tag);
    });

    let tagsHtml = `<button class="tag-btn ${currentSubTag === 'all' ? 'active' : ''}" data-tag="all">All Styles</button>`;
    availableTags.forEach(tag => {
      tagsHtml += `<button class="tag-btn ${currentSubTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</button>`;
    });

    subfilterContainer.innerHTML = tagsHtml;

    // Attach listener
    subfilterContainer.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        subfilterContainer.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSubTag = btn.dataset.tag;
        renderProjects();
      });
    });
  }

  // Render Projects Grid
  function renderProjects() {
    if (!projectsGrid) return;

    const projects = getFilteredProjects();

    if (projects.length === 0) {
      projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 16px; opacity: 0.5;"></i>
          <p style="font-size: 1.1rem;">No projects found under this filter.</p>
        </div>
      `;
      return;
    }

    let html = '';
    projects.forEach(p => {
      const coverUrl = safePath(p.coverImage);
      const isExt = p.category.toLowerCase() === 'exterior';
      const icon = isExt ? 'fa-building' : 'fa-couch';
      const waQuoteText = encodeURIComponent(`Hello BuildCraft, I was viewing your website and loved the ${p.title} (${p.category} Design). Can I get a consultation and quote for a similar project?`);

      html += `
        <article class="project-card" data-id="${p.id}">
          <div class="card-img-wrap">
            <span class="card-tag-pill">
              <i class="fa-solid ${icon}"></i> ${p.category}
            </span>
            <span class="card-renders-count">
              <i class="fa-regular fa-images"></i> ${p.imageCount} Renders
            </span>
            <img class="card-img" src="${coverUrl}" alt="${p.title}" loading="lazy" />
          </div>
          <div class="card-info">
            <div class="card-location">
              <i class="fa-solid fa-location-dot"></i> ${p.location}
            </div>
            <h3 class="card-title">${p.title}</h3>
            <p class="card-desc">${p.description}</p>
            <div class="card-footer-action">
              <span class="card-action-link">
                View Gallery (${p.imageCount}) <i class="fa-solid fa-arrow-right"></i>
              </span>
              <a href="${WA_BASE_URL}?text=${waQuoteText}" target="_blank" rel="noopener noreferrer" class="card-quick-wa" onclick="event.stopPropagation();">
                <i class="fa-brands fa-whatsapp"></i> Inquire
              </a>
            </div>
          </div>
        </article>
      `;
    });

    projectsGrid.innerHTML = html;

    // Attach card click handlers
    projectsGrid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.dataset.id;
        const prj = getAllProjects().find(item => item.id === pId);
        if (prj) {
          openLightbox(prj, 0);
        }
      });
    });
  }

  // Switch Category Tab (All / Exterior / Interior)
  function setCategory(cat) {
    currentCategory = cat;
    currentSubTag = 'all';

    switcherButtons.forEach(btn => {
      if (btn.dataset.category === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderSubFilterTags();
    renderProjects();
  }

  // --- LIGHTBOX GALLERY IMPLEMENTATION ---
  function openLightbox(project, index = 0) {
    if (!project || !project.images || project.images.length === 0) return;

    activeProject = project;
    activeImageIndex = index;

    lightboxTitle.textContent = project.title;
    lightboxSub.innerHTML = `
      <span><i class="fa-solid fa-location-dot"></i> ${project.location}</span>
      <span>•</span>
      <span><i class="fa-solid fa-tag"></i> ${project.category} Design</span>
      <span>•</span>
      <span>${project.type}</span>
    `;

    // WhatsApp CTA button for this project
    const waText = encodeURIComponent(`Hello BuildCraft! I am very interested in your design for "${project.title}" (${project.category}). Could you share cost estimation and consultation details?`);
    if (lightboxWaBtn) {
      lightboxWaBtn.href = `${WA_BASE_URL}?text=${waText}`;
    }
    if (lightboxCallBtn) {
      lightboxCallBtn.href = `tel:${STUDIO_PHONE_RAW}`;
    }

    renderFilmstrip();
    updateLightboxImage();

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    activeProject = null;
  }

  function updateLightboxImage() {
    if (!activeProject) return;

    const total = activeProject.images.length;
    const currentImgPath = activeProject.images[activeImageIndex];

    lightboxCounter.textContent = `${activeImageIndex + 1} / ${total}`;
    
    // Smooth fade effect
    lightboxMainImg.style.opacity = '0.3';
    lightboxMainImg.src = safePath(currentImgPath);
    lightboxMainImg.onload = () => {
      lightboxMainImg.style.opacity = '1';
    };

    // Update filmstrip active state
    if (lightboxFilmstrip) {
      const thumbs = lightboxFilmstrip.querySelectorAll('.filmstrip-thumb');
      thumbs.forEach((thumb, idx) => {
        if (idx === activeImageIndex) {
          thumb.classList.add('active');
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          thumb.classList.remove('active');
        }
      });
    }
  }

  function renderFilmstrip() {
    if (!lightboxFilmstrip || !activeProject) return;

    let thumbsHtml = '';
    activeProject.images.forEach((img, idx) => {
      thumbsHtml += `
        <img class="filmstrip-thumb ${idx === activeImageIndex ? 'active' : ''}" 
             src="${safePath(img)}" 
             alt="Thumbnail ${idx + 1}" 
             data-index="${idx}" 
             loading="lazy" />
      `;
    });

    lightboxFilmstrip.innerHTML = thumbsHtml;

    lightboxFilmstrip.querySelectorAll('.filmstrip-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        activeImageIndex = parseInt(thumb.dataset.index, 10);
        updateLightboxImage();
      });
    });
  }

  function nextImage() {
    if (!activeProject) return;
    activeImageIndex = (activeImageIndex + 1) % activeProject.images.length;
    updateLightboxImage();
  }

  function prevImage() {
    if (!activeProject) return;
    activeImageIndex = (activeImageIndex - 1 + activeProject.images.length) % activeProject.images.length;
    updateLightboxImage();
  }

  // Lightbox Events
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevImage);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextImage);
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);

  // Close on outside click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-body')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch Swipe for Lightbox
  let touchStartX = 0;
  if (lightboxMainImg) {
    lightboxMainImg.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxMainImg.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextImage(); // Swipe left
      } else if (touchEndX - touchStartX > 50) {
        prevImage(); // Swipe right
      }
    }, { passive: true });
  }

  // --- CONTACT FORM TO WHATSAPP ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('consult-name').value.trim();
      const phone = document.getElementById('consult-phone').value.trim();
      const service = document.getElementById('consult-service').value;
      const location = document.getElementById('consult-location').value.trim();
      const notes = document.getElementById('consult-notes').value.trim();

      const message = 
`*NEW INQUIRY FOR BUILDCRAFT STUDIO*
---------------------------------------
👤 *Client Name:* ${name || 'Prospective Client'}
📞 *Phone/Contact:* ${phone || 'Not provided'}
🏛️ *Service Required:* ${service}
📍 *Project Location:* ${location || 'Bangladesh'}
📝 *Project Scope / Notes:*
${notes || 'Interested in consultation and quotation.'}
---------------------------------------
(Sent via BuildCraft Official Website)`;

      const waUrl = `${WA_BASE_URL}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  }

  // --- EXTERIOR / INTERIOR DIRECT BUTTONS & HASH NAVIGATION ---
  document.querySelectorAll('[data-switch-to]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCat = btn.dataset.switchTo;
      setCategory(targetCat);
      const portfolioSec = document.getElementById('portfolio');
      if (portfolioSec) {
        portfolioSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle Category Switcher Buttons
  switcherButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category);
    });
  });

  // Header scroll appearance
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Check URL hash on load
  function handleHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#exterior') {
      setCategory('exterior');
    } else if (hash === '#interior') {
      setCategory('interior');
    } else {
      setCategory('all');
    }
  }

  // Initial Load
  window.addEventListener('DOMContentLoaded', () => {
    handleHash();
  });

})();
