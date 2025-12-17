# Exemple : Pages Portrait & Landscape

But: fournir un exemple autonome pour tester `@page` et orientations mixtes.

Fichiers créés:
- `index.html` — page d'exemple
- `css/style.css` — règles `@page` + classes `.section-portrait` / `.section-landscape`

Test rapide:
1. Ouvrez `exemple/index.html` dans votre navigateur.
2. Ouvrez l'aperçu d'impression (Ctrl+P).
3. Vérifiez que la page 1 est en portrait, la page 2 en paysage, la page 3 en portrait.

Remarques:
- Le support des pages nommées (`page: <name>`) varie selon les navigateurs.
- Pour un rendu fiable en production, testez la sortie PDF ou utilisez `paged.js` / PrinceXML.

Si vous voulez, j'intègre `paged.js` pour un rendu plus prévisible en navigateur et j'ajoute un petit script d'initialisation.