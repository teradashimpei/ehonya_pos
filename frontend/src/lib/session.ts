const KEY = "ehonya_pos_user_name";

export function saveUserName(name: string) {
  sessionStorage.setItem(KEY, name);
}

export function loadUserName(): string | null {
  return sessionStorage.getItem(KEY);
}

export function clearUserName() {
  sessionStorage.removeItem(KEY);
}