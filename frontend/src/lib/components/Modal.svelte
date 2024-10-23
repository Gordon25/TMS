<script lang='ts'>
	import { createEventDispatcher } from "svelte";
	export let showModal:boolean;
  export let closeModal:()=>void;
	let dialog:HTMLDialogElement; // HTMLDialogElement
	let width:'1px';
	let height:'1px';
	let dispatch = createEventDispatcher();
	$: if (dialog && showModal) dialog.showModal();

</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={closeModal}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class='placeholder' on:click|stopPropagation>
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={() => {dialog.close(); dispatch('closeModal');}}>X</button>
		<slot/>
		
	</div>
</dialog>

<style>
	dialog {
		/* max-width: 32em; */
		border-radius: 0.5em;
		border: none;
		padding: 0;
    width:auto;
    /* height:90%; */
		overflow-y: hidden;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	.placeholder {
		margin: 1% auto;
		padding: 0 1em;
		align-items: center;
		justify-items: center;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		overflow: auto;
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
		background-color: transparent;
		margin-left: 98%;
		width:2.5%;
		height:30px;
		position: relative;
		top:0%;
		justify-content: center;
		align-items: center;
		border: transparent;
		font-size: 20px;
	}


</style>
