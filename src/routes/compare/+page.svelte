<script>
    export let data
    let {user1,user2,tracked} = data
    import Title from '$lib/Title.svelte'
    import {page} from '$app/stores'
	import Subtitle from '../../lib/Subtitle.svelte';
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
    let origin = $page.url.origin
    let progress = 0; let total = 0
    async function getAllPosts(name) {
        let posts = []
        let page = 1
        while (true) {
            let res = await fetch(`${origin}/compare/proxy/${name}?page=${page}`)
            let json = await res.json()
            posts = posts.concat(json.posts)
            page++
            progress+= json.posts.length
            if (json.last == true) {
                break
            }
        }
        return posts
    }
    let user1posts
    let user2posts
    let user1graph
    let user2graph
    let statsgraphdata
    let loading = true
    async function main() {
        if (user1 !== null && user2 !== null) {
            if (tracked) {
                let user1botdata = await fetch(`https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/stats/${user1.user.id}.json`)
                let user2botdata = await fetch(`https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/stats/${user2.user.id}.json`)
                user1graph = await user1botdata.json()
                user2graph = await user2botdata.json()
                statsgraphdata = statsgraph()
            }
            total = user1.user.stats.posts + user2.user.stats.posts
            user1posts = await getAllPosts(user1.user.name)
            user2posts = await getAllPosts(user2.user.name)
            loading = false
            totalpostsGraph(user1posts, user2posts)
            lovesGraph(user1posts, user2posts)
            totallovesGraph(user1posts, user2posts)
            totalcommentsGraph(user1posts, user2posts)
            totalrepostsGraph(user1posts, user2posts)
            totaleditsGraph(user1posts, user2posts)
            commentsGraph(user1posts, user2posts)
            repostsGraph(user1posts, user2posts)
            editsGraph(user1posts, user2posts)
        }
    }
    function statsgraph() {
        if (user1graph && user2graph) {
            let user1followers = []
            let user2followers = []
            let user1following = []
            let user2following = []
            let user1posts = []
            let user2posts = []
            for (let i = 0; i < user1graph.timestamp.length; i++) {
                let timestamp = user1graph.timestamp[i] * 1000
                const myDateTime = new Date(timestamp)
                const myDateTimeISO = myDateTime.toISOString()
                user1followers.push({x: new Date(myDateTimeISO), y: user1graph.followers[i]})
                user1following.push({x: new Date(myDateTimeISO), y: user1graph.following[i]})
                user1posts.push({x: new Date(myDateTimeISO), y: user1graph.posts[i]})
            }
            for (let i = 0; i < user2graph.timestamp.length; i++) {
                let timestamp = user2graph.timestamp[i] * 1000
                const myDateTime = new Date(timestamp)
                const myDateTimeISO = myDateTime.toISOString()
                user2followers.push({x: new Date(myDateTimeISO), y: user2graph.followers[i]})
                user2following.push({x: new Date(myDateTimeISO), y: user2graph.following[i]})
                user2posts.push({x: new Date(myDateTimeISO), y: user2graph.posts[i]})
            }
            let graphdata = {
                datasets: [
                    {
                        label: `Followers (@${user1.user.name})`,
                        data: user1followers,
                        backgroundColor: ["rgb(30 58 138 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(30 58 138 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: `Following (@${user1.user.name})`,
                        data: user1following,
                        backgroundColor: ["#818cf8"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["#818cf8"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: `Posts (@${user1.user.name})`,
                        data: user1posts,
                        backgroundColor: ["rgb(253 224 71 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(253 224 71 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: `Followers (@${user2.user.name})`,
                        data: user2followers,
                        backgroundColor: ["rgb(30 58 138 / 1)"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["rgb(30 58 138 / 1)"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: `Following (@${user2.user.name})`,
                        data: user2following,
                        backgroundColor: ["#818cf8"],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: ["#818cf8"],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: `Posts (@${user2.user.name})`,
                        data: user2posts,
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
    let lovesgraphdata
    let totallovesgraphdata
    function lovesGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            loves1.push({x: new Date(post.time), y: post.loves})
        })
        sortedposts2.forEach((post) => {
            loves2.push({x: new Date(post.time), y: post.loves})
        })
        lovesgraphdata = {
                datasets: [
                    {
                        label: 'Loves (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Loves (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    let commentsgraphdata
    function commentsGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            loves1.push({x: new Date(post.time), y: post.comments})
        })
        sortedposts2.forEach((post) => {
            loves2.push({x: new Date(post.time), y: post.comments})
        })
        commentsgraphdata = {
                datasets: [
                    {
                        label: 'Comments (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Comments (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    let repostsgraphdata
    function repostsGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            loves1.push({x: new Date(post.time), y: post.reposts})
        })
        sortedposts2.forEach((post) => {
            loves2.push({x: new Date(post.time), y: post.reposts})
        })
        repostsgraphdata = {
                datasets: [
                    {
                        label: 'Reposts (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Reposts (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    let editsgraphdata
    function editsGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            loves1.push({x: new Date(post.time), y: post.revisions.length})
        })
        sortedposts2.forEach((post) => {
            loves2.push({x: new Date(post.time), y: post.revisions.length})
        })
        editsgraphdata = {
                datasets: [
                    {
                        label: 'Edits (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Edits (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    function totallovesGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let total1 = 0
        let total2 = 0
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            total1 += post.loves
            loves1.push({x: new Date(post.time), y: total1})
        })
        sortedposts2.forEach((post) => {
            total2 += post.loves
            loves2.push({x: new Date(post.time), y: total2})
        })
        totallovesgraphdata = {
                datasets: [
                    {
                        label: 'Total loves (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Total loves (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    let totaleditsgraphdata
    function totaleditsGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let total1 = 0
        let total2 = 0
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            total1 += post.revisions.length
            loves1.push({x: new Date(post.time), y: total1})
        })
        sortedposts2.forEach((post) => {
            total2 += post.revisions.length
            loves2.push({x: new Date(post.time), y: total2})
        })
        totaleditsgraphdata = {
                datasets: [
                    {
                        label: 'Total edits (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Total edits (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    let totalrepostsgraphdata
    let totalcommentsgraphdata
    function totalrepostsGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let total1 = 0
        let total2 = 0
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            total1 += post.reposts
            loves1.push({x: new Date(post.time), y: total1})
        })
        sortedposts2.forEach((post) => {
            total2 += post.reposts
            loves2.push({x: new Date(post.time), y: total2})
        })
        totalrepostsgraphdata = {
                datasets: [
                    {
                        label: 'Total reposts (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Total reposts (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }

    function totalcommentsGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let total1 = 0
        let total2 = 0
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            total1 += post.comments
            loves1.push({x: new Date(post.time), y: total1})
        })
        sortedposts2.forEach((post) => {
            total2 += post.comments
            loves2.push({x: new Date(post.time), y: total2})
        })
        totalcommentsgraphdata = {
                datasets: [
                    {
                        label: 'Total comments (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Total comments (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    let totalpostsgraphdata
    function totalpostsGraph(p1, p2) {
        let loves1 = []
        let loves2 = []
        let total1 = 0
        let total2 = 0
        let sortedposts1 = []
        let sortedposts2 = []
        function sortByTime() {
            sortedposts1 = p1.sort((a,b) => {return a.time - b.time})
            sortedposts2 = p2.sort((a,b) => {return a.time - b.time})
        }
        sortByTime()
        sortedposts1.forEach((post) => {
            total1++
            loves1.push({x: new Date(post.time), y: total1})
        })
        sortedposts2.forEach((post) => {
            total2++
            loves2.push({x: new Date(post.time), y: total2})
        })
        totalpostsgraphdata = {
                datasets: [
                    {
                        label: 'Total posts (@' + user1.user.name + ')',
                        data: loves1,
                        backgroundColor: [colors[user1.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user1.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                    {
                        label: 'Total posts (@' + user2.user.name + ')',
                        data: loves2,
                        backgroundColor: [colors[user2.user.color]],
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        hoverBackgroundColor: [colors[user2.user.color]],
                        hoverBorderColor: "#e5e7eb",
                    },
                ],
            };
    }
    main()
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
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }
</script>
{#if user1 !== null && user2 !== null}
<Title link="#graphs">Graphs</Title>
{/if}
{#if tracked}
<Subtitle>Stats over time (incomplete)</Subtitle>
<p>Tracked by @Ankit_Anmol</p>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={statsgraphdata} options={timegraphoptions} />
</div>
</div>
{/if}
{#if loading && user1 !== null && user2 !== null}
<Subtitle>Loading {#if tracked} more graphs{/if}...</Subtitle>
<progress class="mb-4" max={total} value={progress}> {progress}/{total} </progress>
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
{#if !loading}
<Subtitle>Post count over time</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={totalpostsgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Total loves over time</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={totallovesgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Total comments over time (on their posts)</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={totalcommentsgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Total reposts over time (of their posts)</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={totalrepostsgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Total edits over time (of their posts)</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={totaleditsgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Loves over time</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={lovesgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Comments over time (on their posts)</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={commentsgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Reposts over time (of their posts)</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={repostsgraphdata} options={timegraphoptions} />
</div>
</div>
<Subtitle>Edits over time</Subtitle>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Line data={editsgraphdata} options={timegraphoptions} />
</div>
</div>
{/if}