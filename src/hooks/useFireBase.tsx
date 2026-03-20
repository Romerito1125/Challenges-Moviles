import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export function useFirebaseAuth() {

  const registerUser = async (email: string, password: string) => {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;

  };

  const loginUser = async (email: string, password: string) => {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;

  };

  return { registerUser, loginUser };
}
