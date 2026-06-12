# Webhook Manual Setup Guide

Because webhooks rely on integrating external Google Workspace services (Google Sheets and Firebase Cloud Functions), they **cannot be completely automated by AI** and require manual setup by the developer or workspace administrator. 

Please follow these 3 exact steps to activate your real-time dashboard webhook.

## Step 1: Deploy the Firebase Cloud Function
You have a file at `functions/index.js` which contains the webhook endpoint logic that listens to Google Sheets and updates your Firestore database. This must be deployed to Google's servers.

**Important Note on Pricing:** *Firebase Cloud Functions requires your project to be on the "Blaze" pay-as-you-go pricing plan. This requires adding a billing account, but Cloud Functions includes a massive free tier (2 million invocations per month), so unless you are running a massive enterprise app, you will likely not pay anything. (This is entirely separate from a consumer Google AI Pro subscription).*

1. Open your terminal in the root of your project.
2. Navigate to the functions folder: `cd functions`
3. Log in to Firebase if you haven't already: `firebase login`
4. Deploy the function: `firebase deploy --only functions`
5. Once deployment is finished, the terminal will output a **Function URL** (it will look something like `https://us-central1-synapse-1fa13.cloudfunctions.net/onSheetUpdate`). Copy this URL.

## Step 2: Configure the Google Apps Script
Now you must tell your Google Sheet to send a ping to that URL whenever the sheet is edited.

1. Open your Jeevan Rekha Rice Bran Oil Google Sheet in your web browser.
2. In the top menu, click **Extensions > Apps Script**.
3. Clear out whatever code is there, and open the `webhook.gs` file from this repository in your code editor.
4. Paste the code from `webhook.gs` into the Apps Script editor.
5. Look at **Line 1** of the script. Replace the generic `FIREBASE_FUNCTION_URL` with the actual URL you copied in Step 1!
6. Click the **Save** icon (floppy disk) at the top.

## Step 3: Create the Automated "On Edit" Trigger
The script is saved, but Google Sheets needs permission to run it automatically when changes happen.

1. While still inside the Google Apps Script editor, look at the left sidebar menu and click on the **Triggers** icon (it looks like a small alarm clock).
2. Click the blue **+ Add Trigger** button in the bottom right corner.
3. Configure the popup settings exactly like this:
   - **Choose which function to run:** `onEdit`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `From spreadsheet`
   - **Select event type:** `On edit`
4. Click **Save**.
5. *Important:* Google will pop up an authorization warning saying "Google hasn't verified this app." Click **Advanced**, then click **Go to Untitled project (unsafe)**, and finally click **Allow**.

### You're done!
Your webhook is now fully configured. If you change a number in your spreadsheet, the trigger will fire, the Firebase Function will update the database, and the React dashboard will instantly fetch the new data without requiring a page reload.
