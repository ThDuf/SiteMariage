function auMoinsDeuxChiffres(n) {
  return String(n).padStart(2, "0");
}

function formatDateFrancaise(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", " h ");
  return date + " à " + heure;
}

function formatHorodatageGoogle(d) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function renseignerTextes() {
  const noms = CONFIG.prenom1 + " & " + CONFIG.prenom2;
  document.getElementById("noms-couple").innerHTML =
    CONFIG.prenom1 + ' <span class="et">&</span> ' + CONFIG.prenom2;
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
  const lienTel = document.getElementById("lien-tel");
  lienTel.textContent = CONFIG.telephone;
  lienTel.href = "tel:" + CONFIG.telephone.replace(/\s/g, "");
  document.getElementById("aide-rsvp").textContent =
    "Votre réponse est envoyée directement par e-mail à " + CONFIG.emailsRsvp.join(" et ") + ". En cas de problème, écrivez-nous à ces adresses.";
  const lienPlan = document.getElementById("lien-plan");
  lienPlan.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.lieu);
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
    const li = document.createElement("li");
    li.className = "etape";
    li.innerHTML =
      '<div class="heure">' + etape.heure + '</div>' +
      '<div class="contenu"><h3>' + etape.titre + '</h3>' +
      '<span class="lieu-etape">' + etape.lieu + '</span>' +
      '<p class="detail">' + etape.detail + '</p></div>';
    liste.appendChild(li);
  });
}

function remplirHebergement() {
  const conteneur = document.getElementById("liste-hebergement");
  CONFIG.hebergement.forEach(function (h) {
    const carte = document.createElement("article");
    carte.className = "carte";
    const titre = h.lien
      ? '<a href="' + h.lien + '" target="_blank" rel="noopener">' + h.nom + "</a>"
      : h.nom;
    carte.innerHTML = "<h3>" + titre + "</h3><p>" + h.adresse + "</p><p>" + h.info + "</p>";
    conteneur.appendChild(carte);
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
  function tick() {
    const reste = cible - Date.now();
    if (reste <= 0) {
      el.jours.textContent = "0";
      el.heures.textContent = "00";
      el.minutes.textContent = "00";
      el.secondes.textContent = "00";
      return;
    }
    el.jours.textContent = Math.floor(reste / 86400000);
    el.heures.textContent = auMoinsDeuxChiffres(Math.floor(reste / 3600000) % 24);
    el.minutes.textContent = auMoinsDeuxChiffres(Math.floor(reste / 60000) % 60);
    el.secondes.textContent = auMoinsDeuxChiffres(Math.floor(reste / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);
}

function ouvrirClientMail(sujet, lignes) {
  const url = "mailto:" + CONFIG.emailsRsvp.join(",") +
    "?subject=" + encodeURIComponent(sujet) +
    "&body=" + encodeURIComponent(lignes.join("\n"));
  window.location.href = url;
}

let dernierSujet = "";
let dernieresLignes = [];

function afficherSecoursMailto() {
  const lien = document.getElementById("lien-mailto-secours");
  if (lien) {
    lien.hidden = false;
  }
}

function envoyerRsvp(evenement) {
  evenement.preventDefault();
  const formulaire = evenement.target;
  if (!formulaire.checkValidity()) {
    formulaire.reportValidity();
    return;
  }
  const statut = document.getElementById("statut-rsvp");
  const presence = formulaire.querySelector('input[name="presence"]:checked');
  const lignes = [
    "Nom : " + formulaire.nom.value.trim(),
    "E-mail : " + formulaire.email.value.trim(),
    "Nombre de personnes : " + formulaire.nombre.value,
    "Présence : " + presence.value,
    "Allergies / régimes : " + (formulaire.restrictions.value.trim() || "—"),
    "Message : " + (formulaire.message.value.trim() || "—")
  ];
  const sujet = "RSVP mariage de " + CONFIG.prenom1 + " & " + CONFIG.prenom2 + " – " + formulaire.nom.value.trim();
  if (!CONFIG.rsvpDirect || !CONFIG.rsvpDirect.actif) {
    ouvrirClientMail(sujet, lignes);
    return;
  }
  const donnees = new FormData();
  donnees.append("nom", formulaire.nom.value.trim());
  donnees.append("email", formulaire.email.value.trim());
  donnees.append("nombre_personnes", formulaire.nombre.value);
  donnees.append("presence", presence.value);
  donnees.append("allergies_regimes", formulaire.restrictions.value.trim() || "—");
  donnees.append("message", formulaire.message.value.trim() || "—");
  donnees.append("_subject", sujet);
  donnees.append("_template", "table");
  donnees.append("_captcha", "false");
  if (CONFIG.rsvpDirect.copie) {
    donnees.append("_cc", CONFIG.rsvpDirect.copie);
  }
  dernierSujet = sujet;
  dernieresLignes = lignes;
  if (statut) {
    statut.textContent = "Envoi de votre réponse en cours…";
  }
  fetch(CONFIG.rsvpDirect.endpoint, {
    method: "POST",
    body: donnees,
    headers: { "Accept": "application/json" }
  }).then(function (reponse) {
    return reponse.text().then(function (texte) {
      let data = null;
      try {
        data = JSON.parse(texte);
      } catch (erreur) {
        data = null;
      }
      return { ok: reponse.ok, status: reponse.status, data: data };
    });
  }).then(function (resultat) {
    const data = resultat.data || {};
    const succes = resultat.ok && (data.success === true || data.success === "true");
    if (succes) {
      if (statut) {
        statut.textContent = "Merci ! Votre réponse a bien été envoyée. À très vite le 12 juin 2027 !";
      }
      formulaire.reset();
      const lien = document.getElementById("lien-mailto-secours");
      if (lien) {
        lien.hidden = true;
      }
    } else {
      const raison = data.message || data.error || ("HTTP " + resultat.status);
      if (statut) {
        statut.textContent = "Échec de l'envoi direct : " + raison + " Le formulaire n'a pas été envoyé.";
      }
      afficherSecoursMailto();
    }
  }).catch(function () {
    if (statut) {
      statut.textContent = "Envoi direct indisponible (problème réseau ou blocage du navigateur). Le formulaire n'a pas été envoyé.";
    }
    afficherSecoursMailto();
  });
}

function remplirBateaux() {
  const liste = document.getElementById("liste-bateaux");
  CONFIG.bateaux.forEach(function (b) {
    const li = document.createElement("li");
    li.innerHTML = '<a href="' + b.lien + '" target="_blank" rel="noopener">' + b.nom + "</a> — " + b.info;
    liste.appendChild(li);
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
  if (typeof QRCode !== "undefined" && cible) {
    new QRCode(cible, {
      text: window.location.origin + window.location.pathname,
      width: 140,
      height: 140,
      colorDark: "#2e2a26",
      colorLight: "#fffdf9"
    });
  }
}

function activerMenuMobile() {
  const bouton = document.getElementById("bouton-menu");
  const liens = document.getElementById("liens");
  bouton.addEventListener("click", function () {
    const ouvert = liens.classList.toggle("ouvert");
    bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
  });
  liens.addEventListener("click", function (e) {
    if (e.target.tagName === "A") liens.classList.remove("ouvert");
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
document.getElementById("formulaire-rsvp").addEventListener("submit", envoyerRsvp);
document.getElementById("lien-mailto-secours").addEventListener("click", function (e) {
  e.preventDefault();
  ouvrirClientMail(dernierSujet, dernieresLignes);
});
