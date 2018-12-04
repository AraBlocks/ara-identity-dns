const browser = require('../browser')
const node = require('../index')

node.resolve('araid.qnzl.co')
  .then((res) => {
    console.log("Node test:", res)
  })
  .catch((err) => {
    console.error("Node test fail: ", err)
  })
