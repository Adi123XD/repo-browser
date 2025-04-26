import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VscGithub, VscSearch } from 'react-icons/vsc';

function Header({ onRepoSubmit }) {
  const [repoInput, setRepoInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let owner, repo;
    
    if (repoInput.includes('github.com')) {
      const url = new URL(repoInput);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        [owner, repo] = parts;
      }
    } else {
      const parts = repoInput.split('/').filter(Boolean);
      if (parts.length === 2) {
        [owner, repo] = parts;
      }
    }

    if (owner && repo) {
      onRepoSubmit(owner, repo);
    }
  };

  return (
    <header className="bg-[var(--vscode-sidebar-bg)] border-b border-[var(--vscode-border)]">
      <div className="flex items-center">
        {/* App Logo and Name */}
        <div className="flex items-center gap-2 px-4 py-2 border-r border-[var(--vscode-border)] min-w-[200px]">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VscGithub className="w-5 h-5 text-[#007acc]" />
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-semibold text-[var(--vscode-text)]"
          >
            Repo Browser
          </motion.span>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3 px-4 py-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--vscode-text-dim)]">
              <VscSearch className="w-4 h-4" />
            </div>
            <motion.input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="Enter GitHub repo URL or owner/repo (e.g., facebook/react)"
              className="w-full pl-10 pr-3 py-1.5 bg-[var(--vscode-editor-bg)] text-[var(--vscode-text)] border border-[var(--vscode-border)] rounded focus:outline-none focus:border-[#007acc]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <motion.button
            type="submit"
            className="px-4 py-1.5 bg-[#007acc] text-white rounded hover:bg-[#005c99] transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <VscGithub className="w-4 h-4" />
            Load Repository
          </motion.button>
        </form>
      </div>
    </header>
  );
}

export default Header;