# Site de mariage

Site statique en français, sans serveur ni base de données, publiable tel quel sur GitHub Pages. Trois objectifs : annoncer la date, recueillir les réponses des invités (RSVP) et expliquer l'organisation de la journée.

## Fichiers

- `index.html` : la page unique (accueil avec compte à rebours, organisation, hébergement, formulaire RSVP, contact).
- `config.js` : **seul fichier à modifier** pour personnaliser le site (prénoms, date, lieu, e-mail de réception des RSVP, programme de la journée, hébergements, dress code).
- `app.js` : affichage dynamique (compte à rebours, programme, hébergements et compagnies de bateaux avec liens, carte intégrée, QR code en pied de page, lien agenda Google, génération de l'e-mail RSVP).
- `styles.css` : mise en page (style élégant ivoire/doré, responsive mobile).

## Personnaliser

Ouvrez `config.js` et remplacez les valeurs d'exemple :

- `prenom1`, `prenom2`, `date` (format ISO, ex. `2026-06-20T16:00:00+02:00`), `lieu` ;
- `emailsRsvp` : liste des adresses qui recevront les réponses (le formulaire ouvre le client mail de l'invité avec la réponse pré-remplie, en destinataires multiples) ;
- `programme` : liste des étapes de la journée (heure, titre, lieu, détail) ;
- `hebergement` (chaque entrée accepte un champ `lien` optionnel vers le site de réservation), `bateaux` (compagnies de la traversée Fouras ↔ Île-d'Aix, champ `lien`), `transport`, `lienCarte` (URL de la carte intégrée, ex. Google Maps `output=embed`), `dressCode`, `dateLimiteRsvp`.

Pour changer les couleurs, modifiez les variables CSS en haut de `styles.css` (`--ivoire`, `--or`, etc.).

## Publication sur GitHub Pages

1. Poussez ces fichiers dans un dépôt GitHub (branche `main`, dossier racine).
2. Dans le dépôt : `Settings > Pages > Source : Deploy from a branch`, branche `main`, dossier `/ (root)`.
3. Le site est en ligne à l'adresse indiquée par GitHub Pages.

## Fonctionnement du RSVP

Par défaut, l'envoi est **direct depuis le site** via le service FormSubmit (`rsvpDirect` dans `config.js`) : GitHub Pages étant statique, aucun serveur n'est nécessaire, le navigateur envoie le formulaire en POST à `rsvpDirect.endpoint` (destinataire principal) avec `rsvpDirect.copie` en copie (`_cc`), et chaque réponse arrive par e-mail sur toutes les adresses de `emailsRsvp`. **Au premier envoi, FormSubmit envoie un e-mail de confirmation à chaque adresse destinataire : il faut cliquer sur le lien reçu pour activer la livraison.** Si l'envoi direct échoue, le formulaire ouvre automatiquement le client e-mail de l'invité (mailto pré-rempli vers `emailsRsvp`).

Pour un autre service (Formspree, Google Forms…), changez `rsvpDirect.endpoint`, ou mettez `rsvpDirect.actif` à `false` pour revenir au mailto seul.
