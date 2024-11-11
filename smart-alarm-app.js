// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { Camera } from 'lucide-react';

// Custom hook for managing alarms
const useAlarms = () => {
  const [alarms, setAlarms] = useState([]);

  const addAlarm = (newAlarm) => {
    setAlarms([...alarms, { ...newAlarm, id: Date.now() }]);
  };

  const removeAlarm = (id) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  return { alarms, addAlarm, removeAlarm };
};

// Custom gesture handler for dismissing alarms
const useDismissGesture = () => {
  const pan = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x, dy: pan.y }
    ], { useNativeDriver: false }),
    onPanResponderRelease: (evt, gestureState) => {
      // Check if gesture is sufficient to dismiss
      if (Math.abs(gestureState.dx) > 200) {
        return true;
      }
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false
      }).start();
      return false;
    }
  });

  return { pan, panResponder };
};

// HomeScreen Component
const HomeScreen = ({ navigation }) => {
  const { alarms, addAlarm, removeAlarm } = useAlarms();
  const [sleepData, setSleepData] = useState({
    sleepTime: null,
    wakeTime: null,
    quality: null
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Alarm</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('SetAlarm')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alarmList}>
        {alarms.map(alarm => (
          <AlarmItem 
            key={alarm.id} 
            alarm={alarm}
            onDelete={removeAlarm}
          />
        ))}
      </View>

      <View style={styles.sleepStats}>
        <Text style={styles.statsTitle}>Sleep Statistics</Text>
        <View style={styles.statsGrid}>
          <StatBox 
            title="Sleep Duration" 
            value={sleepData.sleepTime ? "8hrs 20min" : "Not tracked"}
          />
          <StatBox 
            title="Sleep Quality" 
            value={sleepData.quality ? "85%" : "Not tracked"}
          />
        </View>
      </View>
    </View>
  );
};

// AlarmItem Component
const AlarmItem = ({ alarm, onDelete }) => {
  const { pan, panResponder } = useDismissGesture();

  return (
    <Animated.View
      style={[
        styles.alarmItem,
        { transform: [{ translateX: pan.x }] }
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.alarmTime}>{alarm.time}</Text>
      <View style={styles.alarmDetails}>
        <Text style={styles.alarmDays}>
          {alarm.days.join(', ')}
        </Text>
        <Text style={styles.alarmLabel}>{alarm.label}</Text>
      </View>
    </Animated.View>
  );
};

// ChatBot Component
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'user'
    };
    setMessages([...messages, newMessage]);
    // Here you would typically make an API call to your chatbot backend
    // For now, we'll simulate a response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Good morning! I'll help you wake up. How are you feeling?",
        sender: 'bot'
      };
      setMessages(messages => [...messages, botResponse]);
    }, 1000);
  };

  return (
    <View style={styles.chatContainer}>
      {/* Chat messages */}
      <View style={styles.messageList}>
        {messages.map(message => (
          <View 
            key={message.id}
            style={[
              styles.message,
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  alarmList: {
    marginBottom: 20,
  },
  alarmItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  alarmDetails: {
    marginTop: 5,
  },
  alarmDays: {
    color: '#666',
    fontSize: 14,
  },
  alarmLabel: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 2,
  },
  sleepStats: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  messageList: {
    flex: 1,
  },
  message: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E9E9EB',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#333',
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
