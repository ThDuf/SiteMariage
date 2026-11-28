const SHEET_ID = "VOTRE_ID_DE_FEUILLE_ICI";
const SHEET_NAME = "RSVP";
const TOKEN = "VOTRE_SECRET_ICI";

function doPost(e) {
  const p = e.parameter;
  if (p.token !== TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ success: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Numéro", "Date", "Nom", "E-mail", "Nombre de personnes", "Présence", "Allergies / régimes", "Message"]);
  }
  const numero = sheet.getLastRow();
  sheet.appendRow([
    numero,
    new Date(),
    p.nom || "",
    p.email || "",
    p.nombre_personnes || "",
    p.presence || "",
    p.allergies_regimes || "",
    p.message || ""
  ]);
  return ContentService.createTextOutput(JSON.stringify({ success: true, numero: numero }))
    .setMimeType(ContentService.MimeType.JSON);
}
