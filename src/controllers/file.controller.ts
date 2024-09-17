import { Request, Response } from 'express';
import { CoreController } from '../core/core.contoller';
import { savetoCloud, saveToLocal } from '../helper/file.helper';
import { parseBoolean } from '../helper/boolean-converter.helper';

export class FileController extends CoreController{
    
    public static async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as Express.Multer.File;
            const data = req.body
            const config = process.env.CONFIG || 'local'

            if (!file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            let response

            // save the file depending on config
            if(config === 'local'){
             response = await saveToLocal(file, data)
            }else{
             response = await savetoCloud(file, data, config)
            }

            res.status(200).json({
                success: true,
                message: 'Uploaded file successfully',
                response
            });
            return

        } catch (error) {
            console.error('Error uploading file', error);
            FileController.handleError(res)
            return
        }
    }

    public static async getFile(req: Request, res: Response): Promise<void> {
        try {
          

            res.status(200).json({
                success: true,
                message: 'Retrieve file successfully',
                response: ''
            });
            return

        } catch (error) {
            console.error('Error getting file', error);
            FileController.handleError(res)
            return
        }
    }

    public static async deleteFile(req: Request, res: Response): Promise<void> {
        try {
          
            res.status(200).json({
                success: true,
                message: 'deleted file successfully',
                response: ''
            });
            return

        } catch (error) {
            console.error('Error deleting file', error);
            FileController.handleError(res)
            return
        }
    }
}
