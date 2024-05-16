<script lang="ts">
	import { goto } from '$app/navigation';
	import AgendaList from '$lib/components/agendaList.svelte';
	import { deleteFormEl } from '$lib/store/deleteFormEl.js';
	import { selectedAgenda } from '$lib/store/selected.js';
	import { agendas } from '$lib/store/agendas.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { disableButtons } from '$lib/store/disableButtons.js';
	import { updateFormEl } from '$lib/store/updateForm.js';
	import { filterOption } from '$lib/store/filterOption.js';
	import Swal from 'sweetalert2';

	export let data;
	export let form;

	let createInput = '';
	let createInputTag = '';
	let createInputProgress = '';
	let createTextArea = '';
	let updateInput = '';
	let updateInputTag = '';
	let updateInputProgress = '';
	let updateTextArea = '';

	let index: number = 0;

	const getFilteredAgendas = (filter: string | null) => {
		if (filter) {
			if (filter === 'incomplete') return data.userAgendas.filter((agenda) => !agenda.completed);
			if (filter === 'complete') return data.userAgendas.filter((agenda) => agenda.completed);
		}
		return data.userAgendas;
	};

	$: if (form?.errorMsg) {
		Swal.fire({
			title: 'Error',
			html: `<p style="font-size: 16px;">${form.errorMsg}</p>`,
			icon: 'error',
			confirmButtonText: '<div style="color: #000000;">Okay</div>',
			confirmButtonColor: '#e7e4e4'
		});
		form.errorMsg = '';
	}

	$: $agendas = data.userAgendas;
	$: $agendas = getFilteredAgendas($filterOption);

	$: updateInput = $selectedAgenda?.name ?? '';
	$: updateInputTag = $selectedAgenda?.tag ?? '';
	$: updateInputProgress = $selectedAgenda?.progress ?? '';
	$: updateTextArea = $selectedAgenda?.description ?? '';

	$: index = $agendas.findIndex((agendaData) => agendaData._id === $selectedAgenda?._id);
	$: $selectedAgenda = form?.index ? $agendas[Number(form.index)] : null;

	const handleCreateNameUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		createInput = event.value;
	};
	const handleCreateTagUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		createInputTag = event.value;
	};
	const handleCreateProgressUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		if (parseInt(event.value)! > 100) createInputProgress = event.value;
	};

	const handleCreateDescUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLTextAreaElement;
		createTextArea = event.value;
	};

	const handleUpdateNameUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		updateInput = event.value;
	};
	const handleUpdateTagUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		updateInputTag = event.value;
	};
	const handleUpdateProgressUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		updateInputProgress = event.value;
	};

	const handleUpdateDescUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLTextAreaElement;
		updateTextArea = event.value;
	};

	const handleSubmit: SubmitFunction = () => {
		$disableButtons = true;
		createInput = '';
		createTextArea = '';
		return async ({ update }) => {
			await update();
			$disableButtons = false;
		};
	};

	const handleFilterOption = (e: Event) => {
		if (form?.index) form.index = '-1';
		const event = e.currentTarget as HTMLDivElement;
		if (event && $filterOption) {
			const oldFilterEl = document.getElementById($filterOption)!;
			oldFilterEl.classList.remove('selectedFilterOption');
			oldFilterEl.style.backgroundImage = 'linear-gradient(to right, #60A3D9, #ebf2fa)';
			oldFilterEl.style.backgroundImage ='linear-gradient(to top,  #60A3D9, #ebf2fa)';
			oldFilterEl.style.backgroundImage ='linear-gradient(to top,  #60A3D9, #ebf2fa)';
			oldFilterEl.style.backgroundImage ='linear-gradient(to top,  #60A3D9, #ebf2fa)';

			$filterOption = event.id;
			event.classList.add('selectedFilterOption');
			event.style.backgroundImage = 'linear-gradient(to right, #ebf2fa, #ebf2fa)';
			event.style.backgroundImage ='linear-gradient(to top,  #ebf2fa, #ebf2fa)';
			event.style.backgroundImage ='linear-gradient(to top,  #ebf2fa, #ebf2fa)';
			event.style.backgroundImage ='linear-gradient(to top,  #ebf2fa, #ebf2fa)';
		
	};
}
</script>

<div class="mainContainer">
	<div class="header">
		<div class="githubLinkContainer">
			<div class="github">
				<a
					href="https://github.com/Raeyaan/BugtrackingSystem-Sveltekit"
					target="_blank"
					rel="noreferrer noopener">GitHub Code</a
				>
			</div>
		</div>
		<div class="title">Software Development Management</div>
		<div class="logoutButtonContainer">
			<div
				class="logout btn"
				role="button"
				tabindex={0}
				on:click={() => goto('/logout')}
				on:keydown={() => goto('/logout')}
			>
				Logout
			</div>
		</div>
	</div>
	<div class="agendaContainer">
		<div class="createModifyContainer">
			<div class="createAgendaContainer">
				<div class="createFormHeader">Create Agenda</div>
				<form method="POST" action="?/create" class="createForm" use:enhance={handleSubmit}>
					<label for="name">Name:</label>
					<input
						type="text"
						name="name"
						value={createInput}
						on:input={handleCreateNameUpdate}
						maxlength={50}
						class="input input-bordered w-full max-w-xs"
					/>
					<div style={`text-align: right; ${createInput.length > 50 ? 'color: red' : ''}`}>
						{`${createInput.length} / 50`}
					</div>
					<label for="tag">Tag:</label>
					<select name="tag" value={createInputTag} on:change={handleCreateTagUpdate}>
						<option value="">Select Tag</option>
						<option value="bug">Bug</option>
						<option value="feature request">Feature Request</option>
						<option value="issue">Issue</option>
					</select>
					<label for="progress">Progress:</label>
					<input
						type="number"
						name="progress"
						value={createInputProgress}
						on:input={handleCreateProgressUpdate}
						maxlength={3}
						class="input input-bordered w-full input-sm max-w-xs"
					/>

					<label for="description">Description:</label>
					<textarea
						class="textarea descriptionInput"
						placeholder="Bio"
						name="description"
						value={createTextArea}
						on:input={handleCreateDescUpdate}
						maxlength={400}
					/>
					<div style={`text-align: right; ${createTextArea.length > 400 ? 'color: red' : ''}`}>
						{`${createTextArea.length} / 400`}
					</div>
					<div class="createButtonContainer">
						<button class="btn" disabled={$disableButtons}>Create</button>
					</div>
				</form>
			</div>
			<div class="modifyDeleteAgendaContainer">
				<div class="modifyContainer">
					{#if $selectedAgenda}
						<div class="createFormHeader">Modify Agenda</div>
						<form method="POST" action="?/update" class="createForm" use:enhance={handleSubmit}>
							<label for="name">Name:</label>
							<input name="id" value={$selectedAgenda._id} style="display: none;" />
							<input name="index" value={index} style="display: none;" />
							<input name="completed" value={$selectedAgenda?.completed} style="display: none;" />
							<input
								type="text"
								name="name"
								value={updateInput}
								on:input={handleUpdateNameUpdate}
								maxlength={50}
								class="input input-bordered w-full max-w-xs"
							/>
							<div style={`text-align: right; ${updateInput.length > 50 ? 'color: red' : ''}`}>
								{`${updateInput.length} / 50`}
							</div>
							<label for="tag">Tag:</label>
							<select name="tag" value={updateInputTag} on:change={handleUpdateTagUpdate}>
								<option value="">Select Tag</option>
								<option value="bug">Bug</option>
								<option value="feature request">Feature Request</option>
								<option value="issue">Issue</option>
							</select>
							<label for="progress">Progress:</label>
							<input
								type="number"
								name="progress"
								value={updateInputProgress}
								on:input={handleUpdateProgressUpdate}
								maxlength={3}
								class="input input-bordered input-sm w-full max-w-xs"
							/>

							<label for="description">Description:</label>
							<textarea
								class="textarea descriptionInput"
								placeholder="Bio"
								name="description"
								value={updateTextArea}
								on:input={handleUpdateDescUpdate}
								maxlength={400}
							/>
							<div style={`text-align: right; ${updateTextArea.length > 400 ? 'color: red' : ''}`}>
								{`${updateTextArea.length} / 400`}
							</div>
							<div class="createButtonContainer">
								<button class="btn" disabled={$disableButtons}>Update</button>
							</div>
						</form>
					{/if}
				</div>
				<div class="hiddenFormContainer">
					<form
						method="POST"
						action="?/delete"
						bind:this={$deleteFormEl}
						use:enhance={handleSubmit}
					>
						<input name="id" value={$selectedAgenda?._id ?? 0} />
					</form>
				</div>
				<div class="hiddenFormContainer">
					<form
						method="POST"
						action="?/updateCompleted"
						bind:this={$updateFormEl}
						use:enhance={handleSubmit}
					>
						<input name="id" value={$selectedAgenda?._id ?? 0} />
						<input name="completed" value={!$selectedAgenda?.completed ?? false} />
						<input name="index" value={index} />
						<input name="tag" value={$selectedAgenda?.tag} />
						<input name="progress" value={$selectedAgenda?.progress} />
					</form>
				</div>
			</div>
		</div>
		<div class="listFilterContainer">
			<div class="filterAgenda tabs tabs-lifted">
				<div
					id="all"
					class={`filterOption tab ${
						$filterOption === 'all' ? 'selectedFilterOption tab-active' : ''
					}`}
					role="button"
					tabindex={0}
					on:click={handleFilterOption}
					on:keydown={handleFilterOption}
				>
					All
				</div>
				<div
					id="incomplete"
					class={`filterOption tab ${
						$filterOption === 'incomplete' ? 'selectedFilterOption tab-active' : ''
					}`}
					role="button"
					tabindex={0}
					on:click={handleFilterOption}
					on:keydown={handleFilterOption}
				>
					Incomplete
				</div>
				<div
					id="complete"
					class={`filterOption tab ${
						$filterOption === 'complete' ? 'selectedFilterOption tab-active' : ''
					}`}
					role="button"
					tabindex={0}
					on:click={handleFilterOption}
					on:keydown={handleFilterOption}
				>
					Complete
				</div>
			</div>
			<AgendaList />
		</div>
	</div>
</div>

<style>
	label {
		text-align: center;
		align-content: center;
		justify-content: center;
	}

	.mainContainer {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: hidden;
		background-color: #f0f0f0; /* Light gray background */
	}

	.header {
		display: flex;
		justify-content: space-between;
		width: 100vw;
		min-height: 7vh;
		border-bottom: 1px solid #333; /* Dark gray border */
		background-color: #0b3954; /* Dark blue header */
	}

	.githubLinkContainer {
		display: flex;
		width: 33%;
		justify-content: left;
		align-content: center;
		padding-left: 5vw;
		font-size: 17.5px;
		color: #ecf0f1; /* Light gray text color */
	}

	.github {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		text-align: center;
		cursor: pointer;
	}

	.github a {
		text-decoration: none;
		color: #ecf0f1; /* Light gray text color */
	}

	.github a:hover {
		color: #e67e22; /* Orange hover color */
		text-decoration: underline;
	}

	.title {
		display: flex;
		flex-wrap: wrap;
		width: 33%;
		justify-content: center;
		text-align: center;
		align-content: center;
		font-size: 30px;
		color: #ecf0f1; /* Light gray text color */
	}

	.logoutButtonContainer {
		display: flex;
		width: 33%;
		justify-content: right;
		padding-right: 5vw;
		padding-top: 0.6em;
		font-size: 17.5px;
		color: #ecf0f1; /* Light gray text color */
	}

	.logout {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		text-align: center;
		cursor: pointer;
	}

	.logout:hover {
		color: #e67e22; /* Orange hover color */
		text-decoration: underline;
	}

	.agendaContainer {
		display: flex;
		flex-direction: row;
		height: 100vh;
		border-top: none;
  border-right: 0;
  border-bottom: 0px;
  border-left: 0px;
	
	}

	.createModifyContainer {
		display: flex;
		width: 25%;
		flex-direction: column;
		overflow-y: visible;
		padding-left: 5px;
		padding-right: 5px;
		justify-content: space-evenly;
		background:linear-gradient(to right, #bfd7ea, #60A3D9); 
		border-top: none;
  border-right: 0;
  border-bottom: 0px;
  border-left: 0px;
		

	}

	.createAgendaContainer {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		background-color: #bdc3c7;
		box-sizing: border-box;
		border-radius: 10px;

	}

	.createFormHeader {
		width: 100%;
		text-align: center;
		padding-top: 1vh;
		font-size: 18px;
		background-color: #0b3954; /* Dark blue header */
		color: #ecf0f1; /* Light gray text color */
		border-radius: 10px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;

	}

	.createForm {
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;

		padding-left: 3vw;
		padding-right: 3vw;
		background-color: #ebf2fa; /* Light gray form background */
	}

	.createForm input {
		border: none;
		border: solid 1px #333; /* Dark gray border */
		border-radius: 5px;
	}

	.createForm textarea {
		border: none;
		border: solid 1px #333; /* Dark gray border */
		border-radius: 5px;
	}

	.createForm label {
		text-align: left;
		color: #333; /* Dark gray text color */
	}

	.descriptionInput {
		width: 100%;
		resize: none;
	}

	.createButtonContainer {
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 5%;
		
	}
	.createButtonContainer  :hover{
		background-color: #ff6663;

	}

	.modifyDeleteAgendaContainer {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #bdc3c7;
		border-radius: 10px;
		box-sizing:border-box;

		
	}

	.modifyContainer {
		display: flex;
		flex-direction: column;
		align-content: center;
		
	}

	.hiddenFormContainer {
		display: none;
	}

	.errorMessage {
		position: relative;
		align-content: center;
		justify-content: center;
		text-align: center;
		color: #e74c3c; /* Red error message color */
		font-size: 0.75vw;
		padding-left: 1vw;
		padding-right: 1vw;
	}

	.crossIcon {
		position: absolute;
		top: -80%;
		right: 2.5%;
		cursor: pointer;
		color: #333; /* Dark gray cross icon color */
	}

	.listFilterContainer {
		width: 800%;
		min-height: 100%;
	
		
		
	}

	.filterAgenda {
		display: flex;
		justify-content: left;
		text-align: center;
		background:linear-gradient(to right, #60A3D9, #f9f9f9),
		linear-gradient(to left,  #f9f9f9, #60A3D9),
		linear-gradient(to bottom,  #f9f9f9, #60A3D9),
		linear-gradient(to top,  #f9f9f9, #60A3D9);
	
	}

	.filterOption {
		margin-top: 0.5vw;
		margin-left: 1vw;
		margin-right: 1vw;
		color: #e67e22; /* Orange filter option color */
		text-decoration: underline;
		cursor: pointer;
	}

	.selectedFilterOption {
		color: #333; /* Dark gray selected filter option color */
		text-decoration: none;
		cursor: default;
	}
	
	@media screen and (max-width: 650px) {
		button {
			padding-top: 1vh;
			font-size: 16px;
		}

		.title {
			font-size: 24px;
		}

		.githubLinkContainer {
			padding-left: 2vw;
			font-size: 15px;
		}

		.logoutButtonContainer {
			padding-right: 2vw;
			font-size: 18px;
		}

		.createFormHeader {
			padding-bottom: 1vh;
		}

		.createForm {
			font-size: 16px;
		}
	}

	@media screen and (max-width: 400px) {
		button {
			padding-top: 1vh;
			font-size: 14px;
		}

		.title {
			margin-left: 3vw;
			font-size: 18px;
		}

		.githubLinkContainer {
			padding-left: 1vw;
			font-size: 13px;
		}

		.logoutButtonContainer {
			padding-right: 1vw;
			font-size: 15px;
		}

		.createFormHeader {
			padding-bottom: 1vh;
			font-size: 14px;
		}

		.createForm {
			font-size: 12px;
		}
	}

	@media screen and (min-width: 1200px) {
		.githubLinkContainer {
			padding-left: 4vw;
		}

		.header {
			height: 6vh;
		}

		.logoutButtonContainer {
			padding-right: 4vw;
		}
	}
</style>
