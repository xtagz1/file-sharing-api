import { CloudProvider } from "@prisma/client";

export interface IFile {
    file: Express.Multer.File
}

// models/file.model.ts
export interface IFileModel {
    id: number;
    userId: string | null;
    isLocal: boolean;
    cloud: CloudProvider | null; // Adjust CloudProvider type as necessary
    publicKey: string;
    privateKey: string;
    filePath: string;
    lastActivity: Date;
    createdAt: Date;
    updatedAt: Date;
}
