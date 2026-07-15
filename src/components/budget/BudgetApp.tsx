import { useEffect } from 'react';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import { navAtom, loadedAtom, initAtom, installPromptAtom } from '@/lib/budget/atoms';
import type { InstallPrompt } from '@/lib/budget/atoms';
import HomeScreen from './HomeScreen';
import EntryScreen from './EntryScreen';
import ItemScreen from './ItemScreen';
import ConfirmScreen from './ConfirmScreen';
import SettingsScreen from './SettingsScreen';
import NewItemScreen from './NewItemScreen';
import UpcomingScreen from './UpcomingScreen';

function BudgetAppContent() {
  const nav = useAtomValue(navAtom);
  const loaded = useAtomValue(loadedAtom);
  const init = useSetAtom(initAtom);
  const setInstallPrompt = useSetAtom(installPromptAtom);

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as unknown as InstallPrompt);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [setInstallPrompt]);

  let screen;
  if (!loaded) {
    screen = <div className="b-empty">Loading…</div>;
  } else {
    switch (nav.screen) {
      case 'entry':
        screen = <EntryScreen />;
        break;
      case 'item':
        screen = <ItemScreen />;
        break;
      case 'confirm':
        screen = <ConfirmScreen />;
        break;
      case 'settings':
        screen = <SettingsScreen />;
        break;
      case 'newItem':
        screen = <NewItemScreen />;
        break;
      case 'upcoming':
        screen = <UpcomingScreen />;
        break;
      case 'home':
      default:
        screen = <HomeScreen />;
    }
  }

  return <div className="budget-app">{screen}</div>;
}

export default function BudgetApp() {
  return (
    <Provider>
      <BudgetAppContent />
    </Provider>
  );
}
