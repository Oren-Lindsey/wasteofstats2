<script>
    export let link
    let parsed = link
    const hash = /^#/
    if (hash.test(link)) {
        parsed = link.split('#')[1]
    }
</script>
<h2 class="text-2xl font-mono text-black" id={parsed}><a data-sveltekit-prefetch href={link}><slot /></a></h2>