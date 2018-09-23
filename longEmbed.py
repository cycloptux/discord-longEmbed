import discord

def longEmbed(longTextOrArray, textSeparator = "\n", embedTitle = None, embedColor = None):
    if embedTitle is None:
        embedTitle = ""
    if embedColor is None:
        embedColor = 0xe74c3c
    
    if isinstance(longTextOrArray, list):
        arrayOfText = longTextOrArray
        longText = textSeparator.join(longTextOrArray)
    else:
        arrayOfText = longTextOrArray.split(textSeparator)
        longText = longTextOrArray
    
    if len(longText) <= 2048:
        return discord.Embed(title = embedTitle, description = longText, color = embedColor)
    else:
        tmsg = ""
        msglength = 0
        msgcount = 0
        m = ""
        cumulativeMsgLength = 0
        over_quota = False
        for i in range(len(arrayOfText)):
            m = arrayOfText[i] + textSeparator
            msglength += len(m)
            if msgcount > 24 or cumulativeMsgLength + msglength > 6000:
                over_quota = True
                break
            if (msgcount == 0 and msglength < 2048) or (msgcount > 0 and msglength < 1024):
                tmsg += m
            else:
                if msgcount == 0:
                    em = discord.Embed(title = embedTitle, description = tmsg, color = embedColor)
                else:
                    em.add_field(name = "More...", value = tmsg)
                cumulativeMsgLength += msglength
                tmsg = m
                msglength = len(m)
                msgcount += 1
        if not (msgcount > 24 or cumulativeMsgLength + msglength > 6000):
            em.add_field(name = "More...", value = tmsg[:-len(textSeparator)])
        if over_quota:
            em.set_footer(text = "Max number of characters/fields entries reached. There may be more entries, but these were truncated.")
        return em
