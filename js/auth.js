// Authentication Module

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.currentUserProfile = null;
    }

    // Initialize auth state listener
    async init() {
        return new Promise((resolve) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    await this.loadUserProfile();
                    console.log('User logged in:', user.email);
                } else {
                    this.currentUser = null;
                    this.currentUserProfile = null;
                    console.log('User logged out');
                }
                resolve(user);
            });
        });
    }

    // Load user profile from Firestore
    async loadUserProfile() {
        if (!this.currentUser) return null;
        
        try {
            const doc = await db.collection('users').doc(this.currentUser.uid).get();
            if (doc.exists) {
                this.currentUserProfile = doc.data();
                this.currentUserProfile.uid = doc.id;
                return this.currentUserProfile;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
        return null;
    }

    // Sign up with email and password
    async signUp(email, password) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            return result.user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            await this.loadUserProfile();
            return result.user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Sign out
    async signOut() {
        try {
            await auth.signOut();
            this.currentUser = null;
            this.currentUserProfile = null;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Create user profile after onboarding
    async createUserProfile(data) {
        if (!this.currentUser) throw new Error('No user logged in');

        try {
            await db.collection('users').doc(this.currentUser.uid).set({
                email: this.currentUser.email,
                userType: data.userType, // 'student' or 'recruiter'
                name: data.name,
                role: data.role,
                location: data.location,
                skills: data.skills || [],
                targetRoles: data.targetRoles || [],
                company: data.company || null,
                profileComplete: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await this.loadUserProfile();
            return this.currentUserProfile;
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    // Update user profile
    async updateUserProfile(data) {
        if (!this.currentUser) throw new Error('No user logged in');

        try {
            await db.collection('users').doc(this.currentUser.uid).update({
                ...data,
                updatedAt: new Date()
            });

            await this.loadUserProfile();
            return this.currentUserProfile;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is student
    isStudent() {
        return this.currentUserProfile?.userType === 'student';
    }

    // Check if user is recruiter
    isRecruiter() {
        return this.currentUserProfile?.userType === 'recruiter';
    }
}

// Create global auth manager instance
const authManager = new AuthManager();
