import '@testing-library/jest-dom/vitest'

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error test polyfill
global.ResizeObserver = ResizeObserver
