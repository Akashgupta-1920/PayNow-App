import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import Header from "../../components/home/Header";

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      setAuthUser(user);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIME} />
      </View>
    );
  }

  if (!authUser || !userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data found.</Text>
      </View>
    );
  }

  const { wallet, phone, kycDone, bankAccount = {} } = userData;

  return (
    <View style={styles.container}>
      <View style={{marginTop:30}}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mainTitlePro}>👤 Profile Overview</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{authUser.displayName || userData.fullName || "N/A"}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{authUser.email || "N/A"}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{phone || "Not provided"}</Text>
        </View>

        <View style={[styles.card, styles.walletCard]}>
          <Text style={styles.walletTitle}>💰 Wallet Balance</Text>
          <Text style={styles.walletAmount}>₹{wallet?.balance?.toFixed(2) || "0.00"}</Text>
          <Text style={styles.kycText}>KYC Status: {kycDone ? "✅ Verified" : "❌ Not Verified"}</Text>
        </View>

        <Text style={styles.mainTitle}>🏦 Bank Account Info</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.value}>{bankAccount.accountNumber || "N/A"}</Text>

          <Text style={styles.label}>IFSC:</Text>
          <Text style={styles.value}>{bankAccount.ifsc || "N/A"}</Text>

          <Text style={styles.label}>VPA:</Text>
          <Text style={styles.value}>{bankAccount.vpa || "N/A"}</Text>

          <Text style={styles.label}>Aadhaar Number:</Text>
          <Text style={styles.value}>{bankAccount.aadhaarNumber || "N/A"}</Text>
        </View>
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef5ff",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    color: Colors.PRIME,
  },
  mainTitlePro: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    color: Colors.WHITE,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  walletCard: {
    backgroundColor: "#1e3a8a",
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#cce0ff",
    marginBottom: 8,
  },
  walletAmount: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  kycText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
