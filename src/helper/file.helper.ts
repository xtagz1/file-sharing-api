import fs from 'fs';
import path from 'path';
import { saveUploadedFile } from '../services/file.service';
import { fileNameGenerator, privateKeyGenerator, publicKeyGenerator } from './key-generator.helper';

const FOLDER = path.join(__dirname, '..', process.env.FOLDER || 'uploads');


export const saveToLocal = async (
    file: any, 
    data:any
) => {
    // Ensure the specific folder path exists within the root folder
    const fullFolderPath = path.join(FOLDER);
    if (!fs.existsSync(fullFolderPath)) {
        fs.mkdirSync(fullFolderPath, { recursive: true });
    }
    const isLocal = true

    // Generate a unique filename and save the file to the folder
    const uniqueFilename = fileNameGenerator(file)
    const filePath = path.join(fullFolderPath, uniqueFilename);
    
    //Generate public key and privateKey
    const publicKey = publicKeyGenerator(file)
    const privateKey = privateKeyGenerator(file)

    // Write the file to the local folder
    await fs.promises.writeFile(filePath, file.buffer);
    
    const requestData = {
        filePath,
        publicKey,
        privateKey,
        isLocal,
        ...data,
    }
    const savedfile = await saveUploadedFile(requestData)
    return savedfile
}



export const savetoCloud = async (
    file: any, 
    data:any,
    config: string
) => {

    // Ensure the specific folder path exists within the root folder
    const fullFolderPath = path.join(FOLDER);
    if (!fs.existsSync(fullFolderPath)) {
        fs.mkdirSync(fullFolderPath, { recursive: true });
    }

    // Generate a unique filename and save the file to the folder
    const uniqueFilename = fileNameGenerator(file)
    const filePath = path.join(fullFolderPath, uniqueFilename);
    
    //Generate public key and privateKey
    const publicKey = publicKeyGenerator(file)
    const privateKey = privateKeyGenerator(file)

    // Write the file to the local folder
    await fs.promises.writeFile(filePath, file.buffer);
    
    const requestData = {
        filePath,
        publicKey,
        privateKey,
        ...data,
    }

    const savedfile = await saveUploadedFile(requestData)

    return savedfile
}
