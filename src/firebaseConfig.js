// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
/*
Information stored between bottom code removed as it originally comprises of personal tokens. If you are to use this code, please replace information in there with your own firebase tokens and information.
const firebaseConfig = {

};
*/
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Correct named exports
export const storage = getStorage(app);
export const db = getFirestore(app);
