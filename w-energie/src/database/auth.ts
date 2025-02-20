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
    return setPersistence(auth, browserSessionPersistence).then(async () => {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("signed in with google", result);
      return {
        success: true,
        user: result.user,
        error: null,
      };
    });
  } catch (error: any) {
    console.log("error", error);
    return {
      success: false,
      user: null,
      error: error.message,
    };
  }
};

// Sign out functionality
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const AUTHENTICATION = {
  signIn: signInWithGoogle,
  signOut: firebaseSignOut,
};
