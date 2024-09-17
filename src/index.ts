

import './config/env.config'
import express from 'express'
import routes from './routes/index'
import cookieParser from 'cookie-parser'
import CorsConfig from './core/core.cores'
import { logger } from './config/logger.config'
import { FileScheduler } from './scheduler/file-scheduler'

const app = express()
const port = process.env.PORT

// scheduler for deleting inactive files
FileScheduler.startFileCleanup();

app.use(CorsConfig.initializeCors())
app.use(cookieParser())
app.use(express.json())
app.use(logger)
app.use('', routes)
app.listen(port, () => {
    console.log(`Starting server on port ${port}`)
})
