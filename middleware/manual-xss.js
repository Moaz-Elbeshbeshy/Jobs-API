const xss = require('xss');

const sanitize = (req, res, next) => {
    const sanitizeInput = (obj) => {
        if (typeof obj !== 'object' || obj === null) return;

        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = xss(obj[key]);
            } else if (typeof obj[key] === 'object') {
                sanitizeInput(obj[key]);
            }
        }
    };

    sanitizeInput(req.body);
    sanitizeInput(req.query);
    sanitizeInput(req.params);

    next();
};

module.exports = sanitize;
