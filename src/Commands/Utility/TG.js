const { SlashCommandBuilder } = require("discord.js");
var file = require('../../index.js');

module.exports = {

	data:   new SlashCommandBuilder()
                .setName('tg')
                .setDescription('ferme ta gueule niveau insultes'),

    async execute(interaction) {

    },

};
