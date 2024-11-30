import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signIn, signUp } from '../../firebase/database';

const SignUpScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if(fullName === "" || organization === "" || email === ""){
        alert("No empty fields allowed")
        return;
    }
    setIsLoading(true);
    const result = await signUp(fullName, organization, email, password);
    console.log(result)
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Organization"
          placeholderTextColor="#aaa"
          value={organization}
          onChangeText={setOrganization}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        {isLoading ? <ActivityIndicator color={"#FFFFFF"}/> :  <Text style={styles.signUpText}>Sign Up</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => {
            navigation.pop()
        }}>
          <Text style={styles.signInText}>Sign In</Text>
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
  signUpButton: {
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
  signUpText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  footerText: {
    color: '#666',
  },
  signInText: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default SignUpScreen;
