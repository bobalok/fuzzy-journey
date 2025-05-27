# MinIO Integration Summary

## Overview
Tiger.Chat now uses MinIO for file storage instead of Vercel Blob Storage. MinIO is an open-source, S3-compatible object storage system.

## Key Features
- Self-hosted with Docker
- S3 compatible API
- Free and open-source
- Unlimited storage (limited only by your disk space)
- Web-based admin console at http://localhost:9001

## Setup
1. Start MinIO with Docker: `docker-compose up -d`
2. Environment variables are in `.env.local`
3. Access MinIO console at http://localhost:9001 (credentials: minioadmin/minioadmin)

## File Upload Flow
1. User uploads file through UI
2. Request goes to `/api/files/upload` endpoint
3. File is uploaded to MinIO using `lib/minio-client.ts`
4. Public URL is returned to the client

## Testing
Run `pnpm test:minio` to test the MinIO integration.

## Benefits Over Vercel Blob Storage
- Free and unlimited usage
- Local development without cloud dependencies
- Full control over storage infrastructure
- Enhanced privacy and data sovereignty
- No vendor lock-in

## Files Modified
- Created: `/lib/minio-client.ts`
- Created: `/lib/minio-init.ts`
- Modified: `/app/(chat)/api/files/upload/route.ts`
- Created: `/scripts/test-minio.ts`
- Modified: `/app/layout.tsx`
- Updated: `package.json` (removed @vercel/blob dependency)

For more details, see [MinIO Integration Documentation](/docs/minio-integration.md).
