import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-auth.js';
import { getFirestore, doc, getDoc, query, where, collection, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-firestore.js';
import { firebaseConfig } from './firebase.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const userInfo = document.getElementById('user-info');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    userInfo.innerHTML = '<p>Connecte-toi pour voir ton profil.</p><p><a href="login.html">Se connecter</a></p>';
    return;
  }
  // load user doc
  const udoc = await getDoc(doc(db, 'users', user.uid));
  const data = udoc.exists() ? udoc.data() : { email: user.email };
  userInfo.innerHTML = `
    <p><strong>${data.displayName || user.email}</strong></p>
    <p>${data.email || ''}</p>
    <p>Compte créé: ${data.createdAt || ''}</p>
    <h3>Mes posts</h3>
    <ul id="my-posts"></ul>
  `;
  // load posts by user
  const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(postsQuery);
  const list = document.getElementById('my-posts');
  snap.forEach(d => {
    const li = document.createElement('li');
    li.textContent = d.data().content || '[image]';
    list.appendChild(li);
  });
});
