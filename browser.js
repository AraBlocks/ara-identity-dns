const { DID } = require('did-uri')
const fetch = require('node-fetch')

const AID_PREFIX = 'did:ara:'

function resolve(address, ropts) {
  const type = ropts && ropts.type ? ropts.type : 'TXT'
  const uri = `https://dns.google.com/resolve?name=${address}&type=${type}`
  const opts = { method: 'GET' }

  return fetch(uri, opts).then(onresponse)

  async function onresponse(response) {
    const dids = []
    const body = await response.json()
    const { Answer: answers } = body

    if (Array.isArray(answers)) {
      for (const answer of answers) {
        const result = onanswer(answer)
        if (result) {
          dids.push(result)
        }
      }
    }

    return dids
  }

  function onanswer(answer) {
    // check for TXT(16) answer type
    if (16 === answer.type) {
      return ondata(clean(answer.data))
    }

    return null

    function clean(data) {
      return data && data.replace(/(^")(.*)("$)/, '$2')
    }
  }

  function ondata(data) {
    const prefix = data.slice(0, AID_PREFIX.length)

    if (prefix === AID_PREFIX) {
      return new DID(data.toString())
    }

    return null
  }
}

module.exports = {
  resolve
}
