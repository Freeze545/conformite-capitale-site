# Conformité Capitale

Site vitrine de Conformité Capitale, pratique de conception web de Lucas Hamel. L’entreprise est basée au Québec, Canada. Le forfait annoncé est un site clé en main à **995 $** et un entretien facultatif à **49 $ par mois**, en dollars canadiens.

Le site est statique : HTML, CSS et un peu de JavaScript, assemblés avec Vite. Aucun compte, aucun paiement, aucun serveur. Le formulaire de contact ouvre le logiciel de courriel vers `lucas@conformitecapitale.com`.

## Lancer en local

Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Le site est servi sur [http://127.0.0.1:4317](http://127.0.0.1:4317).

```bash
npm run build
npm run preview
```

`npm run build` écrit le site dans `dist/`.

## Pages

| Adresse | Contenu |
| --- | --- |
| `/` | Accueil, offre, déroulement, témoignages (provisoires), questions |
| `/services/` | Périmètre du forfait et de l’entretien |
| `/a-propos/` | Lucas Hamel |
| `/contact/` | Demande de soumission |

## Textes à tenir à jour

- Les prix `995` et `49` sont écrits dans les pages HTML et dans le pied de page (`src/partials/footer.html`).
- Les témoignages de l’accueil sont des emplacements vides. Remplacer les trois cartes de la section `#temoignages`, ou retirer la section, avant de les présenter comme de vrais avis.
- Le périmètre (une ronde de corrections, un envoi de modifications par mois) est un texte de départ. L’ajuster dans `index.html` et `services/index.html` s’il ne correspond plus à l’offre. Le forfait n’annonce pas un nombre de pages.

## Déployer sur Render

Le fichier `render.yaml` décrit un site statique : `runtime: static`, construction `npm ci --include=dev && npm run build`, publication du dossier `dist`.

1. Pousser ce dépôt sur GitHub, GitLab ou Bitbucket.
2. Dans le tableau de bord Render : **New → Blueprint**.
3. Choisir le dépôt. Render lit `render.yaml` et crée le service `conformite-capitale`.
4. Le premier déploiement fournit une adresse `*.onrender.com`. Le plan gratuit des sites statiques suffit.
5. Les aperçus de demandes de fusion sont activés (`previews.generation: automatic`).

Le nom de domaine `conformitecapitale.com` n’est pas configuré ici. Plus tard : dans le service Render, **Settings → Custom Domains**, puis les enregistrements DNS chez le registraire. Ne pas acheter le domaine depuis ce dépôt.

Les adresses sans barre oblique finale (`/services`, `/a-propos`, `/contact`) sont redirigées vers la forme avec barre oblique. Une page `404.html` est incluse dans `dist` pour les adresses inconnues ; Render l’utilise quand le fichier est à la racine du site publié.
