import {Wasteof3} from 'wasteof-client'
const wasteof3 = new Wasteof3()
export async function load() {
    const count = await wasteof3.getUserCount()
    return {
        count: count
    }
}