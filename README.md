# Google Drive Clone

A full-stack Google Drive clone application built with React, Express, and SQLite.

## Features

- 📁 File upload and storage in `public/uploads` folder
- 📂 Folder creation and navigation
- 💾 SQLite database for file metadata storage
- ⭐ Star/unstar files
- 🗑️ Delete files and folders (with recursive deletion for folders)
- 📊 Grid and List view modes
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

Run both the backend server and frontend development server:

```bash
npm run dev:full
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:5173` (or another port if 5173 is occupied)

### Separate Commands

Alternatively, you can run them separately:

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Project Structure

```
GD-Clone/
├── server/
│   ├── server.js      # Express backend server
│   └── database.js    # JSON file-based database
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   └── utils/         # API utility functions
├── public/
│   └── uploads/       # Uploaded files storage
└── database.json      # JSON database (created automatically)
```

## API Endpoints

- `GET /api/files` - Get all files (optional `?parentFolderId=id` query parameter)
- `POST /api/files/upload` - Upload a file (multipart/form-data)
- `POST /api/folders` - Create a new folder
- `DELETE /api/files/:id` - Delete a file or folder
- `PUT /api/files/:id/star` - Toggle star status

## Database Schema

The JSON database stores files in an array with the following structure:
- `id` - Unique identifier (auto-incremented)
- `name` - File/folder name
- `type` - File type (folder, document, pdf, etc.)
- `size` - File size in bytes (0 for folders)
- `path` - Relative path to the file
- `parent_folder_id` - Reference to parent folder ID (null for root)
- `created_at` - Creation timestamp (ISO string)
- `modified_at` - Last modification timestamp (ISO string)
- `starred` - Star status (0 or 1)
- `owner` - File owner (default: 'me')

## Usage

1. **Upload a File**: Click "New" → "File upload" → Select a file
2. **Create a Folder**: Click "New" → "New folder" → Enter folder name
3. **Navigate Folders**: Click on a folder to enter it
4. **Star Files**: Click the menu (three dots) → "Star"
5. **Delete Files**: Click the menu → "Delete"

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Express.js, Multer (file uploads)
- **Database**: JSON file-based storage (no native dependencies required)
- **File Storage**: Local filesystem (`public/uploads`)

## Notes

- Files are stored in the `public/uploads` folder
- Database file (`database.json`) is created automatically on first run
- The uploads folder structure mirrors the folder hierarchy in the database
- No native compilation required - works on all platforms without build tools
