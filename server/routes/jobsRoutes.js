import express from "express";
import { applyJob, createJob, deleteJobPost, getJobById, getJobPosts, recentAppliedJobs, updateJob } from "../controllers/jobController.js";
import userAuth from '../middlewares/authMiddleware.js'

const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// UPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

//APPLY JOB

router.post("/apply-job/:id",userAuth,applyJob)

//Get Recent applied

router.get("/get-applied-jobs",userAuth,recentAppliedJobs)

export default router;