import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import esbuild from 'rollup-plugin-esbuild';
import { terser } from '@rollup/plugin-terser'; // Add for additional minification

export default {
  input: 'index.html', // Ensure this file exists and is correct
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'public', // Ensure this directory is writable and accessible
  },
  preserveEntrySignatures: false,

  plugins: [
    // Use HTML as a Rollup entrypoint
    html({
      minify: true,
    }),
    // Resolve bare module imports
    nodeResolve({
      browser: true, // Ensure browser-compatible module resolution
      preferBuiltins: false, // Fix issues with Node.js built-ins
    }),
    // Minify and transpile JS
    esbuild({
      minify: true,
      target: ['es2017', 'chrome64', 'firefox67', 'safari11.1'], // Adjust based on browser support
    }),
    // Bundle assets referenced via import.meta.url
    importMetaAssets(),
    // Minify HTML and CSS tagged template literals
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.html'],
      plugins: [
        [
          'babel-plugin-template-html-minifier',
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    // Additional minification for better optimization
    terser(),
  ],
};
