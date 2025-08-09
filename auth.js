import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-firestore.js';
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');

if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'index.html';
    } catch (e) { alert(e.message); }
  });
}

if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const displayName = document.getElementById('display-name').value || null;
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCred.user, { displayName });
      }
      // Create user doc in Firestore
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email, displayName, createdAt: new Date().toISOString(), isAdmin: false
      });
      window.location.href = 'index.html';
    } catch (e) { alert(e.message); }
  });
}
