// Create a new futsal (for futsal owners)
export async function createFutsal(data, token) {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'cover_image' && data.cover_image && typeof data.cover_image !== 'string') {
      formData.append('cover_image', data.cover_image);
    } else if (['amenities', 'operating_hours', 'payment_methods'].includes(key)) {
      formData.append(key, JSON.stringify(data[key]));
    } else if (key !== 'cover_image') {
      formData.append(key, data[key]);
    }
  }
  if (data.cover_image && typeof data.cover_image === 'string' && data.cover_image.startsWith('data:')) {
    // Convert base64 to Blob
    const arr = data.cover_image.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], 'futsal_image.png', { type: mime });
    formData.append('cover_image', file);
  }
  const res = await fetch(`${API_BASE}/futsals/`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
// API service for futsal booking app
const API_BASE = 'http://localhost:8000/api';

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/users/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function googleAuthUser(credential) {
  const res = await fetch(`${API_BASE}/users/google-auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function verifyEmailOtp(data) {
  const res = await fetch(`${API_BASE}/users/verify-email-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function resendEmailOtp(data) {
  const res = await fetch(`${API_BASE}/users/resend-email-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchFutsals(params = {}) {
  const url = new URL(`${API_BASE}/futsals/`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const token = localStorage.getItem('accessToken');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchCourts(params = {}) {
  const url = new URL(`${API_BASE}/courts/`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const token = localStorage.getItem('accessToken');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteFutsal(futsalId, token) {
  const res = await fetch(`${API_BASE}/futsals/${futsalId}/`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export async function updateFutsal(futsalId, data, token) {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'cover_image' && data.cover_image && typeof data.cover_image !== 'string') {
      formData.append('cover_image', data.cover_image);
    } else if (['amenities', 'operating_hours', 'payment_methods'].includes(key)) {
      formData.append(key, JSON.stringify(data[key]));
    } else if (key !== 'cover_image' && key !== 'cover_image_preview') {
      formData.append(key, data[key]);
    }
  }
  const res = await fetch(`${API_BASE}/futsals/${futsalId}/`, {
    method: 'PATCH',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Court Management API Functions
export async function createCourt(data, token) {
  const res = await fetch(`${API_BASE}/courts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCourt(courtId, data, token) {
  const res = await fetch(`${API_BASE}/courts/${courtId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCourt(courtId, token) {
  const res = await fetch(`${API_BASE}/courts/${courtId}/`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

// Futsal Images API Functions
export async function fetchFutsalImages(futsalId, token) {
  const res = await fetch(`${API_BASE}/futsal-images/?futsal=${futsalId}`, {
    method: 'GET',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadFutsalImage(data, token) {
  const formData = new FormData();
  formData.append('futsal', data.futsal);
  formData.append('image', data.image);
  if (data.caption) formData.append('caption', data.caption);
  if (data.is_featured !== undefined) formData.append('is_featured', data.is_featured);
  if (data.display_order !== undefined) formData.append('display_order', data.display_order);

  const res = await fetch(`${API_BASE}/futsal-images/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteFutsalImage(imageId, token) {
  const res = await fetch(`${API_BASE}/futsal-images/${imageId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

// Booking Management API Functions
export async function createBooking(bookingData, token) {
  const res = await fetch(`${API_BASE}/bookings/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchBookings(params = {}) {
  const url = new URL(`${API_BASE}/bookings/`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const token = localStorage.getItem('accessToken');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateBookingStatus(bookingId, status, token) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBooking(bookingId, token) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export async function cancelBooking(bookingId) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// User Profile API Functions
export async function fetchUserProfile(token) {
  const res = await fetch(`${API_BASE}/users/profile/`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateUserProfile(data, token) {
  const res = await fetch(`${API_BASE}/users/profile/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function changePassword(data, token) {
  const res = await fetch(`${API_BASE}/users/change-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Court Schedule API Functions
export async function fetchCourtSchedules(params = {}) {
  const url = new URL(`${API_BASE}/schedules/`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const token = localStorage.getItem('accessToken');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCourtSchedule(data, token) {
  const res = await fetch(`${API_BASE}/schedules/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCourtSchedule(scheduleId, token) {
  const res = await fetch(`${API_BASE}/schedules/${scheduleId}/`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.ok;
}
