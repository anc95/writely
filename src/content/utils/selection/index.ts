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
  public position: { x: number; y: number };

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
      this.savedRange = this.selection.getRangeAt(0).cloneRange();
      this.setText();
      // TODO:
      // this.highlight.highlight(this.savedRange);
    } else {
      this.restoreRange();
      // this.selection.removeAllRanges();
      this.setText();
      // this.highlight.unhighlight();
    }
  }

  public async append(text?: string, replace?: boolean) {
    this.restoreRange();
    const container = this.selection.getRangeAt(0).commonAncestorContainer;

    // for input/text-area. In most case we selected the parent selection. not themself
    const inputNode = [...container.childNodes].find(
      (child) => child.nodeName === 'TEXTAREA' || child.nodeName === 'INPUT'
    );

    if (inputNode) {
      this.selection.getRangeAt(0).selectNode(inputNode);

      if (!replace) {
        this.selection.collapseToEnd();
      }

      (inputNode as any).focus();
      return document.execCommand('insertText', false, text);
    } else {
      if (!replace) {
        this.selection.collapseToEnd();
      }
      return document.execCommand('paste');
    }
  }

  public replace(text?: string) {
    this.append(text, true);
  }

  private setup() {
    // listen keyup and check if there is a selection
    document.addEventListener(
      'mouseup',
      // debounce the event
      debounce((e) => {
        this.selection = window.getSelection();

        const valid = !!this.selection.toString();

        if (valid) {
          this.position = {
            x: Math.max(e.x - 30, 10),
            y: e.y + 10,
          };
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

  private restoreRange() {
    this.selection.removeAllRanges();
    this.selection.addRange(this.savedRange);
  }
}
