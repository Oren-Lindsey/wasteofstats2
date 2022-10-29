import {Wasteof3} from 'wasteof-client'
const wasteof3 = new Wasteof3()
export async function load({url}) {
    const user1 = url.searchParams.get('user1') || null
    const user2 = url.searchParams.get('user2') || null
    let user1data = null
    let user2data = null
    if (user1 !== null) user1data = await wasteof3.getUser(user1)
    if (user2 !== null) user2data = await wasteof3.getUser(user2)
    return {
        user1: user1data,
        user2: user2data
    }
}