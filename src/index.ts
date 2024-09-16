

import './config/env.config'
import express from 'express'
import routes from './routes/index'
import cookieParser from 'cookie-parser'
import CorsConfig from './core/core.cores'
import { logger } from './config/logger.config'

const app = express()
const port = process.env.PORT

app.use(CorsConfig.initializeCors())
app.use(cookieParser())
app.use(express.json())
app.use(logger)
app.use('', routes)
app.listen(port, () => {
    console.log(`Starting server on port ${port}`)
})
