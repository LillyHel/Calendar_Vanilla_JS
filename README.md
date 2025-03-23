# Dynamic Year Calendar (Vanilla JS)

This project is a fully dynamic calendar for any year, built with vanilla JavaScript, HTML, and CSS. It calculates and displays fixed and dynamic holidays in Germany and shows calendar weeks (KW). The project runs in the browser and includes a service worker for offline capability.

---

## Features

- Dynamic rendering of all 12 months for a selected year.
- Displays calendar weeks (KW).
- Shows German public holidays:
  - Fixed-date holidays (e.g., New Year's Day, Christmas).
  - Dynamic holidays (e.g., Easter, Pentecost, Ascension Day).
  - "Buß- und Bettag" (Day of Repentance and Prayer).
- Responsive design.
- Year picker and navigation buttons for browsing between years.
- Highlights the current day.
- Clickable holidays with a dropdown description.
- Offline-capable via service worker and caching.

---

## Project Structure

📁 it_beleg ├── 📄 index.html // Main HTML structure ├── 📁 styles │ └── 📄 main.css // Styling ├── 📁 script │ └── 📄 main.js // JavaScript logic for calendar generation ├── 📄 service-worker.js // Service Worker for caching and offline usage └── 📄 manifest.json // PWA Manifest file (optional, für Installierbarkeit)

---

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)
- Service Workers (for offline functionality)

---

## How It Works

- The calendar dynamically generates each month layout and calculates the days and weeks based on the selected year.
- Fixed holidays are stored in a `Map` object, dynamic holidays like Easter are calculated algorithmically.
- Clicking on a holiday reveals a dropdown description.
- Navigation:
  - Year navigation via "Next", "Previous", and a year dropdown picker.
  - Current year reset button.
- Service worker caches key assets for offline use.

---

## Demo & Deployment

This project can be hosted on GitHub Pages or any static web server.

To view the demo locally:

1. Clone the repository:

---

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)
- Service Workers (for offline functionality)

---

## How It Works

- The calendar dynamically generates each month layout and calculates the days and weeks based on the selected year.
- Fixed holidays are stored in a `Map` object, dynamic holidays like Easter are calculated algorithmically.
- Clicking on a holiday reveals a dropdown description.
- Navigation:
  - Year navigation via "Next", "Previous", and a year dropdown picker.
  - Current year reset button.
- Service worker caches key assets for offline use.

---

## Demo & Deployment

You can check out the live demo here:  
🔗 [Live Demo on GitHub Pages](https://lillyhel.github.io/Calendar_Vanilla_JS/)

Or view the repository:  
🔗 [GitHub Repository](https://github.com/LillyHel/Calendar_Vanilla_JS)

---

## How to Use

1. Open the calendar in a modern browser (Chrome, Firefox, Edge).
2. Navigate between years using the buttons or the dropdown.
3. Click on any holiday to view more information.
4. Works offline after the first load, thanks to the service worker.

---

## Possible Improvements

- Add support for holidays from other countries.
- Event creation and management.
- Dark mode / theme options.
- Export calendar as PDF or ICS file.

---

## Author

- [LillyHel](https://github.com/LillyHel)
