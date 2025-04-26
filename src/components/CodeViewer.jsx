import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

function CodeViewer({ file, loading, error }) {
  useEffect(() => {
    if (file?.content) {
      hljs.highlightAll();
    }
  }, [file]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--vscode-editor-bg)] text-[var(--vscode-text)]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-t-2 border-blue-500 rounded-full animate-spin"
            style={{ borderTopColor: '#007acc' }} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--vscode-editor-bg)] text-red-500 p-4">
        <div className="max-w-md">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--vscode-editor-bg)] text-[var(--vscode-text-dim)]">
        <div className="max-w-md text-center">
          <p>Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  // Try to detect if the content is binary
  const isBinary = (content) => {
    const nonPrintable = content.match(/[\x00-\x08\x0E-\x1F\x7F-\xFF]/g) || [];
    return nonPrintable.length > content.length * 0.1;
  };

  // Try to determine file type for syntax highlighting
  const getLanguage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const langMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      rb: 'ruby',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      css: 'css',
      html: 'html',
      xml: 'xml',
      md: 'markdown',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      sh: 'bash',
      bash: 'bash',
    };
    return langMap[ext] || '';
  };

  if (isBinary(file.content)) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--vscode-editor-bg)] text-[var(--vscode-text-dim)]">
        <div className="max-w-md text-center">
          <p>This appears to be a binary file and cannot be displayed</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="h-full overflow-y-auto overflow-x-auto custom-scrollbar bg-[var(--vscode-editor-bg)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4">
        <pre className="relative min-w-full">
          <code className={`${getLanguage(file.name)} min-w-full`}>
            {file.content}
          </code>
        </pre>
      </div>
    </motion.div>

  );
}

export default CodeViewer;