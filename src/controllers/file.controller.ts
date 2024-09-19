import { Request, Response } from 'express';
import { CoreController } from '../core/core.contoller';
import { ipUploadLimiter, savetoCloud, saveToLocal } from '../helper/file-model-helper/file.helper';
import { removeFileFomeDBandStorage, retrieveFile } from '../services/file.service';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export class FileController extends CoreController{
    
    /**
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    public static async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as Express.Multer.File;
            const data = req.body
            const config = process.env.CONFIG || 'local'
            const ip = req.ip;

            if (!file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            // function to limit upload per Ip
            await ipUploadLimiter(file, ip)

            let response
            // save the file depending on config
            if(config === 'local'){
             response = await saveToLocal(file, data, config)
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

    /**
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    public static async getFile(req: Request, res: Response): Promise<void> {
        try {
            const { publicKey } = req.params; 
            const config = process.env.CONFIG || 'local';
            
            // Service to retrieve file
            const { mimeType, filePath } = await retrieveFile(publicKey, config);
    
            if (config === 'local') {
                // If the file is stored locally, stream it to the client
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    
                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);
    
                fileStream.on('error', (error:any) => {
                    console.error('Error streaming file:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Error streaming file',
                    });
                });
    
            } else {
                // If the file is stored in the cloud, send the cloud URL
                res.status(200).json({
                    success: true,
                    message: 'Retrieve file successfully',
                    response: {
                        filePath,  
                        mimeType   
                    }
                });
            }
    
        } catch (error) {
            console.error('Error getting file', error);
            FileController.handleError(res);
        }
    }


    /**
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    public static async deleteFile(req: Request, res: Response): Promise<void> {
        try {
            const { privateKey } = req.params; 
            const config = process.env.CONFIG || 'local'
            // service to delete file
            const response = await removeFileFomeDBandStorage( privateKey, config )

            res.status(200).json({
                success: true,
                message: 'deleted file successfully',
                response
            });
            return

        } catch (error) {
            console.error('Error deleting file', error);
            FileController.handleError(res)
            return
        }
    }
}
