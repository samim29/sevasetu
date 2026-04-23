import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA6FU1Qjbcj1VZKoKXK7UA837Dms869ZUQ",
  authDomain: "volunteer-coordination-27ea2.firebaseapp.com",
  projectId: "volunteer-coordination-27ea2",
  storageBucket: "volunteer-coordination-27ea2.firebasestorage.app",
  messagingSenderId: "1051443256310",
  appId: "1:1051443256310:web:6864e5cd24f9791a6205d7"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app