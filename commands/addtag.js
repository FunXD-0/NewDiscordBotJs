const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtag')
		.setDescription('adds the tag to the database')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of tag')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('description of the tag')
                .setRequired(true)),
	async execute(interaction, player, con) {
        const add = 'INSERT INTO tags(name, description, username) values (' + interaction.options.get("name").value + ',' +
                        interaction.options.get("description").value + ',' + interaction.user.username + ');'; 
		const tag = con.query(add,
            function(err, results, fields){
            console.log(results);
            console.log(fields);
            return true;
        });

        if(tag){
            await interaction.followUp({
                content: interaction.reply(`Tag ${interaction.options.get("name").value} added.`)
            });
        }
        else{
            await interaction.followUp({
                content: interaction.reply(`Something went wrong with adding a tag.`)
            });
        }
	},
};