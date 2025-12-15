import { adminDb, admin } from "@/app/firebase/admin";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const idToken = authHeader.substring(7); // Remove "Bearer "

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if email is in admin allowlist
    const adminEmails = process.env.FIREBASE_ADMIN_CLIENT_EMAIL_DASHBOARD;
    if (!adminEmails) {
      console.error("DASHBOARD_ADMIN_EMAILS env var not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const allowedEmails = adminEmails.split(",").map(email => email.trim().toLowerCase());
    if (!allowedEmails.includes(decodedToken.email.toLowerCase())) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch orders from Firestore
    const ordersSnapshot = await adminDb.collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = ordersSnapshot.docs.map(doc => {
      const data = doc.data();

      // Convert Firestore timestamp to ISO string
      const createdAt = data.createdAt?.toDate?.()?.toISOString() || data.createdAt;

      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
