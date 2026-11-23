# Site de mariage

Site statique en français, sans serveur ni base de données, publiable tel quel sur GitHub Pages. Trois objectifs : annoncer la date, recueillir les réponses des invités (RSVP) et expliquer l'organisation de la journée.

## Fichiers

- `index.html` : la page unique (accueil avec compte à rebours, organisation, hébergement, formulaire RSVP, contact).
- `config.js` : **seul fichier à modifier** pour personnaliser le site (prénoms, date, lieu, e-mail de réception des RSVP, programme de la journée, hébergements, dress code).
- `app.js` : affichage dynamique (compte à rebours, programme, hébergements et compagnies de bateaux avec liens, carte intégrée, QR code en pied de page, lien agenda Google, génération de l'e-mail RSVP).
- `styles.css` : mise en page (style élégant ivoire/doré, responsive mobile).

## Photo d'arrière-plan de l'accueil

L'accueil affiche en arrière-plan `assets/hero-ile-d-aix.jpg` si le fichier existe (votre propre photo de l'île d'Aix), sinon une photo Wikimedia Commons de l'île en secours. Pour utiliser votre photo : placez-la dans `assets/hero-ile-d-aix.jpg` et retirez la ligne de crédit Wikimedia dans le pied de page de `index.html`.

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

Par défaut, l'envoi est **direct depuis le site** via le service FormSubmit (`rsvpDirect` dans `config.js`) : GitHub Pages étant statique, aucun serveur n'est nécessaire, le navigateur envoie le formulaire en POST à `rsvpDirect.endpoint` (destinataire principal) avec `rsvpDirect.copie` en copie (`_cc`), et chaque réponse arrive par e-mail sur toutes les adresses de `emailsRsvp`. **Au premier envoi, FormSubmit envoie un e-mail de confirmation à chaque adresse destinataire : il faut cliquer sur le lien reçu pour activer la livraison.** Si l'envoi direct échoue, la raison exacte est affichée sous le formulaire et un lien permet d'ouvrir le client e-mail de l'invité à la place (mailto pré-rempli vers `emailsRsvp`).

Pour un autre service (Formspree, Google Forms…), changez `rsvpDirect.endpoint`, ou mettez `rsvpDirect.actif` à `false` pour revenir au mailto seul.

## Enregistrer chaque RSVP dans une Google Sheet (avec compteur)

À chaque envoi du formulaire, le site poste aussi les données vers une petite application web Google Apps Script qui ajoute une ligne dans votre feuille, avec un **compteur auto-incrémenté** (colonne « Numéro » = numéro de ligne).

1. Créez une Google Sheet (ex. « Mariage RSVP »). Son ID est dans l'URL, entre `/d/` et `/edit`.
2. Dans la feuille : `Extensions > Apps Script`, collez le contenu de `gsheet-rsvp.gs`, remplacez `SHEET_ID` et `TOKEN` (inventez un secret fort), sauvegardez.
3. `Déployer > Nouveau déploiement > Application web` : exécution « en tant que moi », accès « Tout le monde ». Copiez l'URL du web app.
4. Dans `config.js` : collez cette URL dans `gsheetEndpoint` et le même secret dans `gsheetSecret`.
5. Chaque envoi ajoute dans l'onglet « RSVP » : Numéro, Date, Nom, E-mail, Nombre de personnes, Présence, Allergies / régimes, Message. Compteur global en cellule, ex. `=COUNTA(RSVP!A:A)-1`.

L'enregistrement dans la feuille est indépendant de l'e-mail : une ligne est écrite même si l'envoi direct par e-mail échoue. Le secret (`token`) empêche quiconque d'écrire dans votre feuille via l'URL publique.
