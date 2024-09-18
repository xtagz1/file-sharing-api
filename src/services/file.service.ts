import { Prisma } from "@prisma/client"
import prisma from "../core/core.prisma"
import { IFileModel } from "../interface/file-interface"
import fs from 'fs';
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
                config: fileData.config || null
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

    // find file in project directory
    if (!fileExists) {
        throw new Error('File not found on server')
    }

    // update last activity when fetching
    await updateLastActivity(publicKey)

    // Get the MIME type
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'; 
    return { mimeType, filePath }
        
    } catch (error) {
        console.error('Prisma error:', error);
        throw new Error('Unable to retrieve file')
    }
}



/**
 * 
 * @param privateKey 
 * @returns 
 */
export async function removeFileFomeDBandStorage(
    privateKey: string
): Promise<any> {
    try {
        // Retrieve the file record using the privateKey
        const fileRecord = await prisma.file.findFirst({
            where: { privateKey }
        });

        // Check if the file record exists
        if (!fileRecord) {
            throw new Error('File not found');
        }

        // Read the file path from the record
        const filePath = fileRecord.filePath;

        // Check if the file exists on the filesystem
        if (fs.existsSync(filePath)) {
            // Delete the file from the filesystem
            fs.unlinkSync(filePath); 
        }

        // Delete the file record from the database
        const deletedFile = await prisma.file.delete({
            where: { privateKey }
        });

        // Return the deleted file record or any relevant info
        return deletedFile;

    } catch (error) {
        console.error('Prisma error:', error);
        throw new Error('Unable to delete file');
    }
}



export async function getInactiveFiles() {
    const inactiveDays = Number(process.env.INACTIVE_DAYS) || 2;
    const date = new Date();
    date.setDate(date.getDate() - inactiveDays); 

    // Query the database for files where lastActivity is more than 'inactiveDays' ago
    const inactiveFiles = await prisma.file.findMany({
        where: {
            lastActivity: {
                lt: date,
            },
        },
    });

    return inactiveFiles;
}



/**
 * 
 * @param publicKey 
 * @returns 
 */
export async function updateLastActivity(publicKey: string): Promise<void> {
    try {
        const updatedFile = await prisma.file.update({
            where: {
                publicKey: publicKey,
            },
            data: {
                lastActivity: new Date(), 
            },
        });

        console.log(`Updated lastActivity for file with publicKey: ${publicKey}`);
        return 
    } catch (error) {
        console.error('Error updating lastActivity:', error);
        throw error; 
    }
}