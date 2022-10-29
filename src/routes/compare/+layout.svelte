<script>
    export let data
    let {user1,user2} = data
    if (user1 !== null) user1 = user1.user
    if (user2 !== null) user2 = user2.user
    import Subtitle from "$lib/Subtitle.svelte"
    import Title from '$lib/Title.svelte'
    import Block from '$lib/Block.svelte'
    import {onMount} from "svelte"
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
    let user2name = "";let user1name = ""
    let followersPerDay1
    let followingPerDay1
    let commentsPerDay1
    let postsPerDay1
    let followersPerDay2
    let followingPerDay2
    let commentsPerDay2
    let postsPerDay2
    function round(num) {
        return Math.ceil(num * 100) / 100;
    }
    if (user1 !== null) {
        const dateJoined1 = new Date(user1.history.joined)
        const now = new Date(Date.now())
        let time1 = now.getTime() - dateJoined1.getTime();
        let dayssince1 = time1 / (1000 * 3600 * 24);
        followersPerDay1 = round(user1.stats.followers / dayssince1)
        followingPerDay1 = round(user1.stats.following / dayssince1)
        postsPerDay1 = round(user1.stats.posts / dayssince1)
        commentsPerDay1 = round(user1.stats.comments / dayssince1)
    }
    if (user2 !== null) {
        const dateJoined2 = new Date(user2.history.joined)
        const now = new Date(Date.now())
        let time2 = now.getTime() - dateJoined2.getTime();
        let dayssince2 = time2 / (1000 * 3600 * 24);
        followersPerDay2 = round(user2.stats.followers / dayssince2)
        followingPerDay2 = round(user2.stats.following / dayssince2)
        postsPerDay2 = round(user2.stats.posts / dayssince2)
        commentsPerDay2 = round(user2.stats.comments / dayssince2)
    }
    onMount(() => {
        if (user1 !== null) {
            document.getElementById('main1').style.backgroundImage = `url(https://api.wasteof.money/users/${user1.name}/banner)`
            document.getElementById('main1').style.backgroundPosition = `center center`
            document.getElementById('main1').style.backgroundRepeat = `no-repeat`
            document.getElementById('main1').style.backgroundSize = `cover`
            document.getElementById('color1').style.backgroundColor = colors[user1.color]
        }
        if (user2 !== null) {
            document.getElementById('main2').style.backgroundImage = `url(https://api.wasteof.money/users/${user2.name}/banner)`
            document.getElementById('main2').style.backgroundPosition = `center center`
            document.getElementById('main2').style.backgroundRepeat = `no-repeat`
            document.getElementById('main2').style.backgroundSize = `cover`
            document.getElementById('color2').style.backgroundColor = colors[user2.color]
        }
    })
    function redirect() {
        if (user1name == "" && user2name !== "") {
            window.location.href = `/compare?user1=${user1.name}&user2=${user2name}`
        } else if (user2name == "" && user1name !== "") {
            window.location.href = `/compare?user1=${user1name}&user2=${user2.name}`
        } else if (user1 == null && user2 == null) {
            window.location.href = `/compare?user1=${user1name}&user2=${user2name}`
        } else {
            window.location.href = `/compare?user1=${user1.name}&user2=${user2.name}`
        }
    }
</script>
<div id="color">
<div class="grid grid-cols-2 place-items-center">
<div class="mx-2 grid place-items-center">
{#if user1 !== null}
<div id="color1" class="grid place-items-center w-full m-4 px-0 pt-0 p-4 border-2 border-black min-h-fit">
    <div id="main1" class="grid place-items-center border-black border-b-2 w-full">
    <a class="relative top-10" href="https://wasteof.money/@{user1.name}"><img src="https://api.wasteof.money/users/{user1.name}/picture" alt="{user1.name}'s profile picture" class="block h-24 w-24 rounded-full border-4 border-black bg-white object-cover dark:border-gray-800 z-10" /></a>
    </div>
    <div class="mt-10 grid place-items-center">
    <Title link="https://wasteof.money/@{user1.name}">@{user1.name}</Title>
    <Subtitle>"{user1.bio}"</Subtitle>
    </div>
    </div>
<br>
<Title link="#user1">Statistics</Title>
<Subtitle>Followers: {user1.stats.followers} (~{followersPerDay1} per day)</Subtitle>
<Subtitle>Following: {user1.stats.following} (~{followingPerDay1} per day)</Subtitle>
<Subtitle>Posts: {user1.stats.posts} (~{postsPerDay1} per day)</Subtitle>
<Subtitle>Comments: {user1.stats.comments} (~{commentsPerDay1} per day)</Subtitle>
{:else}
<div class="block h-24 w-24 rounded-full border-4 border-black bg-white object-cover dark:border-gray-800" />
<Block title="Enter another username">
<form on:submit|preventDefault={redirect}>
<input required minlength="1" maxlength="20" type="text" name="user1" id="user1" bind:value={user1name} />
<div class="grid place-items-center"><button class="p-2 bg-blue-900 hover:bg-blue-800 focus:outline-none active:outline-none active:bg-blue-700 transition ease-in-out delay-75 text-white ml-0" type="submit">Go</button></div>
</form>
</Block>
{/if}
</div>
<div class="mx-2 grid place-items-center">
{#if user2 !== null}
<div id="color2" class="grid place-items-center w-full m-4 px-0 pt-0 p-4 border-2 border-black min-h-fit">
    <div id="main2" class="grid place-items-center border-black border-b-2 w-full">
    <a class="relative top-10" href="https://wasteof.money/@{user2.name}"><img src="https://api.wasteof.money/users/{user2.name}/picture" alt="{user2.name}'s profile picture" class="block h-24 w-24 rounded-full border-4 border-black bg-white object-cover dark:border-gray-800 z-10" /></a>
    </div>
    <div class="mt-10 grid place-items-center">
    <Title link="https://wasteof.money/@{user2.name}">@{user2.name}</Title>
    <Subtitle>"{user2.bio}"</Subtitle>
    </div>
</div>
<br>
<Title link="#user2">Statistics</Title>
<Subtitle>Followers: {user2.stats.followers} (~{followersPerDay2} per day)</Subtitle>
<Subtitle>Following: {user2.stats.following} (~{followingPerDay2} per day)</Subtitle>
<Subtitle>Posts: {user2.stats.posts} (~{postsPerDay2} per day)</Subtitle>
<Subtitle>Comments: {user2.stats.comments} (~{commentsPerDay2} per day)</Subtitle>
{:else}
<div class="block h-24 w-24 rounded-full border-4 border-black bg-white object-cover dark:border-gray-800" />
<Block title="Enter another username">
<form on:submit|preventDefault={redirect}>
<input required minlength="1" maxlength="20" type="text" name="user2" id="user2" bind:value={user2name} />
<div class="grid place-items-center"><button class="p-2 bg-blue-900 hover:bg-blue-800 focus:outline-none active:outline-none active:bg-blue-700 transition ease-in-out delay-75 text-white ml-0" type="submit">Go</button></div>
</form>
</Block>
{/if}
</div>
</div>
</div>
<slot />