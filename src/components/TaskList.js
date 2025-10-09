import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Checkbox, IconButton, Chip } from 'react-native-paper';
import { formatDueDate, getPriorityColor, getPriorityLabel } from '../utils/taskParser';

const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
  const renderTask = ({ item: task }) => (
    <TaskItem 
      task={task} 
      onToggleTask={onToggleTask}
      onDeleteTask={onDeleteTask}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>
        No tasks yet. Add one above to get started!
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
      />
    </View>
  );
};

const TaskItem = ({ task, onToggleTask, onDeleteTask }) => {
  const dueDateFormatted = formatDueDate(task.dueDate);
  const priorityColor = getPriorityColor(task.priority);
  const priorityLabel = getPriorityLabel(task.priority);

  return (
    <Card style={[styles.taskCard, task.completed && styles.completedTask]}>
      <Card.Content style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <Checkbox
              status={task.completed ? 'checked' : 'unchecked'}
              onPress={() => onToggleTask(task.id)}
              color={priorityColor}
            />
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
                <Text 
                  variant="bodySmall" 
                  style={[
                    styles.dueDate,
                    task.completed && styles.completedText
                  ]}
                >
                  Due: {dueDateFormatted}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.taskActions}>
            <Chip 
              mode="outlined" 
              textStyle={{ color: priorityColor, fontSize: 12 }}
              style={[styles.priorityChip, { borderColor: priorityColor }]}
            >
              {priorityLabel}
            </Chip>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDeleteTask(task.id)}
              iconColor="#f44336"
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  taskCard: {
    marginBottom: 8,
    elevation: 1,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskContent: {
    paddingVertical: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  taskTitle: {
    fontWeight: '500',
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  dueDate: {
    color: '#666',
    fontStyle: 'italic',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityChip: {
    marginRight: 4,
    height: 28,
  },
});

export default TaskList;
