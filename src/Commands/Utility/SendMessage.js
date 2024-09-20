const { REST, SlashCommandBuilder, Options, ApplicationCommandOptionType, ChannelType } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {

	data:   new SlashCommandBuilder()
                .setName('message')
                .setDescription('Envoie un message')
                .addStringOption(option =>
                    option
                        .setName('texte')
                        .setDescription('Texte a envoyer dans le message')
                        .setRequired(true)
                        .setRequired(true))
                .addChannelOption(option =>
                    option
                        .setName('salon')
                        .setDescription('Salon dans lequel envoyer le message, par defaults : #discussion')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(false)),

                


async execute(interaction) {
                            
     const text = interaction.options.getString('texte');
     let channel = interaction.options.getChannel('salon');
     if (!channel) {
        // Use the default channel here (replace 'default-channel-id' with your actual channel ID)
        channel = interaction.guild.channels.cache.get('1187675345709711402');
     }            
        try {                              
            await channel.send(text);
            await interaction.reply('Message envoyé');
            } catch (error) {
                console.error('Error trying to send message', error);
            }
    },
};