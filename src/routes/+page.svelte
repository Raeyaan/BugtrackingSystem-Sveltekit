<script lang="ts">
	import { onMount } from 'svelte';
	import LoginModal from '$lib/components/loginModal.svelte';
	import agendaList from '$lib/mockData/displayAgendas.json';
	import Swal from 'sweetalert2';

	export let form;

	const exampleAgendas = agendaList.agendas;

	const numberOfRows = 5;
	const numberOfColumns = 5;
	const numberOfAgendas = 18;

	const randomAgendaMap = new Map<number, string>();
	const sentences: string[] = Array(numberOfRows * numberOfColumns).fill('');
	randomAgendaMap.set(2, 'TODO');

	while (randomAgendaMap.size < numberOfAgendas) {
		const agendaLocation = Math.floor(Math.random() * numberOfRows * numberOfColumns);
		if (!randomAgendaMap.has(agendaLocation)) {
			const currentAgendas = [...randomAgendaMap.values()];
			while (!randomAgendaMap.has(agendaLocation)) {
				const randomAgenda = exampleAgendas[Math.floor(Math.random() * exampleAgendas.length)];
				if (!currentAgendas.includes(randomAgenda)) randomAgendaMap.set(agendaLocation, randomAgenda);
			}
		}
	}

	onMount(() => {
		if (form?.errorMsg) {
			Swal.fire({
				title: 'Error',
				html: `<p style="font-size: 16px;">${form.errorMsg}</p>`,
				icon: 'error',
				confirmButtonText: '<div style="color: #000000;">Okay</div>',
				confirmButtonColor: '#e7e4e4'
			});
			form.errorMsg = '';
		}

		const writeNextChar = (
			sentenceIndex: number,
			agendaIndex: number,
			length: number,
			typingSpeed: number
		) => {
			if (sentenceIndex < length) {
				sentences[agendaIndex] += randomAgendaMap.get(agendaIndex)![sentenceIndex] + '';
				setTimeout(() => {
					writeNextChar(sentenceIndex + 1, agendaIndex, length, typingSpeed);
				}, typingSpeed);
			}
			return;
		};
		for (const key of [...randomAgendaMap.keys()]) {
			let timeout: number = Math.random() * 3000;
			if (key === 2) timeout = 0;
			setTimeout(() => {
				writeNextChar(0, key, randomAgendaMap.get(key)!.length, Math.max(75, Math.random() * 125));
			}, timeout);
		}
	});
</script>

<div class="mainContainer">
	<!-- <AnimatedAgendas {numberOfRows} {numberOfColumns} {randomAgendaMap} {sentences} /> -->
	<LoginModal />
</div>

<style>
	.mainContainer {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		overflow-y: hidden;
		overflow-x: hidden;
		background-color: rgb(255, 255, 255);
	}
</style>
