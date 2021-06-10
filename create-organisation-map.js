#!/usr/bin/env node

const readCsv = require('./lib/read-csv')
const writeFile = require('./lib/write-file')

async function createOrganisationMap (data) {
  const id = 'organisationMap'

  return { id, data }
}

async function main () {
  const data = await readCsv('defra-organisation-map.csv', ['originalOrgName', 'orgName', 'orgCode'])

  const orgList = await createOrganisationMap(data)

  await writeFile(orgList)
}

main().catch((e) => console.error(e))
