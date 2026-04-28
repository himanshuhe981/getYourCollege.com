'use client'

import { useCompareStore } from '@/store/compare'
import { Scale, Check } from 'lucide-react'

interface CompareButtonProps {
  collegeId: string
  fullWidth?: boolean
}

export function CompareButton({ collegeId, fullWidth = false }: CompareButtonProps) {
  const { selectedCollegeIds, addCollege, removeCollege } = useCompareStore()
  const isSelected = selectedCollegeIds.includes(collegeId)
  const isFull = selectedCollegeIds.length >= 3 && !isSelected

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSelected) removeCollege(collegeId)
    else if (!isFull) addCollege(collegeId)
  }

  if (fullWidth) {
    return (
      <button
        onClick={handleToggle}
        disabled={isFull}
        className={`flex items-center justify-center gap-2 font-bold text-sm w-full h-full py-5 px-6 rounded-[1.5rem] transition-all ${
          isSelected
            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
            : isFull
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
        }`}
      >
        {isSelected ? <Check className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
        {isSelected ? 'Added to Compare' : isFull ? 'List Full (Max 3)' : 'Add to Compare'}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isFull}
      className={`absolute top-5 right-5 p-2.5 rounded-2xl border transition-all ${
        isSelected
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
          : isFull
            ? 'bg-white/60 text-slate-300 border-slate-200 cursor-not-allowed'
            : 'bg-white/80 text-slate-600 border-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 backdrop-blur-md shadow-sm'
      }`}
      title={isSelected ? 'Remove from compare' : 'Add to compare'}
    >
      {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
    </button>
  )
}
