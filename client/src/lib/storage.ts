class Storage {
  // For client-side storage (if needed)
  static setItem(key: string, value: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }

  static getItem(key: string): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }

  static removeItem(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }

  static clear(): void {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }
}

export default Storage;
