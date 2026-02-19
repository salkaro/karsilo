import admin from "firebase-admin";

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error("Error initializing Admin SDK:", error);
    }
}

const firestoreAdmin = admin.apps.length ? admin.firestore() : (null as unknown as FirebaseFirestore.Firestore);

export { firestoreAdmin, admin };
