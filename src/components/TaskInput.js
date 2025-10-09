import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';

const TaskInput = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;

    setIsSubmitting(true);
    try {
      onAddTask(input.trim());
      setInput('');
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.inputCard}>
        <Card.Content style={styles.inputContent}>
          <TextInput
            label="Add a task..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSubmit}
            multiline={false}
            style={styles.textInput}
            mode="outlined"
            placeholder="e.g., Pay rent by Friday, Buy milk tomorrow, Call John ASAP"
            disabled={isSubmitting}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!input.trim() || isSubmitting}
            style={styles.submitButton}
            loading={isSubmitting}
          >
            Add Task
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  inputCard: {
    elevation: 2,
  },
  inputContent: {
    paddingVertical: 8,
  },
  textInput: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  submitButton: {
    alignSelf: 'flex-end',
  },
});

export default TaskInput;
