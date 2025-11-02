import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Clean up files/folders in uploads that don't exist in database
const cleanupOrphanedFiles = () => {
  const uploadsDir = join(__dirname, '..', 'public', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('Uploads directory does not exist');
    return;
  }

  // Get all files from database
  const data = fs.readFileSync(join(__dirname, '..', 'database.json'), 'utf8');
  const dbData = JSON.parse(data);
  const dbFiles = dbData.files;
  
  // Get all paths from database (relative paths like "uploads/filename")
  const dbPaths = new Set(dbFiles.map(f => f.path));
  
  // Recursively find all files and folders in uploads directory
  const findFilesRecursive = (dir, baseDir, relativePath = '') => {
    const items = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = join(dir, entry.name);
      const relative = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      const dbPath = `uploads/${relative}`;
      
      if (entry.isDirectory()) {
        items.push({ path: dbPath, fullPath, type: 'folder', relative });
        // Recurse into subdirectories
        items.push(...findFilesRecursive(fullPath, baseDir, relative));
      } else {
        items.push({ path: dbPath, fullPath, type: 'file', relative });
      }
    });
    
    return items;
  };

  const allFiles = findFilesRecursive(uploadsDir, uploadsDir);
  
  console.log(`Found ${allFiles.length} items in uploads directory`);
  console.log(`Database has ${dbPaths.size} paths`);
  
  // Find orphaned files (exist in filesystem but not in database)
  const orphaned = allFiles.filter(item => !dbPaths.has(item.path));
  
  if (orphaned.length === 0) {
    console.log('No orphaned files found');
    return;
  }
  
  console.log(`\nFound ${orphaned.length} orphaned items:`);
  orphaned.forEach(item => {
    console.log(`  - ${item.path} (${item.type})`);
  });
  
  // Delete orphaned items (delete files first, then folders)
  const orphanedFiles = orphaned.filter(item => item.type === 'file');
  const orphanedFolders = orphaned.filter(item => item.type === 'folder');
  
  console.log(`\nDeleting ${orphanedFiles.length} orphaned files...`);
  orphanedFiles.forEach(item => {
    try {
      if (fs.existsSync(item.fullPath)) {
        fs.unlinkSync(item.fullPath);
        console.log(`  ✓ Deleted file: ${item.path}`);
      }
    } catch (err) {
      console.error(`  ✗ Error deleting ${item.path}:`, err.message);
    }
  });
  
  console.log(`\nDeleting ${orphanedFolders.length} orphaned folders...`);
  // Sort folders by path depth (deepest first) to delete nested folders before parent
  orphanedFolders.sort((a, b) => b.relative.split('/').length - a.relative.split('/').length);
  
  orphanedFolders.forEach(item => {
    try {
      if (fs.existsSync(item.fullPath)) {
        fs.rmSync(item.fullPath, { recursive: true, force: true });
        console.log(`  ✓ Deleted folder: ${item.path}`);
      }
    } catch (err) {
      console.error(`  ✗ Error deleting ${item.path}:`, err.message);
    }
  });
  
  console.log('\nCleanup complete!');
};

// Run cleanup
cleanupOrphanedFiles();

