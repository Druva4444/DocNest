
import { S3Client } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';

dotenv.config();

const client = new S3Client({
  region: process.env.AWS_REGION||"us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
export default client