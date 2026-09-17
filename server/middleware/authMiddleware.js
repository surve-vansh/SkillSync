const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    try {
        // Cookie se token nikalo
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Not Authorized",
            });
        }

        // Token verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // User database se nikalo
        req.user = await User.findById(decoded.id).select("-password");

        next();

    } catch (error) {
        res.status(401).json({
            message: "Invalid Token",
        });
    }
};

/* softProtect — sets req.user if a valid cookie is present, but never blocks.
   Use on public routes that optionally benefit from knowing who is logged in. */
const softProtect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
        }
    } catch {
        // Ignore invalid/missing token — just leave req.user undefined
    }
    next();
};

module.exports = { protect, softProtect };