const DNSHTTP = require('dns-over-http')

const {
  Questions,
  onanswer
} = require('./lib/utils')

function resolve(address, opts, cb) {
  if ('function' === typeof opts) {
    cb = opts
    opts = {}
  }

  const _opts = Object.assign({ url: 'https://dns.google.com/experimental' }, opts)

  const questions = Questions(address)

  DNSHTTP.query(_opts, questions, (err, res) => {
    if (err) {
      return cb(err)
    }

    const { answers } = res
    if (Array.isArray(answers)) {
      const dids = []
      for (const answer of answers) {
        dids.push(onanswer(answer))
      }

      return cb(null, dids)
    }
    return cb(null, [])
  })
}

module.exports = {
  resolve
}
