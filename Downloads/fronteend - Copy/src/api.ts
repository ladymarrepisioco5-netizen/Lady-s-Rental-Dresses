// src/api.ts
const API_BASE = import.meta.env.VITE_API_URL + "/accounts";

export async function getHello() {
  const res = await fetch(`${API_BASE}/hello`);
  return res.text();
}

export async function createAccount(account: any) {
  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account),
  });
  return res.json();
}

export async function transfer(fromAccountId: number, toAccountId: number, amount: number) {
  const res = await fetch(`${API_BASE}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromAccountId, toAccountId, amount }),
  });
  return res.text(); // kasi string lang ang response: "Transfer successful"
}

