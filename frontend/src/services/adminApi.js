const API_BASE = 'http://localhost:8000/api';

export async function fetchAdminBookingStats(token) {
  const res = await fetch(`${API_BASE}/bookings/bookings/statistics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchAdminRecentBookings(token) {
  const res = await fetch(`${API_BASE}/bookings/bookings/upcoming/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchAdminUsers(token) {
  const res = await fetch(`${API_BASE}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
