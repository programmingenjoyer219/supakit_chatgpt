<script>
	// imports
	import { Button } from "flowbite-svelte";
	import { signInWithGoogle } from "$lib/signIn.js";

	// state variables
	let loadingState = false;

	// functions
	async function handleClick() {
		loadingState = true;
		signInWithGoogle();
	}
</script>

<section>
	<div class="min-h-screen grid place-content-center place-items-center gap-4">
		<h1 class="text-5xl font-bold text-emerald-500">ChatGPT</h1>
		<i
			class="ri-openai-fill text-emerald-500 text-9xl {loadingState &&
				'animate-spin'}"
		></i>
		<Button
			on:click={handleClick}
			disabled={loadingState}
			class="bg-emerald-500 hover:bg-zinc-800 text-zinc-800 border border-emerald-500 hover:border-emerald-300 hover:text-emerald-300 space-x-2 text-xl transition-all duration-200 !ring-0"
		>
			<span>Login</span>
			<i class="ri-google-fill"></i>
		</Button>
	</div>
</section>
