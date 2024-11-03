class BookOverlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }
  
  connectedCallback() {
    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => {
      this.close();
    });
  }
  
  render() {
    this.shadowRoot.innerHTML = `
        <style>
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: none; /* Initially hidden */
            justify-content: center;
            align-items: center;
          }
          .content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          }
        </style>
        <div class="overlay">
          <div class="content">
            <slot></slot>
            <button class="close-button">Close</button>
          </div>
        </div>
      `;
  }
  
  open(content) {
    this.shadowRoot.querySelector('.overlay').style.display = 'flex';
    this.shadowRoot.querySelector('slot').innerHTML = content;
  }
  
  close() {
    this.shadowRoot.querySelector('.overlay').style.display = 'none';
  }
}
  
customElements.define('book-overlay', BookOverlay);
  