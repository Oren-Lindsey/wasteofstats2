<script>
    export let data
    let {user, sort} = data
    let sortby = sort
    import { Line, Bar } from 'svelte-chartjs';
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
    import { page } from '$app/stores';
    import Subtitle from '$lib/Subtitle.svelte'
    import Title from '$lib/Title.svelte'
    import Block from '$lib/Block.svelte'
    let progress = 0
    let loading = true
    let origin = $page.url.origin
    async function getAllPosts(name) {
        let posts = []
        let page = 1
        while (true) {
            let res = await fetch(`${origin}/users/${name}/graphs/proxy?page=${page}`)
            let json = await res.json()
            posts = posts.concat(json.posts)
            page++
            progress = posts.length
            if (json.last == true) {
                loading = false
                break
            }
        }
        return posts
    }
    let posts
    let postgraphdata
    let timegraphdata
    let totalLoves = 0
    let totalComments = 0
    let totalReposts = 0
    let totalEdits = 0
    let avgLoves = 0
    let avgComments = 0
    let avgReposts = 0
    let avgEdits = 0
    let frequencygraphdata
    function frequencyGraph(p) {
        function sortByHour(posts) {
            return posts.sort((a,b) => {return new Date(a.time).getHours() - new Date(b.time).getHours()})
        }
        let posts = sortByHour(p)
        let times = []
        let labels = []
        for (let i = 0; i < 24; i++) {
            times.push(0)
            labels.push(i)
        }
        posts.forEach((post) => {
            let hour = new Date(post.time).getHours()
            times[hour] += 1
        })
        frequencygraphdata = {
                labels: labels,
                datasets: [
                    {
                        label: 'Amount of posts made during this hour (Your local time)',
                        data: times,
                        backgroundColor: ["rgb(30 58 138 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(30 58 138 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    }
                ]
            }
    }
    function timeGraph(p) {
        let labels = []
        let loves = []
        let reposts = []
        let comments = []
        let edits = []
        p.forEach((post) => {
            labels.push(new Date(post.time))
            loves.push(post.loves)
            reposts.push(post.reposts)
            comments.push(post.comments)
            edits.push(post.revisions.length)
            totalLoves += post.loves
            totalReposts += post.reposts
            totalComments += post.comments
            totalEdits += post.revisions.length
        })
        avgLoves = Math.round((totalLoves / p.length) * 100) / 100
        avgReposts = Math.round((totalReposts / p.length) * 100) / 100
        avgComments = Math.round((totalComments / p.length) *100) / 100
        avgEdits = Math.round((totalEdits / p.length) * 100) / 100
        timegraphdata = {
                labels: labels,
                datasets: [
                    {
                        label: 'Loves',
                        data: loves,
                        backgroundColor: ["rgb(30 58 138 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(30 58 138 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Comments',
                        data: comments,
                        backgroundColor: ["#818cf8"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["#818cf8"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Reposts',
                        data: reposts,
                        backgroundColor: ["rgb(253 224 71 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(253 224 71 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Number of Edits',
                        data: edits,
                        backgroundColor: ["rgb(251, 146, 60)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(251, 146, 60)"],
                        hoverBorderColor: "#e5e7eb",
                        hidden: true
                    },
                ],
            };
    }
    let postsLength = 0
    function postsGraph(p, sortType) {
        let labels = []
        let loves = []
        let reposts = []
        let comments = []
        let edits = []
        let posts
        function sortByTime() {
            posts = p.sort((a,b) => {return a.time - b.time})
        }
        function sortByLoves() {
            posts = p.sort((a,b) => {return a.loves - b.loves})
            posts.reverse()
        }
        function sortByComments() {
            posts = p.sort((a,b) => {return a.comments - b.comments})
            posts.reverse()
        }
        function sortByReposts() {
            posts = p.sort((a,b) => {return a.reposts - b.reposts})
            posts.reverse()
        }
        function sortByEdits() {
            posts = p.sort((a,b) => {return a.revisions.length - b.revisions.length})
            posts.reverse()
        }
        switch (sortType) {
            case "time":
                sortByTime()
                break
            case "loves":
                sortByLoves()
                break
            case "comments":
                sortByComments()
                break
            case "reposts":
                sortByReposts()
                break
            case "edits":
                sortByEdits()
                break
        }
        posts = posts.slice(0, 20)
        postsLength = posts.length
        posts.forEach((post) => {
            labels.push(`${post._id} by ${user.name} (posted on ${new Date(post.time).toLocaleString()}): ${post.content.slice(0,20)}...`)
            loves.push(post.loves)
            reposts.push(post.reposts)
            comments.push(post.comments)
            edits.push(post.revisions.length)
        })
        postgraphdata = {
                labels: labels,
                datasets: [
                    {
                        label: 'Loves',
                        data: loves,
                        backgroundColor: ["rgb(30 58 138 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(30 58 138 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Comments',
                        data: comments,
                        backgroundColor: ["#818cf8"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["#818cf8"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Reposts',
                        data: reposts,
                        backgroundColor: ["rgb(253 224 71 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(253 224 71 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Number of Edits',
                        data: edits,
                        backgroundColor: ["rgb(251, 146, 60)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(251, 146, 60)"],
                        hoverBorderColor: "#e5e7eb",
                        hidden: (sort == 'edits' || sortby == 'edits') ? false : true
                    },
                ],
            };
    }
    let countgraphdata
    function countGraph(p) {
        let labels = []
        let postsset = []
        let loves = []
        let comments = []
        let reposts = []
        let edits = []
        let count = 0
        let lovescount = 0
        let repostscount = 0
        let commentscount = 0
        let editscount = 0
        let sortedposts = []
        function sortByTime() {
            sortedposts = p.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts.forEach((post) => {
            labels.push(new Date(post.time))
            count++; repostscount+= post.reposts; commentscount+= post.comments; editscount+= post.revisions.length; lovescount+= post.loves
            postsset.push(count)
            loves.push(lovescount)
            reposts.push(repostscount)
            comments.push(commentscount)
            edits.push(editscount)
        })
        countgraphdata = {
                labels: labels,
                datasets: [
                    {
                        label: 'Posts',
                        data: postsset,
                        backgroundColor: ["#4ade80"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["#4ade80"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Loves',
                        data: loves,
                        backgroundColor: ["rgb(30 58 138 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(30 58 138 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Comments (on this user\'s posts)',
                        data: comments,
                        backgroundColor: ["#818cf8"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["#818cf8"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Reposts (of this user\'s posts)',
                        data: reposts,
                        backgroundColor: ["rgb(253 224 71 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(253 224 71 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Number of Edits (to this user\'s posts)',
                        data: edits,
                        backgroundColor: ["rgb(251, 146, 60)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(251, 146, 60)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    async function main() {
        posts = await getAllPosts(user.name)
        timeGraph(posts)
        postsGraph(posts, sort)
        countGraph(posts)
        frequencyGraph(posts)
    }
    let timegraphoptions = {
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
    let countgraphoptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        second: 'MMM d, yyyy'
                    }
                },
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }
    let postgraphoptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: {
                ticks: {
                    display: false
                }
            }
        },
    }
    main()
    function resort() {
        postsGraph(posts, sortby)
    }
</script>
<Title link="#top">@{user.name}'s graphs</Title>
{#if loading}
<Subtitle>Loading...</Subtitle>
<progress class="mb-4" max={user.stats.posts} value={progress}> {progress}/{user.stats.posts} </progress>
<p>This may take a while because it has to index every post made by this user</p>
{/if}
{#if !loading}
<Title link="#posts">Posts</Title>
<Subtitle>@{user.name} has {user.stats.posts} posts</Subtitle>
<Block title="Totals across all posts">
    <Subtitle>Total Loves: {totalLoves}</Subtitle>
    <Subtitle>Total Comments: {totalComments}</Subtitle>
    <Subtitle>Total Reposts: {totalReposts}</Subtitle>
    <Subtitle>Total Edits: {totalEdits}</Subtitle>
</Block>
<Block title="Averages across all posts">
    <Subtitle>Average Loves: {avgLoves}</Subtitle>
    <Subtitle>Average Comments: {avgComments}</Subtitle>
    <Subtitle>Average Reposts: {avgReposts}</Subtitle>
    <Subtitle>Average Edits: {avgEdits}</Subtitle>
</Block>
<Title link="#count">Stats over time</Title>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={countgraphdata} options={countgraphoptions} />
</div>
</div>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={timegraphdata} options={timegraphoptions} />
</div>
</div>
<Title link="#topPosts">Top {postsLength} posts</Title>
<Block title="Sort by:">
    <form name="sort" on:submit|preventDefault={resort}>
        <select name="sort" bind:value={sortby}>
            <option selected={(sort == "loves" || sortby == 'loves')?true:false} value="loves">Loves</option>
            <option selected={(sort == "comments" || sortby == 'comments')?true:false} value="comments">Comments</option>
            <option selected={(sort == "reposts" || sortby == 'reposts')?true:false} value="reposts">Reposts</option>
            <option selected={(sort == "edits" || sortby == 'edits')?true:false} value="edits">Edits</option>
        </select>
        <br>
        <div class="grid place-items-center">
            <button class="mt-2 p-2 bg-blue-900 hover:bg-blue-800 focus:outline-none active:outline-none active:bg-blue-700 transition ease-in-out delay-75 text-white ml-0" type="submit">Go</button>
        </div>
    </form>
</Block>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Bar data={postgraphdata} options={postgraphoptions} />
</div>
</div>
<Title link="#frequency">Average daily post frequency</Title>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Bar data={frequencygraphdata} options={postgraphoptions} />
</div>
</div>
{/if}
<style>
    progress[value]::-webkit-progress-value {
        background-image:
        -webkit-linear-gradient(-45deg, 
                                transparent 33%, rgba(0, 0, 0, .1) 33%, 
                                rgba(0,0, 0, .1) 66%, transparent 66%),
        -webkit-linear-gradient(left, rgb(30 58 138 / 1), rgb(30 58 138 / 1));
        background-size: 35px 20px, 100% 100%, 100% 100%;
        -webkit-animation: animate-stripes 5s linear infinite;
        animation: animate-stripes 5s linear infinite;
    }
    @-webkit-keyframes animate-stripes {
        100% { background-position: -100px 0px; }
    }

    @keyframes animate-stripes {
        100% { background-position: -100px 0px; }
    }
    progress[value]::-moz-progress-bar {
        background-image:
        -moz-linear-gradient(-45deg, 
                                transparent 33%, rgba(0, 0, 0, .1) 33%, 
                                rgba(0,0, 0, .1) 66%, transparent 66%),
        -moz-linear-gradient(left, rgb(30 58 138 / 1), rgb(30 58 138 / 1));
        background-size: 35px 20px, 100% 100%, 100% 100%;
        -moz-animation: animate-stripes 5s linear infinite;
        animation: animate-stripes 5s linear infinite;
    }
    @-moz-keyframes animate-stripes {
        100% { background-position: -100px 0px; }
    }

    @keyframes animate-stripes {
        100% { background-position: -100px 0px; }
    }
</style>