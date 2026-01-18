'use client';

import { useEffect, useState } from 'react';
import { SoulColor } from '@/lib/constants/soulColors';

export function useSoulColors() {
  const [colors, setColors] = useState<SoulColor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/soul-colors')
      .then(res => res.json())
      .then(data => {
        setColors(data.colors);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch soul colors:', err);
        setLoading(false);
      });
  }, []);

  return { colors, loading };
}
