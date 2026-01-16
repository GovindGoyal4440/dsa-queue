
import React from 'react';
import { Question } from '../types';
import { Target, Zap, Clock, ShieldAlert } from 'lucide-react';

interface StatsProps {
  questions: Question[];
}

const Stats: React.FC<StatsProps> = ({ questions }) => {
  const total = questions.length;
  const due = questions.filter(q => q.nextReviewDate <= Date.now()).length;
  const hardOnes = questions.filter(q => q.difficulty === 'Hard').length;
  const maxRetries = questions.length > 0 ? Math.max(...questions.map(q => q.retryCount)) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Total in Queue" 
        value={total} 
        icon={<Target className="text-blue-400" size={20} />} 
        color="border-blue-500/20"
      />
      <StatCard 
        label="Due Today" 
        value={due} 
        icon={<Clock className="text-orange-400" size={20} />} 
        color="border-orange-500/20"
      />
      <StatCard 
        label="Hard Problems" 
        value={hardOnes} 
        icon={<ShieldAlert className="text-red-400" size={20} />} 
        color="border-red-500/20"
      />
      <StatCard 
        label="Max Retries" 
        value={maxRetries} 
        icon={<Zap className="text-yellow-400" size={20} />} 
        color="border-yellow-500/20"
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className={`bg-slate-900 p-5 rounded-2xl border ${color} hover:bg-slate-800/80 transition-all cursor-default group`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</span>
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

export default Stats;
