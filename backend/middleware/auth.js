import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Optional: if you need to attach the full user object

// YOUR ORIGINAL FUNCTION, UNCHANGED
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization; // Check both cases

    // 1. Check if Authorization header exists and starts with 'Bearer '
    if (!authHeader?.startsWith('Bearer ')) {
        console.log("[Auth Middleware] Failed: No Bearer token found."); // Debug log
        return res.status(401).json({ message: 'Unauthorized - Missing or invalid token format' });
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];
    if (!token) {
         console.log("[Auth Middleware] Failed: Token missing after 'Bearer '."); // Debug log
        return res.status(401).json({ message: 'Unauthorized - Token missing' });
    }

    // 3. Verify the token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET, // Make sure this matches the secret used to sign
        async (err, decoded) => {
            if (err) {
                console.error("[Auth Middleware] Failed: Token verification error:", err.message); // Debug log
                // Handle specific errors like token expiry if needed
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ message: 'Forbidden - Token expired' }); // Use 403 for expired
                }
                return res.status(403).json({ message: 'Forbidden - Invalid token' }); // Use 403 for invalid
            }

            // --- CRITICAL PART ---
            // 4. Attach decoded payload to req.user
            // Ensure the field name 'phoneNumber' matches EXACTLY what's in your JWT payload
            if (!decoded || !decoded.phoneNumber) {
                 console.error("[Auth Middleware] Failed: Decoded token missing 'phoneNumber'. Payload:", decoded); // Debug log
                return res.status(403).json({ message: 'Forbidden - Invalid token payload' });
            }

            // Assign the necessary info to req.user
            req.user = {
                phoneNumber: decoded.phoneNumber, // Make sure this name is correct!
                userId: decoded.userId, // Include userId if present in token
                role: decoded.role // Include role if present in token
            };

            console.log(`[Auth Middleware] Success: User authenticated - Phone: ${req.user.phoneNumber}, ID: ${req.user.userId}, Role: ${req.user.role}`); // Debug log
            next(); // Proceed to the next middleware or controller
        }
    );
};

// --- NEW FUNCTION ---
// 5. Add the 'admin' middleware
const admin = (req, res, next) => {
    // This middleware MUST run *after* auth()
    if (req.user && req.user.role === 'admin') {
        console.log(`[Admin Middleware] Success: User ${req.user.phoneNumber} is admin.`);
        next();
    } else {
        console.warn(`[Admin Middleware] Failed: User ${req.user?.phoneNumber} is not an admin.`);
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// --- MODIFIED EXPORTS ---
// 6. Export 'admin' as named and 'auth' as default
export { admin };
export default auth;