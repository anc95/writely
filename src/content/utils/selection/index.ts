import { Highlight } from './highlight'
import { debounce } from 'lodash-es'
export class SelectionManager {
  protected selectChangeHandlers = []
  // lock a selction, means when selection change, we won't emit onSelectionChange
  protected locked = false
  protected selection: Selection
  protected highlight: Highlight
  protected savedRange: Range
  private textPasted: boolean

  public text: string = ''
  public position: { x: number; y: number }

  constructor() {
    this.setup()
    this.highlight = new Highlight()
  }

  get activeSelection() {
    return this.selection
  }

  get isLocked() {
    return this.locked
  }

  public onSelectionChange = (cb: (selection: Selection) => void) => {
    this.selectChangeHandlers.push(cb)

    return () => {
      this.selectChangeHandlers = this.selectChangeHandlers.filter(
        (handler) => handler != cb
      )
    }
  }

  public setLock(locked: boolean) {
    if (this.locked === locked) {
      return
    }

    this.locked = locked

    if (!locked) {
      this.textPasted = false
    }
  }

  public async append(text?: string, replace?: boolean) {
    this.restoreRange()
    const container = this.selection.getRangeAt(0).commonAncestorContainer

    // for input/text-area. In most case we selected the parent selection. not themself
    const inputNode = [...container.childNodes].find(
      (child) => child.nodeName === 'TEXTAREA' || child.nodeName === 'INPUT'
    )

    if (inputNode) {
      this.selection.getRangeAt(0).selectNode(inputNode)

      if (!replace) {
        this.selection.collapseToEnd()
      }

      ;(inputNode as any).focus()
      return document.execCommand('insertText', false, text)
    } else {
      if (!replace) {
        this.selection.collapseToEnd()
        container?.parentElement?.focus?.()
      }

      // don't know why. but at first time settimeout excute paste actions, everything works as expected
      if (this.textPasted) {
        document.execCommand('paste')
      } else {
        setTimeout(() => {
          document.execCommand('paste')
          this.textPasted = true
        }, 100)
      }
    }
  }

  public replace(text?: string) {
    this.append(text, true)
  }

  private setup() {
    // debounce the event
    const eventHandler = debounce((e: MouseEvent) => {
      this.selection =
        (e.target as any)?.ownerDocument?.getSelection() ||
        window.getSelection()

      const valid = !!this.selection.toString()

      if (valid) {
        this.position = {
          x: Math.max(e.x - 30, 10),
          y: e.y + 10,
        }

        if (!this.locked) {
          this.savedRange = this.selection.getRangeAt(0).cloneRange()
          this.setText()
        }

        this.selectChangeHandlers.forEach((handler) => handler(this.selection))
      }
    }, 300)

    // listen keyup and check if there is a selection
    document.addEventListener('mouseup', eventHandler, true)

    // bind mouseup for every iframes
    const iframes = [...document.getElementsByTagName('iframe')]
    iframes.forEach((f) => {
      if (f.contentDocument) {
        f.contentDocument.addEventListener('mouseup', eventHandler, true)
      }
    })
  }

  private setText() {
    this.text = this.selection.toString()
  }

  private restoreRange() {
    this.selection.removeAllRanges()
    this.selection.addRange(this.savedRange)

    // clone a new copy, to prevent it's being altered
    this.savedRange = this.savedRange.cloneRange()
  }
}
