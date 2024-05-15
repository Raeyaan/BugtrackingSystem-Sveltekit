<script lang="ts">
	import { deleteFormEl } from '$lib/store/deleteFormEl';
	import { disableButtons } from '$lib/store/disableButtons';
	import { selectedAgenda } from '$lib/store/selected';
	import { agendas } from '$lib/store/agendas';
	import { updateFormEl } from '$lib/store/updateForm';

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
				on:click={() => ($selectedAgenda = { ...agenda })}
				on:keydown={() => ($selectedAgenda = { ...agenda })}
				on:mouseenter={onMouseEnterAgenda}
				on:mouseleave={onMouseLeaveAgenda}
			>
				<div class="agendaName">
					{agenda.name}
				</div>
				<div class="agendaDescription">
					{agenda.description}
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
						{parseInt(agenda.progress)}
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
		{/each}
	{/if}
</div>

<style>
	.agendaListContainer {
		width: 100%;
		height: 89.75vh;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.agendaContainer {
		display: flex;
		width: 98.5%;
		min-height: 8vh;
		margin-top: 1vw;
		margin-left: 1vw;
	}

	.agendaContainerHover {
		border: 1px dashed black;
	}

	.agendaName {
		width: 20%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: center;
		font-size: 15px;
		overflow-wrap: anywhere;
	}

	.agendaDescription,
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
	}

	.agendaButtons {
		width: 5%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		text-align: center;
	}

	.deleteAgenda {
		cursor: pointer;
	}

	.agendaCompleted {
		cursor: pointer;
	}

	.emptyAgenda {
		display: flex;
		height: 80%;
		width: 80%;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: center;
	}

	.tile {
		background-color: rgb(231, 228, 228);
	}

	.selected {
		border: 2px solid black;
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
