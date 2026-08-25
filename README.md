# Expense Tracker

A full-stack expense tracker web app built as a college placement portfolio project. Track income and expenses, view real-time balance and category breakdowns, and manage your finances with a custom dark, glowing "space" theme.

## Live Demo

- **Frontend:** https://expense-tracker-frontend-7mw7.onrender.com
- **Backend API:** https://expense-tracker-ejph.onrender.com

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 20–30 seconds to respond.

## Features

- User authentication (signup/login) with JWT and hashed passwords
- Full CRUD for expenses and income entries
- Real-time balance, income, and spending totals
- Category-wise expense breakdown
- Date range filtering
- Inline editing of existing entries
- Form validation with inline error messages
- Responsive design across desktop, tablet, and mobile
- Custom animated space-themed UI (starfield, glassmorphism, glow effects)

## Tech Stack

**Frontend**
- HTML5, CSS3 (custom animations, Grid/Flexbox, glassmorphism)
- Vanilla JavaScript (Fetch API, DOM manipulation, localStorage)
- Google Fonts (Orbitron, Space Grotesk)

**Backend**
- Node.js, Express.js (REST API)
- MongoDB Atlas with Mongoose (ODM)
- JWT for authentication
- bcryptjs for password hashing

**Deployment**
- Render (both frontend static site and backend web service)

**Related repo:** [expense-tracker-backend](https://github.com/Jatin-Setia/expense-tracker-backend)

## Running Locally

1. Clone this repo
2. Clone the [backend repo](https://github.com/Jatin-Setia/expense-tracker-backend) and follow its setup instructions
3. In `script.js` and `auth.js`, update `API_URL`/`API_BASE` to point to `http://localhost:5001` (or wherever your local backend runs)
4. Open `login.html` with a local server (e.g. VS Code's Live Server extension)

## Project Structure

├── index.html # Main dashboard
├── login.html # Login page
├── signup.html # Signup page
├── style.css # Main dashboard styles
├── auth.css # Login/signup page styles
├── script.js # Dashboard logic (CRUD, summary, filtering)
└── auth.js # Login/signup logic


## Author

Built by Jatin Setia as a placement portfolio project.