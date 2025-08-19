module.exports = async (sock, m) => {
  try {
    const jid = m.key.remoteJid;
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants.map(p => p.id || p.jid).filter(Boolean);

    await sock.sendMessage(jid, {
      text: "📢 Tagging everyone:\n\n" + participants.map(p => `@${p.split("@")[0]}`).join(" "),
      mentions: participants
    });
  } catch (e) {
    await sock.sendMessage(m.key.remoteJid, { text: "❌ This command only works in groups." });
  }
};
