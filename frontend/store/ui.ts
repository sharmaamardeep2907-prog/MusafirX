import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean; isMobileMenuOpen: boolean; isAIChatOpen: boolean;
  toggleSearch: () => void; toggleMobileMenu: () => void; toggleAIChat: () => void; closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false, isMobileMenuOpen: false, isAIChatOpen: false,
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleAIChat: () => set((s) => ({ isAIChatOpen: !s.isAIChatOpen })),
  closeAll: () => set({ isSearchOpen: false, isMobileMenuOpen: false }),
}));
