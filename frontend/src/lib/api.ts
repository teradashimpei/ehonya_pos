const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", 
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiRequestError(res.status, body.detail ?? "通信エラーが発生しました");
  }
  return res.json();
}

export function login(employeeId: string, password: string) {
  const params = new URLSearchParams({ employee_id: employeeId, password });
  return request(`/api/login?${params}`, { method: "POST" });
}

export function fetchMember(memberId: string) {
  return request(`/api/members/${memberId}`);
}

export function logout() {
  return request(`/api/logout`, { method: "POST" });
}

export function fetchProduct(productCode: string) {
  return request(`/api/products/${productCode}`);
}

export function createTransaction(memberId: string | null, productCodes: string[]) {
  return request(`/api/transactions`, {
    method: "POST",
    body: JSON.stringify({ member_id: memberId, product_codes: productCodes }),
  });
}