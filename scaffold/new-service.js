'use strict'

const DEBUG = 1

const { spawnSync, spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const _ = require('lodash')

const servicename = 'bfx-util-foo-js'
const target = 'tmp'
const serviceHome = `${target}/${servicename}`
const configRoot = path.join(serviceHome, 'config')

const port = 8721
const workername = servicename
  .replace(/^bfx-/, 'wrk-')
  .replace(/-js$/, '-api')

const configFileName = servicename
  .replace(/^bfx-/, '')
  .replace(/-js$/, '.json')
  .replace(/-/, '.')

const serviceLookupKey = servicename
  .replace(/^bfx-/, 'rest:')
  .replace(/-js$/, '')
  .replace(/-/, ':')

const serviceLocApiName = _.camelCase(
  servicename.replace(/-js$/, '')
).replace(/^bfx/, '')


console.log('Setting service up with:')
console.log('port:', port)
console.log('workername:', workername)
console.log('configFileName:', configFileName)
console.log('serviceLookupKey:', serviceLookupKey)
console.log('serviceLocApiName:', serviceLocApiName)
console.log('')

const parentRepo = 'https://github.com/bitfinexcom/bfx-svc-js'

// used for demo as master is missing some files / templates
const fork = 'https://github.com/robertkowalski/bfx-svc-js'

DEBUG && console.log(`git clone ${parentRepo} ${serviceHome}`)
const cloneCmd = [ 'clone', fork || parentRepo, `${serviceHome}` ]
spawnCmd('git', cloneCmd)

spawnCmd('git', [ 'remote', 'add', 'upstream', parentRepo ], { cwd: serviceHome })
console.log(`Added ${serviceHome} as upstream to git repo`)


console.log(`Installing npm dependencies, this may take some time...`)
// spawnCmd('npm', [ 'i' ], { cwd: serviceHome })

// TODO: more elaborate README creation with template
console.log('Adding infos to README.md...')
const txt = `

Run two Grapes:

\`\`\`
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
\`\`\`

### Boot worker

\`\`\`
node worker.js --env=development --wtype=${workername} --apiPort ${port}
\`\`\`

## Grenache API

### action: 'getHelloWorld'

  - \`args\`: &lt;Array&gt;
    - \`0\`: &lt;String&gt; Name to greet

**Response:**

  - &lt;String&gt; The Greeting

**Example Response:**

\`\`\`js
'Hello Paolo'
\`\`\`

`

const readme = fs.readFileSync(path.join(serviceHome, 'README.md'), 'utf8')
fs.writeFileSync(path.join(serviceHome, 'README.md'), readme + txt, 'utf8')

console.log('Creating basic config files...')
const common = fs.readFileSync(path.join(configRoot, 'common.json.example'), 'utf8')
fs.writeFileSync(path.join(configRoot, 'common.json'), common, 'utf8')

const gExampleFile = path.join(configRoot, 'facs', 'grc.config.json.example')
const grc = fs.readFileSync(gExampleFile, 'utf8')
fs.writeFileSync(path.join(configRoot, 'facs', 'grc.config.json'), grc, 'utf8')

const sConfig = JSON.stringify({
  "apiBfxPort": port
})
fs.writeFileSync(path.join(configRoot, configFileName), sConfig, 'utf8')
console.log('Done!')

const exampleJsFile = path.join(serviceHome, 'scaffold', 'example.js.tmpl')
const exampleJsTxt = fs.readFileSync(exampleJsFile, 'utf8')
const exampleJsSubst = exampleJsTxt.replace('__SERVICE__', serviceLookupKey)
fs.writeFileSync(path.join(serviceHome, 'example.js'), exampleJsSubst, 'utf8')


const exampleLocApiFile = path.join(serviceHome, 'scaffold', 'loc.api.js.tmpl')
const exampleLocApiTxt = fs.readFileSync(exampleLocApiFile, 'utf8')
const exampleLocApiSubst = exampleJsTxt.replace('__CLASSNAME__', serviceLocApiName)
fs.writeFileSync(path.join(serviceHome, 'example.js'), exampleJsSubst, 'utf8')


console.log('')
console.log('All set up!')
console.log(`To test the new service, start two grapes:

grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'

Run your worker:

node worker.js --env=development --wtype=${workername} --apiPort ${port}

and run the example.js in ${serviceHome}:

node example.js
`)

function spawnCmd (cmd, args, opts = { 'encoding': 'utf8' }) {
  if (!opts.encoding) opts.encoding = 'utf8'

  const out = spawnSync(cmd, args, opts)

  if (out.stderr) {
    console.error(out.stderr)
  }

  if (out.stdout) {
    console.log(out.stdout)
  }
}
