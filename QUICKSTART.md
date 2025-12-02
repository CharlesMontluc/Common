# BAIT Quick Start Checklist

## ✅ What's Already Done

- [x] Project structure created
- [x] Firebase authentication system
- [x] Complete routing system (client-side)
- [x] Student onboarding flow
- [x] Recruiter onboarding flow
- [x] Student dashboard (browse offers)
- [x] Student applications tracker
- [x] Student profile page
- [x] Recruiter dashboard (overview stats)
- [x] Create internship offers
- [x] Edit/delete internship offers
- [x] View applicants per offer
- [x] Recruiter student profile viewer
- [x] Smart fit scoring algorithm (skills + roles + location)
- [x] Status management (pending → interview → offered/rejected)
- [x] Professional CSS styling
- [x] Responsive design
- [x] Demo data structure with 5 students, 3 companies, 6 offers
- [x] Complete documentation

---

## 🔧 What You Need to Do (5 Minutes)

### Step 1: Get Your Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click your project
3. Click gear icon → Project Settings
4. Under "Your apps", find your web app
5. Copy the Firebase config object

### Step 2: Update js/config.js
Open `/Users/charlesmontluc/Common/Common/js/config.js` and replace:

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

### Step 3: Set Up Firestore
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose your region
5. Go to Rules tab
6. Paste the security rules from SETUP.md

### Step 4: Set Up Cloud Storage
1. In Firebase Console, go to Cloud Storage
2. Click "Create bucket"
3. Use defaults
4. Go to Rules tab
5. Paste the storage rules from SETUP.md

### Step 5: Run the Server
```bash
cd /Users/charlesmontluc/Common/Common
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser

---

## 🧪 Test the Full Workflow

### As a Student:
1. Click "Sign Up"
2. Use: **alice@test.com** / **password123**
3. Choose "I'm a Student"
4. Add:
   - Name: Alice
   - Skills: JavaScript, React, Python
   - Target Roles: Frontend Engineer
5. Go to dashboard → Browse offers
6. Click "Apply Now" on any offer
7. See fit score and application status

### As a Recruiter:
1. Click "Sign Up"  
2. Use: **recruiter@test.com** / **password123**
3. Choose "I'm a Recruiter"
4. Add: Company Name: TestCorp
5. Click "Create New Offer"
6. Fill in offer details
7. Click "Dashboard" → See offers
8. Click "View Applications"
9. Change candidate status with dropdown

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `js/config.js` | 🔴 Update with your Firebase credentials |
| `js/auth.js` | Authentication and user profiles |
| `js/router.js` | Page routing and navigation |
| `js/services/offers.js` | Offer CRUD operations |
| `js/services/applications.js` | Application management |
| `js/utils/fitScore.js` | Smart matching algorithm |
| `styles/main.css` | All styling (no Tailwind, no external CSS) |
| `html/*.html` | Page templates |

---

## 🎯 Features That Work End-to-End

### Student Side
- ✅ Sign up / Login
- ✅ Create profile with skills
- ✅ Browse all offers
- ✅ See fit scores
- ✅ Apply to offers (one click)
- ✅ View applications and statuses
- ✅ View profile

### Recruiter Side
- ✅ Sign up / Login
- ✅ Create company profile
- ✅ Create internship offers
- ✅ Edit/delete offers
- ✅ View all applicants
- ✅ Sort by fit score
- ✅ Change candidate status
- ✅ View student profiles

### Smart Matching
- ✅ Analyzes student skills
- ✅ Matches to job requirements
- ✅ Considers location
- ✅ Generates 0-100% fit score
- ✅ Color-coded (Poor/Fair/Good/Excellent)

---

## 🚀 How It Works

### Authentication Flow
```
User → Sign Up/Login → Firebase Auth → Create Profile → Dashboard
```

### Application Flow
```
Student: Browse → Apply → Track Status → See Interview/Offer
Recruiter: Post Offer → Review Apps → Change Status → Hire
```

### Matching Flow
```
Student Skills + Interests → Compare to Job Requirements → Fit Score
```

---

## 🎨 Styling

Everything is styled with pure CSS (in `styles/main.css`). The design includes:
- Modern card-based layout
- Blue primary color (#2563eb)
- Green accents (#10b981)
- Responsive grid system
- Mobile-friendly
- Professional buttons and forms

---

## 📊 Demo Data Structure

### Students Included:
- Alice Chen (Frontend/ML)
- Bob Kumar (Product/Business)
- Carol Johnson (Backend/DevOps)
- Diana Martinez (Design)
- Evan Park (Data Science)

### Companies Included:
- TechCorp (Frontend, Backend, UX roles)
- StartupIO (Product Manager, Data Science)
- CloudTech (DevOps Engineer)

### Offers Included:
- Frontend Engineer Intern
- Backend Engineer Intern
- Product Manager Intern
- DevOps Engineer Intern
- Data Scientist Intern
- UX Designer Intern

---

## ❓ Common Questions

**Q: How do I load the demo data?**
A: Open browser console and run `loadSeedData()` from `data/seedLoader.js` (or manually create offers)

**Q: Can I change the colors?**
A: Yes! Edit the `:root` variables in `styles/main.css`

**Q: How do students apply?**
A: Click "Apply Now" button - it creates an application record and calculates fit score

**Q: Can I change the fit score algorithm?**
A: Yes! Edit `js/utils/fitScore.js` - it's just weighted scoring

**Q: Does it send emails?**
A: Not yet - Firebase isn't configured for email. You can add Sendgrid later.

**Q: Can I host this?**
A: Yes! Deploy to Firebase Hosting, Netlify, Vercel, or any static host

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Firebase is not defined" | Make sure index.html loads Firebase CDN before your scripts |
| Can't login | Check Firebase credentials in js/config.js |
| No offers appearing | Create offers through recruiter dashboard or load seed data |
| Applications not saving | Check Firestore security rules |
| CV upload fails | Verify Cloud Storage bucket and rules |
| Router not working | Clear cache and hard refresh (Cmd+Shift+R) |

---

## 📞 Need Help?

1. Check `SETUP.md` for detailed setup instructions
2. Check `README.md` for feature overview
3. Look at browser console for errors (F12)
4. Check Firestore to see if data is being saved
5. Verify Firebase credentials and rules

---

## 🎉 You're Ready!

Once you've done the 5 steps above, BAIT is fully functional. Test both workflows and see it work end-to-end.

Happy hiring! 🚀
