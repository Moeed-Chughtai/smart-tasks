import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

const Header = ({ tasks }) => {
  const todayTasks = tasks.today || [];
  const incompleteTodayTasks = todayTasks.filter(task => !task.completed);

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>
            SmartTasks
          </Text>
          {incompleteTodayTasks.length > 0 && (
            <Text variant="bodyMedium" style={styles.subtitle}>
              You have {incompleteTodayTasks.length} task{incompleteTodayTasks.length !== 1 ? 's' : ''} due today
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerCard: {
    elevation: 2,
    backgroundColor: '#6200ee',
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default Header;
