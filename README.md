# Site de mariage

Site statique en français, sans serveur ni base de données, publiable tel quel sur GitHub Pages. Trois objectifs : annoncer la date, recueillir les réponses des invités (RSVP) et expliquer l'organisation de la journée.

## Fichiers

- `index.html` : la page unique (accueil avec compte à rebours, organisation, hébergement, formulaire RSVP, contact).
- `config.js` : **seul fichier à modifier** pour personnaliser le site (prénoms, date, lieu, e-mail de réception des RSVP, programme de la journée, hébergements, dress code).
- `app.js` : affichage dynamique (compte à rebours, programme, lien agenda Google, génération de l'e-mail RSVP).
- `styles.css` : mise en page (style élégant ivoire/doré, responsive mobile).

## Personnaliser

Ouvrez `config.js` et remplacez les valeurs d'exemple :

- `prenom1`, `prenom2`, `date` (format ISO, ex. `2026-06-20T16:00:00+02:00`), `lieu` ;
- `emailRsvp` : adresse qui recevra les réponses (le formulaire ouvre le client mail de l'invité avec la réponse pré-remplie) ;
- `programme` : liste des étapes de la journée (heure, titre, lieu, détail) ;
- `hebergement` (chaque entrée accepte un champ `lien` optionnel vers le site de réservation), `transport`, `dressCode`, `dateLimiteRsvp`.

Pour changer les couleurs, modifiez les variables CSS en haut de `styles.css` (`--ivoire`, `--or`, etc.).

## Publication sur GitHub Pages

1. Poussez ces fichiers dans un dépôt GitHub (branche `main`, dossier racine).
2. Dans le dépôt : `Settings > Pages > Source : Deploy from a branch`, branche `main`, dossier `/ (root)`.
3. Le site est en ligne à l'adresse indiquée par GitHub Pages.

## Fonctionnement du RSVP

Le formulaire ne stocke rien : à l'envoi, il ouvre le client e-mail de l'invité avec un message pré-rempli adressé à `emailRsvp`. Pour un formulaire hébergé (Google Forms, Formspree…), remplacez la section `#rsvp` de `index.html` par un lien ou un intégration (`<iframe>`) vers votre formulaire.
