const projectListTemplate = document.createElement('template')

projectListTemplate.innerHTML = `
  <style>
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
      align-items: stretch;
    }
  </style>

  <div class="projects"></div>
`

class ProjectList extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(projectListTemplate.content.cloneNode(true))
  }

  get data() {
    return this.dataset.json
  }

  async connectedCallback() {
    this.$container = this._shadowRoot.querySelector('.projects')

    Array.from({ length: 3 }).forEach(() => {
      const $card = document.createElement('project-card')
      this.$container.appendChild($card)
    })

    const res = await fetch(this.data)

    if (res.ok) {
      const data = await res.json()

      this.$container.textContent = ''
      data.forEach(project => {
        const $card = document.createElement('project-card')

        Object.entries(project).forEach(([key, value]) => {
          $card.dataset[key] = Array.isArray(value) ? value.join(',') : value
        })

        this.$container.appendChild($card)
      })
    }
  }
}

window.customElements.define('project-list', ProjectList)
