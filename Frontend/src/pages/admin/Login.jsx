import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (admin) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Is the server running?');
    }
  };

  const inputClass =
    'w-full bg-ink border border-line px-4 py-3 min-h-12 text-base text-white placeholder-neutral-600 focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="min-h-[100svh] flex items-center justify-center px-5 bg-ink">
      <div className="w-full max-w-md bg-surface border border-line p-8 md:p-10">
        <div className="text-center mb-8">
          <p className="text-gold tracking-[0.35em] text-[10px] uppercase mb-3">Admin Panel</p>
          <h1 className="font-serif text-3xl text-white">Vikash Rana</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Email</label>
            <input
              type="email"
              autoComplete="username"
              inputMode="email"
              placeholder="admin@example.com"
              className={inputClass}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold-light text-black font-medium min-h-12 tracking-wider uppercase text-sm transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center min-h-11 text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-gold transition-colors"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
};

export default Login;