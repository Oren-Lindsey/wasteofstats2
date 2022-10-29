<script>
    import Block from '$lib/Block.svelte'
    import Subtitle from '$lib/Subtitle.svelte'
    export let data
    export let stats
</script>
<Block title="Sidebar">
<div class="grid place-items-center grid-cols-1">
<details>
    <summary>Show sidebar</summary>
{#each data as block}
    <Block title="{block.data.title}">
    {#if block.type == 'StatsBlock'}
    <Subtitle>Followers: {stats.followers}</Subtitle>
    <Subtitle>Following: {stats.following}</Subtitle>
    <Subtitle>Posts: {stats.posts}</Subtitle>
    <Subtitle>Comments: {stats.comments}</Subtitle>
    {:else if block.type == 'TextBlock'}
    <Subtitle>{block.data.text}</Subtitle>
    {:else if block.type == 'LinksBlock'}
    {#each block.data.links as link}
    <a href={link.url}>{link.text}</a><br>
    {/each}
    {:else if block.type == 'YouTubeBlock'}
    <a href="https://youtube.com/watch?v={block.data.video}">YouTube video</a>
    {:else if block.type == 'FeaturedUsersBlock'}
    {#each block.data.users as user}
    <a href="https://wasteof.money/@{user.name}">@{user.name} - "{user.bio}"</a><br>
    {/each}
    {:else if block.type == 'PostBlock'}
    <a href="https://wasteof.money/posts}/{block.data.post.id}">{@html block.data.post.content}</a>
    {/if}
    </Block>
{/each}
</details>
</div>
</Block>