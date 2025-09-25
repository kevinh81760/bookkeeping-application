import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

// Step 1: Create an S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Step 2: Upload file helper
export const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  // Step 2a: Create a unique key (S3 object path)
  const key = `receipts/${Date.now()}-${fileName}`;

  // Step 2b: Build the PutObject command
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  // Step 2c: Send the command to S3 (this uploads the file)
  await s3.send(command);

  // Step 2d: Return internal S3 URI (safe to store in DynamoDB)
  return `s3://${process.env.AWS_BUCKET_NAME}/${key}`;
};

// Step 3: Signed URL helper
export const getSignedS3Url = async (s3Uri, expiresIn = 3600) => {
  if (!s3Uri.startsWith("s3://")) throw new Error("Invalid S3 URI");

  const withoutPrefix = s3Uri.replace("s3://", "");
  const [bucket, ...keyParts] = withoutPrefix.split("/");
  const key = keyParts.join("/");

  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3, command, { expiresIn });
};

