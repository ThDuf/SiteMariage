// Fuseau horaire du mariage : les dates et heures s'affichent toujours à l'heure française,
// même pour un invité qui consulte le site depuis l'étranger.
const FUSEAU = "Europe/Paris";

function auMoinsDeuxChiffres(n) {
  return String(n).padStart(2, "0");
}

function formatJourFrancais(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: FUSEAU
  });
}

function formatDateFrancaise(iso) {
  const heure = new Date(iso)
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: FUSEAU })
    .replace(":", " h ");
  return formatJourFrancais(iso) + " à " + heure;
}

function formatHorodatageGoogle(d) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// Crée un élément avec une classe et un texte (le texte n'est jamais interprété comme du HTML).
function creer(balise, classe, texte) {
  const el = document.createElement(balise);
  if (classe) el.className = classe;
  if (texte !== undefined && texte !== null) el.textContent = texte;
  return el;
}

function creerLienExterne(href, texte) {
  const a = creer("a", null, texte);
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

function renseignerTextes() {
  const noms = CONFIG.prenom1 + " & " + CONFIG.prenom2;
  const titre = document.getElementById("noms-couple");
  titre.textContent = "";
  titre.append(CONFIG.prenom1 + " ", creer("span", "et", "&"), " " + CONFIG.prenom2);
  document.getElementById("date-affichee").textContent = formatDateFrancaise(CONFIG.date);
  document.getElementById("lieu-affiche").textContent = CONFIG.lieu;
  document.getElementById("date-limite").textContent = CONFIG.dateLimiteRsvp;
  document.getElementById("texte-transport").textContent = CONFIG.transport;
  document.getElementById("texte-dresscode").textContent = CONFIG.dressCode;
  document.getElementById("texte-organisateurs").textContent = CONFIG.organisateurs;
  document.getElementById("pied-noms").textContent = "Le mariage de " + noms;
  document.title = noms + " se marient";

  const lienEmail = document.getElementById("lien-email");
  lienEmail.textContent = CONFIG.emailsRsvp.join(", ");
  lienEmail.href = "mailto:" + CONFIG.emailsRsvp.join(",");

  const ligneTel = document.getElementById("ligne-tel");
  if (CONFIG.telephone) {
    const lienTel = document.getElementById("lien-tel");
    lienTel.textContent = CONFIG.telephone;
    lienTel.href = "tel:" + CONFIG.telephone.replace(/\s/g, "");
  } else if (ligneTel) {
    ligneTel.remove();
  }

  document.getElementById("aide-rsvp").textContent =
    "Votre réponse est envoyée directement par e-mail à " + CONFIG.emailsRsvp.join(" et ") +
    ". En cas de problème, écrivez-nous à ces adresses.";

  document.getElementById("lien-plan").href =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.lieu);

  const debut = new Date(CONFIG.date);
  const fin = new Date(debut.getTime() + 8 * 3600 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Mariage de " + noms,
    dates: formatHorodatageGoogle(debut) + "/" + formatHorodatageGoogle(fin),
    details: "Cérémonie puis réception. Merci de confirmer votre présence sur le site du mariage.",
    location: CONFIG.lieu
  });
  document.getElementById("lien-calendrier").href =
    "https://calendar.google.com/calendar/render?" + params.toString();
}

function remplirProgramme() {
  const liste = document.getElementById("liste-programme");
  CONFIG.programme.forEach(function (etape) {
    const li = creer("li", "etape");
    const contenu = creer("div", "contenu");
    contenu.append(
      creer("h3", null, etape.titre),
      creer("span", "lieu-etape", etape.lieu),
      creer("p", "detail", etape.detail)
    );
    li.append(creer("div", "heure", etape.heure), contenu);
    liste.appendChild(li);
  });
}

function remplirHebergement() {
  const conteneur = document.getElementById("liste-hebergement");
  CONFIG.hebergement.forEach(function (h) {
    const carte = creer("article", "carte");
    const titre = creer("h3");
    titre.appendChild(h.lien ? creerLienExterne(h.lien, h.nom) : document.createTextNode(h.nom));
    carte.append(titre, creer("p", null, h.adresse), creer("p", null, h.info));
    conteneur.appendChild(carte);
  });
}

function remplirBateaux() {
  const liste = document.getElementById("liste-bateaux");
  CONFIG.bateaux.forEach(function (b) {
    const li = creer("li");
    li.append(b.lien ? creerLienExterne(b.lien, b.nom) : b.nom, " — " + b.info);
    liste.appendChild(li);
  });
}

function lancerCompteARebours() {
  const cible = new Date(CONFIG.date).getTime();
  const el = {
    jours: document.getElementById("cb-jours"),
    heures: document.getElementById("cb-heures"),
    minutes: document.getElementById("cb-minutes"),
    secondes: document.getElementById("cb-secondes")
  };
  let minuterie = null;
  function tick() {
    const reste = Math.max(0, cible - Date.now());
    el.jours.textContent = Math.floor(reste / 86400000);
    el.heures.textContent = auMoinsDeuxChiffres(Math.floor(reste / 3600000) % 24);
    el.minutes.textContent = auMoinsDeuxChiffres(Math.floor(reste / 60000) % 60);
    el.secondes.textContent = auMoinsDeuxChiffres(Math.floor(reste / 1000) % 60);
    if (reste === 0 && minuterie !== null) {
      clearInterval(minuterie);
    }
  }
  tick();
  if (cible > Date.now()) {
    minuterie = setInterval(tick, 1000);
  }
}

function ouvrirClientMail(sujet, lignes) {
  window.location.href = "mailto:" + CONFIG.emailsRsvp.join(",") +
    "?subject=" + encodeURIComponent(sujet) +
    "&body=" + encodeURIComponent(lignes.join("\n"));
}

// Si l'invité répond « Non », le nombre de personnes n'a pas de sens : on désactive le champ.
function gererPresence() {
  const formulaire = document.getElementById("formulaire-rsvp");
  const nombre = formulaire.nombre;
  formulaire.querySelectorAll('input[name="presence"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      const absent = formulaire.querySelector('input[name="presence"]:checked').value === "non";
      nombre.disabled = absent;
      if (!absent && !nombre.value) nombre.value = 1;
    });
  });
  formulaire.addEventListener("reset", function () {
    nombre.disabled = false;
  });
}

function envoyerRsvp(evenement) {
  evenement.preventDefault();
  const formulaire = evenement.target;
  if (!formulaire.checkValidity()) {
    formulaire.reportValidity();
    return;
  }
  const statut = document.getElementById("statut-rsvp");
  const bouton = document.getElementById("bouton-envoyer");

  // Pot de miel anti-robots : un humain ne voit pas ce champ et le laisse vide.
  if (formulaire._honey && formulaire._honey.value) {
    statut.textContent = "Merci ! Votre réponse a bien été envoyée.";
    formulaire.reset();
    return;
  }

  const presence = formulaire.querySelector('input[name="presence"]:checked').value;
  const nombrePersonnes = presence === "non" ? "0" : formulaire.nombre.value;
  const champs = {
    nom: formulaire.nom.value.trim(),
    email: formulaire.email.value.trim(),
    nombre_personnes: nombrePersonnes,
    presence: presence,
    allergies_regimes: formulaire.restrictions.value.trim() || "—",
    message: formulaire.message.value.trim() || "—"
  };
  const lignes = [
    "Nom : " + champs.nom,
    "E-mail : " + champs.email,
    "Nombre de personnes : " + champs.nombre_personnes,
    "Présence : " + champs.presence,
    "Allergies / régimes : " + champs.allergies_regimes,
    "Message : " + champs.message
  ];
  const sujet = "RSVP mariage de " + CONFIG.prenom1 + " & " + CONFIG.prenom2 + " – " + champs.nom;

  if (!CONFIG.rsvpDirect || !CONFIG.rsvpDirect.actif) {
    ouvrirClientMail(sujet, lignes);
    return;
  }

  const donnees = new FormData();
  Object.keys(champs).forEach(function (cle) {
    donnees.append(cle, champs[cle]);
  });
  donnees.append("_subject", sujet);
  donnees.append("_template", "table");
  donnees.append("_captcha", "false"); // le captcha n'est pas disponible en envoi AJAX
  donnees.append("_honey", "");
  donnees.append("_replyto", champs.email);
  if (CONFIG.rsvpDirect.copie) {
    donnees.append("_cc", CONFIG.rsvpDirect.copie);
  }

  bouton.disabled = true;
  statut.textContent = "Envoi de votre réponse en cours…";

  fetch(CONFIG.rsvpDirect.endpoint, {
    method: "POST",
    body: donnees,
    headers: { "Accept": "application/json" }
  }).then(function (reponse) {
    return reponse.json().then(function (data) {
      return { ok: reponse.ok, data: data };
    });
  }).then(function (resultat) {
    const succes = resultat.ok && resultat.data &&
      (resultat.data.success === true || resultat.data.success === "true");
    if (succes) {
      statut.textContent = presence === "non"
        ? "Merci pour votre réponse, vous nous manquerez !"
        : "Merci ! Votre réponse a bien été envoyée. À très vite le " + formatJourFrancais(CONFIG.date) + " !";
      formulaire.reset();
    } else {
      const detail = resultat.data && resultat.data.message ? " — " + resultat.data.message : "";
      statut.textContent = "L'envoi direct a échoué" + detail + ". On ouvre votre client e-mail à la place.";
      ouvrirClientMail(sujet, lignes);
    }
  }).catch(function () {
    statut.textContent = "Envoi direct indisponible — on ouvre votre client e-mail à la place.";
    ouvrirClientMail(sujet, lignes);
  }).finally(function () {
    bouton.disabled = false;
  });
}

function chargerCarte() {
  const iframe = document.getElementById("iframe-carte");
  if (iframe && CONFIG.lienCarte) {
    iframe.src = CONFIG.lienCarte;
  }
}

function genererQrCode() {
  const cible = document.getElementById("qrcode");
  if (typeof QRCode === "undefined" || !cible || !/^https?:$/.test(window.location.protocol)) {
    const bloc = cible && cible.closest(".qrcode-bloc");
    if (bloc) bloc.hidden = true;
    return;
  }
  new QRCode(cible, {
    text: window.location.origin + window.location.pathname,
    width: 140,
    height: 140,
    colorDark: "#2e2a26",
    colorLight: "#fffdf9"
  });
}

function activerMenuMobile() {
  const bouton = document.getElementById("bouton-menu");
  const liens = document.getElementById("liens");
  function fermer() {
    liens.classList.remove("ouvert");
    bouton.setAttribute("aria-expanded", "false");
  }
  bouton.addEventListener("click", function () {
    const ouvert = liens.classList.toggle("ouvert");
    bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
  });
  liens.addEventListener("click", function (e) {
    if (e.target.tagName === "A") fermer();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermer();
  });
}

renseignerTextes();
remplirProgramme();
remplirHebergement();
remplirBateaux();
chargerCarte();
genererQrCode();
lancerCompteARebours();
activerMenuMobile();
gererPresence();
document.getElementById("formulaire-rsvp").addEventListener("submit", envoyerRsvp);
