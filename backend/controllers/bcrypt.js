// File: backend/generateHash.js

import bcrypt from 'bcryptjs';

// ⚠️ IMPORTANT: Replace this with the actual plain text password for user 9191919191
const plainPassword = 'a-very-strong-password-123!'; 
const saltRounds = 10; // Match the 10 salt rounds used in your current hash

console.log("Generating new hash...");

bcrypt.hash(plainPassword, saltRounds)
    .then(hash => {
        console.log("-----------------------------------------------------------------");
        console.log("NEW BCryptJS HASH (Starts with $2a$):");
        console.log(hash);
        console.log("-----------------------------------------------------------------");
        console.log("1. COPY this entire hash string.");
        console.log("2. REPLACE the old password field in MongoDB with this new hash.");
        console.log("3. DELETE this script file.");
    })
    .catch(err => console.error("Error hashing password:", err));