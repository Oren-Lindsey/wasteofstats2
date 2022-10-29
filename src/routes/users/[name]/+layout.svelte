<script>
    export let data
    import Title from '$lib/Title.svelte'
    import Subtitle from '$lib/Subtitle.svelte'
    let {user} = data
    import {onMount} from 'svelte'
    let colors = {
        red: "#f87171",
        orange: "#fb923c",
        yellow: "#facc15",
        green: "#4ade80",
        teal: "#2dd4bf",
        blue: "#60a5fa",
        indigo: "#818cf8",
        fuchsia: "#e879f9",
        gray: "#9ca3af"
    }
    onMount(() => {
        document.getElementById('main').style.backgroundImage = `url(https://api.wasteof.money/users/${user.name}/banner)`
        document.getElementById('main').style.backgroundPosition = `center center`
        document.getElementById('main').style.backgroundRepeat = `no-repeat`
        document.getElementById('main').style.backgroundSize = `cover`
        document.getElementById('color').style.backgroundColor = colors[user.color]
    })
</script>
<div id="color" class="grid place-items-center w-full m-4 px-0 pt-0 p-4 border-2 border-black min-h-fit">
<div id="main" class="grid place-items-center border-black border-b-2 w-full">
<a class="relative top-10" href="https://wasteof.money/@{user.name}"><img src="https://api.wasteof.money/users/{user.name}/picture" alt="{user.name}'s profile picture" class="block h-24 w-24 rounded-full border-4 border-black bg-white object-cover dark:border-gray-800 z-10" /></a>
</div>
<div class="mt-10 grid place-items-center">
<Title link="https://wasteof.money/@{user.name}">@{user.name}</Title>
<Subtitle>"{user.bio}"</Subtitle>
</div>
</div>
<slot />