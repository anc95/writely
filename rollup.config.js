import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import replace from 'rollup-plugin-replace';
import builtins from 'rollup-plugin-node-builtins';

const tag = 'writely-container';

const baseConfig = (name) => ({
  plugins: [
    nodeResolve({
      browser: true,
      extensions: ['.tsx', '.ts', '.js']
    }),
    commonjs(),
    builtins(),
    json(),
    postcss({
      inject:
        name === 'content'
          ? (css) => {
              return `
            var setWritelyStyle = function() {
              setTimeout(() => {
                try {
                  var root = document.getElementsByTagName('${tag}')[0].shadowRoot;
                  var style = document.createElement('style');
                  style.type = 'text/css';
                  root.insertBefore(style);
                  style.innerHTML = ${css};
                } catch {
                  setWritelyStyle()
                }
              }, 1000)
            };
            setWritelyStyle();
          `;
            }
          : true,
      plugins: [tailwindcss, autoprefixer],
    }),
    typescript(),
    copy({
      targets: [
        {
          src: ['./src/options/index.html'],
          dest: ['./dist/options'],
        },
        {
          src: ['./src/popup/index.html'],
          dest: ['./dist/popup'],
        },
        {
          src: ['./node_modules/animate.css/animate.css'],
          dest: ['./dist/content'],
        },
      ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});

/**
 * @type {import('rollup').RollupOptions}
 */
const config = ['content', 'options', 'popup', 'background'].map((entry) => {
  return {
    ...baseConfig(entry),
    input: `src/${entry}/index`,
    output: {
      file: `dist/${entry}/index.js`,
      format: 'esm',
      globals: {
        punycode: `{
          toASCII: function(x) {
            return x;
          },
          toUnicode: function(x) {
            return x;
          }
        }`,
      },
    },
  };
});

export default config;
