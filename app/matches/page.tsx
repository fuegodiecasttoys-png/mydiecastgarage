'use client'

import { useEffect, useState } from 'react'

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [newItem, setNewItem] = useState<any>(null)

  useEffect(() => {
    const storedMatches = localStorage.getItem('matches')
    const storedNewItem = localStorage.getItem('newItem')

    if (storedMatches) setMatches(JSON.parse(storedMatches))
    if (storedNewItem) setNewItem(JSON.parse(storedNewItem))
  }, [])

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-bold">Possible Matches</h1>

      {matches.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2 rounded-xl bg-[#0f172a]"
        >
          <img
            src={item.photo_url}
            className="w-14 h-14 rounded-lg object-cover"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-gray-400">
              {item.color || '-'} • {item.scale || '-'} • Qty {item.qty}
            </p>
          </div>

          <button className="text-orange-400 border border-orange-400 px-3 py-1 rounded-lg text-xs">
            Update
          </button>
        </div>
      ))}

      <button className="w-full mt-4 bg-orange-500 text-black py-3 rounded-xl font-semibold">
        + Add as New Model
      </button>
    </div>
  )
}