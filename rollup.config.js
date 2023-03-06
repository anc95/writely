import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import replace from 'rollup-plugin-replace';

const tag = 'writely-container';

const baseConfig = (name) => ({
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
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
const config = ['content', 'options', 'popup'].map((entry) => {
  return {
    ...baseConfig(entry),
    input: `src/${entry}/index.tsx`,
    output: {
      file: `dist/${entry}/index.js`,
      format: 'esm',
    },
  };
});

export default config;
