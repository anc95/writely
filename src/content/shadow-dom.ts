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
    container.setAttribute('style', 'font-size:16px;');
    shadow.appendChild(container);

    /**
     * Prevent bubble, cause the host website might listen them to make thing unexpected
     * For example notion, it listens on keyup event to delete content
     * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
     * https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType
     */
    ['click', 'keydown', 'keypress', 'keyup', 'copy', 'paste'].forEach(
      (eventName) => {
        shadow.addEventListener(eventName, (e) => {
          e.stopPropagation();
        });
      }
    );
  }
}

// Define the new element
customElements.define('writely-container', WritelyContainer);

export { tag, conatinerId };
