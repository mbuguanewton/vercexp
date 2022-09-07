import mongoose from 'mongoose'
import config from 'config'
import { log } from '../../../utils/logger.mjs'

export const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return
    }

    const mongo_uri =
        process.env.MONGO_URI || config.get('databases.mongodb.uri')

    mongoose.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    let db = mongoose.connection

    db.on('error', (error) => {
        log.error(error)
        process.exit(1)
    })

    db.once('open', () => {
        log.info('Connected to MongoDB')
    })
}
