# BAIT Platform Architecture & User Flows

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BAIT Frontend                        │
│  (Vanilla JS + HTML5 + CSS3)                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │         Application Shell (index.html)           │  │
│  │  • Firebase SDKs                                 │  │
│  │  • Router (client-side navigation)               │  │
│  │  • Auth Manager (session handling)               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────┬──────────────────┐              │
│  │   Student Pages  │  Recruiter Pages │              │
│  │                  │                  │              │
│  │ • Dashboard      │ • Dashboard      │              │
│  │ • Applications   │ • Offers         │              │
│  │ • Offer Detail   │ • Create Offer   │              │
│  │ • Profile        │ • Edit Offer     │              │
│  │                  │ • Applicants     │              │
│  │                  │ • Student View   │              │
│  └──────────────────┴──────────────────┘              │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │     Services & Utilities                        │  │
│  │ • OffersService (CRUD)                          │  │
│  │ • ApplicationsService (tracking)                │  │
│  │ • FitScoreCalculator (matching)                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │        Firebase Backend               │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │   Firebase Auth                 │ │
        │  │ • Email/Password signup/login   │ │
        │  │ • Session management            │ │
        │  │ • Security                      │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │   Firestore Database            │ │
        │  │ • Users collection              │ │
        │  │ • Offers collection             │ │
        │  │ • Applications collection       │ │
        │  │ • Real-time listeners           │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │   Cloud Storage                 │ │
        │  │ • CV file uploads               │ │
        │  │ • File security rules           │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        └───────────────────────────────────────┘
```

---

## Complete Student User Flow

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├─→ [Sign Up] ──→ ┌──────────────────┐
       │                 │  Email/Password  │
       │                 │   Signup Form    │
       │                 └────────┬─────────┘
       │                          │
       ├─→ [Sign In] ──→ ┌────────┴─────────┐
       │                 │ Login Form       │
       │                 └────────┬─────────┘
       │                          │
       └──────────────────────────┼──────────┐
                                  │          │
                          ┌───────▼────────┐ │
                          │ Onboarding     │ │
                          │                │ │
                          │ Select:        │ │
                          │ "Student"      │ │
                          │                │ │
                          │ Fill in:       │ │
                          │ • Name         │ │
                          │ • Role         │ │
                          │ • Location     │ │
                          │ • Skills       │ │
                          │ • Target Roles │ │
                          │ • CV (opt)     │ │
                          └───────┬────────┘ │
                                  │          │
                          ┌───────▼────────┐ │
                          │ Student        │ │
                          │ Dashboard      │ │
                          │                │ │
                          │ Browse:        │ │
                          │ • All Offers   │ │
                          │ • Fit Scores   │ │
                          │ • Companies    │ │
                          └───────┬────────┘ │
                                  │          │
                ┌─────────────────┬┴──────────┐
                │                 │           │
        ┌───────▼────────┐ ┌──────▼──────┐  │
        │ View Offer     │ │ Apply to    │  │
        │ Details        │ │ Offer       │  │
        │                │ │             │  │
        │ See:           │ │ (Calculates │  │
        │ • Full desc    │ │  fit score) │  │
        │ • Skills       │ │             │  │
        │ • Requirements │ │             │  │
        │ • Company info │ └──────┬──────┘  │
        │ • Fit score    │        │         │
        └───────┬────────┘        │         │
                │                 │         │
                └────────┬────────┘         │
                         │                  │
                ┌────────▼──────────┐       │
                │ Track Status      │       │
                │                   │       │
                │ See:              │       │
                │ • All My Apps     │       │
                │ • Statuses        │       │
                │ • Fit Scores      │       │
                │ • Notifications   │       │
                │ (Pending→         │       │
                │  Interview→       │       │
                │  Offered/Rejected)│       │
                └────────┬──────────┘       │
                         │                  │
                ┌────────▼──────────┐       │
                │ Manage Profile    │       │
                │                   │       │
                │ Update:           │       │
                │ • Name            │       │
                │ • Skills          │       │
                │ • Target Roles    │       │
                │ • Location        │       │
                │ • CV Upload       │       │
                └───────────────────┘       │
                                             │
                                    ┌────────▼──────┐
                                    │ Sign Out      │
                                    │ → Back to Home│
                                    └───────────────┘
```

---

## Complete Recruiter User Flow

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├─→ [Sign Up] ──→ ┌──────────────────┐
       │                 │  Email/Password  │
       │                 │   Signup Form    │
       │                 └────────┬─────────┘
       │                          │
       ├─→ [Sign In] ──→ ┌────────┴─────────┐
       │                 │ Login Form       │
       │                 └────────┬─────────┘
       │                          │
       └──────────────────────────┼──────────┐
                                  │          │
                          ┌───────▼────────┐ │
                          │ Onboarding     │ │
                          │                │ │
                          │ Select:        │ │
                          │ "Recruiter"    │ │
                          │                │ │
                          │ Fill in:       │ │
                          │ • Name         │ │
                          │ • Role         │ │
                          │ • Location     │ │
                          │ • Company      │ │
                          └───────┬────────┘ │
                                  │          │
                          ┌───────▼────────┐ │
                          │ Recruiter      │ │
                          │ Dashboard      │ │
                          │                │ │
                          │ Stats:         │ │
                          │ • Offers       │ │
                          │ • Applications │ │
                          │ • Pending      │ │
                          │                │ │
                          │ Actions:       │ │
                          │ • View Offers  │ │
                          │ • New Offer    │ │
                          └───────┬────────┘ │
                                  │          │
                ┌─────────────────┬┴──────────┐
                │                 │           │
        ┌───────▼────────┐ ┌──────▼──────┐  │
        │ View Offers    │ │ Create New  │  │
        │ List           │ │ Offer       │  │
        │                │ │             │  │
        │ For each offer:│ │ Fill in:    │  │
        │ • Click Edit   │ │ • Title     │  │
        │ • Click Delete │ │ • Role      │  │
        │ • Click View   │ │ • Location  │  │
        │   Applications │ │ • Duration  │  │
        └─────┬──────────┘ │ • Stipend   │  │
              │            │ • Description│ │
              │            │ • Skills    │  │
              │            │ • Resp's    │  │
              │            │ • Req'ts    │  │
              │            └──────┬──────┘  │
              │                   │         │
              └─────────┬─────────┘         │
                        │                   │
            ┌───────────▼──────────┐        │
            │ View Applications    │        │
            │ for Offer            │        │
            │                      │        │
            │ See:                 │        │
            │ • All applicants     │        │
            │ • Sorted by score    │        │
            │ • Student names      │        │
            │ • Current status     │        │
            │ • Fit score          │        │
            │                      │        │
            │ For each applicant:  │        │
            │ • View Profile       │        │
            │ • Change Status ▼    │        │
            │   (Pending→          │        │
            │    Interview→        │        │
            │    Offered/Rejected) │        │
            └───────────┬──────────┘        │
                        │                   │
            ┌───────────▼──────────┐        │
            │ View Student         │        │
            │ Full Profile         │        │
            │                      │        │
            │ See:                 │        │
            │ • Name               │        │
            │ • Email              │        │
            │ • Role/Title         │        │
            │ • Location           │        │
            │ • Skills             │        │
            │ • Target Roles       │        │
            │ • Application Count  │        │
            └────────────┬─────────┘        │
                         │                  │
            ┌────────────▼──────────┐       │
            │ Edit Offer            │       │
            │                       │       │
            │ Update any field      │       │
            │ or Delete offer       │       │
            └────────────┬──────────┘       │
                         │                  │
                ┌────────▼──────────┐       │
                │ Sign Out          │       │
                │ → Back to Home    │       │
                └───────────────────┘       │
```

---

## Application Matching Flow

```
┌──────────────────────────────────────────────────┐
│          Student Profile                         │
│                                                  │
│  Skills: JavaScript, React, Python             │
│  Target: Frontend Engineer, Full Stack         │
│  Location: San Francisco, CA                   │
└──────────────┬───────────────────────────────────┘
               │
               │ (Student applies to offer)
               │
               ▼
┌──────────────────────────────────────────────────┐
│          Internship Offer                        │
│                                                  │
│  Required Skills: JavaScript, React             │
│  Role: Frontend Engineer                        │
│  Location: San Francisco, CA                    │
└──────────────┬───────────────────────────────────┘
               │
               │ (Fit Score Algorithm)
               │
        ┌──────▼──────────────────┐
        │                         │
        ├─→ Skill Analysis        │
        │   • Has JavaScript ✓    │
        │   • Has React ✓         │
        │   • Score: 40/40        │
        │                         │
        ├─→ Role Analysis         │
        │   • Frontend Engineer ✓ │
        │   • Score: 40/40        │
        │                         │
        ├─→ Location Analysis     │
        │   • San Francisco ✓     │
        │   • Score: 20/20        │
        │                         │
        └──────┬──────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │  Total Fit Score: 95%    │
        │  Rating: Excellent       │
        │  Color: Green            │
        └──────────────────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Application Created      │
        │ Status: Pending Review   │
        │ Fit Score Recorded: 95%  │
        └──────────────────────────┘
```

---

## Database Schema

```
USERS Collection
├─ uid (Document ID = Firebase UID)
├─ email
├─ name
├─ userType: 'student' | 'recruiter'
├─ role
├─ location
├─ profileComplete: boolean
├─ createdAt
├─ updatedAt
├─ [Student only]
│  ├─ skills: [string]
│  ├─ targetRoles: [string]
│  └─ cvPath: string
└─ [Recruiter only]
   └─ company: string

OFFERS Collection
├─ id (Auto-generated Document ID)
├─ title
├─ recruiterId
├─ recruiterName
├─ recruiterCompany
├─ role
├─ location
├─ duration
├─ stipend
├─ description
├─ requiredSkills: [string]
├─ responsibilities: [string]
├─ requirements: [string]
├─ applicantCount
├─ status: 'active' | 'archived'
├─ createdAt
└─ updatedAt

APPLICATIONS Collection
├─ id (Document ID)
├─ applicationId (unique ID)
├─ offerId
├─ studentId
├─ recruiterId
├─ status: 'pending'|'interview'|'offered'|'rejected'
├─ fitScore: number
├─ appliedAt
└─ updatedAt
```

---

## Navigation Map

```
Landing Page
├─ Sign Up → Onboarding
│           ├─ [Student] → Student Dashboard
│           └─ [Recruiter] → Recruiter Dashboard
│
└─ Sign In → (redirects based on role)
           ├─ Student → Student Dashboard
           └─ Recruiter → Recruiter Dashboard

Student Routes
├─ /student/dashboard → Browse Offers
├─ /student/applications → Track Apps
├─ /student/offer/:id → Offer Details
└─ /student/profile → My Profile

Recruiter Routes
├─ /recruiter/dashboard → Overview
├─ /recruiter/offers → My Offers
├─ /recruiter/offer/new → Create Offer
├─ /recruiter/offer/edit/:id → Edit Offer
├─ /recruiter/offer/:id/applicants → View Apps
└─ /recruiter/student/:id → Student Profile
```

---

## Fit Score Color Coding

```
┌───────────┬──────────────┬──────────┐
│ Score     │ Label        │ Color    │
├───────────┼──────────────┼──────────┤
│ 85-100%   │ Excellent    │ Green    │
│ 70-84%    │ Good         │ Blue     │
│ 50-69%    │ Fair         │ Orange   │
│ Below 50% │ Poor         │ Red      │
└───────────┴──────────────┴──────────┘
```

---

## Real-Time Updates

```
Student applies → Application created → Recruiter sees new applicant
                                       ↓
                      Recruiter changes status → Student sees update

Recruiter creates → Offer appears → Students see in dashboard
offer

Student updates → Profile changes → Fit scores recalculate
skills
```

---

## Security Model

```
┌─────────────────────────────────────────────┐
│           Firebase Auth                     │
│ Email/Password → Firebase Token             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │  Firestore Security      │
        │  Rules                   │
        │                          │
        │  Users:                  │
        │  • Can read own profile  │
        │  • Can read any profile  │
        │    (needed for viewing)  │
        │  • Can write own profile │
        │                          │
        │  Offers:                 │
        │  • Anyone can read       │
        │  • Only owner can write  │
        │                          │
        │  Applications:           │
        │  • Student can see own   │
        │  • Recruiter can see own │
        │  • Recruiter can update  │
        │    status                │
        └──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │  Cloud Storage Security  │
        │  Rules                   │
        │                          │
        │  CVs:                    │
        │  • Student can upload    │
        │    their own CV          │
        │  • Recruiter can read    │
        │    (view applicant CV)   │
        └──────────────────────────┘
```

---

This architecture ensures that BAIT is:
- ✅ Secure (Firebase handles auth)
- ✅ Scalable (Firestore auto-scales)
- ✅ Real-time (Firestore listeners)
- ✅ Efficient (minimal data transfer)
- ✅ User-friendly (clear workflows)
