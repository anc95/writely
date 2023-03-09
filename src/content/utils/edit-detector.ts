import { useState } from 'react';

class EditDetector {
  private activeElement: HTMLElement;
  private timerId = null;

  public get boundingReact() {
    return this.activeElement.getBoundingClientRect();
  }

  public useVisibility = () => {
    const [visible, setVisible] = useState<boolean>(false);

    window.addEventListener('focusin', (e) => {
      if (isEditable(e.target as HTMLElement)) {
        this.activeElement = e.target as HTMLElement;
        setVisible(true);
      }
    });

    window.addEventListener('blur', (e) => {
      if (e.target !== this.activeElement) {
        return;
      }

      clearTimeout(this.timerId);

      this.timerId = setTimeout(() => {
        this.activeElement = null;
        setVisible(false);
      }, 1000);
    });

    return visible;
  };

  public keepFocus = () => {
    clearTimeout(this.timerId);
    setTimeout(() => this.activeElement.focus(), 100);
  };
}

const isEditable = (ele: HTMLElement) => {
  if (!ele) {
    return false;
  }

  if (
    ele.nodeType.toString().toLowerCase() === 'textarea' ||
    ele.isContentEditable
  ) {
    return true;
  }

  return isEditable(ele.parentElement);
};

export const editDetecor = new EditDetector();
