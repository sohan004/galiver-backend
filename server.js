const { server } = require("./socket")
const port = process.env.PORT || 3013

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})