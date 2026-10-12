'use client';

import { createContext, startTransition, useContext, useEffect, useState, useSyncExternalStore, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { createTenant, tenants, type TenantId, type TenantState } from './domain';
import { Button } from '@/components/ui';
import { Icon } from '@/components/icons';
type Store = {
  tenantId: TenantId;
  setTenantId: (t: TenantId) => void;
  state: TenantState;
  update: (fn: (s: TenantState) => TenantState) => void;
  notify: (text: string) => void;
  ready: boolean;
  notice: string;
  setNotice: Dispatch<SetStateAction<string>>;
};
const Context = createContext<Store | null>(null);
const KEY = 'gymcore-demo-v2';
export function MockProvider({
  children
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const keyboard = () => {
      document.documentElement.dataset.input = 'keyboard';
    };
    const pointer = () => {
      document.documentElement.dataset.input = 'pointer';
    };
    window.addEventListener('keydown', keyboard);
    window.addEventListener('pointerdown', pointer);
    return () => {
      window.removeEventListener('keydown', keyboard);
      window.removeEventListener('pointerdown', pointer);
    };
  }, []);
  const [tenantId, setTenantId] = useState<TenantId>('atlas');
  const [all, setAll] = useState<Record<TenantId, TenantState>>(() => ({
    atlas: createTenant('atlas'),
    nord: createTenant('nord')
  }));
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      startTransition(() => {
        try {
          const raw = localStorage.getItem(KEY);
          if (raw) {
            const data = JSON.parse(raw);
            if (data.version === 2 && data.all?.atlas?.students && data.all?.nord?.students) {
              setAll(data.all);
              if (data.tenantId === 'atlas' || data.tenantId === 'nord') setTenantId(data.tenantId);
            }
          }
        } catch {
          setNotice('O armazenamento local está indisponível. A demo continua nesta sessão.');
        }
        setReady(true);
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(KEY, JSON.stringify({
          version: 2,
          all,
          tenantId
        }));
      } catch {/* State remains usable in memory. */}
    }
  }, [all, tenantId, ready]);
  function update(fn: (s: TenantState) => TenantState) {
    setAll(a => ({
      ...a,
      [tenantId]: fn(a[tenantId])
    }));
  }
  function switchTenant(t: TenantId) {
    setTenantId(t);
    setNotice('Você está na ' + tenants[t].name + '. Os dados da demo são separados por academia.');
  }
  return <Context.Provider value={{
    tenantId,
    setTenantId: switchTenant,
    state: all[tenantId],
    update,
    notify: setNotice,
    ready,
    notice,
    setNotice
  }}>{children}<div className="toast-region" aria-live="polite" aria-atomic="true">{notice && <div className="toast">
        <Icon name="check" />
        <span>{notice}</span>
        <Button variant="ghost" size="icon" onClick={() => setNotice('')} aria-label="Dispensar aviso">
          <Icon name="close" size={16} />
        </Button>
      </div>}</div>
  </Context.Provider>;
}
export function useMock() {
  const value = useContext(Context);
  if (!value) throw new Error('MockProvider is required');
  return value;
}
const subscribeHydration = () => () => {};
const clientHydration = () => true;
const serverHydration = () => false;
export function MockReady({
  children
}: {
  children: ReactNode;
}) {
  const {
    ready
  } = useMock();
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydration, serverHydration);
  return ready && hydrated ? children : <main className="route-loading" aria-label="Carregando demonstração">
    <span className="skeleton" />
    <span className="skeleton" />
    <p role="status">Preparando seus dados demonstrativos…</p>
  </main>;
}
