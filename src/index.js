// Includes
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const Insults = require('./Insults.json');
const { Client, Collection, Events, IntentsBitField, ChannelType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ffmpeg = require('ffmpeg-static');


// Initialize the Discord client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const guild = client.guilds.cache.get(guildId);

// Commands setup
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Event listener for when the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    const voiceChannelId = '1249807831528636497'; // Replace with your voice channel ID
    const soundFilePath = 'C:\Users\Troncature\Desktop\Discord\GriddirBot\src\gorm.mp3'; // Replace with the path to your sound file
    joinAndPlay(voiceChannelId, soundFilePath);
});

// Event listener for interaction commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// Function to join a voice channel and play sound
async function joinAndPlay(voiceChannelId, soundFilePath) {
    const channel = client.channels.cache.get(voiceChannelId);

    if (channel && channel.type === ChannelType.GuildVoice) {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
			
        });
		playSound(connection, soundFilePath);
        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('The bot has connected to the channel!');

        });
    } else {
        console.error('Voice channel not found or it is not a voice channel!');
    }
}

// Function to play the sound
// Function to play the sound
function playSound(connection, soundFilePath) {
    const player = createAudioPlayer();
    const resourcePath = path.join(__dirname, soundFilePath);

    if (!fs.existsSync(resourcePath)) {
        console.error(`Audio file not found at: ${resourcePath}`);
        return;
    }

    console.log(`Attempting to play sound from: ${resourcePath}`);
    console.log(`Using FFmpeg executable at: ${ffmpeg}`);

    try {
        const resource = createAudioResource(resourcePath, {
            inputType: 'arbitrary',
            inlineVolume: true,
        });

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('The audio is now playing!');
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('The audio has finished playing!');
            connection.destroy(); // Disconnect the bot when the audio finishes
        });

        player.on('error', error => {
            console.error(`Error playing sound: ${error.message}`);
        });

    } catch (error) {
        console.error(`Error creating audio resource: ${error.message}`);
    }
}


// Message event listener for responding to mentions and target bot
const targetBotId = '155149108183695360';
client.on('messageCreate', (message) => {
    if (message.mentions.users.has(client.user.id)) {
        const randomItemIndex = Math.floor(Math.random() * Object.keys(Insults).length) + 1;
        const randomItem = Insults[randomItemIndex];
        message.reply(randomItem.name);
    }
    if (message.author.id === targetBotId) {
        message.reply('ntm');
    }
});

// Send random insults at regular intervals
const interval = 360000;

function sendMessage() {
    const channel = client.channels.cache.get('1187675345709711402');
    if (channel) {
        const users = client.users.cache.filter(user => !user.bot);
        const randomUser = users.random();
        const randomItemIndex = Math.floor(Math.random() * Object.keys(Insults).length) + 1;
        const randomItem = Insults[randomItemIndex];
        channel.send(`<@${randomUser.id}> ${randomItem.name}`);
        console.log(`Insult sent to <${randomUser.id}>`);
    } else {
        console.error('Channel not found!');
    }
}

const insultFunc = setInterval(sendMessage, interval);

// Login the bot
client.login('MTIzNjA3Mzc0Mzg0Mzk4NzUwOA.GEwBRT.e41clzVMLSP5OlJdGfeRGj5CyUO3s3kTVvOQno');
