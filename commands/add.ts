import { ICommand } from "wokcommands";
import DiscordJS, { MessageEmbed } from 'discord.js'
import autoresponse from "../model/autoresponse";

export default {

    slash: true,
    description: "Add a command to the auto response",
    options: [
        {
            name: "name",
            description: "name for the autoresponse has to be unique",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "keywords",
            description: "keywords separated by comma e.g image,character,test",

            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "title",
            description: "Title of the embed",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "description",
            description: "description of the embed",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
    ],


    callback: async ({ interaction }) => {

        let name: any = interaction.options.getString("name");
        let keywords: any = interaction.options.getString("keywords");
        let title: any = interaction.options.getString("title");
        let description: any = interaction.options.getString("description");

        let res = await autoresponse.findOne({ name: name });

        if (res === null) {
            res = new autoresponse();

            res.name = name;
            res.keywords = keywords.split(",").map(i => i.trim());
            res.title = title;
            res.body = description;

            let author = { text: `${interaction.user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` }

            res.author = author;

            await res.save();

            let embed = new MessageEmbed()
                .setTitle(`Added ${name}`)
                .setDescription(`The auto response \`${name}\` was added`);
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({ embeds: [embed] });

        } else {
            let embed = new MessageEmbed()
                .setTitle(`Already exists`)
                .setDescription(`The autoresponse \`${name}\` already exists`);

            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({ embeds: [embed] });
        }



    }
} as ICommand
