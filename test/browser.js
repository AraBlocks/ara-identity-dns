const browser = require('../browser')
const assert = require('assert')

// Run with `budo`
browser.resolve('araid.qnzl.co')
  .then(assert)
  // .then(console.log)
