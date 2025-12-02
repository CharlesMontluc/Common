// Internship Offers Service

class OffersService {
    // Create a new internship offer
    static async createOffer(data) {
        try {
            const docRef = await db.collection('offers').add({
                ...data,
                recruiterId: authManager.currentUser.uid,
                recruiterName: authManager.currentUserProfile.name,
                recruiterCompany: authManager.currentUserProfile.company,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'active',
                applicantCount: 0
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    // Get offer by ID
    static async getOffer(offerId) {
        try {
            const doc = await db.collection('offers').doc(offerId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting offer:', error);
            throw error;
        }
    }

    // Get all offers (with optional filters)
    static async getAllOffers(filters = {}) {
        try {
            let query = db.collection('offers').where('status', '==', 'active');

            if (filters.location) {
                query = query.where('location', '==', filters.location);
            }
            if (filters.role) {
                query = query.where('role', '==', filters.role);
            }

            const snapshot = await query.orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting offers:', error);
            throw error;
        }
    }

    // Get recruiter's offers
    static async getRecruiterOffers(recruiterId) {
        try {
            const snapshot = await db.collection('offers')
                .where('recruiterId', '==', recruiterId)
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting recruiter offers:', error);
            throw error;
        }
    }

    // Update offer
    static async updateOffer(offerId, data) {
        try {
            await db.collection('offers').doc(offerId).update({
                ...data,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating offer:', error);
            throw error;
        }
    }

    // Delete offer
    static async deleteOffer(offerId) {
        try {
            await db.collection('offers').doc(offerId).delete();
        } catch (error) {
            console.error('Error deleting offer:', error);
            throw error;
        }
    }

    // Add applicant to offer
    static async addApplicant(offerId, studentId, fitScore) {
        try {
            const applicationRef = db.collection('applications').doc();
            
            await applicationRef.set({
                applicationId: applicationRef.id,
                offerId,
                studentId,
                recruiterId: (await this.getOffer(offerId)).recruiterId,
                status: 'pending', // pending, interview, offered, rejected
                fitScore,
                appliedAt: new Date(),
                updatedAt: new Date()
            });

            // Update offer applicant count
            const offer = await this.getOffer(offerId);
            await this.updateOffer(offerId, { 
                applicantCount: (offer.applicantCount || 0) + 1 
            });

            return applicationRef.id;
        } catch (error) {
            console.error('Error adding applicant:', error);
            throw error;
        }
    }
}
