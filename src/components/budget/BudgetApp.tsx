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
