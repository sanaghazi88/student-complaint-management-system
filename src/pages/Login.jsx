

// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../services/supabase';
// import loginBg from '../assets/login-bg.png';
// import {
//   Eye,
//   EyeOff,
//   Lock,
//   Mail,
//   User,
//   ShieldCheck,
//   Sparkles
// } from 'lucide-react';
// import gsap from 'gsap';

// function Login() {
//   const navigate = useNavigate();

//   const cardRef = useRef(null);
//   const iconRef = useRef(null);

//   const [isSignup, setIsSignup] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         cardRef.current,
//         {
//           opacity: 0,
//           y: 45,
//           scale: 0.95
//         },
//         {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//           duration: 1,
//           ease: 'power3.out'
//         }
//       );

//       gsap.fromTo(
//         iconRef.current,
//         {
//           opacity: 0,
//           scale: 0.5,
//           rotation: -25
//         },
//         {
//           opacity: 1,
//           scale: 1,
//           rotation: 0,
//           duration: 0.8,
//           delay: 0.3,
//           ease: 'back.out(1.7)'
//         }
//       );
//     });

//     return () => ctx.revert();
//   }, []);

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     if (!email || !password || (isSignup && !name.trim())) {
//       setMessage('Please fill in all fields.');
//       return;
//     }

//     if (password.length < 6) {
//       setMessage('Password must be at least 6 characters.');
//       return;
//     }

//     setLoading(true);

//     try {
//       if (isSignup) {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: {
//               full_name: name.trim(),
//             },
//           },
//         });

//         if (error) throw error;

//         setMessage(
//           'Signup successful! Check your email for confirmation.'
//         );
//       } else {
//         const { data, error } =
//           await supabase.auth.signInWithPassword({
//             email,
//             password,
//           });

//         if (error) throw error;

//         const { data: profile, error: profileError } =
//           await supabase
//             .from('profiles')
//             .select('role')
//             .eq('id', data.user.id)
//             .single();

//         if (profileError) throw profileError;

//         if (profile.role === 'admin') {
//           navigate('/admin');
//         } else {
//           navigate('/student');
//         }
//       }
//     } catch (error) {
//       setMessage(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#FFF8F3] px-4 py-10">

//       {/* Background Decorations */}
//       <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#FCE5D8] rounded-full blur-3xl opacity-80" />

//       <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F4C4AA] rounded-full blur-3xl opacity-60" />

//       <div className="absolute top-1/4 right-[12%] w-16 h-16 rounded-full bg-[#F4C4AA]/30 blur-xl" />

//       {/* Login Card */}
//       <div
//         ref={cardRef}
//         className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-[#F2E5DC] rounded-[30px] p-7 sm:p-10 shadow-[0_25px_70px_rgba(121,84,67,0.12)]"
//       >

//         {/* Logo */}
//         <div className="text-center mb-8">

//           <div
//             ref={iconRef}
//             className="mx-auto mb-5 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#DE9877] to-[#C77F60] text-white shadow-lg shadow-[#DE9877]/30"
//           >
//             <ShieldCheck size={32} />
//           </div>

//           <div className="flex justify-center items-center gap-2 mb-2">
//             <Sparkles size={16} className="text-[#DE9877]" />

//             <p className="text-xs font-bold tracking-[3px] text-[#B8795D]">
//               STUDENT PORTAL
//             </p>

//             <Sparkles size={16} className="text-[#DE9877]" />
//           </div>

//           <h1 className="text-3xl font-extrabold text-[#795443] tracking-tight">
//             Welcome {isSignup ? 'Aboard' : 'Back'}
//           </h1>

//           <p className="mt-3 text-sm text-[#A68B7B]">
//             {isSignup
//               ? 'Create your account and get started.'
//               : 'Sign in to manage your complaints.'}
//           </p>

//         </div>

//         {/* Form */}
//         <form onSubmit={handleAuth} className="space-y-5">

//           {isSignup && (
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#795443]">
//                 Full Name
//               </label>

//               <div className="flex items-center gap-3 rounded-xl border border-[#F0DED3] bg-[#FFF8F3] px-4 transition-all focus-within:border-[#DE9877] focus-within:ring-4 focus-within:ring-[#DE9877]/10">
//                 <User size={18} className="text-[#B8795D]" />

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter your full name"
//                   className="w-full bg-transparent py-3.5 text-sm text-[#795443] outline-none placeholder:text-[#C4A99A]"
//                 />
//               </div>
//             </div>
//           )}

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-[#795443]">
//               Email Address
//             </label>

//             <div className="flex items-center gap-3 rounded-xl border border-[#F0DED3] bg-[#FFF8F3] px-4 transition-all focus-within:border-[#DE9877] focus-within:ring-4 focus-within:ring-[#DE9877]/10">
//               <Mail size={18} className="text-[#B8795D]" />

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="w-full bg-transparent py-3.5 text-sm text-[#795443] outline-none placeholder:text-[#C4A99A]"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-semibold text-[#795443]">
//               Password
//             </label>

//             <div className="flex items-center gap-3 rounded-xl border border-[#F0DED3] bg-[#FFF8F3] px-4 transition-all focus-within:border-[#DE9877] focus-within:ring-4 focus-within:ring-[#DE9877]/10">

//               <Lock size={18} className="text-[#B8795D]" />

//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full bg-transparent py-3.5 text-sm text-[#795443] outline-none placeholder:text-[#C4A99A]"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="text-[#A68B7B] hover:text-[#795443]"
//               >
//                 {showPassword
//                   ? <EyeOff size={19} />
//                   : <Eye size={19} />
//                 }
//               </button>

//             </div>
//           </div>

//           {/* Message */}
//           {message && (
//             <div className="rounded-xl border border-[#F2D6C8] bg-[#FFF3EC] p-3 text-sm text-[#A66B50]">
//               {message}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-gradient-to-r from-[#DE9877] to-[#C77F60] py-3.5 font-bold text-white shadow-lg shadow-[#DE9877]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#DE9877]/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading
//               ? 'Please wait...'
//               : isSignup
//                 ? 'Create Account'
//                 : 'Sign In'}
//           </button>

//         </form>

//         {/* Toggle */}
//         <div className="mt-7 text-center">
//           <p className="text-sm text-[#A68B7B]">
//             {isSignup
//               ? 'Already have an account?'
//               : "Don't have an account?"}

//             <button
//               type="button"
//               onClick={() => {
//                 setIsSignup(!isSignup);
//                 setMessage('');
//                 setPassword('');
//                 setName('');
//               }}
//               className="ml-2 font-bold text-[#C77F60] hover:text-[#795443] transition-colors"
//             >
//               {isSignup ? 'Login' : 'Sign Up'}
//             </button>
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 pt-5 border-t border-[#F2E5DC] text-center">
//           <p className="text-xs text-[#B9A194]">
//             Student Complaint Management System
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import loginBg from '../assets/login-bg.png';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import gsap from 'gsap';

function Login() {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const iconRef = useRef(null);

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 45, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );

      gsap.fromTo(
        iconRef.current,
        { opacity: 0, scale: 0.5, rotation: -25 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'back.out(1.7)'
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email || !password || (isSignup && !name.trim())) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        setMessage(
          'Signup successful! Check your email for confirmation.'
        );
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;

        const { data: profile, error: profileError } =
          await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        if (profile.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden px-4 py-10 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >

      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-[#FFF8F3]/25" />

      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#FCE5D8]/50 rounded-full blur-3xl" />

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F4C4AA]/40 rounded-full blur-3xl" />

      {/* Login Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/70 rounded-[30px] p-7 sm:p-10 shadow-[0_25px_70px_rgba(121,84,67,0.18)]"
      >

        {/* Logo */}
        <div className="text-center mb-8">

          <div
            ref={iconRef}
            className="mx-auto mb-5 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#DE9877] to-[#C77F60] text-white shadow-lg shadow-[#DE9877]/30"
          >
            <ShieldCheck size={32} />
          </div>

          <div className="flex justify-center items-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#DE9877]" />

            <p className="text-xs font-bold tracking-[3px] text-[#B8795D]">
              STUDENT PORTAL
            </p>

            <Sparkles size={16} className="text-[#DE9877]" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#795443] tracking-tight">
            Welcome {isSignup ? 'Aboard' : 'Back'}
          </h1>

          <p className="mt-3 text-sm text-[#A68B7B]">
            {isSignup
              ? 'Create your account and get started.'
              : 'Sign in to manage your complaints.'}
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-5">

          {isSignup && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#795443]">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#F0DED3] bg-[#FFF8F3] px-4 transition-all focus-within:border-[#DE9877] focus-within:ring-4 focus-within:ring-[#DE9877]/10">
                <User size={18} className="text-[#B8795D]" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent py-3.5 text-sm text-[#795443] outline-none placeholder:text-[#C4A99A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#795443]">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#F0DED3] bg-[#FFF8F3] px-4 transition-all focus-within:border-[#DE9877] focus-within:ring-4 focus-within:ring-[#DE9877]/10">
              <Mail size={18} className="text-[#B8795D]" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent py-3.5 text-sm text-[#795443] outline-none placeholder:text-[#C4A99A]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#795443]">
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#F0DED3] bg-[#FFF8F3] px-4 transition-all focus-within:border-[#DE9877] focus-within:ring-4 focus-within:ring-[#DE9877]/10">

              <Lock size={18} className="text-[#B8795D]" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent py-3.5 text-sm text-[#795443] outline-none placeholder:text-[#C4A99A]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A68B7B] hover:text-[#795443]"
              >
                {showPassword
                  ? <EyeOff size={19} />
                  : <Eye size={19} />
                }
              </button>

            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="rounded-xl border border-[#F2D6C8] bg-[#FFF3EC] p-3 text-sm text-[#A66B50]">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#DE9877] to-[#C77F60] py-3.5 font-bold text-white shadow-lg shadow-[#DE9877]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#DE9877]/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Create Account'
                : 'Sign In'}
          </button>

        </form>

        {/* Toggle */}
        <div className="mt-7 text-center">
          <p className="text-sm text-[#A68B7B]">
            {isSignup
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage('');
                setPassword('');
                setName('');
              }}
              className="ml-2 font-bold text-[#C77F60] hover:text-[#795443] transition-colors"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-[#F2E5DC] text-center">
          <p className="text-xs text-[#B9A194]">
            Student Complaint Management System
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
