const { DID } = require('did-uri')
const Socket = require('dns-socket')
const debug = require('debug')('ara:identity-dns')
const mDNS = require('multicast-dns')
const pify = require('pify')
const once = require('once')

const DEFAULT_TIMEOUT = 2000
const AID_PREFIX = Buffer.from('did:ara:')

async function resolve(address, opts) {
  const _opts = Object.assign({
    port: '53',
    type: 'TXT',
    server: '1.1.1.1',
    timeout: DEFAULT_TIMEOUT,
  }, opts)

  const questions = Questions(address, _opts.type)
  const socket = Socket(_opts.socket)
  const mdns = mDNS(_opts.multicast)

  let results = 0

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

  function Questions(name, type) {
    return [ { name, type } ]
  }

  function query(cb) {
    const done = once(finish)

    timeout()

    socket.on('response', ondnsresponse)
    socket.on('error', onerror)

    mdns.on('error', onerror)
    mdns.on('response', onmdnsresponse)

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

    function ontimeout() {
      if (0 === results) {
        done(new Error('DNS resolution request did timeout'))
      } else {
        done(null, [])
      }
    }

    function timeout(again) {
      clearTimeout(timeout.timer)
      if (false !== again) {
        timeout.timer = setTimeout(ontimeout, _opts.timeout)
      }
    }

    function finish(err, res) {
      cb(err, res)
      timeout(false)
      socket.destroy()
      mdns.destroy()
    }

    function ondnsresponse(res, port, host) {
      debug('dns: response:', host, port)
      onresponse(res)
    }

    function onmdnsresponse(res, rinfo) {
      debug('mdns: response:', rinfo.host, rinfo.port)
      onresponse(res)
    }

    function onanswer(answer) {
      if (_opts.type === answer.type) {
        for (const data of answer.data) {
          const result = ondata(data)
          if (result) {
            return result
          }
        }
      }

      return answer.data[0]
    }

    function ondata(data) {
      const prefix = Buffer.from(data.slice(0, AID_PREFIX.length))

      if (0 === Buffer.compare(prefix, AID_PREFIX)) {
        return new DID(data.toString())
      }

      return null
    }

    function onresponse(res) {
      const { answers } = res

      timeout(false)

      if (Array.isArray(answers)) {
        const dids = []
        for (const answer of answers) {
          const result = onanswer(answer)
          results++
          if (result && result instanceof DID) {
            dids.push(result)
          }
        }

        if (dids.length) {
          return done(null, dids)
        }
      }

      return timeout()
    }
  }
}

module.exports = {
  resolve
}
