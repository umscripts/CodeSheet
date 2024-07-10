const jwt = require('jsonwebtoken');

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.error("No authorization header present.");
        return res.status(401).json({ message: "Authorization header is required" });
    }

    const token = authHeader.split(' ')[1]; // Assume Bearer schema
    if (!token) {
        console.error("No token found in authorization header.");
        return res.status(401).json({ message: "Token not found in authorization header" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            return res.status(403).json({ message: "Failed to authenticate token", detail: err.message });
        }
        // Ensure decoded object is assigned correctly
        req.user = decoded.user ? decoded.user : decoded;
        console.log("Token verified successfully, user:", req.user);
        next();
    });
};

module.exports = { authenticationToken };
