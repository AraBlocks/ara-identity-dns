const Socket = require('dns-socket')
const debug = require('debug')('ara:identity-dns')
const mDNS = require('multicast-dns')
const pify = require('pify')
const once = require('once')

const {
  Questions,
  ondata,
  onanswer
} = require('./lib/utils')

async function resolve(address, opts) {
  const _opts = Object.assign({ port: '53', server: '1.1.1.1' }, opts)

  const questions = Questions(address)
  const socket = Socket(_opts.socket)
  const mdns = mDNS(_opts.multicast)

  if (Array.isArray(_opts.port) && !Array.isArray(_opts.ports)) {
    _opts.ports = _opts.port
  }

  if (Array.isArray(_opts.server) && !Array.isArray(_opts.servers)) {
    _opts.servers = _opts.server
  }

  const ports = Array.isArray(_opts.ports)
    ? _opts.ports
    : [ _opts.ports || _opts.port ]

  const servers = Array.isArray(_opts.servers)
    ? _opts.servers
    : [ _opts.servers || _opts.server ]

  debug('questions', questions)

  return pify(query)()

  function query(cb) {
    const done = once(finish)

    socket.on('response', ondnsresponse)
    socket.on('error', onerror)

    mdns.on('response', onmdnsresponse)
    mdns.on('error', onerror)

    debug('mdns query')
    mdns.query({ questions })

    for (const host of servers) {
      for (const port of ports) {
        socket.query({ questions }, port, host)
        debug('dns query', port, host)
      }
    }

    function onerror(err) {
      debug('err:', err)
      return done(err)
    }

    function finish(err, res) {
      if (err) {
        cb(err)
      } else {
        socket.destroy()
        mdns.destroy()
        cb(null, res)
      }
    }

    function ondnsresponse(res, port, host) {
      debug('dns: response:', host, port)
      onresponse(res)
    }

    function onmdnsresponse(res, rinfo) {
      debug('mdns: response:', rinfo.host, rinfo.port)
      onresponse(res)
    }

    function onresponse(res) {
      const { answers } = res

      if (Array.isArray(answers)) {
        const dids = []
        for (const answer of answers) {
          dids.push(onanswer(answer))
        }

        return done(null, dids)
      } else {
        return done(null, [])
      }
    }
  }
}

module.exports = {
  resolve
}
