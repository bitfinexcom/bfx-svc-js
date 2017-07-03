'use strict'

const async = require('async')
const Base = require('./base')

class WrkApi extends Base {

  init () {
    super.init()

    this.conf.init.facilities.push(
      ['fac', 'grc', 'p0', 'bfx', {}],
      ['fac', 'grc', 'p0', 'bfx_api', this.getApiConf()],
      ['fac', 'api', 'bfx', 'bfx_util', {
        path: this.conf.apiBfxClass
      }]
    )
  }

  getApiGrcConf () {
    return { svc_port: 0, services: [] }
  }

  getPluginCtx (type) {
    const ctx = super.getPluginCtx(type)

    switch (type) {
      case 'api_bfx_util':
        ctx.grc_bfx = this.grc_bfx
        break
    }

    return ctx
  }

  _start (cb) {
    async.series([ next => { super._start(next) },
      next => {
        if (this.api_bfx_util) {
          this.grc_bfx_api.set('api', this.api_bfx_util.api)
        }

        next()
      }
    ], cb)
  }
}

module.exports = WrkApi