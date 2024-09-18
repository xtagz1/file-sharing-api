
import prisma from "../../src/core/core.prisma"
import { updateLastActivity } from "../../src/services/file.service"
// Mock Prisma's file.update function

describe('updateLastActivity', () => {
    it('should update the last activity of an existing file in the DB', async () => {
      const publicKey = 'public_f5db1761-c8ae-43ba-92e3-433ae8e28e8a';  
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
