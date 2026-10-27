import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/source-sans-3'
import './styles.css'

const toggle = document.querySelector('.nav-toggle')
const nav = document.querySelector('#navigation')

document.documentElement.classList.add('js')

if (toggle && nav) {
  const label = toggle.querySelector('.nav-toggle-label')

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open))
    nav.classList.toggle('is-open', open)
    document.body.classList.toggle('nav-open', open)
    if (label) label.textContent = open ? 'Fermer' : 'Menu'
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true')
  })

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false)
  })

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return
    const target = event.target
    if (!(target instanceof Node)) return
    if (nav.contains(target) || toggle.contains(target)) return
    setOpen(false)
  })
}

const page = document.body.dataset.page
if (page) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page')
  })
}

const form = document.querySelector('#soumission')
if (form) {
  const situation = form.querySelector('#situation')
  const demande = new URLSearchParams(window.location.search).get('demande')
  const demandes = {
    site: 'Pas de site pour le moment',
    revoir: 'Site à revoir',
    entretien: 'Entretien mensuel',
  }
  if (situation && demande && demandes[demande]) {
    const option = [...situation.options].find((item) => item.value === demandes[demande])
    if (option) option.selected = true
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const read = (key) => String(data.get(key) || '').trim()
    const nom = read('nom')
    const entreprise = read('entreprise')
    const courriel = read('courriel')
    const telephone = read('telephone')
    const choix = read('situation')
    let message = read('message')
    if (message.length > 1200) message = `${message.slice(0, 1200)}…`

    const subject = `Soumission — ${entreprise || nom}`
    const body = [
      `Nom : ${nom}`,
      `Entreprise : ${entreprise || 'Non précisée'}`,
      `Courriel : ${courriel}`,
      `Téléphone : ${telephone || 'Non précisé'}`,
      `Situation : ${choix}`,
      '',
      message,
    ].join('\n')

    const href = `mailto:lucas@conformitecapitale.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    const status = document.querySelector('#form-status')
    if (status) {
      status.hidden = false
      status.textContent =
        'Votre logiciel de courriel devrait s’ouvrir avec le message prêt. S’il ne s’ouvre pas, écrivez à lucas@conformitecapitale.com.'
    }
    window.location.href = href
  })
}
