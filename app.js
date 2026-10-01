const c = window.BARBEARIA;
const wa = (message) => `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('[data-whatsapp]').forEach(a => {
  a.href = wa('Olá! Vim pelo site da Casa Nostra e gostaria de consultar os serviços e horários disponíveis.');
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});
document.querySelectorAll('[data-phone]').forEach(a => {
  a.href = `tel:+${c.whatsapp}`;
  a.textContent = c.telefone;
});
document.querySelectorAll('[data-address]').forEach(el => {
  el.textContent = c.endereco;
  el.append(document.createElement('br'), document.createTextNode(c.cidade));
});
document.querySelectorAll('[data-map]').forEach(a => a.href = c.maps);
document.querySelectorAll('[data-instagram]').forEach(a => a.href = c.instagram);
document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.querySelector('.menu-toggle'),
  menu = document.querySelector('#menu');

function closeMenu() {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
}
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('open')) {
    closeMenu();
    toggle.focus();
  }
});

// Carrossel automático de 3 segundos, com controles por toque e teclado.
const cutsTrack = document.getElementById('cuts-track');
if (cutsTrack) {
  const carousel = cutsTrack.closest('.cuts-carousel');
  const slides = Array.from(cutsTrack.querySelectorAll('.cut-slide'));
  const thumbs = Array.from(document.querySelectorAll('[data-cut]'));
  const prev = document.getElementById('cuts-prev'),
    next = document.getElementById('cuts-next');
  const counter = document.getElementById('cuts-count'),
    play = document.getElementById('cuts-play');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0,
    paused = false,
    hovered = false,
    visible = !('IntersectionObserver' in window),
    timer = null;

  function update() {
    counter.textContent = `${slides[active].querySelector("video")?"Vídeo":"Foto"} ${active+1} de ${slides.length}`;
    counter.setAttribute('aria-live', paused || reduced.matches ? 'polite' : 'off');
    thumbs.forEach((button, index) => button.setAttribute('aria-pressed', String(index === active)));
    slides.forEach((slide, index) => {
      slide.inert = index !== active;
      const video = slide.querySelector("video");
      if (video && index !== active) video.pause();
    });
    if (slides[active].querySelector("video") && !paused) {
      paused = true;
      syncPlayback();
    }
  }

  function syncPlayback() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    play.disabled = reduced.matches;
    play.textContent = reduced.matches ? 'Troca automática desativada' : paused ? (slides[active].querySelector('video') ? 'Continuar carrossel' : 'Retomar carrossel') : 'Pausar carrossel';
    play.setAttribute('aria-label', reduced.matches ? 'Troca automática desativada por preferência de movimento reduzido' : paused ? 'Retomar troca automática de fotos' : 'Pausar troca automática de fotos');
    counter.setAttribute('aria-live', paused || reduced.matches ? 'polite' : 'off');
    if (document.hidden || !visible) slides.forEach(slide => slide.querySelector('video')?.pause());
    if (!paused && !hovered && !reduced.matches && !document.hidden && visible) {
      timer = setInterval(() => goTo(active + 1), 3000);
    }
  }

  function goTo(index) {
    active = (index + slides.length) % slides.length;
    update();
    cutsTrack.scrollTo({
      left: active * cutsTrack.clientWidth,
      behavior: reduced.matches ? 'instant' : 'smooth'
    });
  }

  function manual(index) {
    paused = true;
    syncPlayback();
    goTo(index);
  }
  play.addEventListener('click', () => {
    if (slides[active].querySelector('video')) {
      goTo(active + 1);
      paused = false;
    } else paused = !paused;
    syncPlayback();
  });
  slides.forEach(slide => {
    const video = slide.querySelector('video');
    if (video) video.addEventListener('play', () => {
      paused = true;
      syncPlayback();
    });
  });
  thumbs.forEach(button => button.addEventListener('click', () => manual(Number(button.dataset.cut))));
  prev.addEventListener('click', () => manual(active - 1));
  next.addEventListener('click', () => manual(active + 1));
  cutsTrack.addEventListener('keydown', event => {
    if (event.target !== cutsTrack) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      manual(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  cutsTrack.addEventListener('pointerdown', () => {
    paused = true;
    syncPlayback();
  });
  carousel.addEventListener('focusin', event => {
    if (event.target !== play) {
      paused = true;
      syncPlayback();
    }
  });
  carousel.addEventListener('mouseenter', () => {
    hovered = true;
    syncPlayback();
  });
  carousel.addEventListener('mouseleave', () => {
    hovered = false;
    syncPlayback();
  });
  let scrollTimer;
  cutsTrack.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      active = Math.max(0, Math.min(slides.length - 1, Math.round(cutsTrack.scrollLeft / Math.max(1, cutsTrack.clientWidth))));
      update();
    }, 120);
  }, {
    passive: true
  });
  window.addEventListener('resize', () => {
    cutsTrack.scrollTo({
      left: active * cutsTrack.clientWidth,
      behavior: 'instant'
    });
    update();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  reduced.addEventListener('change', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, {
      threshold: .15
    }).observe(carousel);
  }
  update();
  syncPlayback();
}

// Indica a seção em leitura sem alterar o foco do visitante.
const sectionLinks = Array.from(document.querySelectorAll('#menu a:not(.nav-cta)'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries)
      if (entry.isIntersecting) {
        sectionLinks.forEach(link => {
          const current = link.hash === '#' + entry.target.id;
          link.classList.toggle('is-current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
  }, {
    rootMargin: '-20% 0px -55% 0px'
  });
  sectionLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}

// Motion follows the visitor's preference; content stays readable without JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const ribbon = document.querySelector('.ribbon');
const motionToggle = document.querySelector('.motion-toggle');
if (motionToggle && ribbon) {
  motionToggle.addEventListener('click', () => {
    const paused = ribbon.classList.toggle('paused');
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.setAttribute('aria-label', paused ? 'Retomar faixa em movimento' : 'Pausar faixa em movimento');
    motionToggle.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
  });
}
const revealElements = document.querySelectorAll('.section-heading,.service,.about-visual,.about-copy,.insta-row,.cuts-carousel,.visit-grid article,.contact-grid>div,.faq>div,.footer-top');
let revealObserver;

function setupMotion() {
  if (revealObserver) revealObserver.disconnect();
  document.body.classList.remove('motion-ready');
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: .08,
    rootMargin: '0px 0px -25px 0px'
  });
  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${el.classList.contains('service')?(index%3)*80:0}ms`);
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    else revealObserver.observe(el);
  });
  document.body.classList.add('motion-ready');
}
setupMotion();
motionPreference.addEventListener('change', setupMotion);
const progress = document.querySelector('.reading-progress');
let framePending = false;

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max>0?Math.min(1,Math.max(0,window.scrollY/max)):0})`;
  framePending = false;
}
window.addEventListener('scroll', () => {
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(updateProgress);
  }
}, {
  passive: true
});
window.addEventListener('resize', updateProgress);
updateProgress();

// Native dialog traps focus; closing returns the visitor to the selected card.
const serviceDialog = document.getElementById('service-dialog');
if (serviceDialog) {
  const services = c.servicos;
  const inputs = Array.from(serviceDialog.querySelectorAll('input[name="booking-service"]'));
  const bookingLink = document.getElementById('booking-link');
  const priceText = service => typeof service.valor === 'number' && Number.isFinite(service.valor) ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(service.valor) : 'Sob consulta';
  let opener;
  services.forEach(service => {
    serviceDialog.querySelector(`[data-service-name="${service.id}"]`).textContent = service.nome;
    serviceDialog.querySelector(`[data-service-price="${service.id}"]`).textContent = priceText(service);
  });

  function selectService(id) {
    const service = services.find(s => s.id === id) || services[0];
    inputs.forEach(input => input.checked = input.value === service.id);
    document.getElementById('booking-name').textContent = service.nome;
    document.getElementById('booking-price').textContent = priceText(service);
    const price = typeof service.valor === 'number' ? ` Valor informado no site: ${priceText(service)}.` : '';
    bookingLink.href = wa(`Olá! Vim pelo site da Casa Nostra e gostaria de agendar o serviço: ${service.nome}.${price} Poderiam me informar os horários disponíveis e confirmar o valor?`);
  }
  document.querySelectorAll('[data-open-services]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    selectService(button.dataset.openServices);
    serviceDialog.showModal();
    document.body.classList.add('modal-open');
    const selected = inputs.find(input => input.checked);
    if (selected) selected.focus();
  }));
  inputs.forEach(input => input.addEventListener('change', () => selectService(input.value)));
  serviceDialog.querySelector('.dialog-close').addEventListener('click', () => serviceDialog.close());
  let backdropStart = false;

  function outside(event) {
    const bounds = serviceDialog.getBoundingClientRect();
    return event.target === serviceDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
  }
  serviceDialog.addEventListener('pointerdown', event => backdropStart = outside(event));
  serviceDialog.addEventListener('click', event => {
    if (backdropStart && outside(event)) serviceDialog.close();
    backdropStart = false;
  });
  serviceDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (opener) opener.focus();
  });
  selectService(services[0].id);
}
