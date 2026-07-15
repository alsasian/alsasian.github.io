import { useSetAtom } from 'jotai';
import { createItemAtom, navAtom, goHomeAtom } from '@/lib/budget/atoms';
import NewItemForm from './shared/NewItemForm';

export default function NewItemScreen() {
  const createItem = useSetAtom(createItemAtom);
  const setNav = useSetAtom(navAtom);
  const goHome = useSetAtom(goHomeAtom);

  return (
    <div className="b-view">
      <div className="b-ihead">
        <button type="button" className="b-back" aria-label="Back" onClick={goHome}>
          ←
        </button>
        <span className="t">New budget</span>
      </div>

      <p className="b-section" style={{ marginBottom: 16, color: 'var(--muted)', fontSize: 13 }}>
        An item is a number you want to watch — Steam, Coffee, Transport. Leave the amount blank to
        track it without a limit.
      </p>

      <NewItemForm
        submitLabel="Create budget"
        onCreate={async (input) => {
          const item = await createItem(input);
          setNav({ screen: 'item', itemId: item.id });
        }}
        onCancel={goHome}
      />
    </div>
  );
}
