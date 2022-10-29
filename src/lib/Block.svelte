<script>
    export let title
</script>
<div class="bg-gray-200 m-4 p-4 border-black border-2 w-fit h-fit">
    <h3 class="grid place-items-center text-lg text-black">{title}</h3>
    <slot />
</div>