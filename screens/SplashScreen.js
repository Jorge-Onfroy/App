import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 7000); // 7 segundos

    return () => clearTimeout(timer); 
  }, []);

  return (
    <View style={styles.container}>
      <Image 
  source={require('../assets/logo.png')} 
  style={styles.logo} 
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  logo: {
    width: 150,
    height: 150,
  },
});
