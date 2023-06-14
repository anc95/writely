import { getSetting } from './store/settings'

class Logger {
  private _debug = false

  constructor() {
    this.init()
  }

  private async init() {
    const settings = await getSetting()

    if (settings.debug) {
      this._debug = true
    }
  }

  public debug = (...args) => {
    if (this._debug) {
      console.debug(...args)
    }
  }
}

const logger = new Logger()

export { logger }
