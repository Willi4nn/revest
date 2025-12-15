import revestIcon from '../../assets/revest-icon.png';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 shrink-0 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <a
          href="/"
          className="flex items-center gap-3 rounded-lg py-1 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <img src={revestIcon} alt="" className="size-8" aria-hidden="true" />
          <span className="text-xl font-semibold tracking-tight text-white">Revest</span>
        </a>
      </nav>
    </header>
  );
}