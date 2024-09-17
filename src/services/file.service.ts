import { Prisma } from "@prisma/client"
import prisma from "../core/core.prisma"
import { IFileModel } from "../interface/file-interface"
import fs from 'fs';
import path from 'path';
import mime from 'mime-types'; // Make sure to install this package

/**
 * 
 * @param fileData 
 * @returns 
 */
export async function saveUploadedFile(
fileData:IFileModel
): Promise<any> {

    try {
        const uploadedFIle = await prisma.file.create({
            data: {
                filePath: fileData.filePath,
                publicKey: fileData.publicKey,
                privateKey: fileData.privateKey,
                isLocal: Boolean(fileData.isLocal),
                userId: fileData.userId || null,
                cloud: fileData.cloud || null
            }
        })
        return uploadedFIle

    } catch (error) {
        console.error('Prisma error:', error);
        throw new Error('Unable to save file')
    }
}

/**
 * 
 * @param publicKey 
 * @returns 
 */
export async function retrieveFile(
publicKey:string
):Promise<any>{
    try {
    // Retrieve the file using the public key
    const fileRecord = await prisma.file.findFirst({
        where: { publicKey:publicKey }
    });

    // Check if the file record exists in db
    if (!fileRecord) {
        throw new Error('File not found')
    }
    
    // Read the file from the filesystem
    const filePath = fileRecord.filePath;
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
        throw new Error('File not found on server')
    }

    // Get the MIME type
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'; // Default MIME type
    return { mimeType, filePath }
        
    } catch (error) {
        console.error('Prisma error:', error);
        throw new Error('Unable to retrieve file')
    }
}
