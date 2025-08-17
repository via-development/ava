import { verifyKeyMiddleware } from "discord-interactions";
import express from "express";
import path from "path";
import { handleBot } from "./bot";
import { getAvatarHash } from "./redis";
import { defaultAvatarUrl, inviteBotUrl } from "./util";

const app = express()

app.get("/", async (req, res) => {
    res.sendFile(path.resolve(__dirname, "static", "home.html"))
})

app.get("/bot", async (req, res) => {
    res.redirect(inviteBotUrl)
})

app.post("/bot", verifyKeyMiddleware(Bun.env.PUBLIC_KEY!), handleBot)

app.get("/:id", async (req, res) => {
    let [userId, format] = req.params.id.split(".") as [string, string | undefined]
    const size = parseInt(<string>req.query.size) || 256

    if (!RegExp("[0-9]{16,19}").test(userId.trim())) return res.redirect(defaultAvatarUrl(format, size))
    const avatar = await getAvatarHash(userId)
    if (!avatar) return res.redirect(defaultAvatarUrl(format, size))

    let url = `https://cdn.discordapp.com/avatars/${userId}/${avatar}`
    if (format) url += `.${format}`
    if (size) url += `?size=${size}`
    return res.redirect(url)
})

const PORT = Bun.env.PORT || 3002
app.listen(PORT)
console.log(`Ava is running on port ${PORT}! http://localhost:${PORT}`)