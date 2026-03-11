import "@testing-library/jest-dom";
// vitest.setup.js
import { vi } from 'vitest';

// Define the chrome object with the methods your code uses
const chromeMock = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    getURL: vi.fn((path) => path),
    id: 'mock-extension-id',
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
  },
};

// Inject it into the global scope
vi.stubGlobal('chrome', chromeMock);
