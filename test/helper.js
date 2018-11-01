'use strict'

const { Grape } = require('grenache-grape')
const { PeerRPCClient } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const waterfall = require('async/waterfall')

exports.peerRequest = peerRequest
function peerRequest (serviceName) {
  const link = new Link({ grape: 'http://127.0.0.1:30001' })
  link.start()
  const peer = new PeerRPCClient(link, {})
  peer.init()

  function _peerRequest (query, cb) {
    peer.request(serviceName, query, { timeout: 10000 }, (err, data) => {
      if (err) return cb(err)
      cb(null, data)
    })
  }

  const stop = () => {
    link.stop()
    peer.stop()
  }
  return { stop: stop, request: _peerRequest }
}

exports.bootTwoGrapes = bootTwoGrapes
function bootTwoGrapes (cb) {
  const grape1 = new Grape({
    dht_port: 20002,
    dht_bootstrap: [ '127.0.0.1:20001' ],
    api_port: 40001
  })
  const grape2 = new Grape({
    dht_port: 20001,
    dht_bootstrap: [ '127.0.0.1:20002' ],
    api_port: 30001
  })

  waterfall([
    (cb) => {
      grape1.start()
      grape1.once('ready', cb)
    },
    (cb) => {
      grape2.start()
      grape2.once('node', cb)
    }
  ], () => {
    cb(null, [ grape1, grape2 ])
  })
}

exports.killGrapes = killGrapes
function killGrapes (grapes, done) {
  grapes[0].stop((err) => {
    if (err) throw err
    grapes[1].stop((err) => {
      if (err) throw err
      done()
    })
  })
}
