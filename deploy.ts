export { }

const req = await fetch(`https://discord.com/api/v10/applications/${Bun.env.BOT_ID!}/commands`, {
    method: "POST",
    headers: {
        Authorization: "Bot " + Bun.env.TOKEN!,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "ava",
        type: 1,
        description: "Get someone's avatar link",
        options: [{
            name: "user",
            description: "The user you want the avatar of.",
            type: 6,
            required: true,
        }, {
            name: "format",
            description: "The image format the avatar should be.",
            type: 3,
            choices: [{
                name: "png",
                value: "png"
            }, {
                name: "jpeg",
                value: "jpeg"
            }, {
                name: "gif",
                value: "gif"
            }, {
                name: "webp",
                value: "webp"
            }]
        }, {
            name: "size",
            description: "The size the avatar image should be.",
            type: 4,
            choices: [{
                name: "2048",
                value: 2048
            }, {
                name: "1024",
                value: 1024
            }, {
                name: "512",
                value: 512
            }, {
                name: "256",
                value: 256
            }]
        }],
        integration_types: [1],
        contexts: [0, 1, 2],
    })
})

console.log(await req.json())