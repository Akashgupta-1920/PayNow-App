import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // Add this at the top
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Header from '../../components/home/Header';
import Colors from '../../constant/Colors';

export default function InvestNowScreen() {
  const { planId, title } = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleInvestment = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return Alert.alert('Login Required');

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) return Alert.alert('User not found');

      const currentBalance = docSnap.data()?.wallet?.balance || 0;

      if (parseFloat(amount) > currentBalance) {
        return Alert.alert('Insufficient funds');
      }

      await updateDoc(userRef, {
        'wallet.balance': currentBalance - parseFloat(amount),
        investments: arrayUnion({
          planId,
          title,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
        }),
      });

      Alert.alert('Success', 'Investment successful');
      router.replace('/home/AccountScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Back Button */}
     <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
  <Feather name="arrow-left" size={24} color="#111" />
</TouchableOpacity>


      <Header />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Invest in {title}</Text>
        <TextInput
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleInvestment} style={styles.button}>
          <Text style={styles.buttonText}>Invest</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    marginTop: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 100,
    elevation: 3,
  },
  container: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
    marginBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: Colors.PRIME,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
