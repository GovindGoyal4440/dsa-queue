
import React from 'react';
import { ExternalLink, CheckCircle, RotateCcw, Trash2, Calendar, AlertCircle, Clock, Undo2 } from 'lucide-react';
import { Question } from '../types';
import { formatDate, getDaysRemaining } from '../lib/utils';

interface QuestionCardProps {
  question: Question;
  onSolved: (id: string) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSolved, onRetry, onDelete }) => {
  const daysLeft = getDaysRemaining(question.nextReviewDate);
  const isDue = daysLeft <= 0 && question.status === 'active';
  const isCompleted = question.status === 'completed';

  const difficultyColors = {
    'Easy': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Medium': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'Hard': 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div className={`group relative bg-slate-900 border ${isDue ? 'border-indigo-500/50 shadow-indigo-500/10 shadow-lg' : isCompleted ? 'border-emerald-500/20 opacity-80' : 'border-slate-800'} rounded-2xl p-5 hover:border-slate-700 transition-all`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${difficultyColors[question.difficulty]}`}>
              {question.difficulty}
            </span>
            {question.topic && (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {question.topic}
              </span>
            )}
            {question.retryCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20">
                <RotateCcw size={10} /> {question.retryCount} Retries
              </span>
            )}
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 leading-snug transition-colors ${isCompleted ? 'text-slate-400 line-through' : 'text-white group-hover:text-indigo-400'}`}>
            {question.name}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {isCompleted ? (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle size={14} />
                <span>Problem Solved!</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Next Review: {formatDate(question.nextReviewDate)}</span>
                </div>
                {isDue ? (
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold animate-pulse">
                    <AlertCircle size={14} />
                    <span>Due Now!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>In {daysLeft} days</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a 
            href={question.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
            title="Open Problem Link"
          >
            <ExternalLink size={18} />
          </a>
          <button 
            onClick={() => onDelete(question.id)}
            className="p-2.5 bg-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-slate-700"
            title="Delete Permanently"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-800/50 flex flex-wrap gap-3">
        {isCompleted ? (
          <button 
            onClick={() => onRetry(question.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-700"
          >
            <Undo2 size={18} />
            Re-queue (Not revision)
          </button>
        ) : (
          <>
            <button 
              onClick={() => onSolved(question.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20"
            >
              <CheckCircle size={18} />
              Solved It!
            </button>
            <button 
              onClick={() => onRetry(question.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-700"
            >
              <RotateCcw size={18} />
              Retry in 5 Days
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
