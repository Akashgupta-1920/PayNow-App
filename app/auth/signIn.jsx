import {View,Text,StyleSheet,Image,TextInput,TouchableOpacity,Pressable, ToastAndroid, ActivityIndicator} from 'react-native';
import React, { useContext, useState } from 'react';
import Colors from './../../constant/Colors';
import { useRouter } from 'expo-router';
import { EmailAuthCredential, signInWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from './../../config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserDetailContext';


export default function SignIn(){
  const router = useRouter()
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const {userDetail,setUserDetail} = useContext(UserDetailContext);
  const [loading,setLoading] = useState(false);
  
  const onSignInClick = () => {
    setLoading(true);
   signInWithEmailAndPassword(auth,email,password)
   .then(async(resp)=>{
    const user=resp.user
    // console.log(user);
   await getUserDetail()
   setLoading(false);
   router.replace('/(tabs)/home')
   }).catch(e=>{
    // console.log(e)
    setLoading(false)
    ToastAndroid.show('Incorrect Email & Password',ToastAndroid.BOTTOM)
   })
  }

  const getUserDetail = async () => {
  const result = await getDoc(doc(db, 'users', email));
  // console.log(result.data());
  setUserDetail(result.data())
  }

   return(
  <View 
   style={{
      display: 'flex',
      alignItems:'center',
      flex:1,
      backgroundColor:Colors.WHITE,
      gap:15
    }}>

    <Text style={styles.logo}>
            Pay<Text style={styles.logoHighlight}>now</Text>
          </Text>

     <Text style={{
     fontSize: 30,
     fontFamily:'outfit-bold'
     }}>
      Welcome Back
     </Text>
     <TextInput placeholder='Email' onChangeText={(value) => setEmail(value)} style={styles.textInput} />
     <TextInput placeholder='Password' onChangeText={(value) => setPassword(value)} secureTextEntry={true} style={styles.textInput} />

     <TouchableOpacity 
     onPress={onSignInClick}
     disabled={loading}
     style={{
      padding:15,
      backgroundColor:Colors.PRIME,
      width:'90%',
      marginTop:25,
      borderRadius:10
     }}>
     {!loading ? <Text style={{fontFamily:'outfit', fontSize:20, color:Colors.WHITE ,textAlign:'center',}} >Sign In</Text>:
     <ActivityIndicator size={'large'} color={Colors.WHITE} />
    }
     </TouchableOpacity>
     <View style={{
      display:'flex',
      flexDirection: 'row',
      gap:5,
      marginTop:20
     }} >
     <Text style={{
      fontFamily:'outfit'
     }} >Don't have Account ?</Text>
     <Pressable onPress={() => router.push('/auth/signUp')} >
      <Text style={{
      color:Colors.PRIME,
      fontFamily:'outfit-bold'
     }}>Create Here</Text>
     </Pressable>
</View>
    </View>
  )
}
const styles = StyleSheet.create({
  textInput:{
    borderWidth:1,
    width: '90%',
    padding:12,
    fontSize:18,
    marginTop:20,
    borderRadius:8
  },  logo: {
      fontSize: 36,
      fontWeight: "bold",
      marginTop:130,
      marginBottom:15,
    },
    logoHighlight: {
      color: Colors.PRIME,
    },
})