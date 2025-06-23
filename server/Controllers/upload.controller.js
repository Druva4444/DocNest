import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../utils/aws.js";
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../Models/User.model.js';
import Upload from '../Models/uploads.model.js';

dotenv.config();

if (!process.env.AWS_BUCKET) {
  console.error('❌ AWS_BUCKET not defined in environment variables');
  process.exit(1);
}

// Upload File
export async function uploadController(req, res) {
  try {
    const file = req.file;
    if (!file || !file.buffer) {
      return res.status(400).json({ message: "File not received properly" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.usedcapacity + file.size > user.capacity) {
      return res.status(403).json({ message: "Storage limit exceeded" });
    }

    const ImageName = crypto.randomBytes(32).toString('hex');

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: ImageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await s3.send(new PutObjectCommand(uploadParams));

    await Upload.create({
      user: req.user._id,
      filename: ImageName,
      originalname: file.originalname,
      filetype: file.mimetype,
      filesize: file.size,
    });

    user.usedcapacity += file.size;
    await user.save();

    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: ImageName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return res.status(200).json({
      message: "File uploaded successfully",
      s3Result: result,
      url,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
}

// Delete File
export async function deleteController(req, res) {
  try {
    const { fileId } = req.params;

    const file = await Upload.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this file" });
    }

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: file.filename,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
    await Upload.findByIdAndDelete(fileId);

    const user = await User.findById(req.user._id);
    if (user) {
      user.usedcapacity = Math.max(0, user.usedcapacity - file.filesize);
      await user.save();
    }

    return res.status(200).json({ message: "File deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
}

// Get Signed URL
export async function getUrl(req, res) {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ message: "Filename not provided" });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return res.status(200).json({ url });

  } catch (error) {
    console.error("Get URL error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get All Uploads
export async function getUploads(req, res) {
  try {
    const uploads = await Upload.find({ user: req.user._id });
    return res.status(200).json({ uploads });
  } catch (error) {
    console.error("Get uploads error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get Images
export async function getImages(req, res) {
  try {
    const images = await Upload.find({ user: req.user._id, filetype: "image/jpeg" });
    return res.status(200).json({ images });
  } catch (error) {
    console.error("Get images error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get PDFs
export async function getPdfs(req, res) {
  try {
    const pdfs = await Upload.find({ user: req.user._id, filetype: "application/pdf" });
    return res.status(200).json({ pdfs });
  } catch (error) {
    console.error("Get PDFs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get Videos
export async function getVideos(req, res) {
  try {
    const videos = await Upload.find({ user: req.user._id, filetype: "video/mp4" });
    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Get videos error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get Authenticated User Info
export async function getuser(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Please login" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Error within server" });
  }
}
