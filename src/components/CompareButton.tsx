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
        className={`flex items-center justify-center gap-2 font-bold text-sm w-full h-full py-5 px-6 transition-all ${
          isSelected
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : isFull
              ? 'bg-black/5 text-black/30 cursor-not-allowed'
              : 'bg-black text-white hover:bg-black/80'
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
      className={`absolute top-5 right-5 p-2.5 border transition-all ${
        isSelected
          ? 'bg-emerald-600 text-white border-emerald-600'
          : isFull
            ? 'bg-white text-black/20 border-black/10 cursor-not-allowed'
            : 'bg-white text-black border-black/10 hover:bg-black hover:text-white hover:border-black'
      }`}
      title={isSelected ? 'Remove from compare' : 'Add to compare'}
    >
      {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
    </button>
  )
}
