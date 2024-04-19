import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  prefix: 'rmrk-2d-renderer',

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  outExtension: 'js',

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: 'src/styled-system',
  jsxFramework: 'react',
});
