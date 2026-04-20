const API_BASE = 'http://localhost:8000/api';

export async function fetchAdminBookingStats(token, params = {}) {
  const url = new URL(`${API_BASE}/bookings/statistics/`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url, {
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
  const res = await fetch(`${API_BASE}/bookings/upcoming/`, {
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
  const res = await fetch(`${API_BASE}/users/manage/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createAdminUser(data, token) {
  const res = await fetch(`${API_BASE}/users/manage/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateAdminUser(userId, data, token) {
  const res = await fetch(`${API_BASE}/users/manage/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteAdminUser(userId, token) {
  const res = await fetch(`${API_BASE}/users/manage/${userId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}
