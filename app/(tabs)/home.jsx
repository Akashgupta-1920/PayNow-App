import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/home/Header.jsx";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; // adjust if path is different


const transactions = [
  { id: "1", name: "Mark Zuck", amount: 237, positive: true },
  { id: "2", name: "James Hiu", amount: 200, positive: false },
  { id: "3", name: "Mark Zuck", amount: 237, positive: true },
];

const Home = () => {
  const route = useRouter()
  const pathname = usePathname();
  const [kycDone, setKycDone] = useState(false);

useEffect(() => {
  const fetchKYC = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setKycDone(data.kycDone === true); // ensure it's boolean
      }
    } catch (err) {
      console.error("Failed to fetch user KYC:", err);
    }
  };

  fetchKYC();
}, []);

const checkAccountExists = async () => {
  const user = getAuth().currentUser;
  if (!user) return false;

  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return false;

    const data = docSnap.data();
    return data?.kycDone === true;
  } catch (err) {
    console.error("Error checking account:", err);
    return false;
  }
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <Header />

      {/* Card */}
      <LinearGradient
        colors={["#1e3a8a", "#2563eb", "#3b82f6"]}
        style={styles.card}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Dots */}
        <View style={styles.dotContainer}>
          {Array.from({ length: 3 }).map((_, row) => (
            <View key={row} style={styles.dotRow}>
              {Array.from({ length: 5 }).map((_, col) => (
                <View key={`${row}-${col}`} style={styles.dot} />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.bankName}>DigiBank</Text>

        {/* Chip Icon */}
        <MaterialCommunityIcons
          name="credit-card-chip"
          size={38}
          color="#f4d35e"
          style={{ marginVertical: 10 }}
        />

        {/* Card Number */}
        <Text style={styles.cardNumber}>5432 1278 56XX XXXX</Text>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardLabel}>Card Holder</Text>
            <Text style={styles.cardHolder}>John Doe</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Valid Thru</Text>
            <Text style={styles.cardHolder}>12/26</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Actions */}
<View style={styles.actions}>
  <TouchableOpacity
    style={[styles.actionButton, !kycDone && { opacity: 1 }]}
    onPress={() => {
      if (kycDone) {
        route.push("/transection");
      } else {
        alert("Please complete your account setup first.");
      }
    }}
  >
    <Ionicons name="swap-horizontal" size={24} color="#0b2f7b" />
    <Text style={styles.actionLabel}>Transfer</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionButton}
    onPress={() => route.push("/addMoney")}
  >
    <Ionicons name="card" size={24} color="#0b2f7b" />
    <Text style={styles.actionLabel}>Accounts</Text>
  </TouchableOpacity>

  <TouchableOpacity
    disabled={!kycDone}
    style={[styles.actionButton, !kycDone && { opacity: 0.5 }]}
    onPress={() => {
      if (kycDone) {
        route.push("/wallet");
      } else {
        alert("Please complete your account setup first.");
      }
    }}
  >
    <Ionicons name="wallet" size={24} color="#0b2f7b" />
    <Text style={styles.actionLabel}>Wallet</Text>
  </TouchableOpacity>
</View>



      {/* Transactions */}
      <Text style={styles.latestText}>Latest Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionNote}>
                Transfer from 129-00-456
              </Text>
            </View>
            <Text
              style={[
                styles.amount,
                { color: item.positive ? "#2ecc71" : "#e74c3c" },
              ]}
            >
              {item.positive ? "+" : "-"} {item.amount}.00
            </Text>
          </View>
        )}
      />

    </SafeAreaView>
  );
};

const ActionButton = ({ icon, label }) => (
  <View style={styles.actionButton}>
    <Ionicons name={icon} size={24} color="#0b2f7b" />
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f0ff",
    paddingTop: 30,
  },
  card: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    overflow: "hidden",
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#2563eb", // backup if gradient fails
    height: 180,
    marginTop: 30,
    marginBottom: 30
  },

  dotContainer: {
    position: "absolute",
    top: 30,
    right: 30,
    flexDirection: "column",
    gap: 6,
  },
  dotRow: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  bankName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  cardNumber: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardHolder: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  cardLabel: {
    color: "#cfd8dc",
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    width: 90,
  },
  actionLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#0b2f7b",
  },
  latestText: {
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  transactionItem: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  transactionName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#111",
  },
  transactionNote: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  amount: {
    fontWeight: "bold",
    fontSize: 16,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 14,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#999",
  },
});
