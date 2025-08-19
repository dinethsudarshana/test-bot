# Queen Hasuki — WhatsApp Bot (MVP)

Minimal WhatsApp bot inspired by KnightBot-MD. Built with **Baileys**, focused on core group utilities.

## ✨ Features (MVP)
- `!tagall` — tag all group members
- `!kick` — remove a tagged member (assumes admin for MVP)
- `!sticker` — convert an image to a sticker
- Anti-link — warns when a link is posted

## ⚙️ Stack
Node.js • @adiwajshing/baileys • pino • axios • node-cache • awesome-phonenumber • libphonenumber-js • dotenv

## 🚀 Setup
1. Ensure **cwebp** is installed (required for sticker conversion).
2. `npm install`
3. `npm start`
4. Scan the QR code in the terminal with WhatsApp.

### Config
Edit `config.js`:
```js
module.exports = {
  botName: "Queen Hasuki",
  prefix: "!",
  owner: "1234567890@s.whatsapp.net",
  apis: { exampleKey: "YOUR_API_KEY" }
}
```

## 🧩 Commands
- `!tagall`
- `!kick @user`
- Reply an image with `!sticker`

## 📦 Structure
```
/commands
  - tagall.js
  - kick.js
  - sticker.js
/lib
  - antilink.js
  - isAdmin.js
  - converter.js
  - sticker.js
index.js
config.js
package.json
README.md
```

## 🧭 Next Steps
- Real admin check using group metadata
- Mute/ban/warn system + persistence
- More entertainment utilities
- Auto-remove users who post links (configurable)
