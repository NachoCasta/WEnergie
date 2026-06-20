import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  signOut,
  getAuth,
} from "firebase/auth";
import { app } from ".";

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

// Sign in with Google functionality
export const signInWithGoogle = async () => {
  console.log("sign in with google");
  try {
    await setPersistence(auth, browserSessionPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user,
      error: null,
    };
  } catch (error: unknown) {
    console.log("error", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      user: null,
      error: message,
    };
  }
};

// Sign out functionality
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: message,
    };
  }
};

export const AUTHENTICATION = {
  signIn: signInWithGoogle,
  signOut: firebaseSignOut,
};
