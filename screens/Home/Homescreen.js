import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/database';
import { getAuth } from 'firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "events"),
      (querySnapshot) => {
        const events = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(events);
      },
      (error) => {
        console.log("Error listening to events: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddToFavorites = async (event) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in to add favorites.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const favoritesCollectionRef = collection(userDocRef, "favorites");
      const favoriteDocRef = doc(favoritesCollectionRef, event.id);

      await setDoc(favoriteDocRef, event);

      Alert.alert("Success", `"${event.eventName}" has been added to your favorites.`);
    } catch (error) {
      console.error("Error adding to favorites: ", error);
      Alert.alert("Error", "Could not add the event to favorites. Please try again.");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.eventItem}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDate}>Date: {item.eventDate}</Text>
        <Text style={styles.eventTime}>Time: {item.eventTime}</Text>
        <Text style={styles.eventAuthor}>Conducted by: {item.name}</Text>
        <View>
          <Button
            title="Add to favorites"
            onPress={() => handleAddToFavorites(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          navigation.push('addevent');
        }}
      >
        <AntDesign name="pluscircle" size={24} color="white" />
      </TouchableOpacity>

      <FlatList
        style={styles.flatList}
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  flatList: {
    width: '95%',
  },
  floatingButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    zIndex: 999,
  },
  listContainer: {
    width: '100%',
    paddingTop: 60,
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 16,
    color: '#555',
  },
  eventTime: {
    fontSize: 16,
    color: '#555',
  },
  eventAuthor: {
    fontSize: 16,
    color: '#199501',
  },
});

export default HomeScreen;
