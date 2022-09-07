import os from 'os'
import fs from 'fs'
import path from 'path'
import pino from 'pino'
import moment from 'moment'
import config from 'config'
import pinoRequestLogger from 'express-pino-logger'
import { sendToSlack } from './slack.mjs'

export const ERROR_START = 15
const logConsole = process.env.LOG_CONSOLE || config.get('logging.console')
const loggingPath = process.env.LOG_PATH || config.get('logging.path')

export const log = (() => {
    const destination = (file = '') => {
        if (logConsole) {
            return process.stdout
        }
        const logPath = path.join(
            loggingPath,
            moment().format('YYYY-MM-DD'),
            os.hostname()
        )
        fs.mkdirSync(logPath, { recursive: true })
        return pino.destination(path.join(logPath, file))
    }

    const opts = {
        name: 'api',
        level: 'trace',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    }

    const logger = pino(opts, destination('api.log'))
    logger.final = pino.final
    logger.requestLogger = pinoRequestLogger(
        {
            ...opts,
            name: 'http',
        },
        destination('http.log')
    )
    return logger
})()

const logError = log.error.bind(log)
log.error = (error) => {
    logError(error)
    sendToSlack(error)
}
