#!/usr/bin/env node

const fs = require('fs/promises')

async function createOrganisationList () {
  console.time('createOrganisationList')
  const id = 'organisationList'
  const orgs = [{
    orgCode: 'APHA',
    orgDescription: 'Animal and Plant Health Agency'
  }, {
    orgCode: 'DEFRA',
    orgDescription: 'Department for Environment, Food and Rural Affairs'
  }, {
    orgCode: 'EA',
    orgDescription: 'Environment Agency'
  }, {
    orgCode: 'FC',
    orgDescription: 'Forestry Commission'
  }, {
    orgCode: 'NE',
    orgDescription: 'Natural England'
  }]

  const organisationList = { id, data: orgs }
  const path = `./data/${id}.json`
  await fs.writeFile(path, JSON.stringify(organisationList))
  console.log(`Saved ${id} to '${path}'.`)
  console.timeEnd('createOrganisationList')
}

async function main () {
  console.time('main')

  await createOrganisationList()

  console.timeEnd('main')
}

main().catch((e) => console.error(e))
