<script>
	// imports
	import EditChatNameForm from "$components/EditChatNameForm.svelte";
	import { setContext } from "svelte";
	import { supabase } from "$lib/supabaseClient.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";

	// props
	export let chat;

	// reactive declarations
	$: ({ id, chat_name } = chat);

	// state variables
	let showPrompt = false;

	// functions
	async function deleteChat() {
		try {
			const { error } = await supabase.from("chats").delete().eq("id", id);

			if (error) throw new Error("Error deleting chat: " + error);

			toastNotifications.addToast("green", "Chat deleted successfully.");
			/*
			user will be redirected to '/' if they were on the chat page 
			corresponding to the deleted chat.
			*/
			if (id === +$page?.params?.chat_id) goto("/");
		} catch (err) {
			console.error(err);
			toastNotifications.addToast("red", "Error deleting chat.");
		}
	}

	function closePromptWindow() {
		showPrompt = false;
	}

	setContext("close prompt", {
		/*
			This context is used by the EditChatNameForm.svelte
			to close the prompt window on successfull form submission.
		*/
		closePromptWindow,
	});
</script>

<li
	class="rounded-md bg-zinc-800 p-2 text-white flex items-center justify-between"
>
	<!-- link to chat page -->
	<a href="/c/{id}" class="flex-1">
		<span>
			{chat_name.length < 20 ? chat_name : chat_name.slice(0, 20) + "..."}
		</span>
	</a>
	<div class="grid grid-cols-2 gap-2">
		<!-- edit chat button -->
		<button
			on:click={() => {
				showPrompt = true;
			}}
			class="rounded border border-emerald-500 text-emerald-500 px-2 hover:text-blue-400 hover:border-blue-400 transition-all duration-200"
		>
			<i class="ri-edit-fill text-lg"></i>
		</button>
		<!-- delete chat button -->
		<button
			on:click={deleteChat}
			class="rounded border border-emerald-500 text-emerald-500 px-2 hover:text-red-400 hover:border-red-400 transition-all duration-200"
		>
			<i class="ri-delete-bin-7-fill"></i>
		</button>
	</div>
</li>

{#if showPrompt}
	<!-- This button is the translucent background. Clicking it will close the prompt window -->
	<button
		on:mousedown|self={closePromptWindow}
		class="cursor-default fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-zinc-900/50"
	>
		<div class="relative">
			<!-- 'x' button on the top right -->
			<button
				on:click={closePromptWindow}
				class="absolute top-2 right-2 px-0.5 rounded"
			>
				<i class="ri-close-fill text-xl text-emerald-500"></i>
			</button>
			<!-- form : edit chat name -->
			<EditChatNameForm chat_id={id} />
		</div>
	</button>
{/if}
