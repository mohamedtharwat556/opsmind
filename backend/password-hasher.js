/**
 * Password Hashing Utility
 * Uses bcryptjs for secure password hashing
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const passwordHasher = {
  /**
   * Hash a plain text password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  hash: async (password) => {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  },

  /**
   * Compare plain password with hashed password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from DB
   * @returns {Promise<boolean>} - True if passwords match
   */
  compare: async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword) {
      return false;
    }
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
};

module.exports = passwordHasher;
