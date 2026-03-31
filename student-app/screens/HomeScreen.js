import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
// API configuration
const API_BASE_URL = 'http://localhost:8000'; // Change this for physical device testing

export default function HomeScreen({ navigation }) {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch schools from API when component mounts
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools from:', `${API_BASE_URL}/schools`);
      const response = await fetch(`${API_BASE_URL}/schools`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const schoolsData = await response.json();
      console.log('Schools fetched:', schoolsData);
      
      setSchools(schoolsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setLoading(false);
      Alert.alert(
        'Connection Error',
        'Could not connect to server. Make sure your backend is running.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNext = () => {
    if (!selectedSchool) {
      Alert.alert('Please Select', 'Please select your school before continuing.');
      return;
    }

    // Find the selected school object
    const school = schools.find(s => s.id.toString() === selectedSchool);
    console.log('Selected school:', school);

    // Navigate to surveys screen with selected school data
    navigation.navigate('Surveys', { 
      schoolId: school.id, 
      schoolName: school.name 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading schools...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Survey App!</Text>
        <Text style={styles.subtitle}>
          Help your school earn funding by participating in surveys
        </Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Your School:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSchool}
              onValueChange={(itemValue) => setSelectedSchool(itemValue)}
              style={styles.picker}
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
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, !selectedSchool && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedSchool}
        >
          <Text style={styles.nextButtonText}>Next →</Text>
        </TouchableOpacity>

        {/* Test/Debug Section */}
        <View style={styles.debugSection}>
          <Text style={styles.debugText}>
            Schools loaded: {schools.length}
          </Text>
          <Text style={styles.debugText}>
            Selected: {selectedSchool || 'None'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  pickerContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  pickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  nextButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  debugSection: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
});