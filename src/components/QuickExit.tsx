// Quick Exit — replaces the entire app view with a neutral screen.
// Activated by the Quick Exit button or the keyboard shortcut (Escape x2).
import { Globe } from 'lucide-react';

export default function QuickExit() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 text-center text-slate-700">
      <Globe size={40} className="mb-4 text-slate-400" />
      <h1 className="text-xl font-semibold text-slate-700">My Notes</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        A simple place for your thoughts and reminders. Nothing to see here right now.
      </p>
      <div className="mt-8 flex gap-3">
        <a
          href="https://www.wikipedia.org"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Open a new site
        </a>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
