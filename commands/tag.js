const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tag')
		.setDescription('fetch the information of that tag')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of tag')
                .setRequired(true)),
	async execute(interaction, player, con) {
        const add = 'SELECT * FROM tags WHERE name = ' + interaction.options.get("name").value + 'LIMIT 1;'; 
		const tag = con.query(add,
            function(err, results, fields){
                interaction.reply(results)
            console.log(fields);
        });
        if(tag){
            const update = 'UPDATE tags SET usage_count = usage_count + 1 WHERE name = ' + interaction.options.get("name").value + ';';
            con.query(update,
                function(err, results, fields){
                console.log(results);
                console.log(fields);
            });
        }
        else{
            await interaction.followUp({
                content: interaction.reply(`Could not find tag: ${interaction.options.get("name").value}`)
            });
        }
	},
};