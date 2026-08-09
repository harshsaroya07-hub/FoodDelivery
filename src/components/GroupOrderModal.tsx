import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, X, Share2, Copy, Plus, Check } from 'lucide-react';
import { GroupOrder } from '../types';

export const GroupOrderModal: React.FC = () => {
  const {
    isGroupOrderModalOpen,
    setIsGroupOrderModalOpen,
    user,
    showToast
  } = useApp();

  const [groupCode, setGroupCode] = useState<string>('');
  const [activeGroup, setActiveGroup] = useState<GroupOrder | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isGroupOrderModalOpen) return null;

  const handleCreateGroup = async () => {
    try {
      const res = await fetch('/api/group-orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: user?.name || 'Harsh' })
      });
      const data = await res.json();
      setActiveGroup(data);
      setGroupCode(data.code);
      showToast(`Group Order Created! Share Code: ${data.code}`);
    } catch (err) {
      console.error('Group order error:', err);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) return;
    try {
      const res = await fetch(`/api/group-orders/${groupCode.trim()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: user?.name || 'Friend' })
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error);
      } else {
        setActiveGroup(data);
        showToast(`Joined Group Order ${data.code}!`);
      }
    } catch (err) {
      showToast('Group order not found');
    }
  };

  const copyCode = () => {
    if (activeGroup) {
      navigator.clipboard.writeText(activeGroup.code);
      setCopied(true);
      showToast('Share code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-indigo-200" />
            <div>
              <h2 className="font-black text-xl tracking-tight">ORDER TOGETHER 🤝</h2>
              <p className="text-xs text-indigo-100">Collate food items with friends in one cart</p>
            </div>
          </div>
          <button
            onClick={() => setIsGroupOrderModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 text-slate-800 dark:text-slate-100">
          
          {!activeGroup ? (
            <div className="space-y-6">
              {/* Option 1: Create */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Host a New Group Order
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Generate a share code for your friends or office team to add their own food items!
                </p>
                <button
                  onClick={handleCreateGroup}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md"
                >
                  Create Group Share Code
                </button>
              </div>

              {/* Option 2: Join */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-xs text-slate-500 uppercase tracking-wider block">
                  Join Existing Group Order
                </span>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={groupCode}
                    onChange={e => setGroupCode(e.target.value.toUpperCase())}
                    placeholder="Enter Code (e.g. FOODORA-123)"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 uppercase"
                  />
                  <button
                    onClick={handleJoinGroup}
                    className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Code Box */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-center space-y-2">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                  Group Share Code
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-300 tracking-wider">
                    {activeGroup.code}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-1.5 rounded-lg bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 hover:opacity-80 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Host: <span className="font-bold text-slate-800 dark:text-slate-200">{activeGroup.hostName}</span>
                </p>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Active Participants ({activeGroup.participants.length}):
                </span>
                <div className="space-y-1.5">
                  {activeGroup.participants.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
                          {p.userName.charAt(0)}
                        </div>
                        <span className="font-bold">{p.userName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-semibold">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsGroupOrderModalOpen(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xs transition"
              >
                Done • Start Adding Food
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
