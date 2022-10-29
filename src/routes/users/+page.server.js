import { Wasteof3 } from 'wasteof-client'
const wasteof3 = new Wasteof3()
export async function load() {
    const users = await wasteof3.getUserCount()
    const version = await fetch('https://beta.wasteof.money/_app/version.json')
    const data = await version.json()
    return {
        count: users,
        time: data.version
    }
}