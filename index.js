const server = require('./server')

//* "Sanity Check"
server.get('/', (req, res) => {
  res.status(200).send(' 👨‍🔬 All systems nominal. 🤦‍')
})

//* Server Listens on PORT
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`\n 💩  === Server Listens and Obeys on port ${PORT} === 🦄 \n`)
})
