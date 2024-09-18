import fs from 'fs';
import path from 'path';
import { saveUploadedFile } from '../services/file.service';
import { fileNameGenerator, privateKeyGenerator, publicKeyGenerator } from './key-generator.helper';
import { v2 as cloudinary } from 'cloudinary'
import { IFileModel } from '../interface/file-interface';

const FOLDER = path.join(__dirname, '..', process.env.FOLDER || 'uploads');
const fullFolderPath = path.join(FOLDER);


/**
 * 
 * @param file 
 * @param data 
 * @returns 
 */
export const saveToLocal = async (
    file: any, 
    data:any,
    config:any
) => {
    // Ensure the specific folder path exists within the root folder

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
        config:config || 'local'
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
    file: Express.Multer.File,
    data: any,
    config: any
) => {

    // Generate a unique filename
    const uniqueFilename = fileNameGenerator(file);

    // Generate public and private keys 
    const publicKey = publicKeyGenerator(file);
    const privateKey = privateKeyGenerator(file);

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload the file to Cloudinary from buffer
    const uploadedFile:any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                public_id: uniqueFilename,
                folder: process.env.CLOUDINARY_FOLDER || 'upload',
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );

        // Write the buffer to the stream
        stream.end(file.buffer);
    });

    // Prepare the data to save to your database
    const fileData: IFileModel = {
        filePath: uploadedFile.secure_url, 
        publicKey,
        privateKey,
        isLocal: false,
        userId: data.userId || null,
        config: config || null,
    };

    // Save the uploaded file to your database
    const savedFile = await saveUploadedFile(fileData);

    return savedFile;
};




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


