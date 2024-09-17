import { Prisma } from "@prisma/client"
import prisma from "../core/core.prisma"
import { IFileModel } from "../interface/file-interface"

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