import useAuth from "hooks/useAuth";
import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: (loading: boolean, error: Error | void) => React.ReactNode;
};

export default function Authed(props: Props) {
  const { children, fallback } = props;
  const [user, loading, error] = useAuth();
  if (user == null || loading || error) {
    return <>{fallback?.(true, error) ?? null}</>;
  }
  return <>{children}</>;
}
