import { defineConfig } from 'vitest/config'

export default defineConfig({
  server: {
    fs: {
      allow: ['..', '/Users/lizi/Documents/trae_projects/Idea Gallery']
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      thresholds: {
        lines: 0.85,
        functions: 0.85,
        branches: 0.85,
        statements: 0.85,
      },
      include: [
        'app/api/**/route.ts',
        'lib/db.ts'
      ],
      exclude: [
        'app/page.tsx',
        'app/layout.tsx',
        'next.config.ts',
        'app/api/auth/**',
        'components/**',
        'types/**',
        'lib/supabase.ts',
        'lib/storage.ts'
      ]
    },
  },
})
