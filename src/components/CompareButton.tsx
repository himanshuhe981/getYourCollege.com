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
        className={`flex items-center justify-center gap-2 font-bold text-lg w-full h-full py-4 px-6 rounded-xl transition-all ${
          isSelected 
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20' 
            : isFull 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/20'
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
      className={`absolute top-6 right-6 p-3 rounded-2xl border transition-all ${
        isSelected 
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' 
          : isFull 
            ? 'bg-white/50 text-slate-300 border-white cursor-not-allowed'
            : 'bg-white/80 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 backdrop-blur-md shadow-sm border-white'
      }`}
      title={isSelected ? "Remove from compare" : "Add to compare"}
    >
      {isSelected ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
    </button>
  )
}
