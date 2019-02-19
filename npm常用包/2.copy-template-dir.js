const copy = require('copy-template-dir')
const path = require('path')
 
const vars = { foo: 'bar' }
const inDir = path.join(process.cwd(), 'templates')
const outDir = path.join(process.cwd(), 'dist')
 
copy(inDir, outDir, vars, (err, createdFiles) => {
  if (err) throw err
  createdFiles.forEach(filePath => console.log(`Created ${filePath}`))
  console.log('done!')
})