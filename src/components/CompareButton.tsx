'use client'

import { useCompareStore } from '@/store/compare'
import { Plus, Check, Scale } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CompareButton({ collegeId, fullWidth = false }: { collegeId: string, fullWidth?: boolean }) {
  const { selectedCollegeIds, addCollege, removeCollege } = useCompareStore()
  const router = useRouter()
  
  const isSelected = selectedCollegeIds.includes(collegeId)
  const isFull = selectedCollegeIds.length >= 3 && !isSelected

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSelected) {
      removeCollege(collegeId)
    } else {
      addCollege(collegeId)
    }
  }

  if (fullWidth) {
    return (
      <button 
        onClick={handleToggle}
        disabled={isFull}
        className={`flex items-center justify-center gap-2 font-bold text-lg w-full h-full p-6 transition-all ${
          isSelected 
            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
            : isFull 
              ? 'bg-black/20 text-white/50 cursor-not-allowed'
              : 'bg-black text-white hover:bg-black/80'
        }`}
      >
        {isSelected ? <Check className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
        {isSelected ? 'Added to Compare' : isFull ? 'Compare List Full (Max 3)' : 'Add to Compare'}
      </button>
    )
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isFull}
      className={`absolute top-6 right-6 p-3 rounded-full border border-black/10 transition-all ${
        isSelected 
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' 
          : isFull 
            ? 'bg-white/50 text-black/20 cursor-not-allowed'
            : 'bg-white/80 text-black hover:bg-black hover:text-white backdrop-blur-md'
      }`}
      title={isSelected ? "Remove from compare" : "Add to compare"}
    >
      {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
    </button>
  )
}
