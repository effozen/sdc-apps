import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '.';

interface Props {
  noSessionComponent?: React.ReactNode;
  supabaseSession: Session | null;
  setSupabaseSession: (session: Session | null) => void;
  children: React.ReactNode;
}

const SupabaseProvider = ({ noSessionComponent, supabaseSession, setSupabaseSession, children }: Props) => {
  const [isShouldPasswordRecovery, setIsShouldPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSupabaseSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setIsShouldPasswordRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSupabaseSession]);

  if (noSessionComponent && (!supabaseSession || isShouldPasswordRecovery)) {
    return <>{noSessionComponent}</>;
  }

  return <>{children}</>;
};

export default SupabaseProvider;
