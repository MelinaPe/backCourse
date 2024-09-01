const authorize = (roles) => {
    return (req, res, next) => {
        console.log("User session in authorize middleware:", req.session.user);
        if (req.session.user && roles.includes(req.session.user.role)) {
            return next();
        }
        return res.status(403).json({ error: "Forbidden" });
    };
};

module.exports = authorize;


