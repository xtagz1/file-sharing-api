import { v2 as cloudinary } from 'cloudinary'
import { IFileModel } from '../../interface/file-interface';
 

export const uploadToCloudinary = async (uniqueFilename: string, file: Express.Multer.File) => {
    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload the file to Cloudinary from buffer
    const uploadedFile: any = await new Promise((resolve, reject) => {
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

    if (!uploadedFile || !uploadedFile.secure_url) {
        throw new Error('Upload failed or returned invalid response');
    }

    return uploadedFile?.secure_url ;
};

