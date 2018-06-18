const Grenache = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const Peer = Grenache.PeerRPCClient

function configRequest (grape, grcServices) {
  const link = new Link({ grape })
  link.start()

  const peer = new Peer(link, {})
  peer.init()

  return (query, res) => {
    const timeout = { timeout: 10000 }
    return new Promise((resolve, reject) => {
      peer.request(grcServices, query, timeout, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}

module.exports = configRequest
