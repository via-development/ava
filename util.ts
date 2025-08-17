export const fetchAvatarHashDiscord = async (userId: string): Promise<string | null> => {
    const res = await fetch(`https://discord.com/api/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${process.env.TOKEN}`
        }
    })
    if (res.status !== 200) return null
    return (await res.json()).avatar
}

export const defaultAvatarUrl = (format: string | undefined, size: number) => `https://cdn.discordapp.com/embed/avatars/5.${format || "png"}?size=${size}`
export const inviteBotUrl = "https://discord.com/oauth2/authorize?client_id=1206787663584165898"