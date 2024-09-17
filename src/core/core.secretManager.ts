import bcrypt from 'bcrypt'

export class CoreSecretManager {
    /**
     * Hashes the given password
     * @param password The password to hash
     * @returns A Promise resolving to the hashed password
     */
    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    /**
     * Compares a plaintext password with a hashed password
     * @param plaintextPassword The plaintext password to compare
     * @param hashedPassword The hashed password to compare against
     * @returns A Promise resolving to a boolean indicating whether the passwords match
     */
    public static async comparePasswords(
        plaintextPassword: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(plaintextPassword, hashedPassword)
    }

}