# Campus Event Registration Midterm Project

## Project idea
A simple campus event registration website. A user enters their information and receives a PDF confirmation by email.

## Requirements covered
1. Frontend: registration form with name, email, date, city, and number of attendees.
2. External API: Open-Meteo is used to get the event weather and display it on the page.
3. Backend: Google Apps Script receives the registration, creates a Google Doc, converts it to PDF, and emails the PDF to the user's email.
4. Deployment: frontend can be hosted on Netlify or Vercel; backend is deployed as a Google Apps Script Web App.
5. GitHub: upload index.html, style.css, script.js, and Code.gs.

## Setup
### A. Google Apps Script
1. Open Google Apps Script.
2. Create a new project.
3. Paste Code.gs into the editor.
4. Click Deploy > New deployment.
5. Select Web app.
6. Set Execute as: Me.
7. Set Who has access: Anyone.
8. Deploy and authorize the requested permissions.
9. Copy the Web App URL.

### B. Frontend
Open script.js and replace:
PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE

with your actual Apps Script Web App URL.

### C. Test
1. Open the website.
2. Enter your name and email.
3. Choose an event date and city.
4. Click Check Event Weather.
5. Click Confirm Registration.
6. Check the email inbox for the PDF.

## Important note
The sample frontend uses `mode: "no-cors"` when sending the POST request. This is useful for avoiding a browser CORS preflight with a Google Apps Script Web App. Because no-cors responses cannot be read by the browser, the page cannot inspect the server response. For the project report, document the CORS/permission issue if you encounter it during deployment.

## Project report outline
Use these headings:
1. Project Theme
2. Data Process Flow
3. Troubleshooting Log

For the troubleshooting log, write only problems that you actually encountered. The following are examples, not claims about your actual development:
- Apps Script authorization prompt appeared during deployment.
- Web App URL was missing from script.js.
- Weather API returned no city because the city name was invalid.
- Browser showed a CORS issue when the backend was called.
- Email was not received because the Apps Script authorization/deployment settings were not completed.

## Data flow
User -> Frontend Form -> Open-Meteo API -> Weather displayed -> Google Apps Script Web App -> Google Doc -> PDF -> Email to user
