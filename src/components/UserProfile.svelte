<script>
	// imports
	import { Button, Dropdown, DropdownItem, Avatar } from "flowbite-svelte";
	import { signOut } from "$lib/signOut.js";
	import { user } from "$lib/stores/user.js";
</script>

<Button
	id="avatar_with_name"
	class="!p-0.5 !ring-0 rounded-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-300"
>
	<!-- This API takes username as a query parameter and creates a user profile picture -->
	<Avatar
		src={`https://ui-avatars.com/api/?name=${$user?.user_metadata?.name}&background=059669&color=fff`}
	/>
</Button>

<Dropdown
	triggeredBy="#avatar_with_name"
	headerClass="py-0 rounded-t-md"
	footerClass="py-0 rounded-t-md"
	containerClass="rounded-md p-1 bg-zinc-800 shadow-md text-emerald-500"
>
	<div slot="header" class="px-4 py-2">
		<!-- Only display user's first name -->
		<span class="block text-sm">{$user?.user_metadata?.name.split(" ")[0]}</span
		>
		<span class="block truncate text-sm font-medium">{$user?.email}</span>
	</div>
	<DropdownItem
		on:click={() => signOut()}
		slot="footer"
		class="transition-all duration-200 rounded-md bg-emerald-500 border border-emerald-500 text-zinc-800 hover:bg-zinc-800 hover:text-emerald-300 hover:border-emerald-300"
		>Sign out</DropdownItem
	>
</Dropdown>
