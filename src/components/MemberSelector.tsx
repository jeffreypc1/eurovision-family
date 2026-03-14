'use client';

import { useState } from 'react';
import { MEMBER_COLORS, MEMBER_EMOJIS } from '@/lib/flags';

interface FamilyMember {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

interface MemberSelectorProps {
  members: FamilyMember[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddMember: (name: string, emoji: string, color: string) => void;
}

export default function MemberSelector({ members, selectedId, onSelect, onAddMember }: MemberSelectorProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎤');
  const [newColor, setNewColor] = useState(MEMBER_COLORS[members.length % MEMBER_COLORS.length]);

  const handleAdd = () => {
    if (newName.trim()) {
      onAddMember(newName.trim(), newEmoji, newColor);
      setNewName('');
      setShowAdd(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Who&apos;s Rating?</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelect(member.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedId === member.id
                ? 'ring-2 ring-offset-2 ring-offset-transparent scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: `${member.color}20`,
              border: `2px solid ${selectedId === member.id ? member.color : 'transparent'}`,
            }}
          >
            <span>{member.emoji}</span>
            <span>{member.name}</span>
          </button>
        ))}
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border-2 border-dashed border-white/20 text-white/40 hover:text-white/80 hover:border-white/40 transition-all"
        >
          <span>+</span>
          <span>Add</span>
        </button>
      </div>

      {showAdd && (
        <div className="flex flex-wrap gap-2 items-end mt-3 pt-3 border-t border-white/10">
          <div>
            <label className="text-xs text-white/40 block mb-1">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Family member name"
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-eurovision-pink"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Emoji</label>
            <div className="flex gap-1 flex-wrap max-w-[200px]">
              {MEMBER_EMOJIS.slice(0, 10).map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewEmoji(emoji)}
                  className={`text-lg p-1 rounded ${newEmoji === emoji ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Color</label>
            <div className="flex gap-1">
              {MEMBER_COLORS.slice(0, 6).map((color) => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={`w-7 h-7 rounded-full border-2 ${newColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="px-4 py-2 rounded-lg bg-eurovision-pink text-white text-sm font-medium hover:bg-eurovision-pink/80 disabled:opacity-30 transition-all"
          >
            Add Member
          </button>
        </div>
      )}
    </div>
  );
}
