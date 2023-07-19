/******/ ;(() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ './node_modules/electron-selected-text/lib/index.js':
      /*!**********************************************************!*\
  !*** ./node_modules/electron-selected-text/lib/index.js ***!
  \**********************************************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        'use strict'

        var __awaiter =
          (this && this.__awaiter) ||
          function (thisArg, _arguments, P, generator) {
            function adopt(value) {
              return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value)
                  })
            }
            return new (P || (P = Promise))(function (resolve, reject) {
              function fulfilled(value) {
                try {
                  step(generator.next(value))
                } catch (e) {
                  reject(e)
                }
              }
              function rejected(value) {
                try {
                  step(generator['throw'](value))
                } catch (e) {
                  reject(e)
                }
              }
              function step(result) {
                result.done
                  ? resolve(result.value)
                  : adopt(result.value).then(fulfilled, rejected)
              }
              step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
              )
            })
          }
        var __generator =
          (this && this.__generator) ||
          function (thisArg, body) {
            var _ = {
                label: 0,
                sent: function () {
                  if (t[0] & 1) throw t[1]
                  return t[1]
                },
                trys: [],
                ops: [],
              },
              f,
              y,
              t,
              g
            return (
              (g = { next: verb(0), throw: verb(1), return: verb(2) }),
              typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                  return this
                }),
              g
            )
            function verb(n) {
              return function (v) {
                return step([n, v])
              }
            }
            function step(op) {
              if (f) throw new TypeError('Generator is already executing.')
              while (_)
                try {
                  if (
                    ((f = 1),
                    y &&
                      (t =
                        op[0] & 2
                          ? y['return']
                          : op[0]
                          ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                          : y.next) &&
                      !(t = t.call(y, op[1])).done)
                  )
                    return t
                  if (((y = 0), t)) op = [op[0] & 2, t.value]
                  switch (op[0]) {
                    case 0:
                    case 1:
                      t = op
                      break
                    case 4:
                      _.label++
                      return { value: op[1], done: false }
                    case 5:
                      _.label++
                      y = op[1]
                      op = [0]
                      continue
                    case 7:
                      op = _.ops.pop()
                      _.trys.pop()
                      continue
                    default:
                      if (
                        !((t = _.trys),
                        (t = t.length > 0 && t[t.length - 1])) &&
                        (op[0] === 6 || op[0] === 2)
                      ) {
                        _ = 0
                        continue
                      }
                      if (
                        op[0] === 3 &&
                        (!t || (op[1] > t[0] && op[1] < t[3]))
                      ) {
                        _.label = op[1]
                        break
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1]
                        t = op
                        break
                      }
                      if (t && _.label < t[2]) {
                        _.label = t[2]
                        _.ops.push(op)
                        break
                      }
                      if (t[2]) _.ops.pop()
                      _.trys.pop()
                      continue
                  }
                  op = body.call(thisArg, _)
                } catch (e) {
                  op = [6, e]
                  y = 0
                } finally {
                  f = t = 0
                }
              if (op[0] & 5) throw op[1]
              return { value: op[0] ? op[1] : void 0, done: true }
            }
          }
        Object.defineProperty(exports, '__esModule', { value: true })
        exports.unregisterShortcut =
          exports.registerShortcut =
          exports.getSelectedText =
            void 0
        var electron_1 = __webpack_require__(/*! electron */ 'electron')
        var robotjs_1 = __webpack_require__(
          /*! robotjs */ './node_modules/robotjs/index.js'
        )
        /**
         * Gets selected text by synthesizing the keyboard shortcut
         * "CommandOrControl+c" then reading text from the clipboard
         */
        var getSelectedText = function () {
          return __awaiter(void 0, void 0, void 0, function () {
            var currentClipboardContent, selectedText
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  currentClipboardContent = electron_1.clipboard.readText()
                  electron_1.clipboard.clear()
                  robotjs_1.keyTap(
                    'c',
                    process.platform === 'darwin' ? 'command' : 'control'
                  )
                  return [
                    4 /*yield*/,
                    new Promise(function (resolve) {
                      return setTimeout(resolve, 200)
                    }),
                  ]
                case 1:
                  _a.sent() // add a delay before checking clipboard
                  selectedText = electron_1.clipboard.readText()
                  electron_1.clipboard.writeText(currentClipboardContent)
                  return [2 /*return*/, selectedText]
              }
            })
          })
        }
        exports.getSelectedText = getSelectedText
        /**
         * Registers a global shortcut of `accelerator`. The `callback` is called
         * with the selected text when the registered shorcut is pressed by the user
         *
         * Returns `true` if the shortcut was registered successfully
         */
        var registerShortcut = function (accelerator, callback) {
          return electron_1.globalShortcut.register(accelerator, function () {
            return __awaiter(void 0, void 0, void 0, function () {
              var _a
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    _a = callback
                    return [4 /*yield*/, exports.getSelectedText()]
                  case 1:
                    _a.apply(void 0, [_b.sent()])
                    return [2 /*return*/]
                }
              })
            })
          })
        }
        exports.registerShortcut = registerShortcut
        /**
         * Unregisters a global shortcut of `accelerator` and
         * is equivalent to electron.globalShortcut.unregister
         */
        var unregisterShortcut = function (accelerator) {
          electron_1.globalShortcut.unregister(accelerator)
        }
        exports.unregisterShortcut = unregisterShortcut

        /***/
      },

    /***/ './node_modules/robotjs/build/Release/robotjs.node':
      /*!*********************************************************!*\
  !*** ./node_modules/robotjs/build/Release/robotjs.node ***!
  \*********************************************************/
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {
        module.exports = require(__webpack_require__.ab +
          'build/Release/robotjs.node')

        /***/
      },

    /***/ './node_modules/robotjs/index.js':
      /*!***************************************!*\
  !*** ./node_modules/robotjs/index.js ***!
  \***************************************/
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {
        var robotjs = __webpack_require__(
          /*! ./build/Release/robotjs.node */ './node_modules/robotjs/build/Release/robotjs.node'
        )

        module.exports = robotjs

        module.exports.screen = {}

        function bitmap(
          width,
          height,
          byteWidth,
          bitsPerPixel,
          bytesPerPixel,
          image
        ) {
          this.width = width
          this.height = height
          this.byteWidth = byteWidth
          this.bitsPerPixel = bitsPerPixel
          this.bytesPerPixel = bytesPerPixel
          this.image = image

          this.colorAt = function (x, y) {
            return robotjs.getColor(this, x, y)
          }
        }

        module.exports.screen.capture = function (x, y, width, height) {
          //If coords have been passed, use them.
          if (
            typeof x !== 'undefined' &&
            typeof y !== 'undefined' &&
            typeof width !== 'undefined' &&
            typeof height !== 'undefined'
          ) {
            b = robotjs.captureScreen(x, y, width, height)
          } else {
            b = robotjs.captureScreen()
          }

          return new bitmap(
            b.width,
            b.height,
            b.byteWidth,
            b.bitsPerPixel,
            b.bytesPerPixel,
            b.image
          )
        }

        /***/
      },

    /***/ electron:
      /*!***************************!*\
  !*** external "electron" ***!
  \***************************/
      /***/ (module) => {
        'use strict'
        module.exports = require('electron')

        /***/
      },

    /******/
  }
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {}
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId]
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    })
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    )
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat get default export */
  /******/ ;(() => {
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = (module) => {
      /******/ var getter =
        module && module.__esModule
          ? /******/ () => module['default']
          : /******/ () => module
      /******/ __webpack_require__.d(getter, { a: getter })
      /******/ return getter
      /******/
    }
    /******/
  })()
  /******/
  /******/ /* webpack/runtime/define property getters */
  /******/ ;(() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          })
          /******/
        }
        /******/
      }
      /******/
    }
    /******/
  })()
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ ;(() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop)
    /******/
  })()
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ ;(() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module',
        })
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true })
      /******/
    }
    /******/
  })()
  /******/
  /******/ /* webpack/runtime/compat */
  /******/
  /******/ if (typeof __webpack_require__ !== 'undefined')
    __webpack_require__.ab = __dirname + '/native_modules/'
  /******/
  /************************************************************************/
  var __webpack_exports__ = {}
  // This entry need to be wrapped in an IIFE because it need to be in strict mode.
  ;(() => {
    'use strict'
    /*!************************************!*\
  !*** ./src/electron/main/index.ts ***!
  \************************************/
    __webpack_require__.r(__webpack_exports__)
    /* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(/*! electron */ 'electron')
    /* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default =
      /*#__PURE__*/ __webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__)
    /* harmony import */ var electron_selected_text__WEBPACK_IMPORTED_MODULE_1__ =
      __webpack_require__(
        /*! electron-selected-text */ './node_modules/electron-selected-text/lib/index.js'
      )
    /* harmony import */ var electron_selected_text__WEBPACK_IMPORTED_MODULE_1___default =
      /*#__PURE__*/ __webpack_require__.n(
        electron_selected_text__WEBPACK_IMPORTED_MODULE_1__
      )

    let mainWindow
    let tray
    function createWindow() {
      mainWindow = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({
        width: 800,
        height: 600,
        // webPreferences: {
        //   preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        //   contextIsolation: true,
        //   nodeIntegration: false,
        // },
      })
      console.log('http://localhost:3000/main_window')
      mainWindow.loadURL('http://localhost:3000/main_window')
      mainWindow.webContents.openDevTools()
    }
    electron__WEBPACK_IMPORTED_MODULE_0__.app.whenReady().then(() => {
      createWindow()
      ;(0,
      electron_selected_text__WEBPACK_IMPORTED_MODULE_1__.registerShortcut)(
        'Alt+w',
        async () => {
          console.log(
            `Selected Text: ${await (0,
            electron_selected_text__WEBPACK_IMPORTED_MODULE_1__.getSelectedText)()}`
          )
          mainWindow.show()
          mainWindow.center()
        }
      )
      const icon = electron__WEBPACK_IMPORTED_MODULE_0__.nativeImage
        .createFromPath('src/icon.png')
        .resize({ width: 16, height: 16 })
      tray = new electron__WEBPACK_IMPORTED_MODULE_0__.Tray(icon)
      // note: your contextMenu, Tooltip and Title code will go here!
      const contextMenu =
        electron__WEBPACK_IMPORTED_MODULE_0__.Menu.buildFromTemplate([
          {
            label: 'Settings',
            type: 'normal',
            click: () => {
              createWindow()
            },
          },
          {
            label: 'Help',
            type: 'normal',
            click: () => {
              let win = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow(
                { width: 800, height: 600 }
              )
              win.loadURL('https://github.com/anc95/writely')
            },
          },
          // https://www.electronjs.org/docs/latest/api/app#appsetloginitemsettingssettings-macos-windows
          // { label: 'Launch at login', type: 'radio', checked: true },
          {
            label: 'Quit',
            type: 'normal',
            click: () => electron__WEBPACK_IMPORTED_MODULE_0__.app.quit(),
          },
        ])
      tray.setContextMenu(contextMenu)
      tray.setToolTip('Writely')
    })
  })()

  module.exports = __webpack_exports__
  /******/
})()
//# sourceMappingURL=index.js.map
