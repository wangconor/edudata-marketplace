import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

const API_BASE_URL = 'http://localhost:8000';

export default function HomeScreen() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schools`);
      const schoolsData = await response.json();
      setSchools(schoolsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setLoading(false);
      Alert.alert('Connection Error', 'Could not connect to server.');
    }
  };

  const handleNext = () => {
  if (!selectedSchool) {
    Alert.alert('Please Select', 'Please select your school before continuing.');
    return;
  }
  
  const school = schools.find(s => s.id.toString() === selectedSchool);
  router.push({
    pathname: '/surveys',
    params: { 
      schoolId: school.id, 
      schoolName: school.name 
    }
  });
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text>Loading schools...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congressional App Challenge</Text>
      <Text style={styles.subtitle}>Select Your School</Text>
      
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedSchool}
          onValueChange={(itemValue) => setSelectedSchool(itemValue)}
        >
          <Picker.Item label="Choose your school..." value="" />
          {schools.map((school) => (
            <Picker.Item 
              key={school.id} 
              label={school.name} 
              value={school.id.toString()} 
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity 
        style={[styles.button, !selectedSchool && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!selectedSchool}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <Text style={styles.debug}>
        Schools loaded: {schools.length} | Selected: {selectedSchool || 'None'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  pickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  debug: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});