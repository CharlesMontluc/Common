// Applications Service

class ApplicationsService {
    // Get all applications for a student
    static async getStudentApplications(studentId) {
        try {
            const snapshot = await db.collection('applications')
                .where('studentId', '==', studentId)
                .orderBy('appliedAt', 'desc')
                .get();

            const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Enrich with offer details
            for (let app of applications) {
                const offer = await db.collection('offers').doc(app.offerId).get();
                app.offer = { id: offer.id, ...offer.data() };
            }

            return applications;
        } catch (error) {
            console.error('Error getting student applications:', error);
            throw error;
        }
    }

    // Get all applications for an offer
    static async getOfferApplications(offerId) {
        try {
            const snapshot = await db.collection('applications')
                .where('offerId', '==', offerId)
                .orderBy('fitScore', 'desc')
                .get();

            const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Enrich with student details
            for (let app of applications) {
                const student = await db.collection('users').doc(app.studentId).get();
                app.student = { id: student.id, ...student.data() };
            }

            return applications;
        } catch (error) {
            console.error('Error getting offer applications:', error);
            throw error;
        }
    }

    // Update application status
    static async updateApplicationStatus(applicationId, status) {
        try {
            await db.collection('applications').doc(applicationId).update({
                status,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating application:', error);
            throw error;
        }
    }

    // Check if student already applied
    static async hasApplied(studentId, offerId) {
        try {
            const snapshot = await db.collection('applications')
                .where('studentId', '==', studentId)
                .where('offerId', '==', offerId)
                .get();
            return !snapshot.empty;
        } catch (error) {
            console.error('Error checking application:', error);
            throw error;
        }
    }
}
