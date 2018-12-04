const { DID } = require('did-uri')

const AID_PREFIX = 'did:ara:'

function onanswer(answer) {
  if ('TXT' === answer.type) {
    return ondata(answer.data[0])
  } else {
    return null
  }
}

function ondata(data) {
  data = data.toString()
  const prefix = data.slice(0, AID_PREFIX.length)

  if (prefix === AID_PREFIX) {
    return new DID(data)
  } else {
    return null
  }
}

function Questions(address, type) {
  return [ {
    name: address,
    type: type || 'TXT'
  } ]
}

module.exports = {
  onanswer,
  ondata,
  Questions
}
