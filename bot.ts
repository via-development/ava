import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Request, Response } from "express";

export const handleBot = async (req: Request, res: Response) => {
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

    if (interaction.data.name == "emoji") {
        const parts = interaction.data.options.find(o => o.name == "emoji").value.split(":")
        const id = parts[2]
        if (id == undefined || id.length < 9) return
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `https://cdn.discordapp.com/emojis/${id.slice(0, id.length - 1)}${parts[0] == "<a" ? ".gif" : ""} .`,
            },
        })
    }
}