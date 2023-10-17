import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js'

// Configuration
const CONFIG_ADDRESS = '0xcbebc5ba53ff12165239cbb3d310fda2236d6ad2'
const CONFIG_ADMIN = '0x4F24f7cF6Bfc7F6A00a10d4d5AB6a5296a1416d8'
const CONFIG_KEY = 'jalbo'
const CONFIG_NETWORK = 'goerli'
const CONFIG_BACKUP = 'https://en.wikipedia.org/wiki/Human_error'
const CONFIG_ABI = '[{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"config","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"val","type":"string"}],"name":"update","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

/**
 * Grabs a config value from the Configuraton contract.
 * 
 * @param {*} user     User that set the config value.
 * @param {*} key      Key of the config value.
 * @param {*} fallback Fallback value if the config value is not set.
 * 
 * @returns Config value or fallback.
 */
const config = async (user, key, fallback) => {
  const contract = new ethers.Contract(
    CONFIG_ADDRESS,
    CONFIG_ABI,
    ethers.getDefaultProvider(CONFIG_NETWORK)
  )

  let res = undefined
  for (let i = 0; i < 5; i++) {
    try {
      res = await contract.config(user, key)
      break
    } catch (err) {
      console.log(err)
      await sleep(200)
    }
  }

  return res || fallback
}

/**
 * Grabs the current Jalbo link.
 * 
 * @returns Jalbo link.
 */
const jalbo = async () => {
  return config(CONFIG_ADMIN, CONFIG_KEY, CONFIG_BACKUP)
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
 * Waits for an object to exist.
 * 
 * @param {*} obj Object to wait for.
 */
const wait = async (obj) => {
  while (!obj) {
    await sleep(200)
  }
}

/**
 * Main function.
 */
const main = async () => {
  const tick = Date.now()
  const link = await jalbo()
  await wait(window.plausible)
  const tock = Date.now()
  await sleep(Math.max(0, 3000 - (tock - tick)))
  redirect(link)
}

// Run the main function.
main()
