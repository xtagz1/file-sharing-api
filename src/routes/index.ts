import { Router } from 'express'

import fileRoute from './file.routes'

const router = Router()


router.use('/files', fileRoute)

export default router