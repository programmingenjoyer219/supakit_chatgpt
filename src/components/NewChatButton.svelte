<script>
	// imports
	import { Button } from "flowbite-svelte";
	import { getUser } from "$lib/stores/user.js";
	import { supabase } from "$lib/supabaseClient";
	import { goto } from "$app/navigation";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";

	// functions
	async function addNewChat() {
		try {
			const { id: user_id } = await getUser();

			const { data, error } = await supabase
				.from("chats")
				.insert([{ user_id, chat_name: "New Chat" }])
				.select("id");

			if (error) throw new Error("Error creating a new chat: " + error);
			goto(`/c/${data[0].id}`);
			toastNotifications.addToast("green", "New chat created successfully.");
		} catch (err) {
			console.error(err);
			toastNotifications.addToast("red", "Error creating a new chat.");
		}
	}
</script>

<Button
	on:click={addNewChat}
	class="bg-emerald-500 hover:bg-emerald-700 border border-emerald-500 hover:border-emerald-300 !ring-0 text-zinc-700 hover:text-emerald-300 transition-all duration-200 w-full"
>
	<span>New Chat</span>
	<i class="ri-add-fill ml-4"></i>
</Button>
