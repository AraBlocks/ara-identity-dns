function resolve(address) {
  return window.fetch(`https://dns.google.com/resolve?name=${address}&type=TXT`, { method: "GET" })
    .then(async (response) => {
      const body = await response.json()
      const { Answer: answers } = body

      if (Array.isArray(answers)) {
        const dids = []
        for (const answer of answers) {
          dids.push(answer.data.replace(/\"/g, ''))
        }

        return dids
      } else {
        return []
      }
    })
    .catch(console.error)
}

module.exports = {
  resolve
}
