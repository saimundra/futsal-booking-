import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  fetchAdminBookingStats,
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../../services/adminApi';
import { fetchFutsals, createFutsal, updateFutsal, deleteFutsal } from '../../services/api';

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const currentYear = new Date().getFullYear();

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    total_bookings: 0,
    total_revenue: 0,
  });
  const [selectedRevenueMonth, setSelectedRevenueMonth] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'player',
  });

  const [newVenue, setNewVenue] = useState({
    name: '',
    address: '',
    city: '',
    contact_phone: '',
    contact_email: '',
    owner: '',
    is_active: true,
  });

  const [venueDrafts, setVenueDrafts] = useState({});

  const ownerUsers = useMemo(
    () => users.filter((user) => user.role === 'futsal_owner'),
    [users]
  );

  const summary = useMemo(() => {
    const totalUsers = users.length;
    const totalOwners = users.filter((user) => user.role === 'futsal_owner').length;
    const totalPlayers = users.filter((user) => user.role === 'player').length;

    return {
      totalFutsals: venues.length,
      totalUsers,
      totalOwners,
      totalPlayers,
      totalBookings: bookingStats?.total_bookings || 0,
      totalRevenue: bookingStats?.total_revenue || 0,
    };
  }, [users, venues, bookingStats]);

  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const revenueParams = selectedRevenueMonth === 'all'
        ? {}
        : { month: selectedRevenueMonth, year: currentYear };

      const [usersRes, venuesRes, allBookingStatsRes, revenueBookingStatsRes] = await Promise.all([
        fetchAdminUsers(token),
        fetchFutsals({ my: true }),
        fetchAdminBookingStats(token),
        fetchAdminBookingStats(token, revenueParams),
      ]);

      const nextUsers = normalizeList(usersRes);
      const nextVenues = normalizeList(venuesRes);
      const nextBookingStats = {
        ...(allBookingStatsRes || {}),
        total_revenue: revenueBookingStatsRes?.total_revenue || 0,
      };

      setUsers(nextUsers);
      setVenues(nextVenues);
      setBookingStats(nextBookingStats);

      const drafts = {};
      nextVenues.forEach((venue) => {
        drafts[venue.id] = {
          name: venue.name || '',
          city: venue.city || '',
          address: venue.address || '',
          contact_phone: venue.contact_phone || '',
          contact_email: venue.contact_email || '',
          owner: venue.owner || '',
          is_active: !!venue.is_active,
        };
      });
      setVenueDrafts(drafts);
    } catch (err) {
      setError('Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedRevenueMonth]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleUserCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createAdminUser(newUser, token);
      setNewUser({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role: 'player',
      });
      await refreshData();
    } catch (err) {
      setError('Could not create user. Check required fields and unique email/username.');
    } finally {
      setSaving(false);
    }
  };

  const handleUserRoleChange = async (userId, role) => {
    setError('');
    try {
      await updateAdminUser(userId, { role }, token);
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
    } catch (err) {
      setError('Failed to update user role.');
    }
  };

  const handleUserDelete = async (userId) => {
    const shouldDelete = window.confirm('Delete this user account?');
    if (!shouldDelete) return;

    setError('');
    try {
      await deleteAdminUser(userId, token);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const handleVenueCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createFutsal({
        ...newVenue,
        owner: Number(newVenue.owner),
      }, token);
      setNewVenue({
        name: '',
        address: '',
        city: '',
        contact_phone: '',
        contact_email: '',
        owner: '',
        is_active: true,
      });
      await refreshData();
    } catch (err) {
      setError('Could not create venue. Please ensure owner is a futsal owner account.');
    } finally {
      setSaving(false);
    }
  };

  const handleVenueDraftChange = (venueId, field, value) => {
    setVenueDrafts((prev) => ({
      ...prev,
      [venueId]: {
        ...prev[venueId],
        [field]: value,
      },
    }));
  };

  const handleVenueSave = async (venueId) => {
    const payload = venueDrafts[venueId];
    if (!payload) return;

    setError('');
    try {
      await updateFutsal(
        venueId,
        {
          ...payload,
          owner: Number(payload.owner),
        },
        token
      );
      await refreshData();
    } catch (err) {
      setError('Failed to update venue.');
    }
  };

  const handleVenueDelete = async (venueId) => {
    const shouldDelete = window.confirm('Delete this futsal venue?');
    if (!shouldDelete) return;

    setError('');
    try {
      await deleteFutsal(venueId, token);
      setVenues((prev) => prev.filter((venue) => venue.id !== venueId));
      setVenueDrafts((prev) => {
        const next = { ...prev };
        delete next[venueId];
        return next;
      });
    } catch (err) {
      setError('Failed to delete venue.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="admin" onLogout={handleLogout} />

      <main className="pt-24 md:pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-base font-medium text-primary mt-1">Hello Admin</p>
            <p className="text-sm text-muted-foreground mt-1">
              Manage users, grant owner/admin access, and control futsal venues.
            </p>
          </div>

          <section className="bg-white rounded-xl border border-border p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold">Summary</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Revenue Month</label>
                <select
                  value={selectedRevenueMonth}
                  onChange={(e) => setSelectedRevenueMonth(e.target.value)}
                  className="h-10 rounded-lg border border-border px-3 bg-white text-sm"
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">Total Futsals</p>
                <p className="text-2xl font-bold text-foreground">{summary.totalFutsals}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{summary.totalUsers}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">Total Owners</p>
                <p className="text-2xl font-bold text-foreground">{summary.totalOwners}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">Total Players</p>
                <p className="text-2xl font-bold text-foreground">{summary.totalPlayers}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-foreground">{summary.totalBookings}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Revenue {selectedRevenueMonth === 'all' ? '(All Time)' : `(${monthOptions.find((m) => m.value === selectedRevenueMonth)?.label} ${currentYear})`}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  NPR {Number(summary.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {error && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-muted-foreground">Loading admin data...</div>
          ) : (
            <>
              <section className="bg-white rounded-xl border border-border p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">Add User</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" onSubmit={handleUserCreate}>
                  <Input
                    name="first_name"
                    label="First Name"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                  <Input
                    name="last_name"
                    label="Last Name"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                  <Input
                    name="username"
                    label="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    name="phone"
                    label="Phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    name="password"
                    label="Password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                    showPasswordToggle
                    required
                  />
                  <label className="flex flex-col text-sm text-foreground">
                    <span className="mb-1">Role</span>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                      className="h-10 rounded-lg border border-border px-3 bg-white"
                    >
                      <option value="player">Player</option>
                      <option value="futsal_owner">Futsal Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <Button type="submit" loading={saving} className="w-full">Create User</Button>
                  </div>
                </form>
              </section>

              <section className="bg-white rounded-xl border border-border p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Role</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border/70">
                          <td className="py-2">{user.first_name} {user.last_name}</td>
                          <td className="py-2">{user.email}</td>
                          <td className="py-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                              className="h-9 rounded-lg border border-border px-2 bg-white"
                            >
                              <option value="player">Player</option>
                              <option value="futsal_owner">Futsal Owner</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-2">
                            <Button
                              variant="outline"
                              className="border-red-300 text-red-700"
                              onClick={() => handleUserDelete(user.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white rounded-xl border border-border p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">Add Futsal Venue</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" onSubmit={handleVenueCreate}>
                  <Input
                    name="name"
                    label="Venue Name"
                    value={newVenue.name}
                    onChange={(e) => setNewVenue((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    name="city"
                    label="City"
                    value={newVenue.city}
                    onChange={(e) => setNewVenue((prev) => ({ ...prev, city: e.target.value }))}
                    required
                  />
                  <Input
                    name="address"
                    label="Address"
                    value={newVenue.address}
                    onChange={(e) => setNewVenue((prev) => ({ ...prev, address: e.target.value }))}
                    required
                  />
                  <Input
                    name="contact_phone"
                    label="Contact Phone"
                    value={newVenue.contact_phone}
                    onChange={(e) => setNewVenue((prev) => ({ ...prev, contact_phone: e.target.value }))}
                    required
                  />
                  <Input
                    name="contact_email"
                    type="email"
                    label="Contact Email"
                    value={newVenue.contact_email}
                    onChange={(e) => setNewVenue((prev) => ({ ...prev, contact_email: e.target.value }))}
                    required
                  />
                  <label className="flex flex-col text-sm text-foreground">
                    <span className="mb-1">Owner (Futsal Owner)</span>
                    <select
                      value={newVenue.owner}
                      onChange={(e) => setNewVenue((prev) => ({ ...prev, owner: e.target.value }))}
                      className="h-10 rounded-lg border border-border px-3 bg-white"
                      required
                    >
                      <option value="">Select owner</option>
                      {ownerUsers.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.first_name} {owner.last_name} ({owner.email})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 pt-6 text-sm">
                    <input
                      type="checkbox"
                      checked={newVenue.is_active}
                      onChange={(e) => setNewVenue((prev) => ({ ...prev, is_active: e.target.checked }))}
                    />
                    Active
                  </label>
                  <div className="flex items-end">
                    <Button type="submit" loading={saving} className="w-full">Create Venue</Button>
                  </div>
                </form>
              </section>

              <section className="bg-white rounded-xl border border-border p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">Futsal Venues</h2>
                <div className="space-y-4">
                  {venues.map((venue) => {
                    const draft = venueDrafts[venue.id] || {};
                    return (
                      <div key={venue.id} className="border border-border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Input
                          label="Name"
                          value={draft.name || ''}
                          onChange={(e) => handleVenueDraftChange(venue.id, 'name', e.target.value)}
                        />
                        <Input
                          label="City"
                          value={draft.city || ''}
                          onChange={(e) => handleVenueDraftChange(venue.id, 'city', e.target.value)}
                        />
                        <Input
                          label="Address"
                          value={draft.address || ''}
                          onChange={(e) => handleVenueDraftChange(venue.id, 'address', e.target.value)}
                        />
                        <Input
                          label="Contact Phone"
                          value={draft.contact_phone || ''}
                          onChange={(e) => handleVenueDraftChange(venue.id, 'contact_phone', e.target.value)}
                        />
                        <Input
                          label="Contact Email"
                          type="email"
                          value={draft.contact_email || ''}
                          onChange={(e) => handleVenueDraftChange(venue.id, 'contact_email', e.target.value)}
                        />
                        <label className="flex flex-col text-sm text-foreground">
                          <span className="mb-1">Owner</span>
                          <select
                            value={draft.owner || ''}
                            onChange={(e) => handleVenueDraftChange(venue.id, 'owner', e.target.value)}
                            className="h-10 rounded-lg border border-border px-3 bg-white"
                          >
                            <option value="">Select owner</option>
                            {ownerUsers.map((owner) => (
                              <option key={owner.id} value={owner.id}>
                                {owner.first_name} {owner.last_name} ({owner.email})
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex items-center gap-2 pt-6 text-sm">
                          <input
                            type="checkbox"
                            checked={!!draft.is_active}
                            onChange={(e) => handleVenueDraftChange(venue.id, 'is_active', e.target.checked)}
                          />
                          Active
                        </label>
                        <div className="flex items-end gap-2">
                          <Button onClick={() => handleVenueSave(venue.id)}>Save</Button>
                          <Button
                            variant="outline"
                            className="border-red-300 text-red-700"
                            onClick={() => handleVenueDelete(venue.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
