
import {Wasteof2, Wasteof3} from 'wasteof-client'
export async function load(event) {
    const timeframe = event.url.searchParams.get("time") || "all"
    const display = event.url.searchParams.get("postsdisplay") || "loves"
    const userdisplay = event.url.searchParams.get("usersdisplay") || "followers"
    const wasteof2 = new Wasteof2()
    const wasteof3 = new Wasteof3()
    let topUsers = await wasteof2.getTopUsers()
    let explore = await wasteof3.getTrending(timeframe)
    let wasteof3users = explore.users
    if (userdisplay == 'date') {
        topUsers.sort((a, b) => a.history.joined - b.history.joined)
        wasteof3users = wasteof3users.filter(function(value){ 
            return value.__order < 15;
        });
        wasteof3users.sort((a, b) => a.history.joined - b.history.joined)
    }
    let colors = []
    for (let i = 0; i < wasteof3users.length; i++) {
        colors.push(wasteof3users[i].color)
    }
    let images = await getImages(); images = images.images
    return {
        users: topUsers,
        colors: colors,
        topPosts: explore.posts,
        betaUsers: explore.users,
        timeframe: timeframe,
        postsdisplay: display,
        usersdisplay: userdisplay,
        images: images,
    }
}
async function getImages() {
    const url = 'https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/url.json'
    const res = await fetch(url)
    const data = await res.json()
    return {
        images: {posts: data["Wasteof-posts.png"], following: data["Wasteof-following.png"], followers: data["Wasteof-followers.png"]}
    }
}