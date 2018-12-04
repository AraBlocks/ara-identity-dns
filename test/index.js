const browser = require('../browser')
const node = require('../index')

browser.resolve('araid.qnzl.co', (err, res) => {
  console.log("Browser test:", err, res)
})

node.resolve('araid.qnzl.co')
  .then((res) => {
    console.log("Node test:", res)
  })
  .catch((err) => {
    console.error("Node test fail: ", err)
  })
