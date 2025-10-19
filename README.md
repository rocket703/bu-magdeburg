# 💼 BU Microsite – Berufsunfähigkeitsversicherung Magdeburg

Eine moderne, responsive Onepage-Microsite für die **Berufsunfähigkeitsberatung in Magdeburg & Umgebung**.  
Ziel: Einfache, verständliche Information + direkte Kontaktaufnahme über ein DSGVO-konformes Formular (Web3Forms).

---

## 🚀 Projektüberblick

**Live-Demo:** [https://berufsunfaehigkeitsversicherung-magdeburg.de](https://berufsunfaehigkeitsversicherung-magdeburg.de)  
**Technologien:**  
- HTML5, CSS3, Vanilla JavaScript  
- Responsive Design (Mobile-first)  
- Accessibility & SEO optimiert  
- Web3Forms API für Formularversand  
- Hosting via GitHub Pages / Netlify  

---

## 🧩 Verzeichnisstruktur

/
├── assets/
│   ├── css/
│   │   └── style.css           # Hauptstylesheet
│   ├── js/
│   │   └── main.js             # Navigation & Animation-Logik
│   └── img/                    # Bilder (Hero, OG-Image etc.)
│
├── kontakt/
│   └── index.html              # Kontaktformular mit Web3Forms-Integration
│
├── impressum/
│   └── index.html              # Gesetzliche Anbieterkennzeichnung
│
├── datenschutz/
│   └── index.html              # Datenschutzinformationen
│
└── index.html                  # Hauptseite mit Hero, Info & CTA

---

## 🧠 Features

### 🎨 Design
- Modernes, reduziertes Layout mit Fokus auf Lesbarkeit
- Klare Typografie mit **Inter** & **Sora**
- Hero-Bereich mit überlagertem Hintergrundbild und Call-to-Action
- Leichte Scroll-Animationen (`.reveal`-Klassen)

### 📱 Responsive
- Mobile-first umgesetzt
- Flexible Grid-Systeme (`grid-2`, `process`, `kpi`)
- Sticky Header + Burger-Navigation

### 📬 Kontaktformular
- Realisiert über **[Web3Forms](https://web3forms.com)**
- DSGVO-konformer Versand ohne Backend
- Honeypot-Spamschutz (`.hp`-Feld)
- Asynchroner Versand via `fetch()` + Live-Statusmeldung
- Optionale Redirect-Funktion nach erfolgreicher Sendung

Beispielauszug:
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="DEIN_ACCESS_KEY">
  <input type="hidden" name="subject" value="Neue Anfrage von BU-Magdeburg.de">
  <input type="hidden" name="email" value="info@deineagentur.de">
</form>

---

## ⚙️ Lokale Entwicklung

1. Repository klonen:
   git clone https://github.com/DEINUSERNAME/bu-microsite.git

2. Öffne das Projekt im Editor deiner Wahl.
3. Starte einen lokalen Server (z. B. mit VS Code Live Server oder npx serve):
   npx serve .

4. Rufe im Browser http://localhost:3000 (oder den angegebenen Port) auf.

---

## 🧾 Rechtliches

- Impressum & Datenschutz separat gepflegt unter /impressum/ und /datenschutz/
- Inhalte gemäß § 5 TMG / DSGVO
- Alle Texte, Bilder und Markennamen © Torsten Römer / Dustin Rose

---

## 👨‍💻 Entwicklung

**Technische Umsetzung:**  
[r³webdesign](https://r3webdesign.de) – Dustin Rose  
> Fokus auf Performance, Barrierefreiheit und einfache Wartung.

---

## 📄 Lizenz

Dieses Projekt ist urheberrechtlich geschützt und **nicht zur kommerziellen Weiterverwendung** freigegeben.  
Für eigene Anpassungen oder Rebrandings bitte Rücksprache mit dem Entwickler.
