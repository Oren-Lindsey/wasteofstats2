export async function load({ parent }) {
    const { user1,user2 } = await parent();
    const tracked = await fetch('https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/tracklist.json')
    const tracklist = await tracked.json()
    let bothTracked = false
    if (user1 !== null && user2 !== null && tracklist.includes(user1.user.id) && tracklist.includes(user2.user.id)) bothTracked = true
    return {
        user1: user1,
        user2: user2,
        tracked: bothTracked
    }
}