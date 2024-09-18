import { Prisma } from "@prisma/client"
import prisma from "../core/core.prisma"
import { IFileModel } from "../interface/file-interface"
import fs from 'fs';
import mime from 'mime-types'; 
import { v2 as cloudinary } from 'cloudinary'
import { getPublicIdFromUrl } from "../helper/file-model-helper/file.helper";

/**
 * 
 * @param fileData 
 * @returns 
 */
export async function saveUploadedFile(
fileData:IFileModel
): Promise<any> {
    // service to create file in database
    try {
        const uploadedFIle = await prisma.file.create({
            data: {
                filePath: fileData.filePath,
                publicKey: fileData.publicKey,
                privateKey: fileData.privateKey,
                isLocal: Boolean(fileData.isLocal),
                userId: fileData.userId || null,
                config: fileData.config || null,
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
    publicKey: string,
    config: string
): Promise<any> {
    try {
        // Retrieve the file using the public key
        const fileRecord = await prisma.file.findFirst({
            where: { publicKey: publicKey }
        });
        const filePath = fileRecord?.filePath;

        if (!fileRecord) {
            throw new Error('File not found');
        }

        // If the file is stored locally
        if (config === 'local') {
            const filePath = fileRecord?.filePath;
            const fileExists = fs.existsSync(filePath);
            const mimeType = mime.lookup(filePath) || 'application/octet-stream';
            // Check if the file exists in the filesystem
            if (!fileExists) {
                throw new Error('File not found on server');
            }
            // Update last activity when fetching
            await updateLastActivity(publicKey);

            return { mimeType, filePath };
        // if file stored in cloud
        } else {
            const mimeType = mime.lookup(fileRecord?.filePath) || 'application/octet-stream';
            // Update last activity when fetching
            await updateLastActivity(publicKey);
            return { mimeType, filePath }; 
        }
        
    } catch (error) {
        console.error('Error retrieving file:', error);
        throw new Error('Unable to retrieve file');
    }
}



/**
 * 
 * @param privateKey 
 * @returns 
 */
export async function removeFileFomeDBandStorage(
    privateKey: string,
    config: string
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

        if (config === 'cloudinary') {
            const publicId = getPublicIdFromUrl(filePath); 
            // Delete the file from Cloudinary
            await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(publicId, (error:any, result:any) => {
                    if (error) {
                        return reject(new Error('Unable to delete file from Cloudinary'));
                    }
                    resolve(result);
                });
            });
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
// update last activity base on Get request
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