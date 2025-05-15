const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { UnauthenticatedError, BadRequestError } = require('../errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide valid credentials')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('User not found')
    }

    const isMatch = await user.comparePasswords(password)
    if (!isMatch) {
        throw new UnauthenticatedError('Wrong credentials')
    }

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({ user: { name: user.name, userId: user._id }, token })
}


module.exports = { register, login }