const fs = require('fs/promises')

module.exports = async (data) => {
  const { id } = data
  const path = `./data/output/${id}.json`
  await fs.writeFile(path, JSON.stringify(data))
  console.log(`Saved ${id} to '${path}'.`)
}
