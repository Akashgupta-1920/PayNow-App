import { Stack } from "expo-router";
import { UserDetailContext } from "../context/UserDetailContext";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import Colors from "../constant/Colors";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
const [userDetail, setUserDetail] = useState(null);
const [loading, setLoading] = useState(true);

const [loaded] = useFonts({
  'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
  'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
});

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUserDetail({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
      });
    } else {
      setUserDetail(null);
    }
    setLoading(false);
  });

  return unsubscribe;
}, []);

  useEffect(() => {
    // console.log("UserDetail updated:", userDetail); // Debug log
  }, [userDetail]);

if (!loaded || loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors?.WHITE || '#fff' }}>
      <ActivityIndicator size="large" color={Colors?.PRIME || 'green'} />
    </View>
  );
}

return (
  <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
    <Stack screenOptions={{ headerShown: false }} />
  </UserDetailContext.Provider>
);

}