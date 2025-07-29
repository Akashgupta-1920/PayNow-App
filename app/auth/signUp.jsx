import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import Colors from './../../constant/Colors';
import { auth } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

import { db } from '../../config/firebaseConfig';
import { UserDetailContext } from "./../../context/UserDetailContext";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { useDetail, setUserDetail } = useContext(UserDetailContext);

  const validateInputs = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const createNewAccount = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
      await SaveUser(user);

      router.push('/home');
    } catch (err) {
      // console.error("Signup Error:", err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const SaveUser = async (user) => {
    const userData = {
      name: fullName,
      email: email.toLowerCase(), // Store email in lowercase
      member: false,
      uid: user?.uid,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userData); // Better to use UID as document ID
    setUserDetail(userData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        Pay<Text style={styles.logoHighlight}>now</Text>
      </Text>
      <Text style={styles.heading}>Create New Account</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder='Full Name'
        value={fullName}
        onChangeText={setFullName}
        style={styles.textInput}
      />
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textInput}
      />

      <TouchableOpacity
        onPress={createNewAccount}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginLink}>
        <Text style={{ fontFamily: 'outfit' }}>Already have an Account?</Text>
        <Pressable onPress={() => router.push('/auth/signIn')}>
          <Text style={styles.link}>Sign In Here</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop:130,
    marginBottom:15,
  },
  logoHighlight: {
    color: Colors.PRIME,
  },
  heading: {
    fontSize: 30,
    fontFamily: 'outfit-bold'
  },
  textInput: {
    borderWidth: 1,
    width: '90%',
    padding: 12,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIME,
    width: '90%',
    marginTop: 25,
    borderRadius: 10
  },
  buttonText: {
    fontFamily: 'outfit',
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: 'center',
  },
  loginLink: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 20
  },
  link: {
    color: Colors.PRIME,
    fontFamily: 'outfit-bold'
  }
});
