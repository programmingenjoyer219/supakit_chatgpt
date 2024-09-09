<script>
	// imports
	import { page } from "$app/stores";

	// reactive declarations
	$: ({
		error: { message },
		status,
	} = $page);
</script>

<section
	class="container mx-auto min-h-dvh grid place-content-center text-center gap-4 text-yellow-400"
>
	{#if status === 404}
		<i class="ri-robot-2-fill text-9xl"></i>
	{:else}
		<i class="ri-error-warning-fill text-9xl"></i>
	{/if}
	<h1 class="text-5xl font-bold">{status}</h1>
	<p class="text-3xl">{message}</p>
</section>
