import mongoose, { ConnectionOptions } from 'mongoose'
import config from './config/config'

const dbOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

const connection = mongoose.connection

mongoose.connect(config.DB.URI, dbOptions)

connection.once('open', () => {
    console.log('Mongodb connection stablished')
})

connection.on('error', err => {
    console.log(err)
    process.exit(0)
})