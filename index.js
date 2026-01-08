function initFHAnimate() {
  const DEFAULTS = {
    distance: 6,
    opacity: 0.8,
    duration: 0.3,
    delayStep: 0.04,
    ease: 'power2.out',
    trigger: 'hover'
  };

  const elements = document.querySelectorAll('[fh-animate]');

  elements.forEach(el => {
    if (el.dataset.fhInit) return;
    el.dataset.fhInit = 'true';

    // Read attributes OR fallback to defaults
    const animation = el.getAttribute('fh-animate');
    const trigger = el.getAttribute('fh-trigger') || DEFAULTS.trigger;
    const distance = parseFloat(el.getAttribute('fh-distance')) || DEFAULTS.distance;
    const opacity = parseFloat(el.getAttribute('fh-opacity')) || DEFAULTS.opacity;
    const duration = parseFloat(el.getAttribute('fh-duration')) || DEFAULTS.duration;
    const delayStep = parseFloat(el.getAttribute('fh-delay-step')) || DEFAULTS.delayStep;
    const ease = el.getAttribute('fh-ease') || DEFAULTS.ease;

    const text = el.textContent.trim();
    el.textContent = '';

    const chars = [...text].map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      el.appendChild(span);
      return span;
    });

    const run = () => runAnimation(animation, chars);
    const reset = () => gsap.to(chars, { clearProps: 'all' });

    if (trigger === 'hover') {
      el.addEventListener('mouseenter', run);
      el.addEventListener('mouseleave', reset);
    } 
    else if (trigger === 'click') {
      el.addEventListener('click', run);
    } 
    else if (trigger === 'load') {
      run();
    }

    function runAnimation(type, targets) {
      switch (type) {

        case 'stagger-up':
          gsap.fromTo(targets,
            { y: 0 },
            { y: -distance, opacity, duration, ease, stagger: delayStep }
          );
          break;

        case 'stagger-down':
          gsap.fromTo(targets,
            { y: 0 },
            { y: distance, opacity, duration, ease, stagger: delayStep }
          );
          break;

        case 'fade':
          gsap.fromTo(targets,
            { opacity: 0.3 },
            { opacity, duration, stagger: delayStep }
          );
          break;

        case 'wave':
          gsap.to(targets, {
            y: -distance,
            duration,
            ease: 'sine.inOut',
            stagger: {
              each: delayStep,
              yoyo: true,
              repeat: -1
            }
          });
          break;

        case 'rotate':
          gsap.fromTo(targets,
            { rotate: 0 },
            { rotate: 8, duration, ease, stagger: delayStep }
          );
          break;

        case 'slide-left':
          gsap.fromTo(targets,
            { x: distance },
            { x: 0, opacity, duration, ease, stagger: delayStep }
          );
          break;

        case 'scale-pop':
          gsap.fromTo(targets,
            { scale: 1 },
            { scale: 1.25, duration, ease, stagger: delayStep }
          );
          break;

        default:
          console.warn(`FH animation "${type}" not found`);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initFHAnimate);
