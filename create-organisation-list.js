#!/usr/bin/env node

const readCsv = require('./lib/read-csv')
const writeFile = require('./lib/write-file')

async function createOrganisationList (data) {
  data.forEach(x => {
    delete x.type
    x.active = x.active === 'Y'
    x.core = x.core === 'Y'
  })
  const id = 'organisationList'

  return { id, data }
}

async function main () {
  const data = await readCsv('defra-organisation-list.csv', ['orgName', 'orgCode', 'type', 'active', 'core'])

  const orgList = await createOrganisationList(data)

  await writeFile(orgList)
}

main().catch((e) => console.error(e))
