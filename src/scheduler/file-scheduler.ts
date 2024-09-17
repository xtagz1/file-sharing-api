import cron from 'node-cron';
import { getInactiveFiles, removeFileFomeDBandStorage } from '../services/file.service';
export class FileScheduler {
    // Schedule a task to run once a day (e.g., every midnight)
    public static startFileCleanup() {
        cron.schedule('18 23 * * *', async () => {
            try {
                console.log('Running scheduled task to delete expired files...');

                // Get files that are older than 3 days
                const inactiveFiles = await getInactiveFiles();

                console.log('inactive!!!!',inactiveFiles)
                for (const file of inactiveFiles) {
                    await removeFileFomeDBandStorage(file.privateKey);
                    console.log(`Deleted file with privateKey: ${file.privateKey}`);
                }

                console.log('Scheduled task completed successfully.');
            } catch (error) {
                console.error('Error during scheduled file deletion:', error);
            }
        });
    }
}







