import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { getAuth } from "firebase/auth";
import { arrayUnion } from "firebase/firestore";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

const EnterAmount = () => {
  const [amount, setAmount] = useState("0");
  const router = useRouter();

  const handlePress = (num) => {
    setAmount((prev) => (prev === "0" && num !== "." ? num : prev + num));
  };

  const handleDelete = () => {
    setAmount((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

const handlePayment = async () => {
  const user = getAuth().currentUser;
  if (!user) return Alert.alert("Error", "User not logged in");

  const amountInPaise = parseFloat(amount) * 100;

  try {
    const res = await fetch("http://192.168.1.5:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInPaise }),
    });

    if (!res.ok) throw new Error("Failed to create order");

    const order = await res.json();

    const options = {
      description: "Add money to wallet",
      image: "https://yourdomain.com/logo.png",
      currency: "INR",
      key: "rzp_test_ABC123XYZ",
      amount: amountInPaise,
      name: "PAYNOW Wallet",
      order_id: order.id,
      prefill: {
        email: user.email || "",
        contact: user.phoneNumber || "",
        name: user.displayName || "",
      },
      theme: { color: Colors.PRIME },
    };

    RazorpayCheckout.open(options)
      .then(async (paymentResult) => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        const currentBalance = docSnap.data()?.wallet?.balance || 0;

        await updateDoc(userRef, {
          "wallet.balance": currentBalance + parseFloat(amount),
          payments: arrayUnion({
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
          }),
        });

        Alert.alert("Success", "Money added successfully!");
        router.replace("/home/AccountScreen");
      })
      .catch((err) => {
        console.log("Payment failed:", err);
        Alert.alert("Payment Failed", err.description || "Try again.");
      });
  } catch (err) {
    console.error("Order creation failed:", err);
    Alert.alert("Error", "Payment could not be initiated");
  }
};



  const renderButton = (label, onPress) => (
    <TouchableOpacity style={styles.keyButton} onPress={onPress}>
      <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Enter Amount</Text>
      <Text style={styles.amount}>₹{amount}</Text>

      <View style={styles.keypad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((num) => (
          <React.Fragment key={num}>
            {renderButton(num, () => handlePress(num))}
          </React.Fragment>
        ))}
        {renderButton("⌫", handleDelete)}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.requestButton} onPress={() => router.back()}>
          <Text style={styles.actionText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.actionText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnterAmount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 12,
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.BLACK,
    marginBottom: 24,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  keyButton: {
    width: "30%",
    aspectRatio: 1,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 24,
    color: Colors.BLACK,
    fontWeight: "600",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    gap: 20,
  },
  requestButton: {
    flex: 1,
    backgroundColor: Colors.PRIME,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payButton: {
    flex: 1,
    backgroundColor: "#2ECC71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
