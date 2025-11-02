import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';

function Home() {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFolderClick = (folder) => {
    // If we're currently in a folder, add it to the stack before navigating
    if (currentFolderId !== null) {
      setFolderStack([...folderStack, { id: currentFolderId, name: currentFolderName || 'Folder' }]);
    }
    
    // Navigate to the clicked folder
    setCurrentFolderId(folder.id);
    setCurrentFolderName(folder.name);
  };

  const handleNavigateToFolder = (targetFolderId, targetFolderName) => {
    if (targetFolderId === null) {
      // Navigate to root
      setCurrentFolderId(null);
      setCurrentFolderName(null);
      setFolderStack([]);
      return;
    }

    // Find the index of the target folder in the stack
    const targetIndex = folderStack.findIndex(f => f.id === targetFolderId);
    
    if (targetIndex !== -1) {
      // If found in stack, navigate to it by removing everything after it
      const targetFolder = folderStack[targetIndex];
      setFolderStack(folderStack.slice(0, targetIndex));
      setCurrentFolderId(targetFolderId);
      setCurrentFolderName(targetFolder.name);
    }
  };

  const handleNavigateUp = () => {
    if (folderStack.length > 0) {
      const previousFolder = folderStack[folderStack.length - 1];
      setFolderStack(folderStack.slice(0, -1));
      setCurrentFolderId(previousFolder.id);
      setCurrentFolderName(previousFolder.name);
    } else {
      setCurrentFolderId(null);
      setCurrentFolderName(null);
      setFolderStack([]);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentFolderId={currentFolderId}
          onFileUpload={handleRefresh}
          onFolderCreate={handleRefresh}
        />
        <MainContent 
          parentFolderId={currentFolderId}
          onFolderClick={handleFolderClick}
          refreshTrigger={refreshTrigger}
          folderStack={folderStack}
          currentFolderId={currentFolderId}
          currentFolderName={currentFolderName}
          onNavigateToFolder={handleNavigateToFolder}
        />
      </div>
    </div>
  );
}

export default Home;