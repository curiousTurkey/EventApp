import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet , ActivityIndicator} from 'react-native';
import { signIn } from '../../firebase/database';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    if(email === "" || password === ""){
      alert("Fields cannot be empty");
      return;
    }
    setIsLoading(true);
    const result = await signIn(email, password);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
      {isLoading ? <ActivityIndicator color={"#FFFFFF"}/> :  <Text style={styles.signInText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => {
          navigation.navigate("signupScreen")
        }}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  signInButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    marginBottom: 20,
  },
  forgotText: {
    color: '#007bff',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  footerText: {
    color: '#666',
  },
  signUpText: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default LoginScreen;
