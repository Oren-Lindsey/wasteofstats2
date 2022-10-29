<script>
    import Title from '$lib/Title.svelte'
    import Subtitle from '$lib/Subtitle.svelte';
    export let data
</script>
<Title link="/users">wasteof.money currently has {data.count} users</Title>
<Subtitle>The current version of wasteof.money was released at {new Date(parseInt(data.time)).toLocaleString()}</Subtitle>