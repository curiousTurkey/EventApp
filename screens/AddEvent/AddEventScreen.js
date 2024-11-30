import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth } from "firebase/auth";
import { addEvent } from "../../firebase/database";

const AddEventScreen = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate;
    setShowDatePicker(Platform.OS === "ios");
    setEventDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || eventTime;
    setShowTimePicker(Platform.OS === "ios");
    setEventTime(new Date(currentTime));
  };

  const handleSubmit = async () => {
    console.log("Event Details Submitted");
    console.log("Name:", eventName);
    console.log("Date:", eventDate.toLocaleDateString());
    console.log("Time:", eventTime.toLocaleTimeString());
    const eventData = {
      eventName: eventName,
      eventDate: eventDate.toLocaleDateString(),
      eventTime: eventTime.toLocaleTimeString(),
      eventAuthor: getAuth().currentUser.uid,
      name: getAuth().currentUser.displayName
    }
    if(eventName === ""){
      alert("Event name cannot be empty!");
      return;
    }
    setIsLoading(true);
    await addEvent(eventData);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Event</Text>


      <TextInput
        style={styles.input}
        placeholder="Event Name"
        placeholderTextColor="#888"
        value={eventName}
        onChangeText={(text) => setEventName(text)}
      />
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectButtonText}>Select Date</Text>
        </TouchableOpacity>
        {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={eventDate}
          mode="date"
          is24Hour={false}
          display="default"
          onChange={onChangeDate}
        />
      )}
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.selectButtonText}>Select Time</Text>
        </TouchableOpacity>
        {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={eventTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onChangeTime}
        />
      )}
      </View>

      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateText}>
          Event Date: {eventDate.toLocaleDateString()}
        </Text>
        <Text style={styles.timeText}>
          Event Time: {eventTime.toLocaleTimeString()}
        </Text>
      </View>


      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        {isLoading ? <ActivityIndicator color={"white"}/>: <Text style={styles.submitButtonText}>Submit Event</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: "#199501",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dateInput: {
    width: "40%",
    marginLeft: 10,
  },
  timeInput: {
    width: "60%",
    marginLeft: 10,
  },
  dateTimeContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  timeText: {
    fontSize: 18,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#199501",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default AddEventScreen;
