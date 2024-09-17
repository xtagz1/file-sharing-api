
import prisma from "../../src/core/core.prisma"
import { updateLastActivity } from "../../src/services/file.service"
// Mock Prisma's file.update function

describe('updateLastActivity', () => {
    it('should update the last activity of an existing file in the DB', async () => {
      const publicKey = 'test-public-key';  // Use a publicKey that already exists in your DB
  
      // Act: Call the function to update the last activity
      await updateLastActivity(publicKey);
  
      // Fetch the updated file from the database
      const updatedFile = await prisma.file.findUnique({
        where: { publicKey },
      });
  
      // Assert that the update was successful
      expect(updatedFile).not.toBeNull();
      expect(updatedFile?.lastActivity).toBeInstanceOf(Date); // Ensure lastActivity is a Date object
  
      // Ensure lastActivity is defined before making comparisons
      if (updatedFile?.lastActivity) {
        expect(updatedFile.lastActivity.getTime()).toBeGreaterThan(updatedFile.createdAt.getTime()); // Compare dates
      }
    });
  });
