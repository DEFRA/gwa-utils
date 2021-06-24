#!/usr/bin/env node

const parse = require('csv-parse/lib/sync')
const fs = require('fs/promises')

function createOfficeCode (office) {
  return `${office.areaCode}:${office.officeLocation.trim().replace(/[^a-z0-9+]/gi, '-').replace(/-+/g, '-')}`
}

async function createAreaToOfficeMap (officeLocationList) {
  console.time('createAreaToOfficeMap')
  const id = 'areaToOfficeMap'
  const areaGroupedOfficeMap = new Map()
  officeLocationList.forEach(ol => {
    const areaCode = ol.areaCode
    const area = areaGroupedOfficeMap.get(areaCode)
    const office = { officeCode: createOfficeCode(ol), officeLocation: ol.officeLocation, originalOfficeLocation: ol.originalOfficeLocation }
    if (area) {
      // Ensure no officeCodes are duplicated
      const officeLocations = area.officeLocations.get(office.officeCode)
      if (!officeLocations) {
        area.officeLocations.set(office.officeCode, office)
      }
    } else {
      areaGroupedOfficeMap.set(areaCode, { areaCode, areaName: ol.areaName, officeLocations: new Map([[office.officeCode, office]]) })
    }
  })
  // Finished with the map
  areaGroupedOfficeMap.forEach(area => {
    area.officeLocations = [...area.officeLocations.values()]
  })

  // Sort officeLocations
  areaGroupedOfficeMap.forEach(area => area.officeLocations.sort((o1, o2) => {
    if (o1.officeCode < o2.officeCode) { return -1 }
    if (o1.officeCode > o2.officeCode) { return 1 }
    return 0
  }))

  const areaToOfficeMapSorted = [...areaGroupedOfficeMap.values()].sort((o1, o2) => {
    if (o1.areaCode < o2.areaCode) { return -1 }
    if (o1.areaCode > o2.areaCode) { return 1 }
    return 0
  })
  const areaToOfficeMap = { id, data: areaToOfficeMapSorted }
  const path = `./data/output/${id}.json`
  await fs.writeFile(path, JSON.stringify(areaToOfficeMap))
  console.log(`Saved ${id} to '${path}'.`)
  console.timeEnd('createAreaToOfficeMap')
}

async function createStandardisedOfficeLocationMap (officeLocations) {
  console.time('createStandardisedOfficeLocationMap')
  const id = 'standardisedOfficeLocationMap'
  const standardisedOfficeLocationMap = officeLocations.map(ol => {
    ol.officeCode = createOfficeCode(ol)
    return ol
  }).sort((o1, o2) => {
    if (o1.officeCode < o2.officeCode) { return -1 }
    if (o1.officeCode > o2.officeCode) { return 1 }
    return 0
  })
  const areaToOfficeMap = { id, data: standardisedOfficeLocationMap }
  const path = `./data/output/${id}.json`
  await fs.writeFile(path, JSON.stringify(areaToOfficeMap))
  console.log(`Saved ${id} to '${path}'.`)
  console.timeEnd('createStandardisedOfficeLocationMap')
}

async function main () {
  console.time('main')

  const input = await fs.readFile('./data/defra-office-locations.csv')
  // Column names are used for naming properties and do not need to match columns in file
  const data = parse(input, { columns: (header) => ['originalOfficeLocation', 'officeLocation', 'areaCode', 'areaName'] })
  await createAreaToOfficeMap(data)
  await createStandardisedOfficeLocationMap(data)

  console.timeEnd('main')
}

main().catch((e) => console.error(e))
