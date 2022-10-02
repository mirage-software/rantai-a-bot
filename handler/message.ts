import { messageLink } from "@discordjs/builders";
import { Client, MessageEmbed } from "discord.js"
import dotenv from "dotenv"
import autoresponse from "../model/autoresponse";

let keywordMap: Map<string, Array<string>> = new Map<string, Array<string>>();

export default (client: Client) => {

    client.on("messageCreate", async message => {

        if (message.channelId === process.env.channelid) {

            if (message.cleanContent.startsWith("?") && !message.cleanContent.startsWith("??")) {
                callembed(message, message.cleanContent);
            } else {
                checkkeywords(message, message.cleanContent);
            }
        }

    })
}


async function callembed(message: any, text: any) {

    let name = text.split(" ")[0].replace("?", "");


    let res = await autoresponse.findOne({ name: name });

    if (res === null) {

        const embed = new MessageEmbed()
            .setTitle("Entry not found")
            .setDescription(`The entry \`${name}\` was not found`);

        message.reply({ embeds: [embed] })
        return;
    } else {

        const embed = new MessageEmbed()
            .setTitle(res.title!)
            .setDescription(res.body!)
            .setFooter(res.author!);

        message.reply({ embeds: [embed] })
        return;
    }

}

async function checkkeywords(message: any, cleanContent: string) {

    if (keywordMap.size === 0) {
        let responses = await autoresponse.find();

        for (let res of responses) {
            keywordMap.set(res.name!, res.keywords);
        }
    }

    let foundkey;

    keywordMap.forEach((value: string[], key: string) => {
        if (value.every((i) => cleanContent.includes(i))) {

            foundkey = key;

            return;
        }
    })

    if (foundkey !== null) {

        let res = await autoresponse.findOne({ name: foundkey });

        if (res !== null) {
            const embed = new MessageEmbed()
                .setTitle(res.title!)
                .setDescription(res.body!)
                .setFooter(res.author!);

            message.reply({ embeds: [embed] })
            return;
        }
    }

}