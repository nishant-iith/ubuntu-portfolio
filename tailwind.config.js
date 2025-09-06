module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      // Ubuntu Official Colors
      'ub-grey': '#2C2C2C',
      'ub-dark-grey': '#1E1E1E', 
      'ub-light-grey': '#3C3C3C',
      'ub-warm-grey': "#AEA79F",
      'ub-cool-grey': "#393939",
      'ub-orange': "#E95420",
      'ub-orange-hover': "#FF6B35",
      'ub-orange-dark': "#D44414",
      // Ubuntu Purple Theme
      'ub-lite-abrgn': "#77216F",
      'ub-med-abrgn': "#5E2750", 
      'ub-drk-abrgn': "#2C001E",
      // Window Colors
      'ub-window-title': "#2D2D2D",
      'ub-window-content': "#FFFFFF",
      'ub-window-border': "#CCCCCC",
      // App Specific
      'ub-gedit-dark': "#021B33",
      'ub-gedit-light': "#003B70",
      'ub-gedit-darker': "#010D1A",
      // Dock/Panel
      'ub-panel': "rgba(0, 0, 0, 0.9)",
      'ub-panel-hover': "rgba(255, 255, 255, 0.1)",
    }),
    textColor: theme => ({
      ...theme('colors'),
      'ubt-grey': '#F6F6F5',
      'ubt-dark': '#2C2C2C',
      'ubt-warm-grey': "#AEA79F", 
      'ubt-cool-grey': "#333333",
      'ubt-blue': "#3584E4",
      'ubt-green': "#26A269", 
      'ubt-orange': "#E95420",
      'ubt-gedit-orange': "#F39A21",
      'ubt-gedit-blue': "#50B6C6",
      'ubt-gedit-dark': "#003B70",
    }),
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.300', 'currentColor'),
      'ubb-orange': '#E95420',
      'ubb-grey': '#CCCCCC',
      'ubb-window': '#D4D4D4',
    }),
    gradientColorStops: theme => ({
      ...theme('colors'),
      'ub-orange': '#E95420',
      'ub-orange-light': '#FF6B35',
      'ub-panel-start': 'rgba(0, 0, 0, 0.95)',
      'ub-panel-end': 'rgba(0, 0, 0, 0.8)',
      'ub-window-start': '#FFFFFF',
      'ub-window-end': '#F8F8F8',
    }),
    minWidth: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    extend: {
      zIndex: {
        '-10': '-10',
      },
      fontFamily: {
        'ubuntu': ['Ubuntu', 'system-ui', 'sans-serif'],
        'ubuntu-mono': ['Ubuntu Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'ubuntu-xs': ['11px', { lineHeight: '1.4' }],
        'ubuntu-sm': ['13px', { lineHeight: '1.4' }],
        'ubuntu-base': ['15px', { lineHeight: '1.5' }],
        'ubuntu-lg': ['17px', { lineHeight: '1.5' }],
        'ubuntu-xl': ['20px', { lineHeight: '1.4' }],
      },
      spacing: {
        'ubuntu-xs': '2px',
        'ubuntu-sm': '4px',
        'ubuntu-md': '8px',
        'ubuntu-lg': '12px',
        'ubuntu-xl': '16px',
      },
      borderRadius: {
        'ubuntu': '6px',
        'ubuntu-sm': '4px',
        'ubuntu-lg': '8px',
      },
      boxShadow: {
        'ubuntu': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'ubuntu-lg': '0 4px 16px rgba(0, 0, 0, 0.25)',
        'ubuntu-window': '0 8px 32px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
