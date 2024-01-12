import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  'html, body': {
    display: 'flex',
    flexGrow: 1,
    minHeight: '100%',
    flexDirection: 'column',
  },
});

export default defineConfig({
  globalCss,
  // Whether to use css reset
  preflight: true,

  presets: [
    '@pandacss/preset-base',
    '@pandacss/preset-panda',
    '@park-ui/panda-preset',
  ],

  // Where to look for your css declarations
  include: [
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',

  // Useful for theme customization
  // theme: {
  //   extend: {
  //     slotRecipes: {
  //       select: selectRecipe,
  //     },
  //     recipes: {
  //       input: inputRecipe,
  //       formLabel: formLabel,
  //     },
  //   },
  // },

  // The output directory for your css system
  outdir: 'styled-system',
});
