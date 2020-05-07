const crypto = require("crypto")

const rounds = 1
const value = "hello world"

console.time("hash time")

let hash = value
for (let i = 0; i < rounds; i++) {
	hash = crypto
		.createHash("md5")
		.update(hash)
		.digest("hex")
}

console.timeEnd("hash time")
console.log(`result of ${rounds} MD5 hashes: ${hash}`)