'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function MatchesPage() {
  const router = useRouter()

  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    const storedMatches = localStorage.getItem('matches')

    if (storedMatches) setMatches(JSON.parse(storedMatches))
  }, [])

  async function handleUpdate(item: any) {
    const newItem = JSON.parse(localStorage.getItem('newItem') || '{}')

    await supabase
      .from('items')
      .update({
        qty: (item.qty || 0) + (newItem.qty || 1),
      })
      .eq('id', item.id)

    router.push('/mygarage')
  }

  async function handleAddNew() {
    const newItem = JSON.parse(localStorage.getItem('newItem') || '{}')

    await supabase.from('items').insert(newItem)

    router.push('/mygarage')
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Possible Matches</h1>

      <p className="text-sm text-gray-400 text-center">
        Update quantity or add as new model.
      </p>

      <div className="space-y-2">
        {matches.map((item, i) => (
          <div
            key={item.id || i}
            className="flex items-center gap-3 p-2 rounded-xl bg-[#0f172a] border border-white/10"
          >
            <img
              src={item.photo_url}
              alt={item.name || 'Match'}
              className="w-14 h-14 rounded-lg object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {item.brand || '-'} • {item.color || '-'} • {item.scale || '-'} • Qty {item.qty || 0}
              </p>
            </div>

            <button
              onClick={() => handleUpdate(item)}
              className="text-orange-400 border border-orange-400 px-3 py-2 rounded-lg text-xs whitespace-nowrap"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddNew}
        className="w-full mt-4 bg-orange-500 text-black py-3 rounded-xl font-semibold"
      >
        + Add as New Model
      </button>
    </div>
  )
}