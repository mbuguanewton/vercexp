import express from 'express'
import cors from 'cors'
import config from 'config'
import api from './v1/index.mjs'
import { log } from './utils/logger.mjs'

export default function bootstrap(app) {
    const corsEnabled =
        process.env.CORS_ENABLED || config.get('cors.enabled') || false

    if (corsEnabled) {
        const corsOptions = {
            origin: process.env.CORS_ORIGINS || config.get('cors.origins'),
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            preflightContinue: false,
        }

        app.use(cors(corsOptions))
    }

    if (process.env.NODE_ENV !== 'test') {
        app.use(log.requestLogger)
    }

    app.use(express.json({ limit: '50mb' }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))

    // Routes
    app.use('/api', api)

    // 404
    app.use((_, res) => {
        res.status(404).send({
            status: 404,
            message: 'The requested resource was not found',
        })
    })

    // 5xx
    app.use((err, _, res, next) => {
        // eslint-disable-line
        log.error(err)
        const message =
            process.env.NODE_ENV === 'production'
                ? "Something went wrong, we're looking into it..."
                : err.stack
        res.status(500).send({ status: 500, message })

        next()
    })
}
