import { Wasteof2 } from "wasteof-client";
export async function GET({ params, url }) {
    const { name } = params;
    const page = parseInt(url.searchParams.get("page")) || 1
    const wasteof2 = new Wasteof2();
    const posts = await wasteof2.getPostsOfUser(name, page);
    return new Response(JSON.stringify(posts))
}