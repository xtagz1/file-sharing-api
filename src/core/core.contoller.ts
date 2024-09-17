import { Response } from 'express'
import ApiResponse from './core.response'

/**
 * Core Controller
 */
export class CoreController {
    /**
     * Error response handler
     * @param res Response
     */
    public static handleError(res: Response): void {
        res.status(500).json(new ApiResponse(false, 'Internal Server Error!'))
    }

}
