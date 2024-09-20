
const { REST, SlashCommandBuilder, Options, ApplicationCommandOptionType, ChannelType, VoiceChannel,  } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {

	data:   new SlashCommandBuilder()
                .setName('son')
                .setDescription('Envoie un son dans un salon vocal')
                .addChannelOption(option =>
                    option
                        .setName('salon')
                        .setDescription('Salon dans lequel envoyer le son, par default : le salon dans lequel tu es')
                        .addChannelTypes(ChannelType.GuildVoice)
                        .setRequired(false)),


async execute(interaction) {
/*     let channel = interaction.options.getChannel('salon');

    if (!channel) {
     
     }  */
//const channel = ;  
try {


    await interaction.reply(`Salon rejoint: ${interaction.member.voice.channel}`)
    const connection = joinVoiceChannel(
        {
            channelId: interaction.member.voice.channel,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        }); 

    joinVoiceChannel();
    } catch (error) {
        console.error('Error trying to join', error);
    }

}};

                                      
/*     joinVoiceChannel()
    .then(connection => {
        const dispatcher = connection.play('./gorm.mp3');
        dispatcher.on("finish", end => {
            voiceChannel.leave();
        });
    })
    .catch(console.error); */
