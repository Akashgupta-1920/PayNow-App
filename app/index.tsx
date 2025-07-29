import { Text, StyleSheet, Image, View, TouchableOpacity } from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "./../config/firebaseConfig"
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../config/firebaseConfig";
import { UserDetailContext } from "@/context/UserDetailContext";
export default function Index() {

  const router = useRouter();
  const {userDetail,setUserDetail} = useContext(UserDetailContext);

 
  onAuthStateChanged(auth,async(user) => {
    if(user){
    //  console.log(user);
     const result=await getDoc(doc(db,'users',user?.email));
     setUserDetail(result.data());
     router.replace('/(tabs)/home')
    }
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../assets/images/landing.png")}
        style={{
          width: "100%",
          height: 300,
          marginTop: 70,
        }}
      />

      <View
        style={{
          padding: 25,
          marginTop:30,
          backgroundColor: Colors.PRIME,
          height: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          gap:15
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 30,
            marginTop:20,
            textAlign: "center",
            fontFamily: "outfit-bold",
          }}
        >
          Welcome to PayNow
        </Text>

        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 18,
            marginTop: 22,
            textAlign: "center",
            fontFamily: "outfit",
          }}
        >
         PayNow is a secure and fast app to send, receive, and manage money with ease.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/auth/signUp");
          }}
        >
          <Text style={[styles.buttonText, { color: Colors.PRIME }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/signIn")}
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIME,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Allready have an Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "outfit",
  },
});
