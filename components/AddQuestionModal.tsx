
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Question } from '../types';

interface AddQuestionModalProps {
  onClose: () => void;
  onSubmit: (name: string, link: string, difficulty: Question['difficulty'], topic: string) => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [difficulty, setDifficulty] = useState<Question['difficulty']>('Medium');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !link.trim()) return;
    onSubmit(name, link, difficulty, topic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Problem</h2>
            <p className="text-xs text-slate-500 mt-0.5">Bhai, don't give up. Fail hua toh kya, seekh lenge!</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Question Name</label>
            <input 
              autoFocus
              type="text" 
              placeholder="e.g., Two Sum, Merge K Sorted Lists..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Question Link (LeetCode/GFG)</label>
            <input 
              type="url" 
              placeholder="https://leetcode.com/problems/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Topic</label>
              <input 
                type="text" 
                placeholder="e.g., DP, Graphs, Array"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Difficulty</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Question['difficulty'])}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              <Send size={18} />
              Add to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
