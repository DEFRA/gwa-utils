#!/usr/bin/env node

require('dotenv').config()
const fs = require('fs/promises')
const fetch = require('node-fetch')
const msal = require('@azure/msal-node')

const clientId = process.env.AAD_CLIENT_ID
const clientSecret = process.env.AAD_CLIENT_SECRET
const tenantId = process.env.AAD_TENANT_ID

const cca = new msal.ConfidentialClientApplication({
  auth: {
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientId,
    clientSecret
  }
})

async function main () {
  console.time('retrieve-aad-users')
  const clientCredentialRequest = { scopes: ['https://graph.microsoft.com/.default'] }
  const authResult = await cca.acquireTokenByClientCredential(clientCredentialRequest)
  const accessToken = authResult.accessToken

  const users = []

  const count = '$count=true'
  const filter = '$filter=accountEnabled eq true and mail ne null'
  const select = '$select=mail,givenName,surname,companyName,officeLocation'
  let url = `https://graph.microsoft.com/v1.0/users?${select}&${filter}&${count}`

  do {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ConsistencyLevel: 'eventual',
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.error) {
      console.error(data)
      throw new Error('Error occurred during data retrieval.')
    }
    // console.log(data)
    users.push(...data.value)
    url = data['@odata.nextLink']

    console.log(`Retrieved ${users.length} users.`)
    console.log(`${url ? 'A nextLink is available, processing will continue.' : 'No nextLink available, processing complete.'}`)
  } while (url)

  console.log(`Data extract from AAD is complete.\n${users.length} users have been processed.`)
  await fs.writeFile('data/aad-users-raw.json', JSON.stringify(users))
  console.timeEnd('retrieve-aad-users')
}

main().catch((e) => {
  console.error(e)
})
