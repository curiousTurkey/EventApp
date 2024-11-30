import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDwaCrAHh1GUfqLvfkZ6PPHk14oAfRuWa8",
  authDomain: "events-42ffe.firebaseapp.com",
  projectId: "events-42ffe",
  storageBucket: "events-42ffe.firebasestorage.app",
  messagingSenderId: "437332225094",
  appId: "1:437332225094:web:98831918c6cd043f89ae47"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db};

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return "success";
    } catch (error) {
        console.log(error)
    }
}
export async function signUp(name,organization, email, password, ){
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if(userCredential){
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                organization: organization,
                email: email
            });
            console.log("Doc created successfully")
            return "success";
        }
        return "failed"
    } catch (error) {
        console.log(error);
    }
}
export async function addEvent(eventData) {
    try {
        const docRef = await addDoc(collection(db, "events"), eventData);
    } catch (error) {
        console.log(error);
    }
}