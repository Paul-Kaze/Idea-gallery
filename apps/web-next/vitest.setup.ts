import '@testing-library/jest-dom'

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.IntersectionObserver = IO
