# BAIT - Project README

**BAIT** is a practical end-to-end internship hiring platform designed for companies focused on internships only. The platform connects students with amazing internship opportunities and helps recruiters find and manage talent.

## What is BAIT?

BAIT is a complete hiring workflow that actually works. It features:

### For Students
- **Easy onboarding** - Set up your profile with skills and target roles in minutes
- **Browse opportunities** - See all active internship offers
- **Smart matching** - Get a fit score for each role based on your skills and interests
- **Apply instantly** - Apply to internships with one click
- **Track status** - See where your applications stand in real-time
- **Rich profiles** - Recruiters can see your skills, roles, and background

### For Recruiters
- **Post offers** - Create internship opportunities in minutes
- **Smart sourcing** - Candidates are ranked by fit score
- **Manage pipeline** - Move candidates through statuses: pending → interview → offered/rejected
- **View profiles** - See detailed student profiles with skills and experience
- **Real-time updates** - Track applications and candidate progress

### Smart Matching
- **Skill analysis** - Compares your skills with job requirements
- **Role matching** - Matches your career interests with opportunities
- **Location awareness** - Considers location preferences
- **Fit scores** - 0-100 scores show how well you match each role
- **Color-coded** - Visual indicators (Poor/Fair/Good/Excellent)

## Live Demo

The platform comes pre-loaded with:
- 5 demo student profiles
- 3 demo recruiting organizations  
- 6 internship offers across different roles
- Full end-to-end workflow

You can test both sides:
- Sign up as a student and apply to offers
- Create a recruiter account and manage applications
- See statuses update in real-time

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase (Authentication, Firestore, Cloud Storage)
- **Hosting**: Static site (Firebase Hosting compatible)
- **Real-time**: Firestore real-time listeners
- **Storage**: Cloud Storage for CV files

## Project Files

```
/Common/
├── index.html              # Entry point
├── SETUP.md               # Setup instructions
├── README.md              # This file
├── styles/
│   └── main.css          # All styling
├── html/                 # Page templates
├── js/                   # Application logic
│   ├── config.js         # Firebase config
│   ├── auth.js           # Auth management
│   ├── router.js         # Page routing
│   ├── app.js            # App init
│   ├── pages/            # Page logic
│   ├── services/         # Data services
│   └── utils/            # Utilities
└── data/                 # Demo data
```

## Getting Started

### 1. Update Firebase Config
Open `js/config.js` and add your Firebase credentials:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};
```

### 2. Set Up Firestore
1. Create Firestore database in Firebase Console
2. Add the security rules from SETUP.md
3. Create Cloud Storage bucket for CVs

### 3. Run the Server
```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser

### 4. Test It Out
- Sign up as a student
- Browse and apply to offers
- Create a recruiter account
- Post offers and review applications

## Key Features

### Student Workflow
1. Sign up and create student profile
2. Add skills and target internship roles
3. Upload CV (optional)
4. Browse active offers
5. See fit score for each role
6. Apply to opportunities
7. Track application status

### Recruiter Workflow
1. Sign up and create recruiter profile
2. Create internship offers
3. View applications sorted by fit score
4. Click to see detailed student profiles
5. Move candidates through statuses
6. Accept or reject candidates

## The Fit Score

Our smart matching algorithm considers:
- **Skill match** - How many required skills you have
- **Role match** - How well your interests align
- **Location** - Geographic fit (or remote availability)

Scores:
- 85-100%: Excellent match
- 70-84%: Good match
- 50-69%: Fair match
- Below 50%: Poor match

## Data Privacy & Security

- Student profiles are private (only recruiters who view them can see details)
- Recruiters can only edit their own offers
- Applications are private to student and recruiter
- All data is encrypted in transit and at rest
- Firebase handles secure authentication

## Architecture

### Authentication (`js/auth.js`)
- Firebase Email/Password authentication
- Auto-login on page load
- Session persistence
- Profile loading on auth

### Routing (`js/router.js`)
- Client-side routing without page reloads
- Protected routes (require login)
- Dynamic page loading and script execution

### Services
- **OffersService** - CRUD operations for internship offers
- **ApplicationsService** - Application management and tracking
- **FitScoreCalculator** - Smart matching algorithm

### Database Schema
- **users** - Student and recruiter profiles
- **offers** - Internship listings
- **applications** - Applications linking students to offers

## Extensibility

The platform is built to scale:
- Switch from demo data to real company data seamlessly
- Hooks for email notifications on applications
- Ready for real CV uploads
- Built for multi-company recruiting
- Real-time updates via Firestore listeners

## Next Steps

1. **Set up Firebase** (see SETUP.md)
2. **Configure credentials** in `js/config.js`
3. **Run the server** and test workflows
4. **(Optional) Load demo data** using `data/seedLoader.js`
5. **Deploy** to Firebase Hosting or any static host

## Building a Real Version

The architecture supports real data out of the box:
- Connect to real company databases
- Add company logo/branding
- Enable email notifications
- Add more application statuses
- Integrate with payroll for stipends
- Add calendar for interview scheduling

## Troubleshooting

**Problem**: "Firebase config not found"
- Solution: Update `js/config.js` with your credentials

**Problem**: Applications not saving
- Solution: Check Firestore security rules and Firebase permissions

**Problem**: Can't upload CV
- Solution: Verify Cloud Storage bucket and rules are set up

See SETUP.md for full troubleshooting guide.

---

**BAIT** - Practical hiring for internships. Build it once, hire forever. 🚀
