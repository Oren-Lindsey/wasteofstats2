import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	ssr:{
		noExternal: ['chart.js']
	}
};

export default config;
