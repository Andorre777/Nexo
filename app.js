import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-firestore.js';
import { getStorage, ref as sref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.6.2/firebase-storage.js';
import { firebaseConfig } from './firebase.js';

// init firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// UI refs
const postBtn = document.getElementById('post-btn');
const contentEl = document.getElementById('post-content');
const imageEl = document.getElementById('post-image');
const postsList = document.getElementById('posts-list');
const authLink = document.getElementById('auth-link');
const logoutBtn = document.getElementById('logout-btn');

let currentUser = null;

onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user) {
    authLink.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    authLink.style.display = '';
    logoutBtn.style.display = 'none';
  }
});

logoutBtn && logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  alert('Déconnecté');
  window.location.href = 'index.html';
});

// Create post
postBtn && postBtn.addEventListener('click', async () => {
  if (!currentUser) {
    alert('Connecte-toi pour poster.');
    window.location.href = 'login.html';
    return;
  }
  const text = contentEl.value.trim();
  if (!text && imageEl.files.length === 0) {
    alert('Ajoute du texte ou une image.');
    return;
  }
  let imageUrl = null;
  if (imageEl.files.length > 0) {
    const file = imageEl.files[0];
    const storageRef = sref(storage, `posts/${currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }
  await addDoc(collection(db, 'posts'), {
    authorId: currentUser.uid,
    authorEmail: currentUser.email || null,
    content: text || null,
    imageUrl: imageUrl || null,
    createdAt: serverTimestamp()
  });
  contentEl.value = '';
  imageEl.value = '';
});

// Real-time feed
const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snap) => {
  postsList.innerHTML = '';
  snap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement('li');
    const when = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toLocaleString() : '';
    li.innerHTML = `
      <strong>${data.authorEmail ? escapeHtml(data.authorEmail) : 'Utilisateur'}</strong>
      <div class="post-meta">${when}</div>
      <p>${data.content ? escapeHtml(data.content) : ''}</p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width:420px;border-radius:8px;margin-top:8px">` : ''}
    `;
    postsList.appendChild(li);
  });
});

function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s=> ({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#39;"}[s])); }
