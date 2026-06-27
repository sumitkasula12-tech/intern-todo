import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Pill Nav items ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Tasks',     path: '/tasks'     },
  { name: 'Profile',   path: '/profile'   },
];

// Match active item: /tasks/new and /tasks/:id/edit both belong to "Tasks"
function getActiveIndex(pathname) {
  for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
    if (pathname.startsWith(NAV_ITEMS[i].path)) return i;
  }
  return 0;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const itemRefs   = useRef([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const activeIndex = getActiveIndex(location.pathname);

  // Reposition the sliding pill whenever the active route changes
  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeIndex]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ───────────────────────────────────────────────────── */}
          <Link to="/dashboard" className="flex shrink-0 items-center gap-2 select-none">
            <span className="text-xl">⚡</span>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
              TaskFlow
            </span>
          </Link>

          {/* ── Pill Nav ───────────────────────────────────────────────── */}
          <div className="relative flex items-center rounded-full bg-slate-100 p-1">
            {/* Sliding pill background */}
            <span
              className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ left: `${pillStyle.left}px`, width: `${pillStyle.width}px` }}
              aria-hidden="true"
            />

            {NAV_ITEMS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.path}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => navigate(item.path)}
                  className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-700'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* ── User Area ──────────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Name + role badge (hidden on small screens) */}
            <div className="hidden flex-col items-end md:flex">
              <span className="text-sm font-semibold leading-tight text-slate-800">
                {user.fullName}
              </span>
              <span
                className={`mt-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                  user.role === 'admin'
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Avatar */}
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullName
                  )}&background=6366f1&color=fff`;
                }}
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white ring-2 ring-indigo-100">
                {initials}
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              {/* Door-exit icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-4.5 w-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
