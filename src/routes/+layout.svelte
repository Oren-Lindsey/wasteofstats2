<script>
    import "../app.css";
    import Menubar from "$lib/menubar.svelte";
    export let data
    let {count} = data
  </script>
  <Menubar count={count} />
  <div class="h-36"></div>
  <div class="overflow-x-hidden mx-5 grid place-items-center">
    <slot />
  </div>