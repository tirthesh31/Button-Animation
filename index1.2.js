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

    const type = el.getAttribute('fh-animate');
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

    const enter = () => animate(type, chars, 'enter');
    const exit = () => animate(type, chars, 'exit');

    if (trigger === 'hover') {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', exit);
    } else if (trigger === 'click') {
      el.addEventListener('click', enter);
    } else if (trigger === 'load') {
      enter();
    }

    function animate(name, targets, direction) {
      const isEnter = direction === 'enter';

      switch (name) {

        case 'stagger-up':
          gsap.to(targets, {
            y: isEnter ? -distance : 0,
            opacity: isEnter ? opacity : 1,
            duration,
            ease,
            stagger: delayStep
          });
          break;

        case 'stagger-down':
          gsap.to(targets, {
            y: isEnter ? distance : 0,
            opacity: isEnter ? opacity : 1,
            duration,
            ease,
            stagger: delayStep
          });
          break;

        case 'fade':
          gsap.to(targets, {
            opacity: isEnter ? opacity : 1,
            duration,
            stagger: delayStep
          });
          break;

        case 'wave':
          if (isEnter) {

            // Kill any existing wave tween (safety)
            if (el._fhWaveTween) {
              el._fhWaveTween.kill();
            }

            // Create & store infinite wave tween
            el._fhWaveTween = gsap.to(targets, {
              y: -distance,
              duration,
              ease: 'sine.inOut',
              stagger: {
                each: delayStep,
                yoyo: true,
                repeat: -1
              }
            });

          } else {

            // Kill infinite wave animation
            if (el._fhWaveTween) {
              el._fhWaveTween.kill();
              el._fhWaveTween = null;
            }

            // Animate back to default state
            gsap.to(targets, {
              y: 0,
              duration,
              ease,
              stagger: delayStep
            });
          }
          break;

        case 'rotate':
          gsap.to(targets, {
            rotate: isEnter ? 8 : 0,
            duration,
            ease,
            stagger: delayStep
          });
          break;

        case 'slide-left':
          gsap.to(targets, {
            x: isEnter ? 0 : distance,
            opacity: isEnter ? opacity : 1,
            duration,
            ease,
            stagger: delayStep
          });
          break;

        case 'scale-pop':
          gsap.to(targets, {
            scale: isEnter ? 1.25 : 1,
            duration,
            ease,
            stagger: delayStep
          });
          break;

        default:
          console.warn(`FH animation "${name}" not found`);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initFHAnimate);
