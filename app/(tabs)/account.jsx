import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import Header from "../../components/home/Header";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function AccountScreen() {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const balance = docSnap.data()?.wallet?.balance || 0;
          setWalletBalance(balance);
        } else {
          console.log("No wallet data found.");
        }
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
      }
    };

    fetchWalletBalance();
  }, []);

  const investmentPlans = [
    {
      id: "1",
      title: "Monthly SIP Plan",
      description: "Invest ₹1,000/month for long-term growth.",
      returns: "Estimated Returns: 12% annually",
    },
    {
      id: "2",
      title: "Fixed Deposit Plan",
      description: "Lock in funds for 1 year.",
      returns: "Interest Rate: 7.5%",
    },
    {
      id: "3",
      title: "Mutual Fund Flexi Plan",
      description: "Flexible investment starting from ₹500.",
      returns: "Expected Returns: 10-14%",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.accountType}>CHECKING</Text>
        <Text style={styles.balance}>₹{walletBalance.toFixed(2)}</Text>
        <Text style={styles.subLabel}>AVAILABLE BALANCE</Text>
        <Text style={styles.currentBalance}>
          Current Balance{" "}
          <Text style={{ fontWeight: "bold", color: Colors.PRIME }}>
            ₹{walletBalance.toFixed(2)}
          </Text>
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push("/addMoney/EnterAmount")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.btnTextPrimary}>Add Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary}>
          <Ionicons name="arrow-down" size={20} color={Colors.PRIME} />
          <Text style={styles.btnTextSecondary}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Investment Plans */}
      <Text style={styles.sectionTitle}>Investment Plans</Text>
      <ScrollView contentContainerStyle={styles.investmentContainer}>
        {investmentPlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planDesc}>{plan.description}</Text>
            <Text style={styles.planReturns}>{plan.returns}</Text>
            <TouchableOpacity
              style={styles.investButton}
              onPress={() => router.push({
                pathname: '/invest/InvestNowScreen',
                params: { planId: plan.id, title: plan.title }
              })}
            >
              <Text style={styles.investButtonText}>Invest Now</Text>
            </TouchableOpacity>

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f0ff",
    marginTop: 30,
  },
  balanceContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  accountType: {
    color: Colors.BLACK,
    fontSize: 16,
    marginBottom: 6,
  },
  balance: {
    color: Colors.PRIME,
    fontSize: 48,
    fontWeight: "bold",
  },
  subLabel: {
    color: Colors.BLACK,
    fontSize: 14,
    marginBottom: 6,
  },
  currentBalance: {
    color: Colors.BLACK,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.PRIME,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.PRIME,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#fff",
  },
  btnTextPrimary: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  btnTextSecondary: {
    color: Colors.PRIME,
    fontWeight: "600",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 10,
    color: Colors.BLACK,
  },
  investmentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  planCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
  },
  planDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  planReturns: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e7e34",
  },
  investButton: {
    marginTop: 10,
    backgroundColor: Colors.PRIME,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  investButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
