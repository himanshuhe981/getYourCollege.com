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
        className={`flex items-center justify-center gap-2 font-bold text-lg w-full h-full py-4 px-6 rounded-none transition-all ${
          isSelected 
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600' 
            : isFull 
              ? 'bg-black/5 text-black/40 cursor-not-allowed border-transparent'
              : 'bg-black text-white hover:bg-black/80 border-black'
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
      className={`absolute top-6 right-6 p-3 rounded-none border transition-all ${
        isSelected 
          ? 'bg-emerald-600 text-white border-emerald-600' 
          : isFull 
            ? 'bg-white/50 text-black/30 border-black/10 cursor-not-allowed'
            : 'bg-white/80 text-black hover:bg-black hover:text-white border-black/10 hover:border-black backdrop-blur-md'
      }`}
      title={isSelected ? "Remove from compare" : "Add to compare"}
    >
      {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
    </button>
  )
}
