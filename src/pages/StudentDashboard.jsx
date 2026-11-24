
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  LoaderCircle
} from 'lucide-react';

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data: { user }, error: authError } =
          await supabase.auth.getUser();

        if (authError || !user) {
          navigate('/');
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        const { data: complaintData, error: complaintError } =
          await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (complaintError) throw complaintError;

        setStudent({
          name: profile.full_name || 'Student',
          email: user.email
        });

        setComplaints(complaintData || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const total = complaints.length;
  const pending = complaints.filter(
    c => c.status === 'Pending'
  ).length;

  const inProgress = complaints.filter(
    c => c.status === 'In Progress'
  ).length;

  const resolved = complaints.filter(
    c => c.status === 'Resolved'
  ).length;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/');
  };

  const stats = [
    { title: 'Total Complaints', value: total, icon: ClipboardList, color: 'bg-[#FCE5D8]', iconColor: 'text-[#B97858]' },
    { title: 'Pending', value: pending, icon: Clock, color: 'bg-[#F8EBD9]', iconColor: 'text-[#B78A49]' },
    { title: 'In Progress', value: inProgress, icon: AlertCircle, color: 'bg-[#E8EDF5]', iconColor: 'text-[#7189AA]' },
    { title: 'Resolved', value: resolved, icon: CheckCircle, color: 'bg-[#E5EFE5]', iconColor: 'text-[#648A68]' }
  ];

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
          STUDENT PORTAL
        </p>

        <nav className="mt-10 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#FCE5D8] px-4 py-3 font-semibold">
            <LayoutDashboard size={19} />
            Dashboard
          </div>

          {/* <div className="flex items-center gap-3 px-4 py-3 text-[#A68B7B]">
            <FilePlus size={19} />
            Submit Complaint
          </div> */}

<button
  onClick={() => navigate('/submit-complaint')}
  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[#A68B7B] hover:bg-[#FFF1E9] hover:text-[#795443] transition"
>
  <FilePlus size={19} />
  Submit Complaint
</button>


          {/* <div className="flex items-center gap-3 px-4 py-3 text-[#A68B7B]">
            <ClipboardList size={19} />
            My Complaints
          </div> */}
          <button
  onClick={() => navigate('/my-complaints')}
  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[#A68B7B] hover:bg-[#FFF1E9] hover:text-[#795443] transition"
>
  <ClipboardList size={19} />
  My Complaints
</button>
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
              STUDENT OVERVIEW
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Dashboard
            </h1>
          </div>

          <div className="bg-white rounded-xl px-4 py-3 border border-[#F2E5DC]">
            <p className="font-semibold">
              {student?.name || 'Student'}
            </p>
            <p className="text-xs text-[#A68B7B]">
              {student?.email}
            </p>
          </div>
        </header>

        <section className="rounded-2xl bg-gradient-to-r from-[#FCE5D8] to-[#F4C4AA] p-6 md:p-8 mb-8">
          <p className="text-sm text-[#96664F]">
            YOUR STUDENT SPACE
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            Welcome back, {student?.name || 'Student'}!
          </h2>
          <p className="mt-2 text-sm text-[#96664F]">
            Keep track of your complaints and their progress.
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
            {stats.map((item) => {
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

        {/* Recent Complaints */}
        <section className="mt-9 bg-white rounded-2xl border border-[#F2E5DC] p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold">
                Recent Complaints
              </h2>
              <p className="text-sm text-[#A68B7B] mt-1">
                Your latest complaint activity
              </p>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="py-10 text-center">
              <ClipboardList size={35} className="mx-auto text-[#DEB9A5]" />
              <p className="font-semibold mt-3">
                No complaints yet
              </p>
              <p className="text-sm text-[#A68B7B] mt-1">
                Your submitted complaints will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F5ECE6] pb-4 last:border-0"
                >
                  <div>
                    <h3 className="font-semibold">
                      {complaint.title}
                    </h3>
                    <p className="text-xs text-[#A68B7B] mt-1">
                      {complaint.category} · {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="text-xs font-semibold rounded-full bg-[#FCE5D8] px-3 py-2 w-fit">
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default StudentDashboard;
