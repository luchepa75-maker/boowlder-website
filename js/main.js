// ── Scroll-based nav blur ────────────────────────────────────────────
const nav = document.querySelector('.nav')
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

// ── Mobile hamburger ─────────────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger')
const mobileMenu = document.querySelector('.nav-mobile')
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open')
    hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'))
  })
}

// ── Active nav link ──────────────────────────────────────────────────
const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html'
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href')
  if (href && (currentPath.endsWith(href) || (href === 'products.html' && currentPath.includes('products')))) {
    link.classList.add('active')
  }
})

// ── Fade-in on scroll ────────────────────────────────────────────────
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible')
      fadeObserver.unobserve(e.target)
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
)

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el))

// ── i18n ─────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('boow-lang') || 'en'

function applyLang(lang) {
  currentLang = lang
  localStorage.setItem('boow-lang', lang)

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en')
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text
    } else {
      el.innerHTML = text
    }
  })

  document.querySelectorAll('[data-en-href]').forEach(el => {
    const href = el.getAttribute(`data-${lang}-href`) || el.getAttribute('data-en-href')
    if (href) el.setAttribute('href', href)
  })

  const btn = document.querySelector('.nav-lang')
  if (btn) btn.textContent = lang === 'en' ? 'FR' : 'EN'
}

const langBtn = document.querySelector('.nav-lang')
if (langBtn) {
  langBtn.addEventListener('click', () => applyLang(currentLang === 'en' ? 'fr' : 'en'))
}

applyLang(currentLang)

// ── Newsletter subscribe ─────────────────────────────────────────────
const newsletterForm = document.querySelector('.newsletter-form')
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault()
    const input = newsletterForm.querySelector('.newsletter-input')
    const btn = newsletterForm.querySelector('.newsletter-btn')
    const msg = document.querySelector('.newsletter-msg')
    const email = input.value.trim()

    if (!email || !email.includes('@')) {
      if (msg) { msg.textContent = currentLang === 'fr' ? 'Email invalide.' : 'Invalid email.'; msg.className = 'newsletter-msg error' }
      return
    }

    btn.disabled = true
    btn.textContent = '...'

    try {
      const res = await fetch('https://api.boowlder.com/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (res.ok) {
        input.value = ''
        if (msg) { msg.textContent = currentLang === 'fr' ? 'Inscrit ! Merci.' : 'Subscribed! Thank you.'; msg.className = 'newsletter-msg success' }
      } else {
        const data = await res.json().catch(() => ({}))
        if (msg) { msg.textContent = data.error || (currentLang === 'fr' ? 'Erreur, réessaie.' : 'Error, try again.'); msg.className = 'newsletter-msg error' }
      }
    } catch {
      if (msg) { msg.textContent = currentLang === 'fr' ? 'Erreur réseau.' : 'Network error.'; msg.className = 'newsletter-msg error' }
    } finally {
      btn.disabled = false
      btn.textContent = currentLang === 'fr' ? 'S\'inscrire' : 'Subscribe'
    }
  })
}

// ── FAQ accordion ────────────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question')
  const answer = item.querySelector('.faq-answer')
  if (!btn || !answer) return

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open')
      o.querySelector('.faq-answer').style.maxHeight = null
    })
    if (!isOpen) {
      item.classList.add('open')
      answer.style.maxHeight = answer.scrollHeight + 'px'
    }
  })
})

// ── Gallery tabs ─────────────────────────────────────────────────────
document.querySelectorAll('.gallery-tabs').forEach(tabs => {
  tabs.querySelectorAll('.gallery-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const gallery = tabs.closest('.gallery-section') || tabs.parentElement
      tabs.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      const target = tab.dataset.tab
      gallery.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'))
      const panel = gallery.querySelector(`[data-panel="${target}"]`)
      if (panel) panel.classList.add('active')
    })
  })
})

// ── Auth tabs ────────────────────────────────────────────────────────
document.querySelectorAll('.auth-tabs').forEach(tabs => {
  tabs.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const container = tabs.closest('.auth-container') || tabs.parentElement
      tabs.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      container.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'))
      const panel = container.querySelector(`[data-panel="${tab.dataset.panel}"]`)
      if (panel) panel.classList.add('active')
    })
  })
})
