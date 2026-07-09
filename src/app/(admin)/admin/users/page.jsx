"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Search } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/users");

      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message || "Unable to load users");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      const { data } = await axios.patch(`/api/users/${id}`, { role });

      if (data.success) {
        toast.success(data.message || "Role updated.");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role } : u))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update role.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`/api/users/${id}`, { status });

      if (data.success) {
        toast.success(data.message || "Status updated.");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, status } : u))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status.");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;

    try {
      const { data } = await axios.delete(`/api/users/${id}`);

      if (data.success) {
        toast.success(data.message || "User deleted.");
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Users</h1>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 w-full max-w-xs">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-200">
                    <td className="p-4 font-semibold">{user.fullName}</td>

                    <td className="p-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        className="border border-gray-200 rounded p-2"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          updateStatus(user._id, e.target.value)
                        }
                        className="border border-gray-200 rounded p-2"
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-600 text-white p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}