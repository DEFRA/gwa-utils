#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs/promises')
const fetch = require('node-fetch')

const awAuthHeader = process.env.AW_AUTH_HEADER
const awDomain = process.env.AW_DOMAIN
const awTenantCode = process.env.AW_TENANT_CODE

async function main () {
  const pageSize = 500 // default is 500 prefer to be specific
  let page = 0 // zero based
  const devices = []
  let next = false

  do {
    const url = `https://${awDomain}/API/mdm/devices/search?pagesize=${pageSize}&page=${page}`
    page++
    console.log(`Request URL: ${url}.`)
    const res = await fetch(url, {
      headers: {
        Authorization: awAuthHeader,
        'aw-tenant-code': awTenantCode,
        'Content-Type': 'application/json'
      }
    })

    if (res.status !== 200) {
      console.error(`Response was not OK.\nStatus: ${res.status}\nText: ${res.statusText}\nURL: ${res.url}`)
      return
    }

    const { Devices, Page, PageSize, Total } = (await res.json())
    devices.push(Devices)

    const resDeviceCount = Devices.length
    console.log(`Response\nStatus: ${res.status} (${res.statusText})\nHeaders: ${JSON.stringify(res.headers.raw())}`)
    console.log(`DeviceCount: ${resDeviceCount}`)
    console.log(`Page: ${Page}\nPageSize: ${PageSize}\nTotal: ${Total}`)

    next = page * pageSize < Total
  } while (next)

  console.log(`Data extract from AW is complete.\n${devices.length} devices have been processed.`)
  await fs.writeFile('data/aw-users-raw.json', JSON.stringify(devices))
}

main().catch((e) => {
  console.error(e)
})
