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
// const db1 = require("./utils/database").mongoURI1
// const db2 = require("./utils/database").mongoURI2

// default options
app.use(cors())
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload())

// const connectWithRetry = function() {
//     return mongoose.connect(db1, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true
//             }, function (err) {
//         if (err) {
//             console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
//             setTimeout(connectWithRetry, 5000);
//         } else {
//             console.log("mongoDB Connected")
//         }
//     });
// };
// connectWithRetry();

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
