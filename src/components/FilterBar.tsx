'use client';

interface FilterBarProps {
  dateFrom: string;
  dateTo: string;
  memberFilter: number | 'all';
  sortBy: 'country' | 'rating' | 'recent';
  onDateFromChange: (val: string) => void;
  onDateToChange: (val: string) => void;
  onMemberFilterChange: (val: number | 'all') => void;
  onSortByChange: (val: 'country' | 'rating' | 'recent') => void;
  members: Array<{ id: number; name: string; emoji: string }>;
}

export default function FilterBar({
  dateFrom, dateTo, memberFilter, sortBy,
  onDateFromChange, onDateToChange, onMemberFilterChange, onSortByChange,
  members,
}: FilterBarProps) {
  return (
    <div className="glass-card p-4 flex flex-wrap gap-4 items-end">
      <div>
        <label className="text-xs text-white/40 block mb-1">From</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-eurovision-pink [color-scheme:dark]"
        />
      </div>
      <div>
        <label className="text-xs text-white/40 block mb-1">To</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-eurovision-pink [color-scheme:dark]"
        />
      </div>
      <div>
        <label className="text-xs text-white/40 block mb-1">Member</label>
        <select
          value={memberFilter === 'all' ? 'all' : memberFilter}
          onChange={(e) => onMemberFilterChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-eurovision-pink [&>option]:bg-gray-900"
        >
          <option value="all">Everyone</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-white/40 block mb-1">Sort by</label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as 'country' | 'rating' | 'recent')}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-eurovision-pink [&>option]:bg-gray-900"
        >
          <option value="country">Country A-Z</option>
          <option value="rating">Highest Rated</option>
          <option value="recent">Recently Rated</option>
        </select>
      </div>
    </div>
  );
}
