const FIREBASE_FUNCTION_URL = "https://us-central1-synapse-1fa13.cloudfunctions.net/onSheetUpdate"; // Update with deployed function URL

function onEdit(e) {
  if (!e) return;
  
  const spreadsheetId = e.source.getId();
  
  const payload = {
    spreadsheetId: spreadsheetId,
    timestamp: new Date().toISOString()
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(FIREBASE_FUNCTION_URL, options);
  } catch(error) {
    console.error("Error triggering webhook", error);
  }
}
