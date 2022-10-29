export async function load({ parent,url }) {
    const { user } = await parent();
    const sort = url.searchParams.get("sort") || "loves";
    return {
        user,
        sort
    }
}