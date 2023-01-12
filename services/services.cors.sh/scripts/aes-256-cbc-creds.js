// used for generating AES-256-CBC credentials. which is used for generating temp api codes

const crypto = require("crypto");

// Generate a 256-bit (32-byte) key
const key = crypto.randomBytes(32);
console.log("Key:", key.toString("hex"));

// Generate a 128-bit (16-byte) IV
const iv = crypto.randomBytes(16);
console.log("IV:", iv.toString("hex"));
