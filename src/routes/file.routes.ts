import { Router } from "express";
import { FileController } from "../controllers/file.controller";
import multer from 'multer';


const upload = multer({ storage: multer.memoryStorage() });
const router = Router()

const {
    uploadFile,
    getFile,
    deleteFile
} = FileController 

router.post('', upload.single('file'), uploadFile)

router.get('/:publicKey', getFile)

router.get('/:privateKey', deleteFile)

export default router