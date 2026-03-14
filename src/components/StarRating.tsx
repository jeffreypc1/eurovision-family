'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRate?: (stars: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export default function StarRating({ rating, onRate, size = 'md', readonly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`star-btn ${sizes[size]} ${readonly ? 'cursor-default' : ''} select-none`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onClick={() => onRate?.(star)}
        >
          {star <= (hovered || rating) ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}
