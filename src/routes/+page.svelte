<script>
    import { Bar } from 'svelte-chartjs';
    import Title from '$lib/Title.svelte'
    import Block from '$lib/Block.svelte';
    import Subtitle from '$lib/Subtitle.svelte';
    export let data
    let topPosts = data.topPosts
    let averageComments = 0;let averageReposts = 0; let averageLoves = 0
    function usersChart() {
        let usernames = []
        let followers = []
        let colors = []
        for (let i = 0; i < data.users.length; i++) {
            usernames.push(`#${i + 1}: ${data.users[i].name}`)
            followers.push(data.users[i].stats.followers)
            if (data.colors[i] == "red") {
                    colors.push("#f87171")
                } else if (data.colors[i] == "orange") {
                    colors.push("#fb923c")
                } else if (data.colors[i] == "yellow") {
                    colors.push("#facc15")
                } else if (data.colors[i] == "green") {
                    colors.push("#4ade80")
                } else if (data.colors[i] == "teal") {
                    colors.push("#2dd4bf")
                } else if (data.colors[i] == "blue") {
                    colors.push("#60a5fa")
                } else if (data.colors[i] == "indigo") {
                    colors.push("#818cf8")
                } else if (data.colors[i] == "fuchsia") {
                    colors.push("#e879f9")
                } else if (data.colors[i] == "gray") {
                    colors.push("#9ca3af")
                } else {
                    colors.push("black")
                }
        }
        let graphdata = {
            labels: usernames,
            datasets: [
                {
                    label: 'Followers',
                    data: followers,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: "#e5e7eb",
                    hoverBackgroundColor: colors,
                    hoverBorderColor: "#e5e7eb",
                }
            ],
        };
        return graphdata
    }
    function postsChart() {
        let labels = []
        let loves = []
        let reposts = []
        let comments = []
        let edits = []
        for (let i = 0;i < topPosts.length;i++) {
            let current = topPosts[i]
            labels.push(`#${i + 1}: ${current.id} by ${current.poster.name} (posted on ${new Date(current.time).toLocaleDateString()}): ${current.content.slice(0,20)}...`)
            loves.push(current.loves)
            reposts.push(current.reposts)
            comments.push(current.comments)
            edits.push(current.revisions.length)
        }
        for (let i = 0;i < loves.length;i++) {
            averageLoves = averageLoves + loves[i]
            averageReposts += reposts[i]
            averageComments += comments[i]
        }
        averageLoves = Math.round(averageLoves / loves.length)
        averageComments = Math.round(averageComments / comments.length)
        averageReposts = Math.round(averageReposts / reposts.length)
        let graphdata = {
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
        return graphdata
    }
    import {
        Chart,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
        TimeScale,
    } from 'chart.js';
    Chart.register(
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
        TimeScale,
    );
    let graphdata = usersChart()
    let postsdata = postsChart()
    let postoptions = {
        scales: {
            xAxes: {
                ticks: {
                    display: false
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }
    let useroptions = {
        responsive: true,
        maintainAspectRatio: false
    }
    function sortByTime() {
        topPosts = topPosts.sort((a,b) => {return a.time - b.time})
    }
    function sortByLoves() {
        topPosts = topPosts.sort((a,b) => {return a.loves - b.loves})
        topPosts.reverse()
    }
    function sortByComments() {
        topPosts = topPosts.sort((a,b) => {return a.comments - b.comments})
        topPosts.reverse()
    }
    function sortByReposts() {
        topPosts = topPosts.sort((a,b) => {return a.reposts - b.reposts})
        topPosts.reverse()
    }
    function sortByEdits() {
        topPosts = topPosts.sort((a,b) => {return a.revisions.length - b.revisions.length})
        topPosts.reverse()
    }
    switch(data.postsdisplay) {
        case 'loves':
            sortByLoves()
            break
        case 'comments':
            sortByComments()
            break
        case 'reposts':
            sortByReposts()
            break
        case 'time':
            sortByTime()
            break
        case 'edits':
            sortByEdits()
            break
        default:
            sortByLoves()
    }
</script>
<h1 class="text-4xl font-mono text-blue-900">wasteofstats</h1>
<p class="text-black">View stats for your favorite wasteof.money users</p>
<br>
<Title link="#users">15 most followed users</Title>
<Block title="Sort by:">
    <form class="grid place-items-center">
        <label class="my-1 text-gray-700 font-mono" for="usersdisplay">Display in order of:</label>
        <select class="my-1" name="usersdisplay" id="usersdisplay">
            <option selected={(data.usersdisplay == "followers")?true:false} value="followers">Followers</option>
            <option selected={(data.usersdisplay == "date")?true:false} value="date">Date joined</option>
        </select>
        <button class="mt-2 p-2 bg-blue-900 hover:bg-blue-800 focus:outline-none active:outline-none active:bg-blue-700 transition ease-in-out delay-75 text-white ml-0" type="submit">Go</button>
    </form>
    </Block>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[50vh] h-[50vh] w-full">
<Bar data={graphdata} options={useroptions} />
</div>
</div>
<Title link="#posts">Top 15 most loved posts</Title>
<Block title="Sort by:">
<form class="grid place-items-center">
    <label class="my-1 text-gray-700 font-mono" for="time">Timeframe:</label>
    <select class="my-1" name="time" id="time">
        <option selected={(data.timeframe == "all")?true:false} value="all">All time</option>
        <option selected={(data.timeframe == "month")?true:false} value="month">Month</option>
        <option selected={(data.timeframe == "week")?true:false} value="week">Week</option>
        <option selected={(data.timeframe == "day")?true:false} value="day">Day</option>
    </select>
    <label class="my-1 text-gray-700 font-mono" for="display">Display in order of:</label>
    <select class="my-1" name="postsdisplay" id="postsdisplay">
        <option selected={(data.postsdisplay == "loves")?true:false} value="loves">Loves</option>
        <option selected={(data.postsdisplay == "time")?true:false} value="time">Time posted</option>
        <option selected={(data.postsdisplay == "comments")?true:false} value="comments">Comments</option>
        <option selected={(data.postsdisplay == "reposts")?true:false} value="reposts">Reposts</option>
        <option selected={(data.postsdisplay == "edits")?true:false} value="edits">Number of edits</option>
    </select>
    <button class="mt-2 p-2 bg-blue-900 hover:bg-blue-800 focus:outline-none active:outline-none active:bg-blue-700 transition ease-in-out delay-75 text-white ml-0" type="submit">Go</button>
</form>
</Block>
<div class="!w-[80vw] !max-w-[80vw]">
<div class="!max-h-[70vh] h-[70vh] w-full">
<Bar data={postsdata} options={postoptions} />
</div>
</div>
<Block title="Averages (for the above posts)">
    <p class="font-mono grid place-items-center text-gray-700">Average loves: {averageLoves}</p>
    <p class="font-mono grid place-items-center text-gray-700">Average comments: {averageComments}</p>
    <p class="font-mono grid place-items-center text-gray-700">Average reposts: {averageReposts}</p>
</Block>
<Title link="#images">Total stats graphs</Title>
<Block title="">
<details>
    <summary class="font-mono text-gray-700">Click to view</summary>
    <Subtitle>Posts graph</Subtitle>
    <img src={data.images.posts} alt="posts graph" />
    <Subtitle>Following graph</Subtitle>
    <img src={data.images.following} alt="following graph" />
    <Subtitle>Followers graph</Subtitle>
    <img src={data.images.followers} alt="followers graph" />
    <p class="mt-1 grid place-items-center">To have your stats included in this, post a comment containing "@wasteof_bot track" anywhere on wasteof. Or send "wob track" in the chat.</p>
    <p class="grid place-items-center">Credit to:<a href="https://wasteof.money/@Ankit_Anmol" class="inline font-bold">@Ankit_Anmol</a></p>
</details>
</Block>