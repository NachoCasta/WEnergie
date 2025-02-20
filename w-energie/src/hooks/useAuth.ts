import { Session } from "@toolpad/core";
import { auth } from "database/auth";
import { AuthStateHook, useAuthState } from "react-firebase-hooks/auth";

export default function useAuth(): AuthStateHook {
  return useAuthState(auth);
}

export function useSession(): Session | null {
  const [user] = useAuth();
  if (user == null) {
    return null;
  }
  return {
    user: {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
    },
  };
}
