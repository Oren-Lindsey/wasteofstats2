<script>
    export let data
    import { Line } from 'svelte-chartjs';
    import 'luxon'
    import 'chartjs-adapter-luxon'
    import {
        Chart,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
        LineElement,
        PointElement,
        TimeScale,
    } from 'chart.js';
    Chart.register(
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LineElement,
        PointElement,
        LinearScale,
        TimeScale,
    );
    import Subtitle from '$lib/Subtitle.svelte';
    import Block from '$lib/Block.svelte'
    import Title from '$lib/Title.svelte'
    let {user, posts} = data
    let {stats} = user
    let graphdata = graph()
    let graphoptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        second: 'MMM d, yyyy'
                    }
                },
                adapters: {
                    date: {
                        zone: 'UTC+6'
                    }
                },
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }
    function graph() {
        if (data.graph) {
            let labels = []
            for (let i = 0; i < data.graph.timestamp.length; i++) {
                let timestamp = data.graph.timestamp[i] * 1000
                const myDateTime = new Date(timestamp)
                const myDateTimeISO = myDateTime.toISOString()
                labels.push(new Date(myDateTimeISO))
            }
            let graphdata = {
                labels: labels,
                datasets: [
                    {
                        label: 'Followers',
                        data: data.graph.followers,
                        backgroundColor: ["rgb(30 58 138 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(30 58 138 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Following',
                        data: data.graph.following,
                        backgroundColor: ["#818cf8"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["#818cf8"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Posts',
                        data: data.graph.posts,
                        backgroundColor: ["rgb(253 224 71 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(253 224 71 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
            return graphdata
        } else {
            return null
        }
    }
    const dateJoined = new Date(user.history.joined)
    const now = new Date(Date.now())
    var time = now.getTime() - dateJoined.getTime();
    var dayssince = time / (1000 * 3600 * 24);
    const followersPerDay = round(user.stats.followers / dayssince)
    const followingPerDay = round(user.stats.following / dayssince)
    const postsPerDay = round(user.stats.posts / dayssince)
    const commentsPerDay = round(user.stats.comments / dayssince)
    function round(num) {
        return Math.ceil(num * 100) / 100;
    }
</script>
<Title link="#stats">Statistics</Title>
<Subtitle>Followers: {stats.followers} (~{followersPerDay} per day)</Subtitle>
<Subtitle>Following: {stats.following} (~{followingPerDay} per day)</Subtitle>
<Subtitle>Posts: {stats.posts} (~{postsPerDay} per day)</Subtitle>
<Subtitle>Comments: {stats.comments} (~{commentsPerDay} per day)</Subtitle>
<a data-sveltekit-prefetch href="/users/{user.name}/graphs" class="text-blue-900 hover:text-blue-800 grid place-items-center">See full stats</a>
<a data-sveltekit-prefetch href="/compare?user1={user.name}" class="text-blue-900 hover:text-blue-800 grid place-items-center">Compare user</a>
{#if data.graph}
<Title link="#graph">Stats over time (incomplete)</Title>
<Subtitle>Tracked by: @Ankit_Anmol</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={graphdata} options={graphoptions} />
</div>
</div>
{/if}
<Title link="#posts">Latest posts</Title>
<div class="grid place-items-center grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
{#each posts as post}
<Block title="@{post.poster.name} on {new Date(post.time).toLocaleString()}:">
<a href="https://wasteof.money/posts/{post.id}">
<Subtitle>{@html ` ${post.content} `}</Subtitle>
<div class="grid grid-cols-3 place-items-center">
<div class="grid grid-cols-2 w-fit"><p class="inline -mr-4 -mt-[0.1rem]">{post.loves}</p><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg></div>
<div class="grid grid-cols-2 w-fit"><p class="inline -mr-4 -mt-[0.1rem]">{post.reposts}</p><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" aria-hidden="true" role="img" viewBox="0 0 24 24"><path d="M11.6 3.4l-.8-.8c-.5-.6-.4-1.5.3-1.8.4-.3 1-.2 1.4.2a509.8 509.8 0 012.7 2.7c.5.4.5 1.2.1 1.6l-2.8 2.9c-.5.5-1.3.5-1.8-.1-.3-.5-.2-1 .2-1.5l.8-1H7a4.3 4.3 0 00-4.1 4.7 2036.2 2036.2 0 01.2 8h2.4c.5 0 .8.2 1 .6.2.4.2.9 0 1.2-.2.4-.6.6-1 .6H1.8c-.7 0-1.2-.5-1.2-1.1v-.2V10c0-1.3.3-2.5 1-3.6 1.3-2 3.2-3 5.6-3h4.4zM12.3 18.3h4.6c2.3 0 4.2-2 4.2-4.3V5.9c0-.2 0-.2-.2-.2h-2.3c-.6 0-1-.3-1.2-.8a1.2 1.2 0 011.1-1.6h3.6c.8 0 1.3.5 1.3 1.3v9c0 1.1-.1 2.2-.6 3.2a6.4 6.4 0 01-5.6 3.7l-4.6.1h-.2l.7.8c.4.4.5.9.3 1.3-.3.8-1.3 1-1.9.4L9 20.6l-.4-.5c-.3-.4-.3-1 0-1.4l2.9-3c.6-.6 1.7-.3 2 .6 0 .4 0 .7-.3 1l-.9 1z" fill="currentColor"></path></svg></div>
<div class="grid grid-cols-2 w-fit"><p class="inline -left-4 -mt-[0.1rem]">{post.comments}</p><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"></path></svg></div>
</div>
</a>
</Block>
{/each}
</div>