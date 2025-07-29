import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

export default function Header() {
  const route = useRouter()
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/wave.png')}
        style={styles.waveImage}
      />

      {/* Header Navbar */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Jay<Text style={styles.logoHighlight}>family</Text>
        </Text>
        {/* <Ionicons name="menu" size={28} color="black" /> */}
<MaterialCommunityIcons name="account-circle-outline" size={32} color="black" onPress={()=> route.push('/profile')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginTop:-40
  },
  waveImage: {
    position: 'absolute',
    width: '100%',
    height: 360,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 35,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoHighlight: {
    color: Colors.PRIME,
  },
});
