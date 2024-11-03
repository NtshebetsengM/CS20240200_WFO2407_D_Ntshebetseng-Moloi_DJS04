//@ts-check
class BookPreview extends HTMLElement {
  static get observedAttributes(){
    return ['image', 'title', 'author', 'description']
  }
  constructor() {
    super();
  
    // Attach shadow DOM to encapsulate styles and content
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      console.warn('ShadowRoot not available, skipping render.');
      return;
    }else{
  
      // Create the component structure
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add('preview')
  
      // Define styles for the component
      const style = document.createElement('style');
      style.textContent = `
              * {
          box-sizing: border-box;
        }
                .preview {
          border-width: 0;
          width: 100%;
          font-family: Roboto, sans-serif;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          text-align: left;
          border-radius: 8px;
          border: 1px solid rgba(var(--color-dark), 0.15);
          background: rgba(var(--color-light), 1);
        }


        .preview_hidden {
          display: none;
        }

        .preview:hover {
          background: rgba(var(--color-blue), 0.05);
        }

        .preview__image {
          width: 48px;
          height: 70px;
          object-fit: cover;
          background: grey;
          border-radius: 2px;
          box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
            0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
        }

        .preview__info {
          padding: 1rem;
        }

        .preview__title {
          margin: 0 0 0.5rem;
          font-weight: bold;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
          color: rgba(var(--color-dark), 0.8)
        }

        .preview__author {
          color: rgba(var(--color-dark), 0.4);
        }
      `;
  
      // Attach the elements to the shadow DOM
      this.shadowRoot.append(style, this.wrapper);
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue){
    this.render()
  }
  render() {
    if (!this.shadowRoot) {
      console.warn('ShadowRoot not available, skipping render.');
      return;
    }
    if (!this.wrapper) {
      console.warn('Wrapper not available, initializing.');
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add('preview');
      this.shadowRoot.append(this.wrapper);
    }
    const image = this.getAttribute('image') || '';
    const title = this.getAttribute('title') || 'Unknown Title';
    const author = this.getAttribute('author') || 'Unknown Author';
    
    this.wrapper.innerHTML = `
          <img class="preview__image" src="${image}" alt="${title}" />
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${author}</div>
          </div>
        `;
  }
}
  
// Register the component
customElements.define('book-preview', BookPreview);
  