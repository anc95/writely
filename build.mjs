import autoprefixer from 'autoprefixer';
import esbuild from 'esbuild';
import stylePlugin from 'esbuild-style-plugin';
import tailwindcss from 'tailwindcss';
import chokidar from 'chokidar';
import { copy } from 'esbuild-plugin-copy';

const outdir = 'dist';

async function runEsbuild() {
  await esbuild.build({
    entryPoints: [
      'src/content/index.tsx',
      'src/background.ts',
      'src/popup/index.tsx',
    ],
    bundle: true,
    outdir: outdir,
    treeShaking: true,
    minify: true,
    legalComments: 'none',
    jsxFactory: 'React.ceateElement',
    jsxFragment: 'React.Fragment',
    jsx: 'transform',
    loader: {
      '.png': 'dataurl',
    },
    plugins: [
      stylePlugin({
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      }),
      copy({
        resolveFrom: 'cwd',
        assets: [
          {
            from: ['./src/**/index.html'],
            to: ['./dist'],
          },
        ],
      }),
    ],
  });
}

const build = () => {
  runEsbuild();
};

if (process.argv[2] == '-w') {
  chokidar.watch('src').on('all', () => {
    console.log('updating...');
    build();
  });
}
