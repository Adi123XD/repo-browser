import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import StatusMessage from './components/StatusMessage';
import FileTree from './components/FileTree';
import CodeViewer from './components/CodeViewer';
import './styles/vscode-theme.css';

function App() {
  const [repoState, setRepoState] = useState({
    owner: '',
    repo: '',
    branch: 'main',
    fileMap: {},
    selectedFile: null,
    loading: false,
    error: null,
    openFiles: [], // Track open files
    activeFile: null // Currently active file
  });

  const [statusMessage, setStatusMessage] = useState({
    text: 'Enter a repository URL or owner/repo to begin.',
    isError: false,
    isLoading: false
  });

  const handleRepoLoad = async (owner, repo) => {
    setRepoState(prev => ({ ...prev, loading: true, error: null }));
    setStatusMessage({ text: `Loading ${owner}/${repo}...`, isLoading: true, isError: false });

    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoResponse.ok) {
        throw new Error(`GitHub API Error: ${repoResponse.status} ${repoResponse.statusText}`);
      }
      const repoData = await repoResponse.json();
      const defaultBranch = repoData.default_branch;

      const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
      if (!treeResponse.ok) {
        throw new Error(`GitHub API Error: ${treeResponse.status} ${treeResponse.statusText}`);
      }
      
      const data = await treeResponse.json();
      const fileMap = {};
      
      data.tree.forEach(item => {
        fileMap[item.path] = {
          name: item.path.split('/').pop(),
          path: item.path,
          type: item.type,
          sha: item.sha
        };
      });

      setRepoState(prev => ({
        ...prev,
        owner,
        repo,
        branch: defaultBranch,
        fileMap,
        loading: false,
        openFiles: [],
        activeFile: null
      }));
      setStatusMessage({ text: `Repository loaded successfully`, isLoading: false, isError: false });
    } catch (error) {
      console.error('Error loading repository:', error);
      setRepoState(prev => ({ ...prev, loading: false, error: error.message }));
      setStatusMessage({ text: error.message, isLoading: false, isError: true });
    }
  };

  const handleFileSelect = async (filePath) => {
    if (!repoState.fileMap[filePath]) return;

    // Check if file is already open
    const isFileOpen = repoState.openFiles.some(f => f.path === filePath);
    if (isFileOpen) {
      // Just make it active
      setRepoState(prev => ({
        ...prev,
        activeFile: filePath
      }));
      return;
    }

    setRepoState(prev => ({ ...prev, loading: true }));
    setStatusMessage({ text: `Loading file: ${filePath}...`, isLoading: true, isError: false });

    try {
      const file = repoState.fileMap[filePath];
      const response = await fetch(`https://api.github.com/repos/${repoState.owner}/${repoState.repo}/git/blobs/${file.sha}`);
      if (!response.ok) throw new Error(`Failed to load file: ${response.status}`);
      
      const data = await response.json();
      const content = atob(data.content);

      const newFile = {
        ...file,
        content
      };

      setRepoState(prev => ({
        ...prev,
        loading: false,
        openFiles: [...prev.openFiles, newFile],
        activeFile: filePath
      }));
      setStatusMessage({ text: `File loaded successfully`, isLoading: false, isError: false });
    } catch (error) {
      console.error('Error loading file:', error);
      setStatusMessage({ text: error.message, isLoading: false, isError: true });
      setRepoState(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  const handleCloseFile = (filePath) => {
    setRepoState(prev => {
      const newOpenFiles = prev.openFiles.filter(f => f.path !== filePath);
      const newActiveFile = prev.activeFile === filePath
        ? newOpenFiles[newOpenFiles.length - 1]?.path || null
        : prev.activeFile;
      return {
        ...prev,
        openFiles: newOpenFiles,
        activeFile: newActiveFile
      };
    });
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--vscode-bg)' }}>
      <Header onRepoSubmit={handleRepoLoad} />
      <StatusMessage {...statusMessage} />
      <main className="flex-grow flex overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "250px" }}
          className="bg-[var(--vscode-sidebar-bg)] border-r border-[var(--vscode-border)]"
        >
          <FileTree 
            fileMap={repoState.fileMap} 
            onFileSelect={handleFileSelect}
            selectedFile={repoState.activeFile}
          />
        </motion.div>
        <div className="flex-grow flex flex-col overflow-hidden">
          {repoState.openFiles.length > 0 && (
            <div className="flex border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)]">
              <AnimatePresence>
                {repoState.openFiles.map((file) => (
                  <motion.div
                    key={file.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`editor-tab px-4 py-2 flex items-center gap-2 ${
                      repoState.activeFile === file.path ? 'active' : ''
                    }`}
                    onClick={() => setRepoState(prev => ({ ...prev, activeFile: file.path }))}
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      className="opacity-50 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseFile(file.path);
                      }}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <motion.div 
            className="flex-grow overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CodeViewer 
              file={repoState.openFiles.find(f => f.path === repoState.activeFile)}
              loading={repoState.loading}
              error={repoState.error}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
