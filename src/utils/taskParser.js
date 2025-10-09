import * as chrono from 'chrono-node';
import { format, isToday, isTomorrow, isThisWeek, isThisYear } from 'date-fns';

export const parseTaskInput = (input) => {
  if (!input || input.trim() === '') {
    throw new Error('Input cannot be empty');
  }

  const trimmedInput = input.trim();
  
  // Parse date using chrono-node
  const parsedDate = chrono.parseDate(trimmedInput);
  
  // Remove date-related phrases from the title
  let title = trimmedInput;
  let dueDate = null;
  
  if (parsedDate) {
    dueDate = parsedDate.toISOString();
    
    // Remove common date phrases from the title
    const datePhrases = [
      'today', 'tomorrow', 'yesterday',
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'next week', 'this week', 'last week',
      'next month', 'this month', 'last month',
      'next year', 'this year', 'last year',
      'asap', 'urgent', 'immediately', 'now', 'emergency', 'critical',
      'someday', 'eventually', 'when possible', 'low priority',
      'morning', 'afternoon', 'evening', 'night',
      'am', 'pm', 'a.m.', 'p.m.'
    ];
    
    // Remove date phrases from title
    title = title.replace(new RegExp(`\\b(${datePhrases.join('|')})\\b`, 'gi'), '').trim();
    
    // Clean up extra spaces and punctuation
    title = title.replace(/\s+/g, ' ').replace(/[,\-]+$/, '').trim();
  }
  
  // If title is empty after removing date phrases, use original input
  if (!title) {
    title = trimmedInput;
  }
  
  // Generate unique ID
  const id = generateId();
  
  return {
    id,
    title,
    dueDate,
    completed: false
  };
};

export const formatDueDate = (dueDateString) => {
  if (!dueDateString) return null;
  
  const date = new Date(dueDateString);
  
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE'); // Day of week
  } else if (isThisYear(date)) {
    return format(date, 'MMM d'); // Month day
  } else {
    return format(date, 'MMM d, yyyy'); // Full date
  }
};

// Removed priority functions as we no longer use priority system

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
