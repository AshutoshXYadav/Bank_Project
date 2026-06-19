const jwt = require('jsonwebtoken');
const User = require('../src/models/User.model');

const systemAuthMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Token required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }

        // Check if user is system admin (adjust field name based on your User model)
        if (!user.system && !user.system) {
            return res.status(403).json({ message: 'Forbidden - System admin access required' });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = systemAuthMiddleware;
