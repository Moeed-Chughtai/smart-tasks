import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TaskInput = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setInput('');
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, focused && styles.cardFocused]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={submit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Add a task..."
          placeholderTextColor="#a0a5b0"
          style={styles.input}
          multiline
          blurOnSubmit
          textAlignVertical="center"
          returnKeyType="done"
        />
        {input.trim().length > 0 && (
          <TouchableOpacity onPress={submit} style={styles.addBtn} activeOpacity={0.7}>
            <Text style={styles.addLabel}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e5ea',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardFocused: {
    borderColor: '#4f6ef7',
    shadowColor: '#4f6ef7',
    shadowOpacity: 0.1,
  },
  input: {
    flex: 1,
    color: '#1a1d26',
    fontSize: 15,
    fontWeight: '400',
    padding: 0,
    maxHeight: 80,
  },
  addBtn: {
    marginLeft: 10,
    backgroundColor: '#4f6ef7',
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  addLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default TaskInput;
