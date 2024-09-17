import fs from 'fs';
import path from 'path';
import { saveUploadedFile } from '../services/file.service';
import { fileNameGenerator, privateKeyGenerator, publicKeyGenerator } from './key-generator.helper';

const FOLDER = path.join(__dirname, '..', process.env.FOLDER || 'uploads');

/**
 * 
 * @param file 
 * @param data 
 * @returns 
 */
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


/**
 * 
 * @param file 
 * @param data 
 * @param config 
 * @returns 
 */
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



/**
 * 
 * @param file 
 * @param ip 
 */
// In-memory store to keep track of uploaded size per IP 
// Please note that if you rerun the app all filesize counte will reset
const uploadLimits: Record<string, { totalSize: number, lastReset: number }> = {};

export const ipUploadLimiter = async (
    file: any, 
    ip: any
) => {
    const SIZE_LIMIT:any = process.env.SIZE || 1024 * 1024 * 10; //default is 10mb
    const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const fileSize = file.size; // Size of the uploaded file
    const now = Date.now();

    // Initialize or reset upload size counter for the IP
    if (!uploadLimits[ip]) {
        uploadLimits[ip] = { totalSize: fileSize, lastReset: now };
    } else if (now - uploadLimits[ip].lastReset > RESET_INTERVAL) {
        // Reset the size counter after 24 hours
        uploadLimits[ip] = { totalSize: fileSize, lastReset: now };
    } else {
        // Check if the total uploaded size exceeds the limit
        if (uploadLimits[ip].totalSize + fileSize > SIZE_LIMIT) {
            throw new Error(`Upload limit exceeded. You can only upload ${SIZE_LIMIT / 1024} KB per day.`);
        }
        // Accumulate the file size
        uploadLimits[ip].totalSize += fileSize;
    }
};

