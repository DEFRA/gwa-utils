#!/usr/bin/env node

require('dotenv').config()
const { QueueClient } = require('@azure/storage-queue')

const connectionString = process.env.NOTIFICATION_TO_SEND_STORAGE_CONNECTION_STRING
const queueName = process.env.NOTIFICATION_TO_SEND_QUEUE
const qClient = new QueueClient(connectionString, queueName)

const [, , count] = process.argv
const messageCount = count ?? 100

async function main () {
  console.time(`sending-${messageCount}-msgs`)
  await qClient.createIfNotExists()
  const promises = []
  let numberBase = 100000000

  for (let i = 0; i < messageCount; i++) {
    const message = JSON.stringify({ notification: { phoneNumber: `07${numberBase++}`, message: 'message goes here' } })
    const buf = Buffer.from(message, 'utf8')
    promises.push(qClient.sendMessage(buf.toString('base64')))
  }
  await Promise.all(promises)
  console.timeEnd(`sending-${messageCount}-msgs`)
}

main().catch((e) => {
  console.error(e)
})
