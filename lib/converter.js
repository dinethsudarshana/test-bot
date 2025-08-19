const { writeFileSync, unlinkSync, readFileSync } = require("fs");
const { exec } = require("child_process");
const path = require("path");

async function imageToWebp(buffer) {
  const tmp = path.join(__dirname, `temp_${Date.now()}.png`);
  const out = path.join(__dirname, `temp_${Date.now()}.webp`);
  writeFileSync(tmp, buffer);

  return new Promise((resolve, reject) => {
    exec(`cwebp -q 80 "${tmp}" -o "${out}"`, (err) => {
      try {
        if (err) return reject(err);
        const data = readFileSync(out);
        unlinkSync(tmp);
        unlinkSync(out);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = { imageToWebp };
