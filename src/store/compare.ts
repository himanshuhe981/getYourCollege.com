import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompareStore {
  selectedCollegeIds: string[]
  addCollege: (id: string) => void
  removeCollege: (id: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedCollegeIds: [],
      addCollege: (id) => {
        const current = get().selectedCollegeIds
        if (current.length < 3 && !current.includes(id)) {
          set({ selectedCollegeIds: [...current, id] })
        }
      },
      removeCollege: (id) => {
        set({ selectedCollegeIds: get().selectedCollegeIds.filter(cId => cId !== id) })
      },
      clear: () => set({ selectedCollegeIds: [] })
    }),
    {
      name: 'compare-storage',
    }
  )
)
