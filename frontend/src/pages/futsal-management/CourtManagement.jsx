import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const defaultCourt = {
  name: '',
  court_number: '',
  court_type: 'indoor',
  surface_type: 'artificial_turf',
  max_players: 10,
  hourly_rate: '',
  is_active: true,
};

const CourtManagement = ({ courts = [], onAdd, onEdit, onDelete }) => {
  const [form, setForm] = useState(defaultCourt);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.court_number || !form.hourly_rate) {
      setError('Name, court number, and hourly rate are required.');
      return;
    }
    setError('');
    if (editing) {
      onEdit(form);
    } else {
      onAdd(form);
    }
    setForm(defaultCourt);
    setEditing(false);
  };

  const handleEdit = (court) => {
    setForm(court);
    setEditing(true);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <Input label="Court Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Court Number" name="court_number" value={form.court_number} onChange={handleChange} required />
        <Input label="Hourly Rate" name="hourly_rate" value={form.hourly_rate} onChange={handleChange} required type="number" min="0" />
        <Input label="Max Players" name="max_players" value={form.max_players} onChange={handleChange} type="number" min="1" />
        <div className="flex gap-4">
          <label>Type:
            <select name="court_type" value={form.court_type} onChange={handleChange} className="ml-2 border rounded px-2 py-1">
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </label>
          <label>Surface:
            <select name="surface_type" value={form.surface_type} onChange={handleChange} className="ml-2 border rounded px-2 py-1">
              <option value="artificial_turf">Artificial Turf</option>
              <option value="natural_grass">Natural Grass</option>
              <option value="synthetic">Synthetic</option>
            </select>
          </label>
        </div>
        {error && <div className="text-error text-sm">{error}</div>}
        <Button type="submit" fullWidth className="mt-6 md:mt-8 transition-all duration-200 border border-green-600 bg-white text-black hover:scale-105 hover:shadow-lg hover:bg-green-600 hover:text-white focus:bg-green-700 focus:ring-2 focus:ring-green-600" style={{ boxShadow: '0 4px 24px 0 rgba(45, 90, 39, 0.25)' }}>{editing ? 'Update Court' : 'Add Court'}</Button>
      </form>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Courts</h2>
        {courts.length === 0 ? (
          <div className="text-muted-foreground">No courts added yet.</div>
        ) : (
          <ul className="space-y-2">
            {courts.map((court, idx) => (
              <li key={court.court_number} className="flex items-center justify-between border rounded p-3 bg-muted">
                <div>
                  <div className="font-medium">{court.name} ({court.court_number})</div>
                  <div className="text-xs text-muted-foreground">{court.court_type}, {court.surface_type}, Max: {court.max_players}, ${court.hourly_rate}/hr</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(court)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(court.court_number)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourtManagement;
