require("dotenv").config()
const express = require("express")
const app = express()
const { QuickDB, SqliteDriver } = require("quick.db");
const sqliteDriver = new SqliteDriver("./data.db")
const db = new QuickDB({ driver: sqliteDriver });
const path = require("path");
const { verifyKeyMiddleware, InteractionType, InteractionResponseType } = require("discord-interactions");

async function getAvatar(userId) {
    let u = await db.get(userId)
    if (u && u.lastFetched && (u.lastFetched + 1000 * 60 * 60 * 24) > Date.now() && u.avatar) return u.avatar
    u = { lastFetched: Date.now(), avatar: null }
    const res = await fetch(`https://discord.com/api/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${process.env.TOKEN}`
        }
    })
    if (res.status !== 200) return null
    const userJSON = await res.json()
    if (!userJSON?.avatar) {
        db.set(userId, u)
        return null
    }
    u.avatar = userJSON.avatar
    db.set(userId, u)
    return userJSON.avatar
}

app.get("/", async (req, res) => {
    res.sendFile(path.resolve(__dirname, "home.html"))
})

app.get("/bot", async (req, res) => {
    res.redirect("https://discord.com/oauth2/authorize?client_id=1206787663584165898")
})

app.post("/bot", verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
    const interaction = req.body;
    if (interaction.type != InteractionType.APPLICATION_COMMAND) return
    if (interaction.data.name == "ava") {
        const userId = interaction.data.options.find(o => o.name == "user").value
        const format = interaction.data.options.find(o => o.name == "format")?.value
        const size = interaction.data.options.find(o => o.name == "size")?.value

        let url = `https://ava.viadev.xyz/${userId}`
        if (format) url += `.${format}`
        if (size) url += `?size=${size}`

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `${url} .`,
            },
        })
    }
})

app.get("/:id", async (req, res) => {
    let [userId, format] = req.params.id.split(".")
    if (!format) format = null
    if (req.query.debug === "true") {
        let u = await db.get(userId)
        if (!u) return res.send("null")
        return res.send(`${u.avatar}<br>${new Date(u.lastFetched).toString()}`)
    }
    const size = req.query.size || 256
    const $f = (url) => {
        if (format) url += `.${format}`
        if (size) url += `?size=${size}`
        return url
    }
    if (!RegExp("[0-9]{18,19}").test(userId.trim())) return res.redirect(`https://cdn.discordapp.com/embed/avatars/5.${format || "png"}?size=${size}`)
    const avatar = await getAvatar(userId)
    if (!avatar) return res.redirect(`https://cdn.discordapp.com/embed/avatars/5.${format || "png"}?size=${size}`)
    else res.redirect($f(`https://cdn.discordapp.com/avatars/${userId}/${avatar}`))
})

app.listen(3002)
