<script>
	// imports
	import { onMount } from "svelte";
	import { Toast } from "flowbite-svelte";
	import { blur } from "svelte/transition";
	import { toastNotifications } from "$lib/stores/toastNotifications.js";

	// props
	export let id;
	export let color;
	export let iconClass;
	export let message;

	// state variables
	let toastStatus = true;
	let counter = 6;

	// functions
	function trigger() {
		toastStatus = true;
		counter = 6;
		timeout();
	}

	function timeout() {
		if (--counter > 0) return setTimeout(timeout, 1000);
		toastStatus = false;
		toastNotifications.removeToast(id);
	}

	// component lifecycle
	onMount(trigger);
</script>

<div
	class="fixed top-4 right-4 bg-{color}-500 border-2 border-{color}-300 text-white rounded-md px-2 flex items-center sm:hidden p-2"
>
	<i class="{iconClass} text-white"></i>
	<span class="text-sm ml-1 animate-pulse">{message}</span>
</div>

<Toast
	transition={blur}
	bind:toastStatus
	{color}
	class="bg-zinc-700 border-2 border-{color}-300 text-white rounded-md hidden sm:flex items-center gap-2"
>
	<svelte:fragment slot="icon">
		<i class={iconClass}></i>
		<span class="sr-only">Warning icon</span>
	</svelte:fragment>
	{message}
</Toast>
