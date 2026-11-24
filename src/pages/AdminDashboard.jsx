
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Search,
  Trash2,
  LoaderCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchData = async () => {
    setError('');

    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        navigate('/');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== 'admin') {
        navigate('/student');
        return;
      }

      setAdmin({
        name: profile.full_name || 'Admin',
        email: user.email
      });

      const { data, error: complaintError } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (complaintError) throw complaintError;

      setComplaints(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, newStatus) => {
    setError('');

    const { error: updateError } = await supabase
      .from('complaints')
      .update({ status: newStatus })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setComplaints(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  const deleteComplaint = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this complaint?'
    );

    if (!confirmed) return;

    setError('');

    const { error: deleteError } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setComplaints(previous =>
      previous.filter(item => item.id !== id)
    );
  };

  const handleLogout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError(logoutError.message);
      return;
    }

    navigate('/');
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    {
      title: 'Total Complaints',
      value: total,
      icon: ClipboardList,
      color: 'bg-[#FCE5D8]',
      iconColor: 'text-[#B97858]'
    },
    {
      title: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-[#F8EBD9]',
      iconColor: 'text-[#B78A49]'
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: AlertCircle,
      color: 'bg-[#E8EDF5]',
      iconColor: 'text-[#7189AA]'
    },
    {
      title: 'Resolved',
      value: resolved,
      icon: CheckCircle,
      color: 'bg-[#E5EFE5]',
      iconColor: 'text-[#648A68]'
    }
  ];

  const filteredComplaints = complaints.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      String(item.id).includes(search) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === 'All' || item.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3]">
        <LoaderCircle className="animate-spin text-[#DE9877]" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] text-[#795443] md:flex">

      {/* Sidebar */}
      <aside className="w-full md:w-64 md:min-h-screen bg-white border-r border-[#F2E5DC] p-6 flex flex-col">

        <h2 className="text-xl font-bold tracking-wide">
          Complain<span className="text-[#DE9877]">Ease.</span>
        </h2>

        <p className="text-xs text-[#B49A89] mt-1">
          ADMIN PORTAL
        </p>

        <nav className="mt-10 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#FCE5D8] px-4 py-3 font-semibold">
            <LayoutDashboard size={19} />
            Dashboard
          </div>

          <div className="flex items-center gap-3 px-4 py-3 text-[#A68B7B]">
            <ClipboardList size={19} />
            All Complaints
          </div>
        </nav>

        <div className="mt-8 md:mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[#A66B50] hover:bg-[#FFF1E9] transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10">

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-[#B49A89]">
              ADMINISTRATION
            </p>

            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="bg-white rounded-xl px-4 py-3 border border-[#F2E5DC] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FCE5D8] flex items-center justify-center">
              <ShieldCheck size={21} className="text-[#B97858]" />
            </div>

            <div>
              <p className="font-semibold">{admin?.name}</p>
              <p className="text-xs text-[#A68B7B]">{admin?.email}</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl bg-gradient-to-r from-[#FCE5D8] to-[#F4C4AA] p-6 md:p-8 mb-8">
          <p className="text-sm text-[#96664F]">
            ADMIN CONTROL CENTER
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            Welcome back, {admin?.name}!
          </h2>

          <p className="mt-2 text-sm text-[#96664F]">
            Manage student complaints and monitor their progress.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section>
          <h2 className="text-lg font-bold mb-4">
            Complaint Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map(item => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl border border-[#F2E5DC] p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={21} className={item.iconColor} />
                  </div>

                  <p className="text-sm text-[#A68B7B] mt-4">
                    {item.title}
                  </p>

                  <h3 className="text-3xl font-bold mt-1">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* All Complaints */}
        <section className="mt-9 bg-white rounded-2xl border border-[#F2E5DC] shadow-sm">

          <div className="p-5 md:p-6 border-b border-[#F2E5DC]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-lg font-bold">
                  All Student Complaints
                </h2>

                <p className="text-sm text-[#A68B7B] mt-1">
                  Review and manage submitted complaints.
                </p>
              </div>

              <button
                onClick={fetchData}
                className="flex items-center gap-2 text-sm font-semibold text-[#A66B50] hover:text-[#795443]"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">

              <div className="flex items-center gap-2 border border-[#EBD9CE] rounded-xl px-3 flex-1">
                <Search size={18} className="text-[#B49A89]" />

                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title, ID or category..."
                  className="w-full py-3 outline-none text-sm"
                />
              </div>

              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="border border-[#EBD9CE] rounded-xl px-4 py-3 outline-none text-sm"
              >
                <option value="All">All Categories</option>
                <option value="IT">IT</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Other">Other</option>
              </select>

            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="py-14 text-center">
              <ClipboardList size={40} className="mx-auto text-[#DEB9A5]" />

              <p className="font-semibold mt-3">
                No complaints found
              </p>

              <p className="text-sm text-[#A68B7B] mt-1">
                Try changing your search or category filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">

                <thead className="bg-[#FFF8F3] text-sm text-[#A68B7B]">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Complaint</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map(item => (
                    <tr
                      key={item.id}
                      className="border-t border-[#F2E5DC] text-sm"
                    >
                      <td className="p-4 font-semibold">
                        #{item.id}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-[#A68B7B] mt-1 max-w-[180px] truncate">
                          {item.description}
                        </p>
                      </td>

                      <td className="p-4">{item.category}</td>

                      <td className="p-4">{item.priority}</td>

                      <td className="p-4">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <select
                          value={item.status}
                          onChange={e => updateStatus(item.id, e.target.value)}
                          className="rounded-lg border border-[#EBD9CE] p-2 text-xs outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => deleteComplaint(item.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition"
                          title="Delete complaint"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;
