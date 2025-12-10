// This code connects Google Form to your website
// You need to set up Google Apps Script (free)

// Instructions:
// 1. Go to script.google.com
// 2. Create new project
// 3. Paste the code below
// 4. Deploy as web app
// 5. Use the URL in your website

function doGet() {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const results = {
    lastUpdated: new Date().toISOString(),
    predictions: []
  };
  
  // Process data here...
  
  return ContentService
    .createTextOutput(JSON.stringify(results))
    .setMimeType(ContentService.MimeType.JSON);
                 }
