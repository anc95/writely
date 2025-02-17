import { defineConfig } from 'tsup'
import { copy } from 'esbuild-plugin-copy'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { execSync } from 'child_process'

let latestTag = ''

try {
  latestTag = execSync(
    'git describe --tags `git rev-list --tags --max-count=1`',
    { encoding: 'utf8' }
  ).trim()
} catch (error) {
  console.error(`执行出错: ${error.message}`)
}

const tag = 'writely-container'

export default defineConfig({
  entry: [
    './src/content/index.tsx',
    './src/options/index.tsx',
    './src/popup/index.tsx',
    './src/background/index.ts',
  ],
  target: 'chrome112',
  format: 'esm',
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.version': JSON.stringify(latestTag),
  },
  injectStyle: (css) => {
    return `
        var setWritelyStyle = function() {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = ${css};
          if (!chrome.runtime.openOptionsPage) {
            setTimeout(() => {
              try {
                var root = document.getElementsByTagName('${tag}')[0].shadowRoot;
                root.appendChild(style);    
              } catch {
                setWritelyStyle()
              }
            }, 100)
          } else {
            var root = document.head || document.getElementsByTagName('head')[0];
            root.appendChild(style)
          }
         
        };
        setWritelyStyle();
      `
  },
  outExtension: () => ({ js: '.js' }),
  esbuildPlugins: [
    NodeModulesPolyfillPlugin(),
    copy({
      assets: [
        {
          from: ['./src/options/index.html'],
          to: ['./options'],
        },
        {
          from: ['./src/popup/index.html'],
          to: ['./popup'],
        },
        {
          from: ['./node_modules/animate.css/animate.css'],
          to: ['./content'],
        },
        {
          from: ['./src/assets/*'],
          to: ['./assets'],
        },
      ],
      watch: process.env.NODE_ENV !== 'production',
    }),
  ],
})
