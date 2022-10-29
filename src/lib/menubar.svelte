<script>
    import { page } from '$app/stores'
    export let count
    let username = ""
    function redirect() {
        window.location.href = `/users/${username}`
    }
    const user = $page.url.pathname.split('/users/')[1]
    page.subscribe(value => {
        const user = value.url.pathname.split('/users/')[1]
        const exceptions = ['wasteof.money', 'willy.', 'someonewithalongername', 'wwwwwwwwwwwwwwwwwwwww', 'david (admin)', 'name with a space in it', 'banned-user.1', 'banned-user.2', 'banned-user.3', 'banned-user.4', 'banned-user.5', 'banned-user.6', 'banned-user.7', 'banned-user.8', 'banned-user.9', 'banned-user.10', 'banned-user.11', 'banned-user.12', '._.']
        const valid = /^[a-z0-9_\\-]{1,20}$/.test(user) || exceptions.includes(user)
        if (user !== undefined && valid) {
            username = user
        } else {
            username = ""
        }
    })
    if (user !== undefined) {
        username = user
    }
</script>
<div class="w-screen bg-blue-900 p-2 grid place-items-center fixed top-0 border-b-2 border-b-black z-50">
    <div>
        <a data-sveltekit-prefetch href="/" class="grid place-items-center">
            <img src="/logo.png" alt="wasteofstats" title="Logo by @micahlt" class="h-10 mb-1">
        </a>
        <form class="bg-blue-900 border-gray-100 border-2 invalid:border-gray-200" on:submit|preventDefault={redirect} >
            <input required minlength="1" maxlength="20" type="text" name="name" bind:value={username} class="p-2 bg-blue-900 invalid:border-blue-900 text-white focus:outline-none active:outline-none focus:w-[80vw] active:bg-blue-700 hover:bg-blue-800 transition ease-in-out delay-75" placeholder="go to user..." /><button class="p-2 bg-blue-900 hover:bg-blue-800 focus:outline-none active:outline-none active:bg-blue-700 transition ease-in-out delay-75 text-white ml-0" type="submit">Go</button>
        </form>
    </div>
    <a data-sveltekit-prefetch href="/users" class="text-gray-100 mt-1 hover:text-gray-200 transition ease-in-out">wasteof.money currently has {count} users</a>
</div>