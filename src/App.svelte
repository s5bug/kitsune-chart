<script lang="ts">
	import {onMount, afterUpdate, onDestroy} from 'svelte';
	import { Chart, registerables } from 'chart.js';
	Chart.register(...registerables);
	import 'chartjs-adapter-date-fns';
	import ChartStreaming from 'chartjs-plugin-streaming';
	Chart.register(ChartStreaming);
	let chart: Chart = null;
	let chartRef: HTMLCanvasElement;

	const beginning = new Date("2021-07-22T00:00:00.000Z");

	let blueData = [];
	let redData = [];
	let greenData = [];
	let yellowData = [];

	onMount(() => {
    	chart = new Chart(chartRef, {
			type: "line",
      		data: {
				datasets: []
			},
			options: {
        		scales: {
            		x: {
                		type: 'time',
						time: {
                    		displayFormats: {
                        		hour: 'yyyy-MM-dd HH:mm:ss',
								day: 'yyyy-MM-dd',
                    		}
                		},
						grid: {
							borderColor: "rgb(255, 255, 255)",
							color: "rgb(86, 86, 86)"
						},
					},
					y: {
						min: 0,
						grid: {
							color: "rgb(86, 86, 86)",
						},
						ticks: {
							color: "rgb(153, 153, 153)",
						},
					}
				},
				plugins: {
					tooltip: {
      		   			mode: 'index',
         				intersect: true
      				},
				},
			},
    	});
  	});
	afterUpdate(() => {
		if (!chart) return;

    	chart.update("none");
  	});
	onDestroy(() => {
		chart = null;
	});

	export let wsUrl: string;
	const socket = new WebSocket(wsUrl);

	import { subDays } from 'date-fns';

	socket.addEventListener("open", (event) => {
		const now = new Date();

		const request = {
			earliest: beginning.toISOString(),
			latest: now.toISOString(),
		};

		socket.send(JSON.stringify(request));
	});

	type KitsuneScore = {
		timestamp: string,
		count: number,
		blueScore: number,
		blueCount: number,
		redScore: number,
		redCount: number,
		greenScore: number,
		greenCount: number,
		yellowScore: number,
		yellowCount: number,
	};

	socket.addEventListener("message", (event) => {
		const data: KitsuneScore = JSON.parse(event.data);
		const date: Date = new Date(data.timestamp);

		const { blueScore, redScore, greenScore, yellowScore } = data;

		blueData.push({x: date, y: blueScore});
		redData.push({x: date, y: redScore});
		greenData.push({x: date, y: greenScore});
		yellowData.push({x: date, y: yellowScore});

		chartRef = chartRef;

		if (chart) {
			chart.data = {
				datasets: [
					{
						data: blueData,
						label: "Blue Score",
						backgroundColor: "rgb(66, 133, 244)",
						borderColor: "rgb(66, 133, 244)",
					},
					{
						data: redData,
						label: "Red Score",
						backgroundColor: "rgb(223, 67, 54)",
						borderColor: "rgb(223, 67, 54)",
					},
					{
						data: greenData,
						label: "Green Score",
						backgroundColor: "rgb(107, 197, 90)",
						borderColor: "rgb(107, 197, 90)",
					},
					{
						data: yellowData,
						label: "Yellow Score",
						backgroundColor: "rgb(251, 188, 4)",
						borderColor: "rgb(251, 188, 4)",
					},
				]
			};
		}
	});
</script>

<main>
	<canvas bind:this={chartRef}></canvas>
</main>
