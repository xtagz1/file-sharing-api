import cron from 'node-cron';
import { getInactiveFiles, removeFileFomeDBandStorage } from '../services/file.service';
export class FileScheduler {
    // Schedule a task to run once a day 
    public static startFileCleanup() {
         const config = process.env.CONFIG || 'local'
        cron.schedule( process.env.FILE_CLEANUP_CRON_EXPRESSION || "0 0 * * *", async () => {
            try {
                console.log('Running scheduled task to delete expired files...');

                // Get files that are older than set deays
                const inactiveFiles = await getInactiveFiles();

                for (const file of inactiveFiles) {
                    await removeFileFomeDBandStorage(file.privateKey, config);
                    console.log(`Deleted file with privateKey: ${file.privateKey}`);
                }

                console.log('Scheduled task completed successfully.');
            } catch (error) {
                console.error('Error during scheduled file deletion:', error);
            }
        });
    }
}







