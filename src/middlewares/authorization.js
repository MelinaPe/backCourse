const authorize = (roles) => {
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.role)) {
            return next();
        }
        return res.status(403).json({ error: "Forbidden" });
    };
};

module.exports = authorize;
