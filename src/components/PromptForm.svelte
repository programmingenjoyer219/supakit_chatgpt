<script>
	// imports
	import { onMount } from "svelte";
	import { getUser } from "$lib/stores/user.js";
	import { supabase } from "$lib/supabaseClient";
	import { getResponseToPrompt } from "$lib/gemini.js";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";
	import { Toast } from "flowbite-svelte";
	import { blur } from "svelte/transition";

	// props
	export let chat_id;

	// state variables
	let prompt = "";
	let formError = "";
	let loading = false;
	let promptInputWidth;

	// reactive declarations
	$: rowCharLimit = Math.floor(promptInputWidth / 8.8);
	$: textareaRows = Math.min(
		Math.floor(prompt.trim().length / rowCharLimit) + 1,
		3
	);

	// component lifecycle
	onMount(() => {
		promptInputWidth = document.getElementById("prompt_input").offsetWidth;
	});

	async function handleSubmit() {
		if (prompt.trim().length === 0) {
			formError = "Please dont leave the entry empty";
			return;
		}

		loading = true;
		const userPrompt = prompt;
		prompt = "";

		try {
			const { id: user_id } = await getUser();

			const { error } = await supabase
				.from("messages")
				.insert([{ chat_id, user_id, role: "user", content: userPrompt }]);

			if (error) throw new Error("Error responding to the prompt: " + error);

			await getResponseToPrompt(userPrompt, chat_id);
		} catch (err) {
			console.error(err);
			toastNotifications.addToast(
				"red",
				"Error responding to the prompt. Try later..."
			);
		} finally {
			loading = false;
		}
	}
</script>

<!-- Custom toast notification. It's displayed when the prompt is being processed. -->
{#if loading}
	<div
		class="fixed top-4 right-4 bg-emerald-500 text-white rounded-md px-2 flex items-center sm:hidden"
	>
		<i class="ri-openai-fill text-3xl animate-spin"></i>
		<span class="text-sm ml-2 animate-pulse">Processing prompt</span>
	</div>

	<Toast
		transition={blur}
		toastStatus={true}
		color="green"
		class="bg-zinc-700 border-2 border-green-300 text-white rounded-md fixed top-4 right-4 hidden sm:flex items-center gap-2"
	>
		<svelte:fragment slot="icon">
			<i class="ri-openai-fill text-3xl animate-spin"></i>
		</svelte:fragment>
		Processing prompt
	</Toast>
{/if}

<div class="fixed bottom-4 container max-w-4xl left-1/2 -translate-x-1/2 px-4">
	{#if formError}
		<span class="text-red-500 font-medium">{formError}</span>
	{/if}

	<form
		class="flex items-start gap-2 rounded-md bg-zinc-700 p-1"
		on:submit|preventDefault={handleSubmit}
	>
		<textarea
			id="prompt_input"
			name="prompt"
			bind:value={prompt}
			rows={textareaRows}
			type="text"
			class="flex-1 resize-none bg-transparent !ring-0 !outline-emerald-500 !border-none text-white text-sm sm:text-base rounded-sm px-4"
		></textarea>

		<button
			type="submit"
			class="text-white bg-emerald-500 rounded-sm px-[4px] mt-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={prompt.trim().length === 0}
		>
			<i class="ri-send-plane-fill text-3xl"></i>
		</button>
	</form>
</div>
