import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { formatDueDate } from '../utils/taskParser';

const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
  const renderTask = ({ item: task, index }) => (
    <TaskItem 
      task={task} 
      index={index}
      onToggleTask={onToggleTask}
      onDeleteTask={onDeleteTask}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✓</Text>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No tasks yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Add your first task above to get started!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const TaskItem = ({ task, index, onToggleTask, onDeleteTask }) => {
  const dueDateFormatted = formatDueDate(task.dueDate);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <Animated.View 
      style={[
        styles.taskCard,
        task.completed && styles.completedTask,
        isOverdue && styles.overdueTask
      ]}
    >
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => onToggleTask(task.id)}
        activeOpacity={0.7}
      >
        <View style={styles.taskMain}>
          <View style={styles.checkboxContainer}>
            <View style={[
              styles.checkbox,
              task.completed && styles.checkboxCompleted
            ]}>
              {task.completed && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </View>
          
          <View style={styles.taskTextContainer}>
            <Text 
              variant="bodyLarge" 
              style={[
                styles.taskTitle,
                task.completed && styles.completedText
              ]}
            >
              {task.title}
            </Text>
            {dueDateFormatted && (
              <View style={styles.dueDateContainer}>
                <Text 
                  variant="bodySmall" 
                  style={[
                    styles.dueDate,
                    task.completed && styles.completedText,
                    isOverdue && styles.overdueText
                  ]}
                >
                  📅 {dueDateFormatted}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteTask(task.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    color: '#d1d5db',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#374151',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  completedTask: {
    opacity: 0.6,
    backgroundColor: '#f9fafb',
  },
  overdueTask: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    color: '#6b7280',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  overdueText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
});

export default TaskList;
