
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ArrowLeft, Send, LoaderCircle } from 'lucide-react';

function SubmitComplaint() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        navigate('/');
        return;
      }

      const { error: insertError } = await supabase
        .from('complaints')
        .insert([{
          student_id: user.id,
          title: title.trim(),
          category,
          description: description.trim(),
          priority
        }]);

      if (insertError) throw insertError;

      setMessage('Complaint submitted successfully!');
      setTitle('');
      setCategory('IT');
      setDescription('');
      setPriority('Medium');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] p-5 md:p-10 text-[#795443]">

      <button
        onClick={() => navigate('/student')}
        className="flex items-center gap-2 mb-7 text-[#A66B50] hover:text-[#795443]"
      >
        <ArrowLeft size={19} />
        Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#F2E5DC] shadow-sm p-6 md:p-9">

        <p className="text-sm font-semibold text-[#DE9877]">
          STUDENT PORTAL
        </p>

        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          Submit a Complaint
        </h1>

        <p className="text-sm text-[#A68B7B] mt-2 mb-8">
          Please provide the details of your issue below.
        </p>

        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl mb-5 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold mb-2">
              Complaint Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter complaint title"
              className="w-full border border-[#EBD9CE] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F4C4AA]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-[#EBD9CE] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F4C4AA]"
            >
              <option value="IT">IT</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-[#EBD9CE] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F4C4AA]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your complaint in detail..."
              rows={5}
              className="w-full border border-[#EBD9CE] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F4C4AA] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#DE9877] hover:bg-[#C98262] text-white font-semibold rounded-xl p-3 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={19} />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Complaint
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default SubmitComplaint;
