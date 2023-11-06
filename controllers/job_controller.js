const Job = require("../models/Job");
const CustomError = require("../error/custom_error");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({});
    if (!jobs) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Jobs not found");
    }
    res.status(StatusCodes.OK).json({ jobs });
  } catch (error) {
    next(error);
  }
};



const createJob = async (req, res, next) => {
  console.log(req.user);
  try {
    req.body.createdBy = req.user._id;
    await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: "Job created" });
  } catch (error) {
    next(error);
  }
};



const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const job = await Job.findOneAndUpdate(
      { _id: id, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        `No job with this id: ${id}`
      );
    }
    res.status(StatusCodes.OK).json({ message: "Job updated successfully" });
  } catch (error) {
    next(error);
  }
};



const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const job = await Job.findByIdAndDelete({ _id: id, createdBy: userId });
    if (!job) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        `No job with this id: ${id}`
      );
    }
    res.status(StatusCodes.OK).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
};
