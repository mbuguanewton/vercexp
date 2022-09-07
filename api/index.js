import os from 'os'
import express from 'express'
import http from 'http'
import config from 'config'
import { log } from './utils/logger.mjs'
import { sendInfoToSlack } from './utils/slack.mjs'
import { connectDB } from './resources/dbs/mongo/index.mjs'
import bootstrap from './app.mjs'

let server
const app = express()

app.start = async () => {
    log.info('Starting app ...')

    // await mongoose.connect
    await connectDB()

    log.info('Starting server ...')
    const signals = ['SIGINT', 'SIGTERM']

    signals.forEach((signal) => process.on(signal, process.exit))

    const port = process.env.PORT || config.get('port') || 4000
    app.set('port', port)

    bootstrap(app)

    server = http.createServer(app)

    server.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error
        }

        error.description = 'Failed to start server'
        log.error(error)
        process.exit(15)
    })

    server.on('listening', () => {
        const address = server.address()
        log.info(`Server listening ${address.port} : ${os.hostname}`)

        const envProd = process.env.NODE_ENV === 'production'

        if (envProd) {
            const msg = `API is live on port: ${
                address.port
            } 🚀 on ${new Date().toLocaleString()}: ${os.hostname}`

            const params = {
                title: 'Server started',
                message: msg,
                value: {
                    ...server,
                },
                date: new Date().toLocaleString(),
            }
            sendInfoToSlack({ params })
        } else {
            log.info('api is up 🚀')
        }
    })

    if (process.env.NODE_ENV !== 'test') {
        server.listen(port)
    }
}

Promise.resolve(true)
    .then(app.start)
    .catch((err) => {
        log.error(err)
        setTimeout(() => process.exit(15), 1000)
    })

export default app
