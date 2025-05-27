# Tiger.Chat Database Configuration Report

## Overview
This report provides a summary of the Tiger.Chat database configuration after removing the Convex implementation and confirming the continued use of Drizzle ORM with PostgreSQL.

## Database Configuration

- **Database Type**: PostgreSQL (Hosted on Supabase)
- **ORM**: Drizzle
- **Connection String**: `POSTGRES_URL` in `.env.local`
- **Migration Files**: 7 SQL migrations

## Database Schema

The Tiger.Chat application uses the following main tables:

### User Table
User authentication and account information.
- `id`: UUID (Primary Key)
- `email`: VARCHAR (64)
- `password`: VARCHAR (64)

### Chat Table
Chat sessions and metadata.
- `id`: UUID (Primary Key)
- `createdAt`: TIMESTAMP
- `title`: TEXT
- `userId`: UUID (Foreign Key to User)
- `visibility`: VARCHAR ('public' or 'private')

### Message Table (v2)
Messages with improved schema using parts.
- `id`: UUID (Primary Key)
- `chatId`: UUID (Foreign Key to Chat)
- `role`: VARCHAR
- `parts`: JSON
- `attachments`: JSON
- `createdAt`: TIMESTAMP

### Vote Table (v2)
Voting information for messages.
- `chatId`: UUID (Foreign Key to Chat)
- `messageId`: UUID (Foreign Key to Message)
- `isUpvoted`: BOOLEAN
- Primary Key: (`chatId`, `messageId`)

### Document Table
Document storage for artifacts.
- `id`: UUID
- `createdAt`: TIMESTAMP
- `title`: TEXT
- `content`: TEXT
- `kind`: VARCHAR ('text', 'code', 'image', 'sheet')
- `userId`: UUID (Foreign Key to User)
- Primary Key: (`id`, `createdAt`)

### Suggestion Table
Document suggestions.
- `id`: UUID (Primary Key)
- `documentId`: UUID
- `documentCreatedAt`: TIMESTAMP
- `originalText`: TEXT
- `suggestedText`: TEXT
- `description`: TEXT
- `isResolved`: BOOLEAN
- `userId`: UUID (Foreign Key to User)
- `createdAt`: TIMESTAMP
- Foreign Key: (`documentId`, `documentCreatedAt`) references Document

### Stream Table
Streaming information.
- `id`: UUID (Primary Key)
- `chatId`: UUID (Foreign Key to Chat)
- `createdAt`: TIMESTAMP

## Migration Information

The database uses Drizzle migrations located in `lib/db/migrations/`:
1. `0000_keen_devos.sql`
2. `0001_sparkling_blue_marvel.sql`
3. `0002_wandering_riptide.sql`
4. `0003_cloudy_glorian.sql`
5. `0004_odd_slayback.sql`
6. `0005_wooden_whistler.sql`
7. `0006_marvelous_frog_thor.sql`

## Database Operations

Database operations are centralized in `lib/db/queries.ts` and include:
- User management (getting and creating users)
- Chat management (creating, retrieving, and deleting chats)
- Message operations
- Document operations

## Verification

Verification steps confirmed that:
1. All database migrations run successfully
2. The Next.js application starts without errors
3. The database connection to PostgreSQL is properly configured
4. All Convex implementation has been removed

## Final Status

**Convex has been fully removed from the project.**

The application continues to use Drizzle ORM with PostgreSQL, following the original design with database code located in `lib/db`.

## Report Date
May 27, 2025
