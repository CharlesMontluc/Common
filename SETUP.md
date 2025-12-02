# BAIT - Internship Hiring Platform Setup Guide

## Quick Start

### 1. Firebase Setup
You've already done Firebase login. Now you need to configure the Firebase project credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Copy your Firebase config object
5. Update `js/config.js` with your credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2. Database Setup in Firebase Console

Go to **Firestore Database** and create a new database:
- Start in production mode
- Location: nearest to you
- Click **Create**

Then set these Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    
    // Offers collection
    match /offers/{offerId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.recruiterId;
      allow create: if request.auth != null && request.resource.data.recruiterId == request.auth.uid;
    }
    
    // Applications collection
    match /applications/{appId} {
      allow read: if request.auth.uid == resource.data.studentId || request.auth.uid == resource.data.recruiterId;
      allow create: if request.auth.uid == request.resource.data.studentId;
      allow update: if request.auth.uid == resource.data.recruiterId;
    }
  }
}
```

### 3. Storage Setup for CVs

Go to **Cloud Storage**:
- Create a bucket (use defaults)
- Set security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cvs/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId || 
                     request.auth.uid == request.path.param('userId');
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 4. Running the Application

```bash
cd /Users/charlesmontluc/Common/Common
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Testing the Application

### As a Student:
1. Click "Sign Up"
2. Create an account (e.g., alice@example.com)
3. Choose "I'm a Student"
4. Fill in your profile (name, skills, target roles)
5. View internship offers from the dashboard
6. Apply to offers and track applications

### As a Recruiter:
1. Click "Sign Up"
2. Create an account (e.g., recruiter@company.com)
3. Choose "I'm a Recruiter"
4. Fill in your company information
5. Create internship offers
6. View applications and manage candidates

## Project Structure

```
/Users/charlesmontluc/Common/Common/
├── index.html                 # Main entry point
├── package.json              # Dependencies
├── styles/
│   └── main.css             # All styling
├── html/                     # HTML pages
│   ├── landing.html
│   ├── login.html
│   ├── signup.html
│   ├── onboarding.html
│   ├── student-dashboard.html
│   ├── student-applications.html
│   ├── student-offer-detail.html
│   ├── student-profile.html
│   ├── recruiter-dashboard.html
│   ├── recruiter-offers.html
│   ├── recruiter-offer-new.html
│   ├── recruiter-offer-edit.html
│   ├── recruiter-applicants.html
│   └── recruiter-student-profile.html
├── js/
│   ├── config.js            # Firebase configuration
│   ├── auth.js              # Authentication logic
│   ├── router.js            # Page routing
│   ├── app.js               # App initialization
│   ├── pages/               # Page logic
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── onboarding.js
│   │   ├── student-dashboard.js
│   │   ├── student-applications.js
│   │   ├── student-offer-detail.js
│   │   ├── student-profile.js
│   │   ├── recruiter-dashboard.js
│   │   ├── recruiter-offers.js
│   │   ├── recruiter-offer-new.js
│   │   ├── recruiter-offer-edit.js
│   │   ├── recruiter-applicants.js
│   │   └── recruiter-student-profile.js
│   ├── services/            # Data services
│   │   ├── offers.js        # Offer management
│   │   └── applications.js  # Application management
│   └── utils/
│       └── fitScore.js      # AI-style matching algorithm
└── data/
    ├── seedData.js          # Demo data structure
    └── seedLoader.js        # Load demo data
```

## Features

### Student Features
- ✓ Sign up and create profile
- ✓ Upload CV
- ✓ Browse internship offers
- ✓ Apply to offers
- ✓ Track application status
- ✓ View fit scores (how well you match each role)
- ✓ See detailed offer information

### Recruiter Features
- ✓ Sign up and create company profile
- ✓ Create internship offers
- ✓ Edit and delete offers
- ✓ View all applications per offer
- ✓ See rich student profiles
- ✓ Move candidates through statuses (pending → interview → offered/rejected)
- ✓ View fit scores showing how well candidates match
- ✓ Sort candidates by fit score

### Smart Matching
- Analyzes student skills vs. required skills
- Matches target roles with job descriptions
- Considers location preferences
- Assigns fit scores from 0-100%
- Color-coded fit ratings (Poor, Fair, Good, Excellent)

## Data Model

### Users Collection
```javascript
{
  uid: string,
  email: string,
  name: string,
  userType: 'student' | 'recruiter',
  role: string,
  location: string,
  
  // Student fields
  skills: [string],
  targetRoles: [string],
  cvPath: string, // Path to CV in storage
  
  // Recruiter fields
  company: string,
  
  profileComplete: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Offers Collection
```javascript
{
  id: string,
  title: string,
  recruiterId: string,
  recruiterName: string,
  recruiterCompany: string,
  role: string,
  location: string,
  duration: string,
  stipend: string,
  description: string,
  requiredSkills: [string],
  responsibilities: [string],
  requirements: [string],
  applicantCount: number,
  status: 'active' | 'archived',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Applications Collection
```javascript
{
  applicationId: string,
  offerId: string,
  studentId: string,
  recruiterId: string,
  status: 'pending' | 'interview' | 'offered' | 'rejected',
  fitScore: number (0-100),
  appliedAt: timestamp,
  updatedAt: timestamp
}
```

## Fit Score Algorithm

The fit score is calculated based on:

1. **Skill Match (40 points)**
   - Compares student skills with required skills
   - Partial matches count
   - Score: (matched skills / total required skills) × 40

2. **Role Match (40 points)**
   - Checks if student's target roles match the job role
   - Full 40 points if there's a match

3. **Location Match (20 points)**
   - 20 points for exact location match
   - 10 points if job is remote or location matches partially
   - 0 points if no match

**Total Score = Base 50 + Skill Match + Role Match + Location Match**

## Next Steps

1. Update Firebase config in `js/config.js`
2. Set up Firestore database and security rules
3. Set up Cloud Storage for CVs
4. Run the server and test the application
5. (Optional) Load seed data using `data/seedLoader.js`

## Demo Workflow

### Step 1: Create Student Account
- Sign up as alice@example.com
- Select "I'm a Student"
- Add skills like "JavaScript, React, Python"
- Add target roles like "Frontend Engineer, Full Stack Engineer"

### Step 2: Create Recruiter Account
- Sign up as recruiter@example.com
- Select "I'm a Recruiter"
- Add company name

### Step 3: Create Internship Offer
- Go to recruiter dashboard
- Click "Create New Offer"
- Add details like title, location, requirements

### Step 4: Apply as Student
- Go to student dashboard
- Browse offers
- See your fit score
- Click "Apply Now"

### Step 5: Review Applications as Recruiter
- Go to recruiter dashboard
- See applicants sorted by fit score
- Move candidates through statuses
- View detailed student profiles

## Customization

### Change Colors
Edit `styles/main.css`:
```css
:root {
    --primary: #2563eb;        /* Main blue */
    --secondary: #10b981;      /* Green */
    --danger: #ef4444;         /* Red */
    /* ... more colors ... */
}
```

### Add More Offers
Edit `data/seedData.js` and add to the `offers` array, then run `loadSeedData()`

### Modify Fit Score Algorithm
Edit `js/utils/fitScore.js` to adjust scoring weights

## Troubleshooting

### "Firebase config not found"
- Make sure you've updated `js/config.js` with your Firebase credentials

### Applications not saving
- Check Firestore security rules
- Make sure you're logged in
- Check browser console for errors

### Images/files not uploading
- Verify Cloud Storage bucket exists
- Check storage security rules
- Make sure authentication works first

## Support

For issues:
1. Check browser console for errors (F12)
2. Check Firestore database to see if data is being saved
3. Verify Firebase config and security rules
4. Make sure authentication is working

Good luck with BAIT! 🚀
