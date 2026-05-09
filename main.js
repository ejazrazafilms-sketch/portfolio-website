// main.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Loader
  setTimeout(() => {
    const loader = document.querySelector('.loader-overlay');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1000);
    }
  }, 1500);

  const isDesktop = window.innerWidth > 900;

  // 2. Custom Cursor
  const cursor = document.querySelector('.cursor');
  const cursorText = document.querySelector('.cursor-text');
  const hoverTargets = document.querySelectorAll('.hover-target, .nav-links a');

  if (isDesktop && cursor) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    // Smooth custom cursor using requestAnimationFrame
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        let text = target.getAttribute('data-cursor');
        if (text === 'PLAY') {
          text = '▶'; // Show play symbol
        }
        if (text) {
          cursorText.textContent = text;
        } else {
          cursorText.textContent = '';
        }
      });
      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorText.textContent = '';
      });
    });
  }

  // 3. Navigation Handling
  const navLinksList = document.querySelectorAll('.nav-links a');
  navLinksList.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // If it's a local anchor link (starts with #)
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  // 4. Video Hover Handling
  const breakSection = document.querySelector('.image-break');
  const nasffVideo = document.getElementById('nasff-video');

  if (breakSection && nasffVideo) {
    breakSection.addEventListener('mouseenter', () => {
      nasffVideo.currentTime = 0;
      nasffVideo.play().catch(e => console.log("Auto-play blocked:", e));
    });

    breakSection.addEventListener('mouseleave', () => {
      nasffVideo.pause();
    });

    // Touch support for mobile
    breakSection.addEventListener('touchstart', (e) => {
      if (nasffVideo.paused) {
        nasffVideo.play().catch(e => console.log("Touch-play blocked:", e));
      } else {
        nasffVideo.pause();
      }
    }, { passive: true });
  }

  // 5. Slider Indicator Sync
  const setupSliderSync = (slider, indicatorSpans) => {
    if (slider && indicatorSpans.length > 0) {
      slider.addEventListener('scroll', () => {
        // More robust index calculation based on scroll percentage
        const scrollPercentage = slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
        const scrollIndex = Math.round(scrollPercentage * (indicatorSpans.length - 1));
        
        indicatorSpans.forEach((dot, index) => {
          if (index === scrollIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      });
    }
  };

  const aboutSlider = document.querySelector('.about-slider');
  const aboutIndicators = document.querySelectorAll('.panel.about .slider-indicator span');
  setupSliderSync(aboutSlider, aboutIndicators);

  const pressSlider = document.querySelector('.press-grid');
  const pressIndicators = document.querySelectorAll('.recognition-indicator span');
  setupSliderSync(pressSlider, pressIndicators);

  // 6. BTS Slider Active State (Intersection Observer)
  const btsSlider = document.querySelector('.bts-slider');
  const btsSlides = document.querySelectorAll('.bts-slide');

  if (btsSlider && btsSlides.length > 0) {
    const observerOptions = {
      root: btsSlider,
      threshold: 0.6
    };

    const btsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          btsSlides.forEach(s => s.classList.remove('active'));
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    btsSlides.forEach(slide => btsObserver.observe(slide));
  }
});
