import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search, LogOut, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, deleteUser, updateUser } from '../api';
import type { User } from '../types';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    
    fetchAllUsers();
  }, [navigate]);

  const fetchAllUsers = async () => {
    try {
      const allPages = Array.from({ length: 2 }, (_, i) => i + 1);
      const responses = await Promise.all(
        allPages.map(page => getUsers(page))
      );
      
      const combinedUsers = responses.flatMap(response => response.data);
      setAllUsers(combinedUsers);
      setTotalPages(Math.ceil(combinedUsers.length / 6));
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    const filteredUsers = allUsers.filter(user => {
      const searchTerm = searchQuery.toLowerCase();
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      
      return fullName.includes(searchTerm) || email.includes(searchTerm);
    });

    setTotalPages(Math.ceil(filteredUsers.length / 6));
    setUsers(filteredUsers.slice((page - 1) * 6, page * 6));
  }, [allUsers, searchQuery, page]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(id);
      setAllUsers(allUsers.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdate = async (user: User) => {
    try {
      await updateUser(user.id, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      });
      setAllUsers(allUsers.map(u => u.id === user.id ? user : u));
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover-lift">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Team Members
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative animate-slide-in">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr 
                    key={user.id}
                    className="animate-fade-in hover:bg-gray-50/50 transition-colors duration-150"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={user.avatar} 
                        alt={user.first_name}
                        className="h-10 w-10 rounded-full transform transition-transform hover:scale-110 hover:rotate-6"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <div className="space-x-2">
                          <input
                            type="text"
                            value={editingUser.first_name}
                            onChange={e => setEditingUser({ ...editingUser, first_name: e.target.value })}
                            className="w-24 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <input
                            type="text"
                            value={editingUser.last_name}
                            onChange={e => setEditingUser({ ...editingUser, last_name: e.target.value })}
                            className="w-24 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-gray-900">{`${user.first_name} ${user.last_name}`}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                          className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <span className="text-gray-600">{user.email}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {editingUser?.id === user.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(editingUser)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          >
                            <Pencil size={16} className="inline transform transition-transform hover:scale-110" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <Trash2 size={16} className="inline transform transition-transform hover:scale-110" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 animate-fade-in">
                      No users found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white/50">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 hover:border-indigo-300"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 hover:border-indigo-300"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}