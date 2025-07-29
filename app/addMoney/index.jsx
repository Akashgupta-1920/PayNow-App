import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import Header from '../../components/home/Header';
import { useRouter } from 'expo-router'; 

const CreateBankAccount = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIFSC] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [name, setName] = useState('');

  const router = useRouter(); // 👈 Initialize router

  const handleCreateAccount = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return Alert.alert('Error', 'User not logged in');

      const dataToSave = {
        fullName: user.displayName || '',
        email: user.email,
        phone: user.phoneNumber,
        kycDone: true,
        bankAccount: {
          name,
          accountNumber,
          phone,
          ifsc,
          aadhaarNumber,
        },
      };

      console.log("Saving data:", dataToSave);

      await setDoc(doc(db, 'users', user.uid), dataToSave, { merge: true });

      Alert.alert('Success', 'Bank account created successfully');

      // 👇 Navigate to account screen
      router.replace('/(tabs)/home');

    } catch (err) {
      console.error("Error saving user bank account:", err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView>
      <View style={{ marginTop: 30 }}>
        <Header />
            {/* Back Button */}
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={28} color="#fff" />
    </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.heading}>Create An Account</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            keyboardType="name-phone-pad"
            maxLength={12}
          />
          <TextInput
            placeholder="Aadhaar Number"
            style={styles.input}
            value={aadhaarNumber}
            onChangeText={setAadhaarNumber}
            keyboardType="numeric"
            maxLength={12}
          />

          <TextInput
            placeholder="Phone"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            placeholder="Account Number"
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            maxLength={14} 
          />


          <TextInput
            placeholder="IFSC Code"
            style={styles.input}
            value={ifsc}
            onChangeText={setIFSC}
          />



          <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateBankAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    marginTop: 80,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
  position: 'absolute',
  top: 60,
  left: 20,
  zIndex: 10,
  padding: 12,
},

});
