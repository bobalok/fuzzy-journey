import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import { uploadFile, initializeBucket } from '../lib/minio-client';

// Load environment variables
config({ path: '.env.local' });

async function testMinioUpload() {
  console.log('Testing MinIO Storage Implementation...');

  try {
    // Initialize the bucket (ensuring it exists)
    await initializeBucket();
    console.log('MinIO bucket initialized successfully');

    // Get a sample image file to upload
    const sampleImagePath = path.join(
      __dirname,
      '../public/images/opengraph-image.png',
    );

    if (!fs.existsSync(sampleImagePath)) {
      console.error(`Sample image not found at: ${sampleImagePath}`);
      console.log('Trying alternative image location...');

      const altImagePath = path.join(
        __dirname,
        '../app/(chat)/opengraph-image.png',
      );
      if (fs.existsSync(altImagePath)) {
        console.log(`Found alternative image at: ${altImagePath}`);
        await uploadAndTestFile(altImagePath);
      } else {
        console.error('Could not find a sample image to test with.');
        process.exit(1);
      }
    } else {
      await uploadAndTestFile(sampleImagePath);
    }
  } catch (error) {
    console.error('MinIO test failed:', error);
    process.exit(1);
  }
}

async function uploadAndTestFile(filePath: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  console.log(`Uploading test file: ${fileName} (${fileBuffer.length} bytes)`);

  try {
    const result = await uploadFile(fileName, fileBuffer, 'image/png');

    console.log('File upload successful!');
    console.log('Result:', result);
    console.log(`File URL: ${result.url}`);
    console.log('You can access this file in your web browser.');
  } catch (error) {
    console.error('Error during file upload:', error);
    throw error;
  }
}

testMinioUpload().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
