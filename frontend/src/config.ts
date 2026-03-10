declare global {
  interface Window {
    env: {
      API_URL: string;
    };
  }
}

export const API_URL = window.env?.API_URL || "http://localhost:";
