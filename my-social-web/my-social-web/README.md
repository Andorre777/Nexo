# My Social Web - Starter pour GitHub Pages + Firebase

Déploiement rapide sur GitHub Pages :
1. Crée un repo GitHub (public ou privé).
2. Ajoute les fichiers de ce dossier à la racine du repo.
3. Dans les *Settings* du repo -> Pages, choisis la branche `main` (ou `gh-pages`) et dossier `/ (root)` pour publier.
4. Attends quelques secondes, ton site sera dispo sur `https://<ton-user>.github.io/<ton-repo>/`.

Configuration Firebase :
- Va sur https://console.firebase.google.com et crée un projet.
- Active **Email/Password** dans Authentication → Sign-in method.
- Crée une base Firestore (mode test pour commencer, mais mets des règles dans la console).
- Active Firebase Storage (pour les images).
- Copie ta configuration Firebase (API keys) et colle-les dans `firebase.js` (remplace les placeholders).

Lancer en local :
- Tu peux ouvrir `index.html` directement dans le navigateur. Certaines fonctionnalités (upload) peuvent nécessiter un serveur local pour éviter des restrictions CORS : utilise `npx http-server` ou `python -m http.server`.

Points importants :
- Ce kit est un starter : pas de modération ni d'interface admin pour l'instant.
- Pense à configurer des règles Firestore/Storage avant de mettre en production.
- Si tu veux, je t'ajoute le script de règles Firestore & un petit admin panel ensuite.

---
By Dédé — starter kit pour apprendre et itérer rapidement.
