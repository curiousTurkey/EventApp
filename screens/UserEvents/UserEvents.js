import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/database";
import { getAuth } from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker";

const UserEventsScreen = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [updatedDate, setUpdatedDate] = useState(new Date());
  const [updatedTime, setUpdatedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("User not logged in.");
      setLoading(false);
      return;
    }

    const q = query(collection(db, "events"), where("eventAuthor", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const events = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserEvents(events);
        setLoading(false);
      },
      (error) => {
        console.log("Error fetching user events: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleEditPress = (event) => {
    setSelectedEvent(event);
    setUpdatedDate(new Date(event.eventDate));
    setUpdatedTime(new Date(event.eventTime));
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (selectedEvent) {
      try {
        const eventRef = doc(db, "events", selectedEvent.id);
        await updateDoc(eventRef, {
          eventDate: updatedDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          eventTime: updatedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        setModalVisible(false);
      } catch (error) {
        console.log("Error updating event: ", error);
      }
    }
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.eventName}</Text>
      <Text style={styles.eventDetails}>
        {item.eventDate} at {item.eventTime}
      </Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditPress(item)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close the picker
    if (selectedDate) {
      setUpdatedDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false); // Close the picker
    if (selectedTime) {
      setUpdatedTime(selectedTime);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your events...</Text>
      </View>
    );
  }

  if (userEvents.length === 0) {
    return (
      <View style={styles.noEventsContainer}>
        <Text style={styles.noEventsText}>No events found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Event</Text>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                Select Date: {updatedDate.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                Select Time: {updatedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={updatedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={updatedTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <View style={styles.modalButtons}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  eventCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickerButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  pickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});

export default UserEventsScreen;
