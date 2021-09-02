#!/usr/bin/env node

const { parseAsync } = require('json2csv')
require('dotenv').config()
const fs = require('fs/promises')
const { ContainerClient } = require('@azure/storage-blob')
const streamToBuffer = require('./lib/stream-to-buffer')

const connectionString = process.env.ETL_CONNECTION_STRING

function addAreaCode (item) {
  item.areaCode = item.officeCode.split(':')[0]
  return item
}

function getConfig (input) {
  return {
    'aad-users': {
      container: 'data-extract',
      filename: 'aad-users.json',
      outputFilename: 'aad-users.csv'
    },
    'valid-users': {
      container: 'data-import',
      filename: 'valid-users.json',
      outputFilename: 'valid-users.csv'
    }
  }[input]
}

async function getFileContents (fileSpec) {
  const containerClient = new ContainerClient(connectionString, fileSpec.container)
  const blobClient = containerClient.getBlobClient(fileSpec.filename)
  const downloadBlobResponse = await blobClient.download()
  return JSON.parse((await streamToBuffer(downloadBlobResponse.readableStreamBody)).toString())
}

async function main () {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Please provide the file to process. Options are:\n  * aad-users\n  * valid-users')
    process.exit(1)
  }
  const filename = args[0]
  const fileSpec = getConfig(filename)
  if (!fileSpec) {
    console.error(`'${filename}' is not a supported file.`)
    process.exit(1)
  }
  console.time('process-users')

  const data = await getFileContents(fileSpec)

  const csvData = await parseAsync(data, {
    fields: ['emailAddress', 'givenName', 'surname', 'areaCode', 'officeLocation', 'orgCode', 'orgName'],
    transforms: [addAreaCode]
  })

  await fs.writeFile(fileSpec.outputFilename, csvData)
  console.timeEnd('process-users')
}

main().catch((e) => {
  console.error(e)
})
