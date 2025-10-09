import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

const Header = ({ tasks }) => {
  const todayTasks = tasks.today || [];
  const incompleteTodayTasks = todayTasks.filter(task => !task.completed);
  const totalIncompleteTasks = (tasks.today || []).concat(tasks.tomorrow || []).concat(tasks.thisWeek || []).concat(tasks.later || []).concat(tasks.noDate || []).filter(task => !task.completed);

  return (
    <View style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text variant="headlineLarge" style={styles.title}>
              SmartTasks
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            {incompleteTodayTasks.length > 0 && (
              <View style={styles.statItem}>
                <Text variant="titleLarge" style={styles.statNumber}>
                  {incompleteTodayTasks.length}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Due Today
                </Text>
              </View>
            )}
            
            <View style={styles.statItem}>
              <Text variant="titleLarge" style={styles.statNumber}>
                {totalIncompleteTasks.length}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Total Tasks
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    backgroundColor: '#667eea',
    paddingTop: 50, // Account for status bar
    paddingBottom: 20,
  },
  container: {
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontWeight: '700',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Header;
