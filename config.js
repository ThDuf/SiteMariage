const CONFIG = {
  prenom1: "Adèle",
  prenom2: "Thibault",
  date: "2027-06-12T16:00:00+02:00",
  lieu: "Île-d'Aix, 17123 Charente-Maritime",
  emailsRsvp: ["dufresne.thibault@gmail.com", "adele.et.thibault@gmail.com"],
  rsvpDirect: {
    actif: true,
    endpoint: "https://formsubmit.co/ajax/dufresne.thibault@gmail.com",
    copie: "adele.et.thibault@gmail.com"
  },
  gsheetEndpoint: "",
  gsheetSecret: "",
  telephone: "+33 6 12 34 56 78",
  dateLimiteRsvp: "30 avril 2027",
  dressCode: "Tenue de cérémonie. Le blanc et le doré sont réservés aux mariés.",
  programme: [
    { heure: "15 h 30", titre: "Accueil des invités", lieu: "Château de la Vallée", detail: "Merci d'arriver 30 minutes avant le début de la cérémonie." },
    { heure: "16 h 00", titre: "Cérémonie civile", lieu: "Mairie du 11e arrondissement", detail: "Salle des mariages. Merci de vous munir d'une pièce d'identité." },
    { heure: "17 h 30", titre: "Cocktail de bienvenue", lieu: "Les jardins du château", detail: "Vin d'honneur, photos de groupe et jeux de pelouse." },
    { heure: "20 h 00", titre: "Dîner de fête", lieu: "L'orangerie du château", detail: "Menu servi à table, avec options végétariennes sur demande." },
    { heure: "23 h 00", titre: "Soirée dansante", lieu: "L'orangerie du château", detail: "Jusqu'au bout de la nuit, avec gâteau de minuit." }
  ],
  hebergement: [
    { nom: "La maison familiale", adresse: "Île-d'Aix — adresse transmise avec l'invitation", info: "Chambres disponibles chez la famille d'Adèle & Thibault — écrivez-nous pour réserver la vôtre.", lien: "" },
    { nom: "Hôtel Napoléon", adresse: "Rue Gourgaud, Île-d'Aix, 17123", info: "18 chambres au cœur du village, bloc réservé au nom du mariage. Aucun véhicule sur l'île : parking réservé au port de Fouras.", lien: "https://hotel-ile-aix.com/" },
    { nom: "Logements Chaudet", adresse: "Île-d'Aix", info: "Logements meublés réservés pour les invités du mariage — lien à compléter.", lien: "" },
    { nom: "Pierre & Vacances — Le Fort de la Rade", adresse: "Île-d'Aix, à 300 m de l'embarcadère", info: "Appartements et maisons dans l'enceinte fortifiée, piscine en saison. Meilleur prix garanti sur le site officiel.", lien: "https://www.pierreetvacances.com/fr-fr/fp_IXF_location-residence-le-fort-de-la-rade" }
  ],
  transport: "L'île d'Aix est entièrement piétonne : aucun véhicule motorisé n'est autorisé sur l'île. Garez votre voiture au parking du port de Fouras (pointe de la Fumée), puis prenez le bateau pour la traversée (environ 20 minutes).",
  bateaux: [
    { nom: "Inter Îles", info: "Liaisons maritimes Fouras ↔ Île d'Aix, et croisières depuis La Rochelle vers l'île d'Aix et Fort Boyard.", lien: "https://www.inter-iles.com/" },
    { nom: "Navipromer", info: "Liaisons et croisières vers l'île d'Aix et Fort Boyard au départ de Fouras.", lien: "https://www.navipromer.com/" }
  ],
  lienCarte: "https://www.google.com/maps?q=%C3%8Ele-d%27Aix%2C+17123+Charente-Maritime&z=14&output=embed",
  organisateurs: "Pour toute question, écrivez-nous ou appelez-nous, nous vous répondrons avec plaisir."
};
