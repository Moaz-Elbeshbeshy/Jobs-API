const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No token provided error')
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        throw new UnauthenticatedError('No token found')
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: decoded.userId, name: decoded.name, token: token }
        next()
    } catch (err) {
        next(new UnauthenticatedError('Error verifying token'))
    }
}

module.exports = authMiddleware