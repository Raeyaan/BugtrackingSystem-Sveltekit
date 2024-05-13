import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';


export default {
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      input: 'src/main.js',
	  external: ['mock-aws-s3', 'aws-sdk', 'nock'],
    },
  },
  optimizeDeps: {
    exclude: ['@mapbox/node-pre-gyp'],
  },
};