const keyPrefix = "b-";
export function setItem(key: string, value: string) {
  try {
    localStorage.setItem(keyPrefix + key, value);
  } catch (err) {
    console.error(err);
  }
}

export function getItem<T>(key: string): T | null {
  let res = null;
  try {
    const raw = localStorage.getItem(keyPrefix + key);
    if (raw) {
      res = JSON.parse(raw);
    }
  } catch (err) {
    // Fallback to non-json value
    try {
      res = localStorage.getItem(keyPrefix + key);
    } catch (err) {
      console.error(err);
    }
  }
  return res;
}
