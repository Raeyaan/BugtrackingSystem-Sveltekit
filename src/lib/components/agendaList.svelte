<script lang="ts">
	import { deleteFormEl } from '$lib/store/deleteFormEl';
	import { disableButtons } from '$lib/store/disableButtons';
	import { selectedAgenda } from '$lib/store/selected';
	import { agendas } from '$lib/store/agendas';
	import { updateFormEl } from '$lib/store/updateForm';

	let showDescription = false;
	let selectedAgendaIndex: number | null = null;

	const updateSelectedAgenda = () => {
		if ($updateFormEl && !$disableButtons) {
			$disableButtons = true;
			$updateFormEl.submit();
		}
	};

	const deleteSelectedAgenda = () => {
		if ($deleteFormEl && !$disableButtons) {
			$disableButtons = true;
			$deleteFormEl.submit();
		}
	};

	const onMouseEnterAgenda = (e: Event) => {
		const event = e.target as HTMLDivElement;
		if (event.classList.contains('selected')) return;
		event.classList.add('agendaContainerHover');
	};

	const onMouseLeaveAgenda = (e: Event) => {
		const event = e.target as HTMLDivElement;
		event.classList.remove('agendaContainerHover');
	};

	const toggleDescription = (index: number) => {
		if (selectedAgendaIndex === index) {
			showDescription = !showDescription;
		} else {
			showDescription = true;
			selectedAgendaIndex = index;
		}
	};
</script>

<div class="agendaListContainer">
	{#if !$agendas?.length}
		<div class="emptyAgenda">
			<p>
				You have no agendas!<br /><br /> Create new agendas by using the creation form on the left.
			</p>
		</div>
	{:else}
		{#each $agendas as agenda, i (i)}
			<div
				class={`agendaContainer ${i % 2 === 0 ? 'tile' : ''} ${
					$selectedAgenda?._id === agenda._id ? 'selected' : ''
				}`}
				style={agenda.completed ? 'text-decoration: line-through;' : ''}
				role="button"
				tabindex="0"
				on:click={() => {
					$selectedAgenda = { ...agenda };
					toggleDescription(i);
				}}
				on:keydown={() => {
					$selectedAgenda = { ...agenda };
					toggleDescription(i);
				}}
				on:mouseenter={onMouseEnterAgenda}
				on:mouseleave={onMouseLeaveAgenda}
			>
				<div class="agendaName">
					{agenda.name}
				</div>
				<div class="agendaTag">
					<span class="badge"> {agenda.tag}</span>
				</div>
				<div class="agendaProgress">
					<div
						class="radial-progress"
						style={`--value:${parseInt(agenda.progress)}`}
						role="progressbar"
					>
						{parseInt(agenda.progress)}%
					</div>
				</div>
				<div class="agendaButtons">
					{#if $selectedAgenda?._id === agenda._id}
						<div
							class="deleteAgenda"
							role="button"
							tabindex={0}
							on:click={deleteSelectedAgenda}
							on:keydown={deleteSelectedAgenda}
						>
							<img
								src={!$disableButtons ? '/assets/delete.svg' : '/assets/deleteDisabled.svg'}
								alt="delete"
							/>
						</div>
						<div
							class="agendaCompleted"
							role="button"
							tabindex={0}
							on:click={updateSelectedAgenda}
							on:keydown={updateSelectedAgenda}
						>
							<img
								src={agenda?.completed ? '/assets/completed.svg' : '/assets/incomplete.svg'}
								alt="delete"
								style="width: 20px;"
							/>
						</div>
					{/if}
				</div>
			</div>
			{#if showDescription && selectedAgendaIndex === i}
				<div class="agendaDescription">
					{agenda.description}
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.agendaListContainer {
		width: 100%;
		height: 89.75vh;
		overflow-y: auto;
		overflow-x: hidden;
		background:linear-gradient(to right, #60A3D9, #bfd7ea),
		linear-gradient(to left, #60A3D9, #bfd7ea),
		linear-gradient(to bottom, #60A3D9, #bfd7ea),
		linear-gradient(to top, #60A3D9, #bfd7ea);	
		padding: 20px;
		font-family: 'Roboto', sans-serif; /* Modern font */


	}

	.agendaContainer {
		display: flex;
		width: 98.5%;
		min-height: 8vh;
		margin-top: 1vw;
		margin-left: 1vw;
		background:linear-gradient(to right, #ebf2fa, #60A3D9),
		linear-gradient(to left, #ebf2fa, #60A3D9),
		linear-gradient(to bottom, #ebf2fa, #60A3D9),
		linear-gradient(to top, #ebf2fa, #60A3D9); /* White background for agendas */
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
		transition: transform 0.2s, box-shadow 0.2s; /* Smooth transition */

	}

	.agendaContainer:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	}

	.agendaContainerHover {
		border: 1px solid #3498db; /* Blue border on hover */
	}

	.agendaName {
		width: 20%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: center;
		font-size: 16px;
		overflow-wrap: anywhere;
		color: #2c3e50; /* Darker text color */
	}

	.agendaDescription {
		width: 70%;
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
		align-content: center;
		text-align: left;
		padding-left: 1.5%;
		font-size: 16px;
		overflow-wrap: anywhere;
		background:linear-gradient(to right, #60A3D9, #bfd7ea),
		linear-gradient(to left, #60A3D9, #bfd7ea),
		linear-gradient(to bottom, #60A3D9, #bfd7ea),
		linear-gradient(to top, #60A3D9, #bfd7ea);  /* Light gray background */
		padding: 10px;
		margin-left: 1vw;
		margin-bottom: 1vw;
		color: #2c3e50; /* Darker text color */
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
	}

	.agendaTag,
	.agendaProgress {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: left;
		padding-left: 1.5%;
		font-size: 15px;
		overflow-wrap: anywhere;
		color: #2c3e50; /* Darker text color */
	}

	.agendaButtons {
		width: 5%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		text-align: center;
	}

	.deleteAgenda, .agendaCompleted {
		cursor: pointer;
		transition: transform 0.2s;
	}

	.deleteAgenda:hover, .agendaCompleted:hover {
		transform: scale(1.1);
	}

	.emptyAgenda {
		display: flex;
		height: 80%;
		width: 80%;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: center;
		color: #2c3e50; /* Darker text color */
		font-size: 18px;
	}

	.tile {
		background-color: #ecf0f1; /* Light gray background */
	}

	.selected {
		border: 2px solid #3498db; /* Blue border for selected */
	}

	@media screen and (max-width: 420px) {
		.agendaName {
			width: 25%;
		}

		.agendaButtons {
			padding-right: 8%;
		}
	}
</style>