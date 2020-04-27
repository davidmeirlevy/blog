const {spawn, fork} = require('child_process')
const apps = require('./apps')

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  // run mongo locally to insert data.
  console.log('run mongo')
  const mongo = spawn('mongod', ['--dbpath', './db-data'])

  process.once('exit', () => mongo.kill())

  mongo.stdout.on('data', data => {
    if (data.toString().includes('waiting for connections on port')) {
      console.log('db is running')
      runServicesInits()
    }
  })
} else {
  runServicesInits()
}

function runServicesInits() {
  console.log('start populate data')
  Promise.all([
    runServiceInit('content', apps.content.env),
    runServiceInit('auth', apps.auth.env)
  ]).then(() => {
    console.log('init data completed successfully!')
    process.exit(0)
  }, () => {
    console.log('init data failed!')
    process.exit(1)
  })
}

function runServiceInit(service, env) {
  console.log('run', service)
  return new Promise((resolve, reject) => {
    const f = fork('./' + service + '/helpers/init.js', null, {env})

    f.on('close', () => {
      console.log(service, 'close')
      resolve()
    })
    f.on('error', () => {
      console.log(service, 'error')
      reject()
    })
  })

}
