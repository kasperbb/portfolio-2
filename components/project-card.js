const projectCardTemplate = document.createElement('template')

projectCardTemplate.innerHTML = `
  <style>
    .card {
      background-color: #252525;
      max-width: 24rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      height: 100%;
    }

    .card .card__image {
      display: block;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      max-width: 100%;
      height: 200px;
      object-fit: cover;
      background-color: #3a3a3a;
    }

    .card .card__body {
      padding: 1.5rem;
      min-height: 180px;
    }

    .card .card__body a {
      color: white;
      text-decoration: none;
    }
    
    .card .card__body h3 {
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card .card__body p {
      color: #c4c4c4;
    }

    .card .card__body > span {
      white-space: nowrap;
      padding-inline-start: 0.5rem;
      padding-inline-end: 0.5rem;
      margin-inline-end: 0.25rem;
      text-transform: uppercase;
      font-size: 0.75rem;
      border-radius: 9999px;
      font-weight: 700;
      background: rgba(129, 230, 217, 0.16) none repeat scroll 0% 0%;
      color: #81e6d9;
    }

    .card .card__body .repository {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .card .card__body .repository span {
      max-width: 30ch;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #8a8a8a;
    }

    .card .card__body a svg {
      width: 20px;
      height: 20px;
      fill: white;
    }
  </style>

  <div class="card">
    <img class="card__image" />
    <div class="card__body"></div>
  </div>
`

class ProjectCard extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(projectCardTemplate.content.cloneNode(true))
  }

  get name() {
    return this.dataset.name
  }

  get description() {
    return this.dataset.description
  }

  get types() {
    return this.dataset.types.split(',').map(type => type.trim())
  }

  get src() {
    return this.dataset.src ?? ''
  }

  get alt() {
    return this.dataset.alt ?? ''
  }

  get link() {
    return this.dataset.link
  }

  get repository() {
    return this.dataset.repository
  }

  parseHtml(string) {
    const parser = new DOMParser()
    return parser.parseFromString(string, 'text/html').body.children[0]
  }

  createName() {
    const $link = document.createElement('a')
    $link.href = this.link
    const $name = document.createElement('h3')
    $name.textContent = this.name
    $link.title = this.name
    $link.appendChild($name)
    return $link
  }

  createDescription() {
    const $paragraph = document.createElement('p')
    $paragraph.textContent = this.description
    return $paragraph
  }

  createTypes() {
    return this.types.map(type => {
      const $type = document.createElement('span')
      $type.textContent = type
      return $type
    })
  }

  createImage(element) {
    element.src = this.src
    element.alt = this.alt
  }

  createGithubIcon() {
    return this.parseHtml(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
      </svg>
    `)
  }

  createRepository() {
    const $repository = document.createElement('a')
    $repository.href = this.repository
    $repository.classList.add('repository')

    $repository.appendChild(this.createGithubIcon())

    const $repositoryLink = document.createElement('span')
    $repositoryLink.appendChild(document.createTextNode(' ' + this.repository))

    $repository.appendChild($repositoryLink)
    return $repository
  }

  connectedCallback() {
    this.$cardImage = this._shadowRoot.querySelector('.card__image')
    this.createImage(this.$cardImage)

    this.$cardBody = this._shadowRoot.querySelector('.card__body')
    this.$cardBody.append(...this.createTypes())
    this.$cardBody.appendChild(this.createName())
    this.$cardBody.appendChild(this.createDescription())
    this.$cardBody.appendChild(this.createRepository())
  }
}

window.customElements.define('project-card', ProjectCard)
