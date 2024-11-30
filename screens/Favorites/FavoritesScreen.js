import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/database';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in to view your favorites.");
      setLoading(false);
      return;
    }

    const favoritesCollectionRef = collection(db, "users", user.uid, "favorites");

    const unsubscribe = onSnapshot(
      favoritesCollectionRef,
      (querySnapshot) => {
        const fetchedFavorites = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(fetchedFavorites);
        setLoading(false);
      },
      (error) => {
        console.log("Error fetching favorites: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const removeFavorite = async (id) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "You must be logged in to remove favorites.");
        return;
      }

      const favoriteDocRef = doc(db, "users", user.uid, "favorites", id);
      await deleteDoc(favoriteDocRef);
      Alert.alert("Success", "Event removed from favorites.");
    } catch (error) {
      console.log("Error removing favorite: ", error);
      Alert.alert("Error", "Could not remove event from favorites.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.eventDate}>Date: {item.eventDate}</Text>
      <Text style={styles.eventTime}>Time: {item.eventTime}</Text>
      <Text style={styles.eventAuthor}>Conducted by: {item.name}</Text>
      <Button color="#005407" title="Remove" onPress={() => removeFavorite(item.id)} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.noFavoritesContainer}>
        <Text style={styles.noFavoritesText}>You have no favorite events yet!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  listContainer: {
    width: '100%',
  },
  favoriteItem: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    color: '#555',
  },
});

export default FavoritesScreen;
