// main.js
import desktopVideo from './assets/videos/Updated_Reel_Landscape_compressed.mp4';
import mobileVideo from './assets/videos/Updated_Reel_Potrait_compressed.mp4';

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

  // Responsive Hero Video Loading & Resize Handling
  const heroVideo = document.getElementById('hero-video');
  let currentMode = window.innerWidth > 900 ? 'desktop' : 'mobile';

  function updateHeroVideoSource() {
    if (!heroVideo) return;
    const isMobile = window.innerWidth <= 900;
    const targetSrc = isMobile ? mobileVideo : desktopVideo;
    const activeMode = isMobile ? 'mobile' : 'desktop';
    
    // Only update if we are not in fullscreen
    const fsEl = document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement;

    if (activeMode !== currentMode && !fsEl) {
      currentMode = activeMode;
      heroVideo.src = targetSrc;
      heroVideo.load();
      heroVideo.play().catch(err => console.log("Hero video load/play failed on resize:", err));
    }
  }

  if (heroVideo) {
    const isMobile = window.innerWidth <= 900;
    heroVideo.src = isMobile ? mobileVideo : desktopVideo;
    heroVideo.load();
    heroVideo.play().catch(err => console.log("Hero video autoplay failed:", err));

    window.addEventListener('resize', updateHeroVideoSource);
  }

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
        if (target.classList.contains('image-break')) {
          cursor.classList.add('small-play');
        }
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
        cursor.classList.remove('small-play');
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

  // 4.1 Hero Video Controls (Mute toggle + Fullscreen)
  const heroUnmuteBtn = document.getElementById('hero-unmute-btn');
  const heroFullscreenBtn = document.getElementById('hero-fullscreen-btn');
  const iconMuted = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');

  // Track manual mute state
  let isManuallyMuted = false;

  // -- Mute / Unmute --
  if (heroVideo && heroUnmuteBtn) {
    // Initial sync of icons in case the HTML has different default values
    if (heroVideo.muted) {
      iconMuted.style.display = '';
      iconUnmuted.style.display = 'none';
      heroUnmuteBtn.setAttribute('data-cursor', 'SOUND');
    } else {
      iconMuted.style.display = 'none';
      iconUnmuted.style.display = '';
      heroUnmuteBtn.setAttribute('data-cursor', 'MUTE');
    }

    heroUnmuteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      isManuallyMuted = heroVideo.muted;
      if (heroVideo.muted) {
        iconMuted.style.display = '';
        iconUnmuted.style.display = 'none';
        heroUnmuteBtn.setAttribute('data-cursor', 'SOUND');
      } else {
        iconMuted.style.display = 'none';
        iconUnmuted.style.display = '';
        heroUnmuteBtn.setAttribute('data-cursor', 'MUTE');
      }
    });
  }

  // -- Fullscreen Overlay (custom, works on all devices incl. iOS) --
  const fsOverlay    = document.getElementById('custom-fullscreen-overlay');
  const fsVideo      = document.getElementById('fullscreen-video');
  const fsCloseBtn   = document.getElementById('custom-fullscreen-close');

  // Pre-load the desktop video into the hidden overlay player
  if (fsVideo) {
    fsVideo.src = desktopVideo;
    fsVideo.load();
  }

  function openFullscreenOverlay() {
    if (!fsOverlay || !fsVideo) return;

    fsVideo.muted  = isManuallyMuted;
    fsVideo.loop   = true;
    fsVideo.currentTime = 0;

    // Show overlay
    fsOverlay.style.display = 'flex';
    // Force reflow so the transition fires
    fsOverlay.offsetHeight; // eslint-disable-line no-unused-expressions
    fsOverlay.classList.add('is-open');
    document.body.classList.add('fullscreen-open');

    fsVideo.play().catch(e => console.log('Fullscreen play blocked:', e));
  }

  function closeFullscreenOverlay() {
    if (!fsOverlay || !fsVideo) return;
    fsOverlay.classList.remove('is-open');
    document.body.classList.remove('fullscreen-open');

    fsVideo.pause();
    fsVideo.currentTime = 0;

    // Hide after transition
    setTimeout(() => { fsOverlay.style.display = 'none'; }, 260);
  }

  if (heroFullscreenBtn) {
    heroFullscreenBtn.addEventListener('click', openFullscreenOverlay);
  }

  if (fsCloseBtn) {
    fsCloseBtn.addEventListener('click', closeFullscreenOverlay);
  }

  // Also close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeFullscreenOverlay();
  });

  // 5. Slider Indicator Sync & Navigation
  const setupSliderSync = (slider, indicatorSpans) => {
    if (slider && indicatorSpans.length > 0) {
      // Update dots on scroll
      slider.addEventListener('scroll', () => {
        const scrollPercentage = slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
        const scrollIndex = Math.round(scrollPercentage * (indicatorSpans.length - 1));
        
        indicatorSpans.forEach((dot, index) => {
          if (index === scrollIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }, { passive: true });

      // Navigate on click
      indicatorSpans.forEach((dot, index) => {
        dot.style.cursor = 'pointer'; // Ensure pointer cursor
        dot.classList.add('hover-target'); // Use custom cursor logic if needed
        dot.setAttribute('data-cursor', 'GO');
        
        dot.addEventListener('click', () => {
          const targetScroll = (slider.scrollWidth - slider.clientWidth) * (index / (indicatorSpans.length - 1));
          slider.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        });
      });
    }
  };

  const aboutSlider = document.querySelector('.about-slider');
  const aboutIndicators = document.querySelectorAll('.panel.about .slider-indicator span');
  setupSliderSync(aboutSlider, aboutIndicators);

  // 5.1 About Navigation Arrows
  const setupAboutArrows = () => {
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const aboutImage = document.querySelector('.about-pane-image');
    
    if (!aboutSlider || !nextBtn || !prevBtn) return;

    const updateArrows = () => {
      const scrollPercentage = aboutSlider.scrollLeft / (aboutSlider.scrollWidth - aboutSlider.clientWidth);
      const scrollIndex = Math.round(scrollPercentage * (aboutIndicators.length - 1));

      // User request: Left arrow (next-btn) scrolls forward
      // Right arrow (prev-btn) only on 2nd/3rd slides to go back
      
      if (scrollIndex >= aboutIndicators.length - 1) {
        nextBtn.style.visibility = 'hidden';
      } else {
        nextBtn.style.visibility = 'visible';
      }

      if (scrollIndex > 0) {
        prevBtn.style.visibility = 'visible';
      } else {
        prevBtn.style.visibility = 'hidden';
      }

      // Smooth transition for headshot to disappear
      if (aboutImage) {
        const slideWidth = aboutSlider.clientWidth;
        let opacity = 1 - (aboutSlider.scrollLeft / (slideWidth * 0.6)); // Fade out slightly faster
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        aboutImage.style.opacity = opacity;
        
        // Removed parallax translateX to prevent the next slide's text from overlaying the image
        aboutImage.style.transform = `translateX(0px)`;
        
        // Clear any inline height applied previously
        aboutImage.style.height = '';
      }
    };

    nextBtn.addEventListener('click', () => {
      const slideWidth = aboutSlider.clientWidth;
      aboutSlider.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      const slideWidth = aboutSlider.clientWidth;
      aboutSlider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });

    aboutSlider.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
  };

  setupAboutArrows();

  const pressSlider = document.querySelector('.press-grid');
  const pressIndicators = document.querySelectorAll('.recognition-indicator span');
  setupSliderSync(pressSlider, pressIndicators);

  // Recognition carousel: highlight center card + nav arrows
  if (pressSlider) {
    const pressItems = pressSlider.querySelectorAll('.press-item');

    const updateCenterCard = () => {
      const sliderRect = pressSlider.getBoundingClientRect();
      const sliderCenter = sliderRect.left + sliderRect.width / 2;
      let closest = null;
      let closestDist = Infinity;
      pressItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const dist = Math.abs(itemCenter - sliderCenter);
        if (dist < closestDist) { closestDist = dist; closest = item; }
      });
      pressItems.forEach(item => item.classList.remove('is-center'));
      if (closest) closest.classList.add('is-center');
    };

    pressSlider.addEventListener('scroll', updateCenterCard, { passive: true });
    // Init on load and after a brief delay for layout
    updateCenterCard();
    setTimeout(updateCenterCard, 300);

    // Nav arrows
    const recPrev = document.querySelector('.rec-prev');
    const recNext = document.querySelector('.rec-next');
    if (recPrev) recPrev.addEventListener('click', () => {
      pressSlider.scrollBy({ left: -(pressSlider.clientWidth * 0.35), behavior: 'smooth' });
    });
    if (recNext) recNext.addEventListener('click', () => {
      pressSlider.scrollBy({ left: pressSlider.clientWidth * 0.35, behavior: 'smooth' });
    });
  }


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

  // 7. Parallax Effect for Work Posters
  if (isDesktop) {
    const workItems = document.querySelectorAll('.scattered-item, .work-item');
    workItems.forEach(item => {
      const poster = item.querySelector('.poster, .collage-img');
      if (poster) {
        item.addEventListener('mousemove', (e) => {
          const { left, top, width, height } = item.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          
          // Subtle movement for depth
          poster.style.transform = `scale(1.1) translate(${x * 20}px, ${y * 20}px)`;
        });
        
        item.addEventListener('mouseleave', () => {
          poster.style.transform = 'scale(1) translate(0, 0)';
        });
      }
    });
  }

  // 8. Smooth Page Transitions
  const internalLinks = document.querySelectorAll('a[href$=".html"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Check if it's the same page or external
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();
        const loader = document.querySelector('.loader-overlay');
        const loaderText = document.querySelector('.loader-text');
        
        if (loader) {
          // Update loader text based on destination
          if (loaderText) {
            if (href.includes('commercial')) loaderText.innerHTML = '<img src="./assets/images/Logo/Ejaz%20logo.png" alt="EJAZ Logo" style="height: 100px; width: auto;">';
            else if (href.includes('work')) loaderText.innerHTML = '<img src="./assets/images/Logo/Ejaz%20logo.png" alt="EJAZ Logo" style="height: 100px; width: auto;">';
            else loaderText.innerHTML = '<img src="./assets/images/Logo/Ejaz%20logo.png" alt="EJAZ Logo" style="height: 100px; width: auto;">';
          }

          loader.style.display = 'flex';
          setTimeout(() => {
            loader.style.opacity = '1';
          }, 10);
          
          setTimeout(() => {
            window.location.href = href;
          }, 800);
        } else {
          window.location.href = href;
        }
      }
    });
  });

  // 9. Reveal on Scroll
  const revealItems = document.querySelectorAll('.scattered-item, .work-item, .award-item, .press-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    item.classList.add('reveal-item');
    revealObserver.observe(item);
  });
});
