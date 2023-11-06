const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job_controller');
const authentication = require('../middleware/auth');
router.get('/jobs', authentication, jobController.getAllJobs);
router.post('/jobs', authentication, jobController.createJob);
router.put('/job/update/:id', authentication, jobController.updateJob );
router.delete('/job/delete/:id', authentication, jobController.deleteJob );

module.exports = router;