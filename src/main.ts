import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		wsUrl: "wss://kitsune-data.s5.pm/"
	}
});

export default app;