<script>
	// imports
	import { Drawer, CloseButton } from "flowbite-svelte";
	import { sineIn } from "svelte/easing";
	import ChatLink from "$components/ChatLink.svelte";
	import NewChatButton from "$components/NewChatButton.svelte";
	import UserProfile from "$components/UserProfile.svelte";
	import { navigating } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { getUser } from "$lib/stores/user.js";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";

	// state variables
	let hidden1 = true;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn,
	};
	let chats = [];
	let chatsChannel;

	// reactive declarations
	$: {
		if (!!$navigating) {
			hidden1 = true;
		}
	}

	// component lifecycle
	onMount(async () => {
		console.log("Supabase subscription added: Chats table");
		fetchChats();

		try {
			const { id: user_id } = await getUser();
			/*
			This channel will only listen to the changes corresponding 
			to the current user's records.
			*/
			chatsChannel = supabase
				.channel("chats-channel")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "chats",
						filter: `user_id=eq.${user_id}`,
					},
					(payload) => {
						console.log("Changes in Chats table");
						if (!payload.errors) {
							console.log("fetching fresh data from Chats Table");
							fetchChats();
						}
					}
				)
				.subscribe();
		} catch (error) {
			console.error("Subscription to Chats Table failed: " + error);
		}
	});

	onDestroy(() => {
		try {
			supabase.removeChannel(chatsChannel);
			console.log("Supabase subscription removed: Chats Table");
		} catch (error) {
			console.error("Unsubscribing from Chats Table failed: " + error);
		}
	});

	// functions
	async function fetchChats() {
		try {
			let { data, error } = await supabase
				.from("chats")
				.select("id,chat_name")
				.order("created_at", { ascending: false });

			if (error) throw new Error("Error fetching chats: " + error);

			chats = data;
		} catch (err) {
			console.error(err);
			toastNotifications.addToast("yellow", "Error fetching chats.");
		}
	}
</script>

<button
	class="z-10 fixed top-4 left-4 bg-emerald-500 hover:bg-emerald-700 border border-emerald-500 hover:border-emerald-300 !ring-0 text-zinc-700 hover:text-emerald-300 transition-all duration-200 py-2 px-4 rounded-md"
	on:click={() => (hidden1 = false)}
>
	<i class="ri-menu-line text-2xl"></i>
</button>

<Drawer
	backdrop={false}
	transitionType="fly"
	{transitionParams}
	bind:hidden={hidden1}
	id="sidebar1"
	class="bg-zinc-700 space-y-4"
>
	<div class="flex items-center">
		<UserProfile />

		<CloseButton
			on:click={() => (hidden1 = true)}
			class="text-emerald-500 hover:bg-transparent"
			id="close_drawer"
		/>
	</div>

	<NewChatButton />

	<ul class="flex flex-col gap-2 w-full overflow-y-auto">
		{#each chats as chat (chat.id)}
			<ChatLink {chat} />
		{/each}
	</ul>
</Drawer>
