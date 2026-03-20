import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { initDatabase, addTask, getTasks, updateTask, deleteTask, moveTaskToTab, reorderTasks } from './src/database/database';
import { parseTaskInput } from './src/utils/taskParser';
import { createTask } from './src/types/Task';
import TaskInput from './src/components/TaskInput';
import TaskList from './src/components/TaskList';
import Header from './src/components/Header';

export default function App() {
  const [nowTasks, setNowTasks] = useState([]);
  const [laterTasks, setLaterTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('now');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDatabase();
    loadTasks();
    setLoading(false);
  }, []);

  const loadTasks = () => {
    setNowTasks(getTasks('now'));
    setLaterTasks(getTasks('later'));
  };

  const handleAddTask = (input) => {
    const parsed = parseTaskInput(input);
    const task = createTask({ ...parsed, tab: 'now' });
    addTask(task);
    loadTasks();
  };

  const handleToggleTask = (taskId) => {
    const all = [...nowTasks, ...laterTasks];
    const task = all.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { completed: !task.completed });
    loadTasks();
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    loadTasks();
  };

  const handleReorder = (orderedIds) => {
    reorderTasks(orderedIds);
    loadTasks();
  };

  const handleSendToTab = (taskId) => {
    moveTaskToTab(taskId, activeTab === 'now' ? 'later' : 'now');
    loadTasks();
  };

  const activeTasks = activeTab === 'now' ? nowTasks : laterTasks;
  const nowIncomplete = nowTasks.filter(t => !t.completed).length;
  const laterIncomplete = laterTasks.filter(t => !t.completed).length;

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Header
            activeTab={activeTab}
            onTabChange={setActiveTab}
            nowCount={nowIncomplete}
            laterCount={laterIncomplete}
          />
          <TaskInput onAddTask={handleAddTask} />
          <TaskList
            tasks={activeTasks}
            activeTab={activeTab}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onReorder={handleReorder}
            onSendToTab={handleSendToTab}
          />
          <StatusBar style="dark" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
});
