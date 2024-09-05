<script>
	// imports
	import { Avatar } from "flowbite-svelte";
	import { user } from "$lib/stores/user.js";

	// props
	export let role = "model";
</script>

<div
	class="message-grid gap-[4px] sm:gap-[10px] p-2 sm:p-4 rounded-md {role ===
		'user' && 'bg-zinc-700'} text-zinc-300"
>
	<div class="relative">
		{#if role === "user"}
			<Avatar
				src={`https://ui-avatars.com/api/?name=${$user?.user_metadata?.name}&background=059669&color=fff`}
				class="absolute left-1 size-6 !rounded-full"
			/>
		{:else}
			<i
				class="ri-openai-fill text-2xl text-emerald-500 absolute -top-[2px] left-1"
			></i>
		{/if}
	</div>
	<p class="prose prose-invert max-w-full prose-sm sm:prose-base">
		<slot></slot>
	</p>
</div>

<style>
	.message-grid {
		display: grid;
		grid-template-columns: 2rem auto;
	}
</style>
