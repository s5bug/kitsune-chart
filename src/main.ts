import App from './App.svelte';

const app = new App({
    target: document.body,
    props: {
        staticDataUrl: "https://kitsune-data.s5.pm/all.json?remindmeto=removethislater",
        wsUrl: "wss://kitsune-data.s5.pm/"
    }
});

export default app;