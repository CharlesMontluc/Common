// Firebase Configuration
// Replace with your Firebase project config from Firebase Console

const firebaseConfig = {
    apiKey: "AIzaSyCldaebb7COJN-iIgkn-B9WpTzxyJkFmrc",
    authDomain: "bait-internships.firebaseapp.com",
    projectId: "bait-internships",
    storageBucket: "bait-internships.firebasestorage.app",
    messagingSenderId: "244726921204",
    appId: "1:244726921204:web:3494c5d15cdf1856542ba1",
    measurementId: "G-SHG8GR950C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Offline persistence failed - multiple tabs open');
        } else if (err.code == 'unimplemented') {
            console.warn('Offline persistence not supported');
        }
    });
