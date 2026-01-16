
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Clock, CheckCircle2, ListFilter, Download, Upload } from 'lucide-react';
import { Question, TabType } from './types';
import { generateId, REVISION_INTERVAL_DAYS } from './lib/utils';
import Header from './components/Header';
import Stats from './components/Stats';
import AddQuestionModal from './components/AddQuestionModal';
import QuestionCard from './components/QuestionCard';

const STORAGE_KEY = 'dsa_revision_queue_v1';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('due');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration for old data without status
        const migrated = parsed.map((q: any) => ({ ...q, status: q.status || 'active' }));
        setQuestions(migrated);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  const addQuestion = (name: string, link: string, difficulty: Question['difficulty'], topic: string) => {
    const now = Date.now();
    const newQuestion: Question = {
      id: generateId(),
      name,
      link,
      difficulty,
      topic,
      addedDate: now,
      nextReviewDate: now + (REVISION_INTERVAL_DAYS * 24 * 60 * 60 * 1000),
      retryCount: 0,
      status: 'active'
    };
    setQuestions(prev => [...prev, newQuestion]);
    setIsModalOpen(false);
  };

  const deleteQuestion = (id: string) => {
    if (window.confirm("Bhai, delete kar du?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleSolved = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'completed' } : q));
  };

  const handleRetry = (id: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return {
          ...q,
          status: 'active',
          nextReviewDate: Date.now() + (REVISION_INTERVAL_DAYS * 24 * 60 * 60 * 1000),
          retryCount: q.retryCount + 1
        };
      }
      return q;
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `dsa-queue-backup-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json) && window.confirm("Bhai, current data replace ho jayega. Pakka?")) {
          setQuestions(json);
        }
      } catch (err) {
        alert("Invalid file format!");
      }
    };
    reader.readAsText(file);
  };

  const filteredQuestions = useMemo(() => {
    const now = Date.now();
    let list = questions;

    if (searchTerm) {
      list = list.filter(q => 
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab === 'due') {
      return list.filter(q => q.status === 'active' && q.nextReviewDate <= now).sort((a, b) => a.nextReviewDate - b.nextReviewDate);
    } else if (activeTab === 'upcoming') {
      return list.filter(q => q.status === 'active' && q.nextReviewDate > now).sort((a, b) => a.nextReviewDate - b.nextReviewDate);
    } else {
      return list.filter(q => q.status === 'completed').sort((a, b) => b.addedDate - a.addedDate);
    }
  }, [questions, activeTab, searchTerm]);

  const dueCount = questions.filter(q => q.status === 'active' && q.nextReviewDate <= Date.now()).length;
  const upcomingCount = questions.filter(q => q.status === 'active' && q.nextReviewDate > Date.now()).length;
  const completedCount = questions.filter(q => q.status === 'completed').length;

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <Header onExport={exportData} onImport={importData} />
      
      <main className="max-w-5xl mx-auto px-4 mt-8">
        <Stats questions={questions} />

        <div className="flex flex-col md:flex-row md:items-center justify-between mt-12 mb-6 gap-4">
          <div className="flex flex-wrap items-center bg-slate-900 rounded-lg p-1 border border-slate-800 self-start">
            <button 
              onClick={() => setActiveTab('due')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'due' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Clock size={16} />
              Due ({dueCount})
            </button>
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <LayoutDashboard size={16} />
              Upcoming ({upcomingCount})
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'completed' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <CheckCircle2 size={16} />
              Solved ({completedCount})
            </button>
          </div>

          <div className="relative flex-1 md:max-w-xs">
            <input 
              type="text" 
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <ListFilter className="absolute right-3 top-2.5 text-slate-500" size={16} />
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 animate-in fade-in duration-500">
            <LayoutDashboard size={48} className="mb-4 opacity-20" />
            <p className="text-lg">Empty list, bhai!</p>
            <p className="text-sm">Start grinding and add your first question.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {filteredQuestions.map(q => (
              <QuestionCard 
                key={q.id} 
                question={q} 
                onSolved={handleSolved} 
                onRetry={handleRetry} 
                onDelete={deleteQuestion}
              />
            ))}
          </div>
        )}
      </main>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group z-20"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {isModalOpen && (
        <AddQuestionModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={addQuestion} 
        />
      )}
    </div>
  );
};

export default App;
