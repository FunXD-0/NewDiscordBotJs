const {QueryType} = require('discord-player');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays music Ya Eh')
        .addStringOption(options =>
            options.setName('search')
                .setDescription('The song you want to play')
                .setRequired(true)),
	async execute(interaction, player) {
		if(!interaction.member.voice.channelId) {
            return await interaction.reply({ 
                content: "You are not in a voice channel!", 
                ephemeral: true,
            });
        }

        if(interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId){
            return await interaction.reply({
                content: "You are not in my voice channel!",
                ephemeral: true
            });
        }
        
        await interaction.deferReply();
        const query = interaction.options.get("search").value;
        const queue = player.createQueue(interaction.guild,{
            metadata: {
                channel: interaction.channel,
            }
        });

        const searchResult = await player.search(query, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        }).then(x => x.tracks[0]);      
        if (!searchResult){
            return await interaction.followUp({
                content: 'No results were found!'
            });
        }
        
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.followUp({
                content: "Could not join your voice channel!", ephemeral: true 
            });
        }

        await interaction.followUp({
            content: `Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
          });
          queue.addTrack(searchResult.tracks);
          if (!queue.playing) await queue.play();
	},
};
