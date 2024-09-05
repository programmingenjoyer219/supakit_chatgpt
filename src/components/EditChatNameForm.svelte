<script>
	// imports
	import { Label, Button } from "flowbite-svelte";
	import { supabase } from "$lib/supabaseClient.js";
	import { getContext } from "svelte";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";

	// props
	export let chat_id;
	/*
  This will be used to close the prompt window on 
  form submission if submission is successfull.
  */
	const { closePromptWindow } = getContext("close prompt");

	// state variables
	let loading = false;
	let newName = "";
	let formError = "";

	// functions
	async function editChat() {
		loading = true;
		if (!newName.trim().length) {
			formError = "Please don't leave the entry empty.";
			loading = false;
			return;
		}

		try {
			const { error } = await supabase
				.from("chats")
				.update({ chat_name: newName })
				.eq("id", chat_id);

			if (error) throw new Error("Error editing chat: " + error);
			closePromptWindow();
		} catch (err) {
			console.error(err);
			formError = "Something went wrong. Try later.";
			toastNotifications.addToast("red", "Error editing chat.");
		} finally {
			loading = false;
		}
	}
</script>

<form
	on:submit|preventDefault={editChat}
	class="bg-zinc-700 rounded-md px-8 py-6 space-y-4"
>
	<div class="flex flex-col w-full gap-2">
		<Label for="edit_chat_name" class="text-lg font-semibold text-white">
			Edit chat name
		</Label>
		<!-- form errors -->
		{#if formError}
			<span class="text-sm text-red-500 font-medium">{formError}</span>
		{/if}
		<!-- form input -->
		<input
			class="!ring-0 !border-none !outline-emerald-500 text-sm bg-zinc-500 px-2 py-2 rounded-md text-white"
			id="edit_chat_name"
			bind:value={newName}
		/>
	</div>
	<!-- submit button -->
	<Button
		class="w-full bg-emerald-500 hover:bg-emerald-700 border border-emerald-500 hover:border-emerald-300 !ring-0 text-zinc-700 hover:text-emerald-300 transition-all duration-200"
		type="submit"
		disabled={loading}
	>
		{#if loading}
			<i class="ri-openai-fill text-white animate-spin text-2xl"></i>
		{:else}
			Submit
		{/if}
	</Button>
</form>
