import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'vi' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'vi',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'quy-blog-language',
    }
  )
);