/**
 * KUMAWAT COACHING CLASSES - INTERACTIVE LOGIC
 * Includes: Sticky Navbar, Mobile Drawer, Modal, Validation, WhatsApp routing, Gallery Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current Year in footer
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------
   * 1. NAVBAR SCROLL EFFECT & SCROLL SPY
   * ---------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ----------------------------------------------------
   * 2. MOBILE DRAWER MENU
   * ---------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeDrawer = document.getElementById('closeDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (closeDrawer) closeDrawer.addEventListener('click', closeMobileMenu);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ----------------------------------------------------
   * 3. ENQUIRY / JOIN BATCH MODAL SYSTEM
   * ---------------------------------------------------- */
  const enquiryModal = document.getElementById('enquiryModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openEnquiryBtns = document.querySelectorAll('.open-enquiry-btn');
  const enquiryForm = document.getElementById('enquiryForm');
  const enquirySuccessState = document.getElementById('enquirySuccessState');
  const resetModalBtn = document.getElementById('resetModalBtn');
  const studentClassSelect = document.getElementById('studentClass');
  const studentSubjectSelect = document.getElementById('studentSubject');
  const sendViaWhatsAppBtn = document.getElementById('sendViaWhatsAppBtn');
  const submittedInfoBox = document.getElementById('submittedInfoBox');

  function openModal(batchInfo = '') {
    // Check if a specific class/batch was passed
    if (batchInfo) {
      if (batchInfo.includes('5th–8th') || batchInfo.includes('5th-8th')) {
        studentClassSelect.value = 'Class 8th';
        studentSubjectSelect.value = 'All Subjects (Classes 5th-10th)';
      } else if (batchInfo.includes('9th–10th') || batchInfo.includes('9th-10th')) {
        studentClassSelect.value = 'Class 10th (All Subjects)';
        studentSubjectSelect.value = 'All Subjects (Classes 5th-10th)';
      } else if (batchInfo.includes('11th–12th') || batchInfo.includes('11th-12th')) {
        studentClassSelect.value = 'Class 11th';
        studentSubjectSelect.value = 'Mathematics Stream (11th-12th)';
      }
    }

    enquiryModal.classList.add('show');
    enquiryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    enquiryModal.classList.remove('show');
    enquiryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openEnquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const batch = btn.getAttribute('data-batch') || '';
      openModal(batch);
      // Close mobile drawer if it was open
      closeMobileMenu();
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside dialog
  enquiryModal.addEventListener('click', (e) => {
    if (e.target === enquiryModal) {
      closeModal();
    }
  });

  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (enquiryModal.classList.contains('show')) closeModal();
      if (lightboxModal.classList.contains('show')) closeLightbox();
    }
  });

  /* ----------------------------------------------------
   * 4. FORM VALIDATION & SUBMISSION
   * ---------------------------------------------------- */
  const studentNameInput = document.getElementById('studentName');
  const parentNameInput = document.getElementById('parentName');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const messageInput = document.getElementById('message');

  function validateInput(input, condition) {
    if (!condition) {
      input.classList.add('is-invalid');
      return false;
    } else {
      input.classList.remove('is-invalid');
      return true;
    }
  }

  // Clear validation on input
  [studentNameInput, parentNameInput, phoneNumberInput, studentClassSelect, studentSubjectSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
      input.addEventListener('change', () => {
        input.classList.remove('is-invalid');
      });
    }
  });

  // Only allow digits in phone number
  if (phoneNumberInput) {
    phoneNumberInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isStudentValid = validateInput(studentNameInput, studentNameInput.value.trim().length >= 2);
      const isParentValid = validateInput(parentNameInput, parentNameInput.value.trim().length >= 2);
      const isClassValid = validateInput(studentClassSelect, studentClassSelect.value !== '');
      const isSubjectValid = validateInput(studentSubjectSelect, studentSubjectSelect.value !== '');
      const phoneRegex = /^[6-9]\d{9}$/;
      const isPhoneValid = validateInput(phoneNumberInput, phoneRegex.test(phoneNumberInput.value.trim()));

      if (isStudentValid && isParentValid && isClassValid && isSubjectValid && isPhoneValid) {
        const studentName = studentNameInput.value.trim();
        const parentName = parentNameInput.value.trim();
        const studentClass = studentClassSelect.value;
        const studentSubject = studentSubjectSelect.value;
        const phoneNumber = phoneNumberInput.value.trim();
        const message = messageInput.value.trim();

        // Populate submitted details in success view
        submittedInfoBox.innerHTML = `
          <div class="info-row"><span><strong>Student Name:</strong></span> <span>${studentName}</span></div>
          <div class="info-row"><span><strong>Parent Name:</strong></span> <span>${parentName}</span></div>
          <div class="info-row"><span><strong>Class:</strong></span> <span>${studentClass}</span></div>
          <div class="info-row"><span><strong>Subject / Stream:</strong></span> <span>${studentSubject}</span></div>
          <div class="info-row"><span><strong>Phone Number:</strong></span> <span>${phoneNumber}</span></div>
          ${message ? `<div class="info-row"><span><strong>Message:</strong></span> <span>${message}</span></div>` : ''}
        `;

        // Generate WhatsApp link with prefilled enquiry message
        const waText = encodeURIComponent(
          `*New Admission / Batch Enquiry*\n` +
          `• Institute: Kumawat Coaching Classes (Neemuch)\n` +
          `• Student Name: ${studentName}\n` +
          `• Parent/Guardian: ${parentName}\n` +
          `• Class: ${studentClass}\n` +
          `• Stream/Subject: ${studentSubject}\n` +
          `• Contact Number: ${phoneNumber}\n` +
          (message ? `• Note: ${message}\n` : '') +
          `\nPlease share admission and batch timing details.`
        );
        sendViaWhatsAppBtn.href = `https://wa.me/918269354753?text=${waText}`;

        // Switch to success view
        enquiryForm.style.display = 'none';
        enquirySuccessState.style.display = 'block';
      }
    });
  }

  if (resetModalBtn) {
    resetModalBtn.addEventListener('click', () => {
      enquiryForm.reset();
      enquiryForm.style.display = 'block';
      enquirySuccessState.style.display = 'none';
    });
  }

  /* ----------------------------------------------------
   * 5. GALLERY LIGHTBOX SYSTEM
   * ---------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || 'Kumawat Coaching Classes, Neemuch';
    lightboxModal.classList.add('show');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('show');
    lightboxModal.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption');
      openLightbox(src, caption);
    });
  });

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });
});
