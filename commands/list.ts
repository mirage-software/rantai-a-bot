import { ICommand } from "wokcommands";
import DiscordJS, { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import autoresponse from "../model/autoresponse";

export default {

    slash: true,
    description: "lists autoresponses",
    hidden: true,

    callback: async ({ interaction }) => {


        let responses: any = await autoresponse.find({});

        let embed = new MessageEmbed()
            .setTitle(`Available autoresponses`)

        let description = "\`Name | Keywords\`\n";

        let index = 0;

        for (let res of responses) {
            index++;
            description += `${index}. \`${res.name} | ${res.keywords.toString()}\`\n`;
        }

        embed.setDescription(description);

        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ embeds: [embed] });


    }
} as ICommand