import { Wasteof3 } from "wasteof-client";
import { error } from '@sveltejs/kit';
const wasteof3 = new Wasteof3();
export async function load(e) {
    try {
        const { name } = e.params
        const user = await wasteof3.getUser(name)
        return user
    } catch (e) {
        throw error(404, 'not found :(')
    }
}