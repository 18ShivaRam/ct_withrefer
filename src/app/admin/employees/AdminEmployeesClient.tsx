'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FaEdit, FaTrash } from 'react-icons/fa';

type EmployeeRole = 'caller' | 'reviewer' | 'preparer';

export default function AdminEmployeesPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', employeeRole: 'caller' as EmployeeRole, password: '', confirmPassword: '' });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<{ id: string; full_name: string; email: string; phone: string; employee_role: EmployeeRole }>({ id: '', full_name: '', email: '', phone: '', employee_role: 'caller' });
  const [savingEdit, setSavingEdit] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/admin/login'; return; }
      const { data: admin } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      if (!admin?.is_admin) { await supabase.auth.signOut(); window.location.href = '/admin/login'; return; }
      await Promise.all([fetchEmployees(), fetchClients()]);
      setLoading(false);
    };
    load();
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'employee')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error.message);
    }
    setEmployees(data || []);
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'client')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error.message);
    }
    setClients(data || []);
  };

  const createEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      if (!form.password || form.password !== form.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const res = await fetch('/api/admin/create-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const j = await res.json();
        alert(j.error || 'Failed to create employee');
        return;
      }
      setForm({ fullName: '', email: '', phone: '', employeeRole: 'caller', password: '', confirmPassword: '' });
      setShowForm(false);
      await fetchEmployees();
    } finally {
      setCreating(false);
    }
  };

  const saveEmployeeEdit = async () => {
    setSavingEdit(true);
    const updates = {
      full_name: editForm.full_name,
      email: editForm.email,
      phone: editForm.phone,
      employee_role: editForm.employee_role,
    };
    const { error } = await supabase.from('profiles').update(updates).eq('id', editForm.id);
    if (error) {
      alert(error.message);
    } else {
      setEditing(false);
      await fetchEmployees();
    }
    setSavingEdit(false);
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    const { error } = await supabase.from('profiles').update({ is_deleted: true }).eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }
    await fetchEmployees();
  };

  const assignClient = async (employeeId: string, clientId: string) => {
    const res = await fetch('/api/admin/assign-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, clientId })
    });
    if (!res.ok) {
      const j = await res.json();
      alert(j.error || 'Assignment failed');
    } else {
      alert('Assigned successfully');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-black font-bold">Employees</h1>
        <button className="bg-[#006666] text-white rounded px-4 py-2" onClick={() => setShowForm(true)}>Create Employee</button>
      </div>

      {/* Create Employee Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-black font-semibold">Create Employee</h2>
              <button className="text-gray-600" onClick={() => setShowForm(false)}>Close</button>
            </div>
            <form onSubmit={createEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border rounded p-2 text-black" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
              <input className="border rounded p-2 text-black" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input className="border rounded p-2 text-black" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <select className="border rounded p-2 text-black" value={form.employeeRole} onChange={e => setForm({ ...form, employeeRole: e.target.value as EmployeeRole })}>
                <option value="caller">Caller</option>
                <option value="reviewer">Reviewer</option>
                <option value="preparer">Preparer</option>
              </select>
              <input className="border rounded p-2 text-black" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <input className="border rounded p-2 text-black" placeholder="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
              <div className="md:col-span-2 flex justify-end space-x-2">
                <button type="button" className="border rounded px-4 py-2 text-black" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" disabled={creating} className="bg-[#006666] text-white rounded px-4 py-2">{creating ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Employees */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-black font-semibold">Employee List</h2>
          <input
            type="text"
            className="border rounded p-2 text-black"
            placeholder="Search employees"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-black text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(employees.filter((emp) => {
                  const q = search.trim().toLowerCase();
                  if (!q) return true;
                  const fields = [emp.full_name, emp.email, emp.phone, emp.employee_role].map((v: any) => (v || '').toString().toLowerCase());
                  return fields.some((f: string) => f.includes(q));
                })).map(emp => (
                  <tr key={emp.id}>
                    <td className="px-6 py-4">{emp.full_name}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{emp.phone || '-'}</td>
                    <td className="px-6 py-4">{emp.employee_role || '-'}</td>
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <select className="border rounded p-1">
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
                          ))}
                        </select>
                        <button className="bg-[#006666] text-white rounded px-3 py-1" onClick={e => {
                          const select = (e.currentTarget.previousSibling as HTMLSelectElement);
                          assignClient(emp.id, select.value);
                        }}>Assign</button>
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                          onClick={() => {
                            setEditForm({ id: emp.id, full_name: emp.full_name || '', email: emp.email || '', phone: emp.phone || '', employee_role: (emp.employee_role || 'caller') as EmployeeRole });
                            setEditing(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() => deleteEmployee(emp.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Employee Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-black font-semibold">Edit Employee</h2>
              <button className="text-gray-600" onClick={() => setEditing(false)}>Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border rounded p-2 text-black" placeholder="Full Name" value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} />
              <input className="border rounded p-2 text-black" placeholder="Email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              <input className="border rounded p-2 text-black" placeholder="Phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              <select className="border rounded p-2 text-black" value={editForm.employee_role} onChange={e => setEditForm({ ...editForm, employee_role: e.target.value as EmployeeRole })}>
                <option value="caller">Caller</option>
                <option value="reviewer">Reviewer</option>
                <option value="preparer">Preparer</option>
              </select>
              <div className="md:col-span-2 flex justify-end space-x-2">
                <button type="button" className="border rounded px-4 py-2 text-black" onClick={() => setEditing(false)}>Cancel</button>
                <button type="button" disabled={savingEdit} className="bg-[#006666] text-white rounded px-4 py-2" onClick={saveEmployeeEdit}>{savingEdit ? 'Saving...' : 'Update'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
