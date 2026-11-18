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
  lienEmail.textContent = CONFIG.emailRsvp;
  lienEmail.href = "mailto:" + CONFIG.emailRsvp;
  const lienTel = document.getElementById("lien-tel");
  lienTel.textContent = CONFIG.telephone;
  lienTel.href = "tel:" + CONFIG.telephone.replace(/\s/g, "");
  document.getElementById("aide-rsvp").textContent =
    "Si votre client e-mail ne s'ouvre pas, écrivez-nous directement à " + CONFIG.emailRsvp + ".";
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

function envoyerRsvp(evenement) {
  evenement.preventDefault();
  const formulaire = evenement.target;
  if (!formulaire.checkValidity()) {
    formulaire.reportValidity();
    return;
  }
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
  const url = "mailto:" + CONFIG.emailRsvp +
    "?subject=" + encodeURIComponent(sujet) +
    "&body=" + encodeURIComponent(lignes.join("\n"));
  window.location.href = url;
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
lancerCompteARebours();
activerMenuMobile();
document.getElementById("formulaire-rsvp").addEventListener("submit", envoyerRsvp);
