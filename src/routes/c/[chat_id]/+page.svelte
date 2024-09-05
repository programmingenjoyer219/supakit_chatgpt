<script>
	// imports
	import PromptForm from "$components/PromptForm.svelte";
	import Message from "$components/Message.svelte";
	import { page } from "$app/stores";
	import { onDestroy, onMount, afterUpdate } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { getUser } from "$lib/stores/user.js";
	import { marked } from "marked";
	import ScrollToBottomButton from "$components/ScrollToBottomButton.svelte";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";

	// reactive declarations
	$: chat_id = +$page?.params?.chat_id;
	$: {
		if (chat_id) fetchMessages();
	}

	// state variables
	let messages = [];
	let messagesChannel;
	let chatPageDomElement;
	let browserWindow;

	// component lifecycle
	onMount(async () => {
		chatPageDomElement = document.getElementById("chat-page-section");
		browserWindow = window;

		console.log("Supabase subscription added: Messages table");
		fetchMessages();

		try {
			const { id: user_id } = await getUser();
			/*
			This channel will only listen to the changes corresponding 
			to the current user's records.
			*/
			messagesChannel = supabase
				.channel("messages-channel")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "messages",
						filter: `user_id=eq.${user_id}`,
					},
					(payload) => {
						console.log("Change received in messages table!");
						if (!payload.errors) {
							console.log("fetching fresh data for messages...");
							fetchMessages();
						}
					}
				)
				.subscribe();
		} catch (error) {
			console.error("Subscription to Messages Table failed: " + error);
		}
	});

	afterUpdate(() => {
		scrollToBottom();
	});

	onDestroy(() => {
		try {
			supabase.removeChannel(messagesChannel);
			console.log("Supabase subscription removed: Messages Table");
		} catch (error) {
			console.error("Unsubscribing from Messages Table failed: " + error);
		}
	});

	// functions
	async function fetchMessages() {
		if (!chat_id) {
			return;
		}

		try {
			let { data, error } = await supabase
				.from("messages")
				.select("id, role, content")
				.eq("chat_id", chat_id)
				.order("created_at", { ascending: true });

			if (error) throw new Error("Error fetching messages: " + error);

			messages = data;
		} catch (err) {
			console.error(err);
			toastNotifications.addToast("yellow", "Error fetching messages.");
		}
	}

	function scrollToBottom() {
		browserWindow.scrollTo({
			top: chatPageDomElement.scrollHeight,
			behavior: "smooth",
		});
	}
</script>

<ScrollToBottomButton />

<section
	id="chat-page-section"
	class="min-h-screen container mx-auto max-w-4xl py-[5rem] px-4 flex flex-col lg:pt-[1rem]"
>
	<!-- message section -->
	<div class="flex flex-col gap-6 flex-1">
		{#if messages.length > 0}
			{#each messages as { id, role, content } (id)}
				<Message {role}>{@html marked(content)}</Message>
			{/each}
		{:else}
			<div class="text-emerald-300 text-center">
				<p class="text-xl">Enter a prompt to start using ChatGPT</p>
				<div class="py-4 grid place-content-center">
					<i class="ri-arrow-down-circle-fill text-3xl animate-bounce"></i>
				</div>
			</div>
		{/if}
	</div>
	<!-- prompt form -->
	<PromptForm {chat_id} />
</section>
