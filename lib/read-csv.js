const fs = require('fs/promises')
const parse = require('csv-parse/lib/sync')

module.exports = async (id, columns) => {
  const input = await fs.readFile(`./data/input/${id}`)
  // Column names are used for naming properties and do not need to match columns in file
  return parse(input, { columns: (_) => columns })
}
