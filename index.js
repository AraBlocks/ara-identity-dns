const dnsSocket = require('dns-socket')
const { DID } = require('did-uri')

/**
 * Get DID from TXT DNS record for the given domain
 *
 * @param  {String}  options.domain  Domain name to search (for non-root records, use <name>.<domain>)
 * @param  {String}  [options.dns]   IP of DNS server
 * @param  {Number}  [options.port]  Port to talk to DNS through
 *
 * @return {DID}                     Object containing info about DID
 */
const getDID = ({ domain, dns = '8.8.8.8', port = 53 }) => {
  const socket = dnsSocket()

  return new Promise((resolve, reject) => {
    socket.query({
      questions: [ {
        type: 'TXT',
        name: domain
      } ]
    }, port, dns, (err, response) => {
      if (0 === response.answers.length) {
        return resolve(null)
      }
      try {
        return resolve(response.answers[0].data.toString())
      } catch (e) {
        return reject(e)
      }
    })
  })
}

module.exports = { getDID }
