import { Config } from "@prisma/client";

export interface IFile {
    file: Express.Multer.File
}

// models/file.model.ts
export interface IFileModel {
    userId: string | null;
    isLocal: boolean;
    config: Config | null; // Adjust CloudProvider type as necessary
    publicKey: string;
    privateKey: string;
    filePath: string;
}
