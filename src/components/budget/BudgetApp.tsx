import { useEffect } from 'react';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import { navAtom, loadedAtom, initAtom } from '@/lib/budget/atoms';
import HomeScreen from './HomeScreen';
import EntryScreen from './EntryScreen';
import ItemScreen from './ItemScreen';
import ConfirmScreen from './ConfirmScreen';
import SettingsScreen from './SettingsScreen';

function BudgetAppContent() {
  const nav = useAtomValue(navAtom);
  const loaded = useAtomValue(loadedAtom);
  const init = useSetAtom(initAtom);

  useEffect(() => {
    void init();
  }, [init]);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        Loading…
      </div>
    );
  }

  switch (nav.screen) {
    case 'entry':
      return <EntryScreen />;
    case 'item':
      return <ItemScreen />;
    case 'confirm':
      return <ConfirmScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

export default function BudgetApp() {
  return (
    <Provider>
      <BudgetAppContent />
    </Provider>
  );
}
