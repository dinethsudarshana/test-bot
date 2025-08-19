  const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
  } = require("@adiwajshing/baileys");
  const P = require("pino");
  const config = require("./config");
  const antiLink = require("./lib/antilink");
  const fs = require("fs");

  async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      auth: state,
      logger: P({ level: "silent" })
    });

    console.log(`\n==============================
    ${config.botName} is starting...
    Prefix: ${config.prefix}
==============================\n`);

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
        if (shouldReconnect) startBot();
        else console.log("❌ Logged out. Delete the session folder to relogin.");
      } else if (connection === "open") {
        console.log(`✅ ${config.botName} connected.`);
      }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      const m = messages && messages[0];
      if (!m || !m.message || m.key.fromMe) return;

      const from = m.key.remoteJid;
      const sender = m.key.participant || m.key.remoteJid;
      const body =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        m.message.imageMessage?.caption ||
        "";

      // Echo baseline
      if (!body.startsWith(config.prefix)) {
        // basic echo for MVP (can be removed later)
        // await sock.sendMessage(from, { text: body });
      }

      // Anti-link check
      if (antiLink(body)) {
        await sock.sendMessage(from, {
          text: `⚠️ Links are not allowed here, @${sender.split("@")[0]}`,
          mentions: [sender]
        });
        return;
      }

      // Commands
      if (body.startsWith(config.prefix)) {
        const args = body.slice(config.prefix.length).trim().split(/\s+/);
        const command = (args.shift() || "").toLowerCase();

        try {
          const commandFile = require(`./commands/${command}.js`);
          await commandFile(sock, m, args, config);
        } catch (err) {
          // Unknown command
          // console.log(err);
          await sock.sendMessage(from, { text: `❓ Unknown command: ${command}` });
        }
      }
    });
  }

  startBot();
