import dotenv from 'dotenv'
dotenv.config()

module.exports = {
    databases: {
        mongodb: {
            uri: process.env.MONGO_URI,
        },
    },
    port: 8080,

    jwt: {
        secret: process.env.JWT_SECRET,
    },
    slack: {
        webhook: process.env.SLACK_WEBHOOK,
    },
    logging: {
        console: true,
        path: 'logs',
    },
    cors: {
        enabled: true,
        origins: ['http://localhost:3000'],
    },
}
