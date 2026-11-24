

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  ArrowLeft,
  ClipboardList,
  LoaderCircle,
  Eye,
  X,
  CalendarDays,
  Tag,
  Flag,
  FileText
} from 'lucide-react';

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data: { user }, error: authError } =
          await supabase.auth.getUser();

        if (authError || !user) {
          navigate('/');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('complaints')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setComplaints(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  const statusStyle = (status) => {
    if (status === 'Resolved') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'In Progress') {
      return 'bg-blue-100 text-blue-700';
    }

    return 'bg-orange-100 text-orange-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3]">
        <LoaderCircle className="animate-spin text-[#DE9877]" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] p-5 md:p-10 text-[#795443]">

      <button
        onClick={() => navigate('/student')}
        className="flex items-center gap-2 mb-7 text-[#A66B50]"
      >
        <ArrowLeft size={19} />
        Back to Dashboard
      </button>

      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-sm font-semibold text-[#DE9877]">
            STUDENT PORTAL
          </p>

          <h1 className="text-3xl font-bold mt-2">
            My Complaints
          </h1>

          <p className="text-sm text-[#A68B7B] mt-2">
            Track all your submitted complaints and their progress.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-5">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#F2E5DC] shadow-sm overflow-hidden">

          <div className="p-5 md:p-6 border-b border-[#F2E5DC]">
            <h2 className="font-bold text-lg">
              Complaint History
            </h2>

            <p className="text-sm text-[#A68B7B] mt-1">
              Total complaints: {complaints.length}
            </p>
          </div>

          {complaints.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardList
                size={42}
                className="mx-auto text-[#DEB9A5]"
              />

              <h3 className="font-semibold mt-4">
                No complaints found
              </h3>

              <p className="text-sm text-[#A68B7B] mt-2">
                You haven't submitted any complaints yet.
              </p>

              <button
                onClick={() => navigate('/submit-complaint')}
                className="mt-5 bg-[#DE9877] text-white px-5 py-3 rounded-xl"
              >
                Submit a Complaint
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[850px]">
                <thead className="bg-[#FFF8F3] text-sm text-[#A68B7B]">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-t border-[#F2E5DC] text-sm"
                    >
                      <td className="p-4 font-semibold">
                        #{complaint.id}
                      </td>

                      <td className="p-4 font-semibold">
                        {complaint.title}
                      </td>

                      <td className="p-4">
                        {complaint.category}
                      </td>

                      <td className="p-4">
                        {complaint.priority}
                      </td>

                      <td className="p-4">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span className={`rounded-full px-3 py-2 text-xs font-semibold ${statusStyle(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="flex items-center gap-2 text-[#DE9877] font-semibold hover:text-[#A66B50] whitespace-nowrap"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Details Popup */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D2920]/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="bg-[#FCE5D8] p-6 md:p-8 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#B8795D]">
                  STUDENT PORTAL
                </p>

                <h2 className="text-2xl font-bold mt-2 text-[#795443]">
                  Complaint Details
                </h2>

                <p className="text-sm text-[#A66B50] mt-1">
                  Complaint #{selectedComplaint.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="bg-white/80 p-2 rounded-full text-[#795443] hover:bg-white"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-5 max-h-[65vh] overflow-y-auto">

              <div>
                <div className="flex items-center gap-2 text-[#A68B7B] text-sm mb-2">
                  <FileText size={17} />
                  Complaint Title
                </div>

                <p className="font-bold text-[#795443]">
                  {selectedComplaint.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <div className="flex items-center gap-2 text-[#A68B7B] text-sm mb-2">
                    <Tag size={16} />
                    Category
                  </div>

                  <p className="font-semibold text-[#795443]">
                    {selectedComplaint.category}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#A68B7B] text-sm mb-2">
                    <Flag size={16} />
                    Priority
                  </div>

                  <p className="font-semibold text-[#795443]">
                    {selectedComplaint.priority}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-sm text-[#A68B7B] mb-2">
                  Description
                </p>

                <div className="bg-[#FFF8F3] border border-[#F2E5DC] rounded-xl p-4 text-sm text-[#795443] leading-6 whitespace-pre-wrap break-words">
                  {selectedComplaint.description}
                </div>
              </div>

              <div>
                <p className="text-sm text-[#A68B7B] mb-2">
                  Current Status
                </p>

                <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold ${statusStyle(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#A68B7B] text-sm mb-2">
                  <CalendarDays size={16} />
                  Submission Date
                </div>

                <p className="font-semibold text-[#795443]">
                  {new Date(selectedComplaint.created_at).toLocaleString()}
                </p>
              </div>

            </div>

            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-full bg-[#DE9877] hover:bg-[#C77F60] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MyComplaints;



