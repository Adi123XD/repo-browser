// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   VscChevronRight,
//   VscFolder,
//   VscFolderOpened,
//   VscFile,
//   VscSymbolFile,
//   VscJson,
//   VscMarkdown,
//   VscGithub,
//   VscTerminal,
//   VscCode,
//   VscSymbolClass,
//   VscSymbolMethod,
//   VscSymbolVariable,
//   VscSettingsGear
// } from 'react-icons/vsc';

// function FileTree({ fileMap, onFileSelect, selectedFile }) {
//   const [expandedFolders, setExpandedFolders] = useState(new Set());
//   const [commitMessage, setCommitMessage] = useState('');

//   const handleCommitPush = () => {
//     if (!commitMessage.trim()) {
//       alert('Please enter a commit message.');
//       return;
//     }

//     // Here you would normally trigger your backend API call to:
//     // 1. git add .
//     // 2. git commit -m "message"
//     // 3. git push

//     console.log('Committing and pushing with message:', commitMessage);
//     setCommitMessage(''); // Clear after commit
//   };


//   const getFileIcon = (type, name) => {
//     if (type === 'tree') {
//       return expandedFolders.has(name) ? <VscFolderOpened className="text-[#dcb67a]" /> : <VscFolder className="text-[#dcb67a]" />;
//     }

//     const ext = name.split('.').pop().toLowerCase();
//     const iconMap = {
//       js: <VscSymbolFile className="text-[#e6b422]" />,
//       jsx: <VscCode className="text-[#00bcd4]" />,
//       ts: <VscSymbolFile className="text-[#0288d1]" />,
//       tsx: <VscCode className="text-[#00bcd4]" />,
//       py: <VscSymbolFile className="text-[#3572A5]" />,
//       cpp: <VscSymbolFile className="text-[#f34b7d]" />,
//       c: <VscSymbolFile className="text-[#555555]" />,
//       java: <VscSymbolClass className="text-[#b07219]" />,
//       html: <VscCode className="text-[#e34c26]" />,
//       css: <VscSymbolVariable className="text-[#563d7c]" />,
//       json: <VscJson className="text-[#cea73d]" />,
//       md: <VscMarkdown className="text-[#083fa1]" />,
//       yml: <VscSettingsGear className="text-[#6d8086]" />,
//       yaml: <VscSettingsGear className="text-[#6d8086]" />,
//       sh: <VscTerminal className="text-[#89e051]" />,
//       bat: <VscTerminal className="text-[#C1F12E]" />,
//       ps1: <VscTerminal className="text-[#012456]" />,
//       sql: <VscSymbolMethod className="text-[#e38c00]" />,
//       gitignore: <VscGithub className="text-[#7d7d7d]" />,
//     };

//     return iconMap[ext] || <VscFile className="text-[#ababab]" />;
//   };

//   const buildTreeStructure = () => {
//     const tree = {};

//     Object.entries(fileMap).forEach(([path, info]) => {
//       const parts = path.split('/');
//       let currentLevel = tree;

//       parts.forEach((part, index) => {
//         if (!currentLevel[part]) {
//           currentLevel[part] = {
//             name: part,
//             path: parts.slice(0, index + 1).join('/'),
//             type: index === parts.length - 1 ? info.type : 'tree',
//             children: {},
//             sha: info.sha
//           };
//         }
//         currentLevel = currentLevel[part].children;
//       });
//     });

//     return tree;
//   };

//   const toggleFolder = (path) => {
//     setExpandedFolders(prev => {
//       const next = new Set(prev);
//       if (next.has(path)) {
//         next.delete(path);
//       } else {
//         next.add(path);
//       }
//       return next;
//     });
//   };

//   const renderTreeItem = (item, level = 0) => {
//     const isFolder = item.type === 'tree';
//     const isExpanded = expandedFolders.has(item.path);
//     const isSelected = item.path === selectedFile;
//     const indent = level * 16;

//     return (
//       <div key={item.path}>
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.2 }}
//           className={`tree-item group ${isSelected ? 'selected' : ''}`}
//           style={{ paddingLeft: `${indent}px` }}
//           onClick={() => {
//             if (isFolder) {
//               toggleFolder(item.path);
//             } else {
//               onFileSelect(item.path);
//             }
//           }}
//         >
//           <div className="flex items-center gap-1">
//             {isFolder && (
//               <motion.div
//                 initial={{ rotate: 0 }}
//                 animate={{ rotate: isExpanded ? 90 : 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <VscChevronRight className="text-[#ababab] w-4 h-4" />
//               </motion.div>
//             )}
//             {!isFolder && <div className="w-4" />}
//             <span className="w-5 h-5 flex items-center">
//               {getFileIcon(item.type, item.name)}
//             </span>
//             <span className="truncate">{item.name}</span>
//           </div>
//         </motion.div>
//         {isFolder && isExpanded && (
//           <AnimatePresence>
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               {Object.values(item.children)
//                 .sort((a, b) => {
//                   if (a.type === b.type) return a.name.localeCompare(b.name);
//                   return a.type === 'tree' ? -1 : 1;
//                 })
//                 .map(child => renderTreeItem(child, level + 1))
//               }
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </div>
//     );
//   };

//   const treeStructure = buildTreeStructure();

//   return (
//     <div className="h-full overflow-y-auto custom-scrollbar bg-[var(--vscode-sidebar-bg)] text-[var(--vscode-text)]">
//         {/* Source Control Commit UI */}
//         <div className="px-2 py-3 border-b border-[var(--vscode-sideBar-border)]">
//           <div className="text-sm font-semibold mb-2">SOURCE CONTROL</div>
//           <input
//             type="text"
//             className="w-full p-1 px-2 rounded text-sm bg-[var(--vscode-input-background)] text-[var(--vscode-input-foreground)] border border-[var(--vscode-input-border)] focus:outline-none focus:ring focus:ring-blue-400"
//             placeholder="Message (Ctrl+Enter to commit)"
//             value={commitMessage}
//             onChange={(e) => setCommitMessage(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.ctrlKey && e.key === 'Enter') {
//                 handleCommitPush();
//               }
//             }}
//           />
//           <button
//             onClick={handleCommitPush}
//             className="mt-2 w-full flex items-center justify-center gap-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
//           >
//             <VscCloudUpload className="w-4 h-4" />
//             Commit & Push
//           </button>
//         </div>
//         {/* File Explorer */}
//         <div className="py-2">
//           <AnimatePresence>
//             {Object.values(treeStructure)
//               .sort((a, b) => {
//                 if (a.type === b.type) return a.name.localeCompare(b.name);
//                 return a.type === 'tree' ? -1 : 1;
//               })
//               .map(item => renderTreeItem(item))
//             }
//           </AnimatePresence>
//         </div>
//       </div>
//       );
// }

//       export default FileTree;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VscChevronRight,
  VscFolder,
  VscFolderOpened,
  VscFile,
  VscSymbolFile,
  VscJson,
  VscMarkdown,
  VscGithub,
  VscTerminal,
  VscCode,
  VscSymbolClass,
  VscSymbolMethod,
  VscSymbolVariable,
  VscSettingsGear,
  VscCloudUpload,
} from 'react-icons/vsc';

function FileTree({ fileMap, onFileSelect, selectedFile }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [commitMessage, setCommitMessage] = useState('');

  const handleCommitPush = () => {
    if (!commitMessage.trim()) {
      alert('Please enter a commit message.');
      return;
    }

    console.log('Committing and pushing with message:', commitMessage);
    setCommitMessage('');
  };

  const getFileIcon = (type, name) => {
    if (type === 'tree') {
      return expandedFolders.has(name)
        ? <VscFolderOpened className="text-[#dcb67a]" />
        : <VscFolder className="text-[#dcb67a]" />;
    }

    const ext = name.split('.').pop().toLowerCase();
    const iconMap = {
      js: <VscSymbolFile className="text-[#e6b422]" />,
      jsx: <VscCode className="text-[#00bcd4]" />,
      ts: <VscSymbolFile className="text-[#0288d1]" />,
      tsx: <VscCode className="text-[#00bcd4]" />,
      py: <VscSymbolFile className="text-[#3572A5]" />,
      cpp: <VscSymbolFile className="text-[#f34b7d]" />,
      c: <VscSymbolFile className="text-[#555555]" />,
      java: <VscSymbolClass className="text-[#b07219]" />,
      html: <VscCode className="text-[#e34c26]" />,
      css: <VscSymbolVariable className="text-[#563d7c]" />,
      json: <VscJson className="text-[#cea73d]" />,
      md: <VscMarkdown className="text-[#083fa1]" />,
      yml: <VscSettingsGear className="text-[#6d8086]" />,
      yaml: <VscSettingsGear className="text-[#6d8086]" />,
      sh: <VscTerminal className="text-[#89e051]" />,
      bat: <VscTerminal className="text-[#C1F12E]" />,
      ps1: <VscTerminal className="text-[#012456]" />,
      sql: <VscSymbolMethod className="text-[#e38c00]" />,
      gitignore: <VscGithub className="text-[#7d7d7d]" />,
    };

    return iconMap[ext] || <VscFile className="text-[#ababab]" />;
  };

  const buildTreeStructure = () => {
    const tree = {};

    Object.entries(fileMap).forEach(([path, info]) => {
      const parts = path.split('/');
      let currentLevel = tree;

      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: index === parts.length - 1 ? info.type : 'tree',
            children: {},
            sha: info.sha,
          };
        }
        currentLevel = currentLevel[part].children;
      });
    });

    return tree;
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderTreeItem = (item, level = 0) => {
    const isFolder = item.type === 'tree';
    const isExpanded = expandedFolders.has(item.path);
    const isSelected = item.path === selectedFile;
    const indent = level * 16;

    return (
      <div key={item.path}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={`tree-item group ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder(item.path);
            } else {
              onFileSelect(item.path);
            }
          }}
        >
          <div className="flex items-center gap-1">
            {isFolder && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <VscChevronRight className="text-[#ababab] w-4 h-4" />
              </motion.div>
            )}
            {!isFolder && <div className="w-4" />}
            <span className="w-5 h-5 flex items-center">
              {getFileIcon(item.type, item.name)}
            </span>
            <span className="truncate">{item.name}</span>
          </div>
        </motion.div>
        {isFolder && isExpanded && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {Object.values(item.children)
                .sort((a, b) => {
                  if (a.type === b.type) return a.name.localeCompare(b.name);
                  return a.type === 'tree' ? -1 : 1;
                })
                .map(child => renderTreeItem(child, level + 1))
              }
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  const treeStructure = buildTreeStructure();

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[var(--vscode-sidebar-bg)] text-[var(--vscode-text)]">
      {/* Source Control Commit UI */}
      <div className="px-2 py-3 border-b border-[var(--vscode-sideBar-border)]">
        <div className="text-sm font-semibold mb-2">SOURCE CONTROL</div>
        <input
          type="text"
          className="w-full p-1 px-2 rounded text-sm bg-[var(--vscode-input-background)] text-[var(--vscode-input-foreground)] border border-[var(--vscode-input-border)] focus:outline-none focus:ring focus:ring-blue-400"
          placeholder="Message (Ctrl+Enter to commit)"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === 'Enter') {
              handleCommitPush();
            }
          }}
        />
        <button
          onClick={handleCommitPush}
          className="mt-2 w-full flex items-center justify-center gap-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          <VscCloudUpload className="w-4 h-4" />
          Commit & Push
        </button>
      </div>

      {/* File Explorer */}
      <div className="py-2">
        <AnimatePresence>
          {Object.values(treeStructure)
            .sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'tree' ? -1 : 1;
            })
            .map(item => renderTreeItem(item))
          }
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FileTree;
