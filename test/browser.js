const express = require('express')

const app = express()

app.use(express.static('public'))

console.log("LISTERNING ON 3000")

app.listen(3000)