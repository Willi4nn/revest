import { History, Key } from 'lucide-react';
import revestIcon from '../../assets/revest-icon.png';
import { NavButton } from './NavButton';

interface AppHeaderProps {
  onOpenHistory: () => void;
  onChangeApiKey: () => void;
  onOpenConfirmModal: () => void;
}

export function AppHeader({ onOpenHistory, onOpenConfirmModal }: AppHeaderProps) {
  return (
    <header className="header">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <a
          href="/"
          className="flex items-center gap-3 rounded-lg py-1 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <img src={revestIcon} alt="" className="size-8" aria-hidden="true" />
          <span className="text-xl font-semibold tracking-tight text-white">Revest</span>
        </a>

        <div className="flex items-center gap-2">
          <NavButton
            onClick={onOpenHistory}
            icon={<History size={16} />}
          >
            <span className="hidden sm:inline">Histórico</span>
          </NavButton>

          <NavButton
            onClick={onOpenConfirmModal}
            variant="primary"
            icon={<Key size={16} />}
          >
            <span className="hidden sm:inline">Trocar API Key</span>
            <span className="sm:hidden">API Key</span>
          </NavButton>
        </div>
      </nav>
    </header>
  );
}