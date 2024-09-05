<script>
	// imports
	import "../app.css";
	import "remixicon/fonts/remixicon.css";
	import Login from "$components/Login.svelte";
	import Sidebar from "$components/Sidebar.svelte";
	import { user } from "$lib/stores/user.js";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";
	import CustomToast from "$components/CustomToast.svelte";

	// reactive declarations
	$: loggedIn = !!$user;
</script>

<main class="bg-zinc-800 min-h-screen">
	{#if !loggedIn}
		<Login />
	{:else}
		<ul class="z-20 fixed top-4 right-4 space-y-2">
			{#each $toastNotifications as { id, color, iconClass, message }}
				<li>
					<CustomToast {id} {color} {iconClass} {message} />
				</li>
			{/each}
		</ul>

		<Sidebar />

		<slot></slot>
	{/if}
</main>
