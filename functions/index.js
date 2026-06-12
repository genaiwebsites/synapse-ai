const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.onSheetUpdate = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { spreadsheetId } = req.body;
  if (!spreadsheetId) {
    return res.status(400).send("Missing spreadsheetId");
  }

  try {
    const db = admin.firestore();
    const docRef = db.collection("dashboards").doc("jeevan_rekha").collection("sync_metadata").doc("latest");
    
    await docRef.set({
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      spreadsheetId: spreadsheetId
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error updating Firestore:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
