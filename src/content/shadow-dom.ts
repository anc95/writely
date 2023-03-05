const tag = 'writely-container';
const conatinerId = 'writely-container-id';
// Create a class for the element
class WritelyContainer extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    const container = document.createElement('div');
    container.id = conatinerId;
    shadow.appendChild(container);

    shadow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
}

// Define the new element
customElements.define('writely-container', WritelyContainer);

export { tag, conatinerId };
