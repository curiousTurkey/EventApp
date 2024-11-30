import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/database';


const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  // Fetch events from Firebase when the component is mounted
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const events = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
        setEvents(events)
      } catch (error) {
        console.log('Error fetching events: ', error);
      }
    };

    fetchEvents();
  }, []);

  // Render each event item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.eventItem}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDate}>Date: {item.eventDate}</Text>
        <Text style={styles.eventTime}>Time: {item.eventTime}</Text>
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
    justifyContent: 'flex-start', // Keep the list at the top
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  flatList: {
    width: "90%"
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
  },
  listContainer: {
    width: '100%',
    paddingTop: 60, // To avoid overlap with the floating button
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
});

export default HomeScreen;
