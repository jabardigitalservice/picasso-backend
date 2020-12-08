const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const express = require("express")
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const Raven = require('raven')
const fileUpload = require('express-fileupload')

// Import middleware
const env = process.env.NODE_ENV
try {
    switch(env) {
        case 'undefined':
            require('dotenv').config();
            break
        case 'development':
            require('dotenv').config({
                path: path.resolve(process.cwd(), '../../.env'),
            })
            break
        default:
            Error('Unrecognized Environment')
    }
} catch (err) {
    Error('Error trying to run file')
}

const authenticate = require('./controllers/authenticate')

const app = express()

// default options
app.use(cors())
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload())

mongoose.Promise = global.Promise

// Authentications
app.use(authenticate)

// Import models
app.set('models', mongoose.models)

// Import modules
const route = require('./routes')

//routes
app.use('/api/logbook', route)
Raven.config(process.env.SENTRY_URI).install()

const host = process.env.HOST || "0.0.0.0"
const port = process.env.LOGBOOK_PORT || 80

app.listen(port, () => {
    console.log(`Api Logbook service listening on port ${host}:${port}`)
})

var server = app.listen()
server.setTimeout(300000)
