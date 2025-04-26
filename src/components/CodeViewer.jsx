import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// import Editor from 'react-simple-code-editor';
import { Editor } from '@monaco-editor/react';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

function CodeViewer({ file, loading, error }) {
  const [code, setCode] = useState('');
  const buttonClass = "px-3 py-1 rounded-md bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)] text-sm font-medium";
  const disabledButtonClass = "opacity-50 cursor-not-allowed";


  useEffect(() => {
    if (file?.content) {
      setCode(file.content);
    }
  }, [file]);

  // undo and redo support 
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const handleCodeChange = (newCode) => {
    setHistory(prev => [...prev, code]);
    setRedoStack([]);
    setCode(newCode);
  };

  const undo = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prev = newHistory.pop();
      setRedoStack(r => [...r, code]);
      setCode(prev);
      setHistory(newHistory);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const next = newRedoStack.pop();
      setHistory(h => [...h, code]);
      setCode(next);
      setRedoStack(newRedoStack);
    }
  };

  // download file option 
  const downloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const highlightCode = (code) => {
    const language = getLanguage(file?.name || '');
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  };
  // format code 
  const formatCode = () => {
    const formatted = code
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n'); // max 2 empty lines
    setCode(formatted);
  };

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

  const isBinary = (content) => {
    const nonPrintable = content.match(/[\x00-\x08\x0E-\x1F\x7F-\xFF]/g) || [];
    return nonPrintable.length > content.length * 0.1;
  };

  // const getLanguage = (filename) => {
  //   const ext = filename.split('.').pop().toLowerCase();
  //   const langMap = {
  //     js: 'javascript',
  //     jsx: 'javascript',
  //     ts: 'typescript',
  //     tsx: 'typescript',
  //     py: 'python',
  //     rb: 'ruby',
  //     java: 'java',
  //     cpp: 'cpp',
  //     c: 'c',
  //     cs: 'csharp',
  //     css: 'css',
  //     html: 'html',
  //     xml: 'xml',
  //     md: 'markdown',
  //     json: 'json',
  //     yaml: 'yaml',
  //     yml: 'yaml',
  //     sh: 'bash',
  //     bash: 'bash',
  //   };
  //   return langMap[ext] || '';
  // };
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
      sh: 'shell',
      bash: 'shell',
    };
    return langMap[ext] || 'plaintext';
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
      <div className="p-4 space-y-2">
        <div className="flex gap-2 flex-wrap">
          <button onClick={downloadFile} className={buttonClass}>Download</button>
          <button onClick={undo} disabled={!history.length} className={`${buttonClass} ${!history.length ? disabledButtonClass : ''}`}>Undo</button>
          <button onClick={redo} disabled={!redoStack.length} className={`${buttonClass} ${!redoStack.length ? disabledButtonClass : ''}`}>Redo</button>
          <button onClick={formatCode} className={buttonClass}>Format</button>
        </div>

        {/* <Editor
          value={code}
          // onValueChange={setCode}
          onValueChange={handleCodeChange}
          highlight={highlightCode}
          padding={10}
          textareaClassName="bg-transparent text-[var(--vscode-text)] focus:outline-none min-w-full"
          style={{
            backgroundColor: 'var(--vscode-editor-bg)',
            color: 'var(--vscode-text)',
            fontFamily: '"Fira Code", monospace',
            fontSize: 14,
            minHeight: '100%'
          }}
        /> */}
        <Editor
          height="80vh"
          defaultLanguage={getLanguage(file.name)}
          value={code}
          onChange={(newValue) => handleCodeChange(newValue)}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: '"Fira Code", monospace',
            minimap: { enabled: false },
            automaticLayout: true,
            lineNumbers: "on",
            matchBrackets: "always",
            wordWrap: "on",
            tabSize: 2,
            scrollBeyondLastLine: false,
          }}
        />

      </div>
    </motion.div>
  );
}

export default CodeViewer;
