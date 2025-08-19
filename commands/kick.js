const isAdmin = require("../lib/isAdmin");

module.exports = async (sock, m, args, config) => {
  const jid = m.key.remoteJid;
  if (!await isAdmin(sock, m)) {
    return sock.sendMessage(jid, { text: "❌ Only group admins can use this command." });
  }

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (!mentioned[0]) {
    return sock.sendMessage(jid, { text: "❌ Please tag a user to kick. (e.g., !kick @user)" });
  }

  try {
    await sock.groupParticipantsUpdate(jid, [mentioned[0]], "remove");
    await sock.sendMessage(jid, { text: `✅ Removed: @${mentioned[0].split("@")[0]}`, mentions: mentioned });
  } catch (e) {
    await sock.sendMessage(jid, { text: "⚠️ Failed to remove user. I might not be an admin." });
  }
};
