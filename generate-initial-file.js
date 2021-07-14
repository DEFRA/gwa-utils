#!/usr/bin/env node

const fs = require('fs/promises')

const [, , listSize] = process.argv
const numberOfContacts = listSize ?? 100
console.log(`Generating a list of ${numberOfContacts} contacts`)
const contacts = []

// '07700900000' is a recognised test phoneNumber (for Notify)
let numberBase = 10000000
console.time('gen-contacts')
for (let i = 0; i < numberOfContacts; i++) {
  contacts.push({ phoneNumber: `077${numberBase++}` })
}
console.timeEnd('gen-contacts')

const text = 'This is a test message. It is being sent via Notify using an API key of type TEST.'

const msg = {
  message: {
    id: `msg-id-${listSize}`,
    text
  },
  contacts
}

const dataDir = './data/output'
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
