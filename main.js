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
