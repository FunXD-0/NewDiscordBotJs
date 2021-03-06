const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('pausingggggg'),
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
        const queue = player.getQueue(interaction.guildId)
        if(!queue || !queue.playing)
            return await interaction.followUp({
                content: 'No music is being played!',
            });
        const success = queue.setPaused(true);
        return await interaction.followUp({
            content: success ? 'Paused!' : 'NANI, What happend?',
        });
	},
};