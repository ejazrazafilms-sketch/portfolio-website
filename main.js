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

  // 4.1 Hero Video Unmute Handling
  const heroVideo = document.getElementById('hero-video');
  const heroUnmuteBtn = document.getElementById('hero-unmute-btn');

  if (heroVideo && heroUnmuteBtn) {
    heroUnmuteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      
      const unmuteText = heroUnmuteBtn.querySelector('.unmute-text');
      const unmuteIcon = heroUnmuteBtn.querySelector('.unmute-icon');

      if (heroVideo.muted) {
        if (unmuteText) unmuteText.textContent = 'Unmute';
        heroUnmuteBtn.setAttribute('data-cursor', 'SOUND ON');
        if (cursorText && document.querySelector('.cursor.active')) {
          cursorText.textContent = 'SOUND ON';
        }
        if (unmuteIcon) {
          unmuteIcon.innerHTML = `<path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
        }
      } else {
        if (unmuteText) unmuteText.textContent = 'Mute';
        heroUnmuteBtn.setAttribute('data-cursor', 'MUTE');
        if (cursorText && document.querySelector('.cursor.active')) {
          cursorText.textContent = 'MUTE';
        }
        if (unmuteIcon) {
          unmuteIcon.innerHTML = `<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
        }
      }
    });
  }

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
