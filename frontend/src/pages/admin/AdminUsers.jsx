import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then((r) => setUsers(r.data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    setUsers(users.filter((u) => u._id !== id));
    toast.success('User deleted');
  };

  return (
    <div className="admin-page">
      <h1>Users</h1>
      <div className="card" style={{ padding: '1rem' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? <span className="badge badge-info">Admin</span> : 'Customer'}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {!u.isAdmin && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
