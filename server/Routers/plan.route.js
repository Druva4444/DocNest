import express from 'express'
const router = express.Router()
import {getPlans} from '../Controllers/Plan.controller.js'
router.get('/getplans',getPlans)
export default router