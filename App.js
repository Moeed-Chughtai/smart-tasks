import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { initDatabase, addTask, getTasks, updateTask, deleteTask } from './src/database/database';
import { parseTaskInput, formatDueDate, getPriorityColor, getPriorityLabel } from './src/utils/taskParser';
import { createTask, sortTasks, groupTasksByDate } from './src/types/Task';
import TaskInput from './src/components/TaskInput';
import TaskList from './src/components/TaskList';
import Header from './src/components/Header';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      initDatabase();
      loadTasks();
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to initialize the app');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = () => {
    try {
      const tasksData = getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  const handleAddTask = (input) => {
    try {
      const parsedTask = parseTaskInput(input);
      const task = createTask(parsedTask);
      
      addTask(task);
      loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', error.message || 'Failed to add task');
    }
  };

  const handleToggleTask = (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      updateTask(taskId, { completed: !task.completed });
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTask = (taskId) => {
    try {
      deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const sortedTasks = sortTasks(tasks);
  const groupedTasks = groupTasksByDate(sortedTasks);

  if (loading) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
              {/* You could add a loading spinner here */}
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Header tasks={groupedTasks} />
            <TaskInput onAddTask={handleAddTask} />
            <TaskList 
              tasks={sortedTasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
            <StatusBar style="auto" />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
