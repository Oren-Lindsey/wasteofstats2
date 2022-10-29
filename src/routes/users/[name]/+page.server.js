export async function load({ parent }) {
    const { user } = await parent();
    let userGraph = undefined
    let userList = await fetch(`https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/tracklist.json`)
    userList = await userList.json()
    if (userList.includes(user.id)) {
        userGraph = await fetch(`https://raw.githubusercontent.com/Quantum-Codes/Wob-Graphs/main/stats/${user.id}.json`)
        userGraph = await userGraph.json()
    }
    return {
        user: user,
        graph: userGraph
    }
}