import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

const TaskInput = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline={false}
            style={styles.textInput}
            mode="flat"
            placeholder="Add a new task..."
            placeholderTextColor="#9ca3af"
            disabled={isSubmitting}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            contentStyle={styles.inputContent}
          />
          {input.trim() && (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={styles.submitButton}
            >
              <View style={styles.submitGradient}>
                <Text style={styles.submitText}>✓</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.suggestionContainer}>
        <Text variant="bodySmall" style={styles.suggestionText}>
          Try: "Buy milk tomorrow" or "Call John by Friday"
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: '#667eea',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContent: {
    paddingVertical: 0,
    marginVertical: 0,
  },
  submitButton: {
    marginLeft: 12,
  },
  submitGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  suggestionText: {
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default TaskInput;
