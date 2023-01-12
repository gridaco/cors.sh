const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../../mail.cors.sh", "render");
const templates = fs
  .readdirSync(dir)
  // list files ending with .template.html
  .filter((file) => file.endsWith(".template.html"));

const prefix = "mail_cors_sh_";

module.exports = async (serverless, options) =>
  templates.map((file) => {
    const fname = file.replace(".template.html", "");
    const name = prefix + fname;
    const subject = fs.readFileSync(path.join(dir, `${fname}.subject`), "utf8");
    const html = fs.readFileSync(path.join(dir, file), "utf8");
    return { name, subject, html };
  });
