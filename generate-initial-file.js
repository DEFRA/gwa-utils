#!/usr/bin/env node

const fs = require('fs/promises')

const [, , listSize] = process.argv
const numberOfContacts = listSize ?? 100
console.log(`Generating a list of ${numberOfContacts} contacts`)
const contacts = []

// '07700900000' is a recognised test phoneNumber (for Notify)
let numberBase = 100000000
console.time('gen-contacts')
for (let i = 0; i < numberOfContacts; i++) {
  contacts.push({ phoneNumber: `07${numberBase++}` })
}
console.timeEnd('gen-contacts')

const message = 'This is a test message. Please ignore. There is nothing to see here. This is the way. It has a length so as not to exceed a single message i.e. 160 chars.'

const msg = {
  message,
  contacts
}

const dataDir = './data'
const filePath = `${dataDir}/initial-${numberOfContacts}-contacts.json`

async function main () {
  console.time(`writeFile: ${filePath}`)
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(msg))
  console.timeEnd(`writeFile: ${filePath}`)
}

main().catch((e) => {
  console.error(e)
})
