import { ICommand } from "wokcommands";
import DiscordJS, { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import autoresponse from "../model/autoresponse";

export default {

    slash: true,
    description: "Removes an auto response",
    options: [
        {
            name: "name",
            description: "name for the autoresponse has to be unique",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],


    callback: async ({ interaction }) => {

        let name: any = interaction.options.getString("name");

        let confirm = new MessageButton()
            .setCustomId(`${interaction.id}_confirm`)
            .setLabel("✅ Confirm")
            .setStyle('PRIMARY')

        const row = new MessageActionRow();

        row.addComponents(confirm);

        let embed = new MessageEmbed()
            .setTitle(`Delete ${name}`)
            .setDescription(`Do you really wanna delete \`${name}\``);

        const filter = (i: any) => {
            return i.customId === confirm.customId;
        }

        await interaction.reply({ embeds: [embed], components: [row] });

        const collector = interaction.channel!.createMessageComponentCollector({ filter, time: 60000 })

        collector.on("collect", async (i: any) => {

            const params = i.customId.split("_")[1];

            if (params === "confirm") {

                let embed = new MessageEmbed()
                    .setTitle(`Delete ${name}`)
                    .setDescription(`The auto response \`${name}\` was deleted`);

                await autoresponse.deleteOne({ name: name });
                await i.deferReply({ ephemeral: true });
                await i.editReply({ embeds: [embed] });
                await interaction.deleteReply();

            }

        });

        collector.on("end", async () => {

            await interaction.deleteReply();

        });


    }
} as ICommand