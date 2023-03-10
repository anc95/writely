import { defineConfig } from "tsup";
import { copy } from "esbuild-plugin-copy";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const tag = "writely-container";

export default defineConfig({
  entry: [
    "./src/content/index.tsx",
    "./src/options/index.tsx",
    "./src/popup/index.tsx",
    "./src/background/index.ts",
  ],
  format: "esm",
  splitting: false,
  sourcemap: false,
  clean: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  injectStyle: (css) => {
    return `
        var setWritelyStyle = function() {
          setTimeout(() => {
            try {
              var style = document.createElement('style');
              style.type = 'text/css';
              style.innerHTML = ${css};
              var root;
              if (document.getElementsByTagName('${tag}')[0]) {
                root = document.getElementsByTagName('${tag}')[0].shadowRoot
              } else {
                root = document.head || document.getElementsByTagName('head')[0];
              }
              root.appendChild(style)
            } catch {
              setWritelyStyle()
            }
          }, 1000)
        };
        setWritelyStyle();
      `;
  },
  outExtension: () => ({ js: ".js" }),
  esbuildPlugins: [
    NodeModulesPolyfillPlugin(),
    copy({
      assets: [
        {
          from: ["./src/options/index.html"],
          to: ["./options"],
        },
        {
          from: ["./src/popup/index.html"],
          to: ["./popup"],
        },
        {
          from: ["./node_modules/animate.css/animate.css"],
          to: ["./content"],
        },
      ],
      watch: true,
    }),
  ],
});
