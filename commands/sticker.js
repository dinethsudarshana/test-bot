const { imageToWebp } = require("../lib/converter");

module.exports = async (sock, m) => {
  const jid = m.key.remoteJid;
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || m.message?.imageMessage;

  if (!quoted) {
    return sock.sendMessage(jid, { text: "❌ Reply to an image with !sticker" });
  }

  try {
    const msgForDownload = m.message?.imageMessage ? m : {
      message: { imageMessage: quoted },
      key: m.key
    };
    const buffer = await sock.downloadMediaMessage(msgForDownload);
    const webpBuff = await imageToWebp(buffer);
    await sock.sendMessage(jid, { sticker: webpBuff });
  } catch (e) {
    await sock.sendMessage(jid, { text: "⚠️ Could not create sticker. Ensure cwebp is installed on your system." });
  }
};
