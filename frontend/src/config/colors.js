// Color Configuration
// Ubah warna di sini untuk menyesuaikan dengan bg.jpeg Anda

export const colorThemes = {
  // Neutral Gray (Default - cocok untuk semua warna background)
  neutral: {
    name: 'Neutral Gray',
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    }
  },

  // Blue Theme (Original)
  blue: {
    name: 'Blue',
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    }
  },

  // Green Theme (untuk warehouse dengan tema hijau)
  green: {
    name: 'Green',
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    }
  },

  // Orange Theme (untuk warehouse dengan tema orange/warm)
  orange: {
    name: 'Orange',
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    }
  },

  // Teal Theme (untuk warehouse dengan tema teal/cyan)
  teal: {
    name: 'Teal',
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    }
  },

  // Purple Theme (untuk warehouse dengan tema purple)
  purple: {
    name: 'Purple',
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    }
  },

  // Red Theme (untuk warehouse dengan tema red/warm)
  red: {
    name: 'Red',
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }
  },

  // Indigo Theme (untuk warehouse dengan tema indigo/dark blue)
  indigo: {
    name: 'Indigo',
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    }
  },
};

// Pilih tema yang aktif di sini
// Options: 'neutral', 'blue', 'green', 'orange', 'teal', 'purple', 'red', 'indigo'
export const activeTheme = 'neutral';

// Export active colors
export const colors = colorThemes[activeTheme].primary;

export default colors;
