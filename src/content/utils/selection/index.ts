import { Highlight } from './highlight';
import { debounce } from 'lodash-es';

export class SelectionManager {
  protected selectChangeHandlers = [];
  // lock a selction, means when selection change, we won't emit onSelectionChange
  protected locked = false;
  protected selection: Selection;
  protected highlight: Highlight;
  protected savedRange: Range;

  public text: string = '';
  public selectionBoundingRect?: DOMRect;

  constructor() {
    this.setup();
    this.highlight = new Highlight();
  }

  get activeSelection() {
    return this.selection;
  }

  get isLocked() {
    return this.locked;
  }

  public onSelectionChange = (cb: (selection: Selection) => void) => {
    this.selectChangeHandlers.push(cb);

    return () => {
      this.selectChangeHandlers = this.selectChangeHandlers.filter(
        (handler) => handler != cb
      );
    };
  };

  public setLock(locked: boolean) {
    if (this.locked === locked) {
      return;
    }

    this.locked = locked;

    if (locked) {
      this.savedRange = this.selection.getRangeAt(0);
      this.setText();
      this.setBoundingRect();
      this.highlight.highlight(this.savedRange);
    } else {
      this.restoreRange();
      this.selection.removeAllRanges();
      this.setText();
      this.setBoundingRect();
      this.highlight.unhighlight();
    }
  }

  public append(text: string) {
    this.restoreRange();
    this.selection.collapseToEnd();
    const textNode = document.createTextNode(text);

    if (location.host.includes('feishu')) {
      if (!document.execCommand('insertText', false, text)) {
        this.selection.getRangeAt(0).insertNode(textNode);
      }
    } else {
      this.selection.getRangeAt(0).insertNode(textNode);
    }
  }

  public replace(text: string) {
    this.restoreRange();
    this.selection.deleteFromDocument();
    const textNode = document.createTextNode(text);

    this.selection.getRangeAt(0).insertNode(textNode);
  }

  private setup() {
    // listen keyup and check if there is a selection
    document.addEventListener(
      'mouseup',
      // debounce the event
      debounce(() => {
        if (this.locked) {
          return;
        }

        this.selection = window.getSelection();
        const valid =
          this.selection.anchorOffset !== this.selection.focusOffset;

        if (valid) {
          this.setBoundingRect();
          this.selectChangeHandlers.forEach((handler) =>
            handler(this.selection)
          );
        }
      }, 300)
    );
  }

  private setText() {
    this.text = this.selection.toString();
  }

  private setBoundingRect() {
    if (this.selection.rangeCount === 0) {
      console.log('no selection valiable');
      this.selectionBoundingRect = undefined;

      return;
    }

    const range = this.selection.getRangeAt(0);

    this.selectionBoundingRect = range.getBoundingClientRect();
  }

  private restoreRange() {
    this.selection.removeAllRanges();
    this.selection.addRange(this.savedRange);
  }
}
