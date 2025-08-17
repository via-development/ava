import { createClient } from "redis";
import { fetchAvatarHashDiscord } from "./util";

export const redis = createClient()
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect()

export const getAvatarHash = async (userId: string): Promise<string | null> => {
    const avatarHash = await redis.get("avatar:" + userId)
    if (avatarHash) return avatarHash

    const ah = await fetchAvatarHashDiscord(userId)
    if (ah != null) {
        redis.set("avatar:" + userId, ah, {
            EX: 24 * 60 * 60
        })
    }

    return ah
}
