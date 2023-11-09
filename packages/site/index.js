// Configuration
const CONFIG_MANAGER_SCHEMA = '0x81ba1506292bcde4ceae1d8960f26f2e62c9c61b7ecbe3cd3d73682453fa8b7c'
const CONFIG_RECORD_SCHEMA = '0x245b64ff9792a92c3026895d09423841ca1e772e877c42d3a3159a268c7ffec2'
const CONFIG_ADMIN = '0x4F24f7cF6Bfc7F6A00a10d4d5AB6a5296a1416d8'
const CONFIG_BACKUP = 'https://en.wikipedia.org/wiki/Human_error'

/**
 * Performs a GraphQL request to EAS.
 * 
 * @param {*} schema   Schema ID to match against.
 * @param {*} attester Attester to match against.
 * @param {*} content  Content to match against.
 * 
 * @returns Result of the GraphQL request.
 */
const request = async (schema, attester, content) => {
  return (await fetch(
    'https://optimism.easscan.org/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Query($where: AttestationWhereInput, $take: Int) {
            attestations(where: $where, take: $take, orderBy: {time: desc}) {
              id
              schemaId
              attester
              recipient
              decodedDataJson
            }
          }
        `,
        variables: {
          take: 1,
          where: {
            schemaId: {
              equals: schema,
            },
            attester: {
              equals: attester,
            },
            decodedDataJson: {
              contains: content
            },
            revoked: {
              equals: false,
            }
          }
        },
      }),
    }
  )).json()
}

/**
 * Grabs the manager for a specific subdomain.
 * 
 * @param {*} subdomain Subdomain to grab the manager for.
 * 
 * @returns Manager for the given subdomain.
 */
const manager = async (subdomain) => {
  return (await request(
    CONFIG_MANAGER_SCHEMA,
    CONFIG_ADMIN,
    subdomain
  )).data.attestations[0].recipient
}

/**
 * Grabs the Jalbo link for a specific subdomain.
 * 
 * @param {*} subdomain Subdomain to grab the Jalbo link for.
 * 
 * @returns Jalbo link for the given subdomain.
 */
const record = async (subdomain) => {
  try {
    return JSON.parse((await request(
      CONFIG_RECORD_SCHEMA,
      await manager(subdomain),
      subdomain
    )).data.attestations[0].decodedDataJson)[1].value.value
  } catch (err) {
    return CONFIG_BACKUP
  }
}

/**
 * Gets the subdomain for the current page.
 * 
 * @returns Subdomain for the current page.
 */
const subdomain = () => {
  if (window.location.hostname.includes('jalbo.link')) {
    return window.location.hostname.split('.')[0]
  } else {
    return 'jalbo'
  }
}

/**
 * Redirects the user to a given page.
 * 
 * @param {*} location Location to redirect to.
 */
const redirect = (location) => {
  window.location.href = location
}

/**
 * Sleeps for a given amount of time.
 * 
 * @param {*} ms Time to sleep in milliseconds.
 * 
 * @returns Promise that resolves after the given time.
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Main function.
 */
const main = async () => {
  console.log('Grabbing Jalbo link...')
  const tick = Date.now()
  const link = await record(subdomain())
  const tock = Date.now() - tick
  console.log(`Grabbed Jalbo link in ${tock}ms`)
  await sleep(Math.max(0, 1000 - tock))
  redirect(link)
}

// Run the main function on load.
window.onload = main
window.onunload = () => {}
window.onpageshow = (e) => {
  if (e.persisted) {
    main()
  }
}
