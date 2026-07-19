# 📚 Local Library Kiosk Logging System

A lightweight browser-based **Local Library Kiosk Logging System** built with **HTML, CSS, and Vanilla JavaScript (ES6+)**. The application replaces manual paper registers and Excel sheets with a simple digital interface for managing visitor logs efficiently.

This project was developed as part of the **ENG-22393** engineering assignment under the **Core Infrastructure Overhaul** initiative.


## 🔗 Project Links
* **Live Demo:** [https://library-sandy-nine.vercel.app]
* **GitHub Repository:** [https://github.com/mudit2838/library.git]

---

## 📖 Overview

Library staff often rely on paper registers or spreadsheets to maintain visitor records. These methods are prone to human error, data loss, and inefficient searching.

The Local Library Kiosk Logging System digitizes this workflow by providing a responsive interface for managing visitor records while remaining lightweight and fully browser-based.

---

## ✨ Features

### Visitor Management

* Add new visitor logs
* Edit existing records
* Delete visitor logs
* View all records

### Search

* Search by Visitor Name
* Search by Library Card Number
* Instant search filtering

### Data Persistence

* LocalStorage integration
* Automatically restores records after page refresh
* No backend required

### Validation

* Required field validation
* Invalid input highlighting
* Prevents incomplete submissions

### User Experience

* Responsive layout
* Loading indicator simulation
* Empty state handling
* Instant UI updates

### Security

* XSS input sanitization
* Safe rendering of user-provided data

### Accessibility

* Semantic HTML
* Keyboard navigable interface
* ARIA labels
* Accessible form controls

### Analytics Simulation

Every successful primary action logs the following message:

```text
[Analytics] User interacted with Local Library Kiosk Logging System
```

---

# 🛠 Tech Stack

| Technology                | Purpose                           |
| ------------------------- | --------------------------------- |
| HTML5                     | Application Structure             |
| CSS3                      | Styling                           |
| Vanilla JavaScript (ES6+) | Business Logic & DOM Manipulation |
| LocalStorage              | Client-side Persistence           |

---

# 📁 Project Structure

```text
library-kiosk-logging-system/

│── index.html
│── README.md

├── css/
│   ├── variables.css
│   ├── components.css
│   └── responsive.css

├── js/
│   ├── app.js
│   ├── state.js
│   ├── render.js
│   ├── events.js
│   ├── validation.js
│   ├── sanitize.js
│   ├── storage.js
│   ├── analytics.js
│   └── utils.js

├── assets/
│   ├── icons/
│   └── images/
```

---

# 🏗 Application Architecture

```text
User Interaction
        │
        ▼
 Event Listeners
        │
        ▼
 Input Validation
        │
        ▼
 XSS Sanitization
        │
        ▼
 Application State
        │
 ┌──────┴────────┐
 ▼               ▼
LocalStorage   DOM Rendering
        │
        ▼
 Analytics Logging
```

---

# 📄 Visitor Record Structure

```javascript
{
  id: 1721458462,
  visitorName: "John Doe",
  cardNumber: "LIB1025",
  phone: "9876543210",
  purpose: "Book Issue",
  checkIn: "09:30",
  checkOut: "11:15",
  notes: "Reference Section",
  createdAt: "2026-07-19T10:20:00Z"
}
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone <repository-url>
```

## Open the Project

Navigate to the project directory.

```bash
cd library-kiosk-logging-system
```

Open `index.html` directly in your browser or use any lightweight local server.

Example using VS Code Live Server:

```text
Right Click → Open with Live Server
```

---

# 🧩 Core Functionalities

* Create visitor logs
* Edit records
* Delete records
* Search logs
* LocalStorage persistence
* Input validation
* Loading state
* Empty state
* Analytics simulation
* XSS protection

---

# ⚠ Edge Cases Handled

* Empty visitor list
* Empty search results
* Missing required fields
* Invalid user input
* Malicious HTML/script injection
* Browser refresh
* LocalStorage restoration
* Simulated slow network loading

---

# ♿ Accessibility

The application follows accessibility best practices including:

* Semantic HTML
* Proper form labels
* ARIA attributes
* Keyboard navigation
* Visible focus indicators
* High contrast monochromatic interface

---

# 🔒 Security

User inputs are sanitized before being stored or rendered to prevent Cross-Site Scripting (XSS) attacks.

Examples of sanitized content include:

* `<script>`
* HTML tags
* Event handler injections
* Special characters

---

# 📊 Performance

* Lightweight implementation
* No external frameworks
* Instant client-side rendering
* Efficient DOM updates
* Local data storage
* Fast search functionality

---

# 📋 Project Requirements Coverage

| Requirement              | Status |
| ------------------------ | ------ |
| Visitor CRUD Operations  | ✅      |
| Search Functionality     | ✅      |
| LocalStorage Persistence | ✅      |
| Empty State Handling     | ✅      |
| Loading Indicator        | ✅      |
| Form Validation          | ✅      |
| XSS Sanitization         | ✅      |
| Accessibility Support    | ✅      |
| Analytics Simulation     | ✅      |
| Responsive Design        | ✅      |

---

# 🔮 Future Enhancements

* User Authentication
* Backend Integration
* Cloud Database Support
* Export to CSV/PDF
* QR Code Based Visitor Check-In
* Dashboard & Reporting
* Multi-Library Support
* Role-Based Access Control

---

# 👨‍💻 Author

**Mudit Kumar**

B.Tech Computer Science Engineering

---

# 📄 License

This project was developed as part of an engineering assessment and is intended for educational and demonstration purposes.
