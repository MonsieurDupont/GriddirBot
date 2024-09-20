const { SlashCommandBuilder } = require("discord.js");

module.exports = {

	data:   new SlashCommandBuilder()
                .setName('idir')
                .setDescription('Idir le vrai'),

    async execute(interaction) {
        await interaction.reply('va niquer ta mere');
    },

};