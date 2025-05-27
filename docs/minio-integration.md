# MinIO Integration for Tiger.Chat

This document describes the integration of MinIO as a file storage solution for Tiger.Chat, replacing the Vercel Blob Storage.

## Overview

MinIO is an open-source, high-performance object storage system that is API compatible with Amazon S3. It's designed to be used for building high-performance infrastructure for machine learning, analytics, and application data workloads.

## Configuration

### Environment Variables

The following environment variables are used for MinIO configuration:

```
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=tiger-chat-uploads
```

Add these variables to your `.env.local` file.

### Docker Configuration

Tiger.Chat uses Docker to run MinIO locally. The configuration is in the `docker-compose.yml` file:

```yaml
services:
  minio:
    image: minio/minio
    container_name: tiger-chat-minio
    ports:
      - "9000:9000" # API port
      - "9001:9001" # Console port
    volumes:
      - minio-data:/data
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    command: server --console-address ":9001" /data

volumes:
  minio-data:
    driver: local
```

## File Structure

The MinIO integration consists of the following files:

1. `/lib/minio-client.ts` - The main MinIO client utility that handles bucket creation and file uploads
2. `/lib/minio-init.ts` - A script that initializes the MinIO bucket on app startup
3. `/app/(chat)/api/files/upload/route.ts` - The API route that handles file uploads
4. `/scripts/test-minio.ts` - A test script to verify MinIO functionality

## Usage

### Starting MinIO

To start the MinIO server, run:

```bash
docker-compose up -d
```

This will start the MinIO server in the background. You can access the MinIO console at http://localhost:9001 with the credentials:
- Username: minioadmin
- Password: minioadmin

### Uploading Files

The file upload route at `/api/files/upload` handles file uploads to MinIO. It accepts `multipart/form-data` requests with a file field.

Example usage in React:

```tsx
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data;
};
```

### Testing MinIO Integration

To test the MinIO integration, run:

```bash
pnpm test:minio
```

This script will upload a sample image to MinIO and output the URL.

## Folder Structure

```
lib/
  minio-client.ts     # MinIO client utility
  minio-init.ts       # MinIO initialization script
app/
  (chat)/
    api/
      files/
        upload/
          route.ts    # File upload API endpoint
scripts/
  test-minio.ts       # Test script for MinIO
```

## API Reference

### `initializeBucket()`

Initializes the MinIO bucket if it doesn't exist and sets it to public.

```typescript
async function initializeBucket(): Promise<void>
```

### `uploadFile(filename, buffer, contentType)`

Uploads a file to MinIO.

```typescript
async function uploadFile(
  filename: string, 
  buffer: Buffer, 
  contentType: string
): Promise<{ url: string; size: number; uploadedAt: string }>
```

Parameters:
- `filename`: The name of the file to upload
- `buffer`: The file data as a Buffer
- `contentType`: The MIME type of the file

Returns:
- An object with the URL of the uploaded file, its size, and the upload timestamp

## Troubleshooting

### Common Issues

1. **MinIO server not running**
   - Check if the MinIO container is running with `docker ps | grep minio`
   - Start the container with `docker start tiger-chat-minio` if it's stopped

2. **Permission denied**
   - Verify your MinIO credentials in `.env.local`
   - Check if the bucket has the correct permissions

3. **File not accessible**
   - Make sure the bucket is set to public
   - Check network connectivity to the MinIO server

### Debugging

Set environment variable `DEBUG=minio*` to enable verbose logging for MinIO client.
