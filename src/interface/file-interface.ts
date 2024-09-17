import { CloudProvider } from "@prisma/client";

export interface IFile {
    file: Express.Multer.File
}

export interface IFileModel {
    filePath: string;           
    publicKey: string;         
    privateKey: string;        
    isLocal: boolean;           
    userId?: string | null;     
    cloud?: CloudProvider | null; 
}