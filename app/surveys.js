import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const API_BASE_URL = 'http://localhost:8000';

export default function SurveysScreen() {
  const { schoolId, schoolName } = useLocalSearchParams();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys`);
      const surveysData = await response.json();
      setSurveys(surveysData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setLoading(false);
      Alert.alert('Error', 'Could not load surveys');
    }
  };

  const handleSurveySelect = (survey) => {
    Alert.alert('Survey Selected', `You selected: ${survey.title}`);
    // Later we'll navigate to the survey questions
  };

  const renderSurveyItem = ({ item: survey }) => (
    <TouchableOpacity 
      style={styles.surveyCard}
      onPress={() => handleSurveySelect(survey)}
    >
      <Text style={styles.surveyTitle}>{survey.title}</Text>
      <Text style={styles.surveyCategory}>{survey.category}</Text>
      <Text style={styles.surveyQuestions}>
        {survey.questions.length} questions
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text>Loading surveys...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.schoolText}>School: {schoolName}</Text>
      <Text style={styles.title}>Choose a Survey</Text>
      
      <FlatList
        data={surveys}
        renderItem={renderSurveyItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.surveyList}
      />
      
      <Text style={styles.debug}>
        Surveys loaded: {surveys.length} | School ID: {schoolId}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  surveyList: {
    flex: 1,
  },
  surveyCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  surveyCategory: {
    fontSize: 14,
    color: '#4F46E5',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  surveyQuestions: {
    fontSize: 14,
    color: '#64748B',
  },
  debug: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});