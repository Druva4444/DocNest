import express from 'express'
import upload from '../middlewares/multer.js'
const router = express.Router()
import {getUrl, uploadController,getUploads,getImages,getVideos,getPdfs,getuser, deleteController} from '../Controllers/upload.controller.js'
import {checkauth} from '../middlewares/checkauth.js'
router.post('/upload',upload.single('file'),checkauth ,uploadController)
router.post('/geturl',checkauth,getUrl)
router.get('/getuploads',checkauth,getUploads)
router.get('/getimages',checkauth,getImages)
router.get('/getvideos',checkauth,getVideos)
router.get('/getpdfs',checkauth,getPdfs)
router.get('/getuser',checkauth,getuser)
router.delete('/delete/:fileId',checkauth,deleteController)
export default router
