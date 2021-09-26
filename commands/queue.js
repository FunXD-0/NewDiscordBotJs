const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Want to view the queue eh. HUH'),
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

        var queue = player.getQueue(interaction.guildId);
        if (typeof(queue) != 'undefined') {
              return await interaction.reply({
                embeds: [
                  {
                    title: 'Now Playing',
                    description: `The Current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | **${queue}**! `,
                  }
                ]
              })
          } else {
            return await interaction.reply({
              content: 'There is no song in the queue!'
            })
          }
	},
};