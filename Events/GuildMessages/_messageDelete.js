const { Events, AuditLogEvent } = require('discord.js')
const { clientId, chatLogs } = require("../../config.json")

const createEmbed = require("../../Modules/embed.js").new

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {

    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MessageDelete
    });

    const log = fetchedLogs.entries.first();
    if (!log) return;
    
    const { executor, target } = log;

    if (target.id != message.author.id)
      return;

    message.guild.channels.fetch(chatLogs).then(c => {
      c.send({
        embeds: [createEmbed({
          title: "Message Deleted",
          desc: `Author: ${message.author}\nMessage: ${message.content}`,
          footer: {text: executor.tag, iconURL: executor.displayAvatarURL()}
        })]
      })
    })
  }
}