const { StatusCodes } = require("http-status-codes")
const Job = require("../models/Job")
const { NotFoundError, BadRequestError } = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const getJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req

    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new NotFoundError('Job not found')
    }
    res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.userId
        const job = await Job.create(req.body)
        res.status(StatusCodes.CREATED).json(job)
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Job already exists' })
        }
        next(error)
    }
}
const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req

    if (company === '' || position === '') {
        throw new BadRequestError('Company and Position fields cannot be empty')
    }

    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })

    if (!job) {
        throw new NotFoundError('Job not found')
    }
    res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req

    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })

    if (!job) {
        throw new NotFoundError('Job not found')
    }

    res.status(StatusCodes.OK).json({ msg: 'Job was deleted successfully' })
}









module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }