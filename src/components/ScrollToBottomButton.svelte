<script>
	// imports
	import { onMount } from "svelte";

	// state variables
	let browserWindow;
	let chatPageDomElement;
	let isAtBottom = false;

	// component lifecycle
	onMount(() => {
		browserWindow = window;
		chatPageDomElement = document.getElementById("chat-page-section");

		let height = chatPageDomElement.offsetHeight;
		let scrollPosition = document.documentElement.scrollTop;
		const oldHeightDifference = height - scrollPosition;

		const intervalId = setInterval(() => {
			/*
			This function checks whether the user has scrolled to the 
			bottom of the screen. If so, 'isAtBottom' is set to 'true'.
			*/
			height = chatPageDomElement.offsetHeight;
			scrollPosition = document.documentElement.scrollTop;
			isAtBottom = height - scrollPosition === oldHeightDifference;
		}, 100);

		return () => clearInterval(intervalId);
	});

	// functions
	function scrollToBottom() {
		browserWindow.scrollTo({
			top: chatPageDomElement.scrollHeight,
			behavior: "smooth",
		});
	}
</script>

{#if !isAtBottom}
	<button
		on:click={scrollToBottom}
		class="fixed bottom-[4.5rem] left-1/2 -translate-x-1/2 rounded px-2 bg-emerald-500 hover:bg-emerald-300"
	>
		<i class="ri-arrow-down-line text-zinc-800 text-2xl"></i>
	</button>
{/if}
