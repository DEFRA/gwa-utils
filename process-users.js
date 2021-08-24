#!/usr/bin/env node

const { parseAsync } = require('json2csv')
require('dotenv').config()
const fs = require('fs/promises')
const { ContainerClient } = require('@azure/storage-blob')
const streamToBuffer = require('./lib/stream-to-buffer')

const connectionString = process.env.ETL_CONNECTION_STRING
const dataImportContainer = 'data-import'
const containerClient = new ContainerClient(connectionString, dataImportContainer)
const filename = 'valid-users.json'
const blobClient = containerClient.getBlobClient(filename)

function addAreaCode (item) {
  item.areaCode = item.officeCode.split(':')[0]
  return item
}

async function main () {
  console.time('process-users')

  const downloadBlobResponse = await blobClient.download()
  const users = JSON.parse((await streamToBuffer(downloadBlobResponse.readableStreamBody)).toString())

  const csvData = await parseAsync(users, {
    fields: ['emailAddress', 'givenName', 'surname', 'areaCode', 'officeLocation', 'orgCode', 'orgName'],
    transforms: [addAreaCode]
  })
  await fs.writeFile('valid-users.csv', csvData)
  console.timeEnd('process-users')
}

main().catch((e) => {
  console.error(e)
})
