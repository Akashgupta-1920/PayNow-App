import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import Header from '../../components/home/Header';
import Colors from '../../constant/Colors';

const transactions = [
  { id: "1", name: "Mark Zuck", amount: 237, date: "Jul 26" },
  { id: "2", name: "James Hiu", amount: -200, date: "Jul 25" },
  { id: "3", name: "Mobile Recharge", amount: -100, date: "Jul 23" },
  { id: "4", name: "Bill Payment", amount: -1000, date: "Jul 22" },
  { id: "5", name: "Scooter's", date: "Sep 19, 2024", amount: -7.39 },
  { id: "6", name: "Yash", date: "Sep 18, 2024", amount: -2.0 },
  { id: "7", name: "Mohit", date: "Sep 18, 2024", amount: -73.5 },
  { id: "9", name: "Yash", date: "Sep 18, 2024", amount: 70.0 },
  { id: "10", name: "Not", date: "Sep 18, 2024", amount: 70.0 },
  { id: "11", name: "Do", date: "Sep 18, 2024", amount: 70.0 },
  { id: "12", name: "There", date: "Sep 18, 2024", amount: 70.0 },
  { id: "13", name: "Yash", date: "Sep 18, 2024", amount: 70.0 },
];

const Transection = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e6f0ff", }}>
      <View style={{marginTop:30}}>
      <Header />
      <Text style={styles.logo}>
        Lat<Text style={styles.logoHighlight}>est</Text>
        <Text style={styles.logolight}>
          {" "}Tran<Text style={styles.logoHighlight}>section</Text>
        </Text>
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={24}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionNote}>{item.date || "Transfer from 129-00-456"}</Text>
            </View>
            <Text
              style={[
                styles.amount,
                { color: item.amount >= 0 ? "#2ecc71" : "#e74c3c" },
              ]}
            >
              {item.amount >= 0 ? "+" : "-"} ₹{Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
        )}
      />
      </View>
    </SafeAreaView>
  );
};

export default Transection;

const styles = StyleSheet.create({
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 100,
    marginLeft: 20,
    marginBottom: 20,
  },
  logoHighlight: {
    color: Colors.PRIME,
  },
  logolight: {
    color: Colors.BLACK,
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
});
