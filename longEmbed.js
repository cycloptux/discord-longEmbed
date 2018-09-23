const { RichEmbed } = require("discord.js");

const longEmbed = function (Client, longTextOrArray, textSeparator, embedTitle, embedColor, pre_or_post) {
    // PRE: textSeparator is appended to the current message, before the split
    // POST: textSeparator is prepended to the following message, after the split
    pre_or_post = typeof pre_or_post !== "undefined" ? pre_or_post : "pre";
    var embed = new RichEmbed();
    if (Client !== null && Client !== undefined) embed.setFooter(Client.user.username, Client.user.avatarURL).setTimestamp();
    if (embedTitle !== null) embed.setTitle(embedTitle);
    if (embedColor !== null) embed.setColor(embedColor);

    if (Array.isArray(longTextOrArray)) {
        var arrayOfText = longTextOrArray;
        var longText = arrayOfText.join(textSeparator);
    } else {
        var reObj = new RegExp(regExpEscape(textSeparator), "g");
        arrayOfText = longTextOrArray.split(reObj);
        longText = longTextOrArray;
    }

    if (longText.length <= 2048) return embed.setDescription(longText);
    else {
        var tmsg = "", msglength = 0, msgcount = 0, m = "", cumulativeMsgLength = 0;
        for (var i = 0; i < arrayOfText.length; i++) {
            if (pre_or_post === "pre") m = arrayOfText[i] + textSeparator;
            else if (pre_or_post === "post") {
                if (i === 0) m = arrayOfText[i];
                else m = textSeparator + arrayOfText[i];
            }
            msglength += m.length;
            if (msgcount > 24 || cumulativeMsgLength + msglength > 6000) {
                // OVER QUOTA
                embed.setFooter("Max number of characters/fields entries reached. There may be more entries, but these were truncated.");
                break;
            }
            if ((msgcount === 0 && msglength < 2048) || (msgcount > 0 && msglength < 1024)) {
                tmsg = tmsg.concat(m);
            } else {
                if (msgcount === 0) embed.setDescription(tmsg);
                else embed.addField("More...", tmsg);
                cumulativeMsgLength += msglength;
                tmsg = m;
                msglength = m.length;
                msgcount++;
            }
        }
        if (!(msgcount > 24 || cumulativeMsgLength + msglength > 6000)) embed.addField("More...", pre_or_post === "pre" ? tmsg.slice(0, -textSeparator.length) : tmsg);
        return embed;
    }
};

module.exports = {
    longEmbed
}
