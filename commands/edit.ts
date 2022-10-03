import { ICommand } from "wokcommands";
import DiscordJS, { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import autoresponse from "../model/autoresponse";

export default {

    slash: true,
    description: "Edits an auto response",
    options: [
        {
            name: "name",
            description: "name for the autoresponse has to be unique",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
        {
            name: "field",
            description: "the field to edit",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                { name: "name", value: "name" },
                { name: "keywords", value: "keywords" },
                { name: "title", value: "title" },
                { name: "body", value: "body" }
            ]
        },
        {
            name: "value",
            description: "new value for the field",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],


    callback: async ({ interaction }) => {

        let name: any = interaction.options.getString("name");
        let field: any = interaction.options.getString("field");
        let value: any = interaction.options.getString("value");

        let res: any = await autoresponse.findOne({ name: name });

        let embed = new MessageEmbed()

        switch (field) {

            case "name":

                let exists = await autoresponse.findOne({ name: value });

                if (exists === null) {
                    res.name = value;

                    res.save();
                } else {
                    
                    embed
                    .setTitle(`Already exists`)
                    .setDescription(`The autoresponse \`${name}\` already exists`);

                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({embeds: [embed]});
                }
                break;
            case "keywords":

                res.keywords = value.trim().split(",");
                res.save();

                embed
                .setTitle(`Keywords were updated`)
                .setDescription(`Keywords are now \`${res.keywords.join(", ")}\``);
        
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({embeds: [embed]});

                break;
            case "title":

                res.title = value;
                res.save();

                embed
                .setTitle(`Title was updated`)
                .setDescription(`Title is now  \`${res.title}\``);
        
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({embeds: [embed]});

                break;
            case "body":

                res.body = value;
                res.save();

                embed
                .setTitle(`Body was updated`)
                .setDescription(`Keywords are now \`${res.body}\``);
        
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({embeds: [embed]});

                break;
        }

    }
} as ICommand