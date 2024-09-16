import dotenv from 'dotenv'
import fs from 'fs'

const envFile =
    process.env.NODE_ENV === 'production' ? '.env.production' : '.env'

if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile })
} else {
    console.warn(`Environment file ${envFile} not found`)
}
