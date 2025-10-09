// Task data model and validation

export const createTask = (data) => {
  const {
    id,
    title,
    dueDate = null,
    completed = false,
    createdAt = new Date().toISOString()
  } = data;

  // Validate required fields
  if (!id || !title) {
    throw new Error('Task must have an id and title');
  }

  // Validate dueDate if provided
  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    throw new Error('Invalid due date format');
  }

  return {
    id: String(id),
    title: String(title).trim(),
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    completed: Boolean(completed),
    createdAt: String(createdAt)
  };
};

export const validateTask = (task) => {
  try {
    createTask(task);
    return true;
  } catch (error) {
    console.error('Task validation failed:', error.message);
    return false;
  }
};

export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then, sort by due date (earliest first, null dates last)
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
    } else if (a.dueDate && !b.dueDate) {
      return -1;
    } else if (!a.dueDate && b.dueDate) {
      return 1;
    }

    // Finally, sort by creation date (oldest first)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

export const groupTasksByDate = (tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const groups = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    noDate: []
  };

  tasks.forEach(task => {
    if (task.completed) {
      groups.later.push(task);
      return;
    }

    if (!task.dueDate) {
      groups.noDate.push(task);
      return;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() === today.getTime()) {
      groups.today.push(task);
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      groups.tomorrow.push(task);
    } else if (dueDate <= nextWeek) {
      groups.thisWeek.push(task);
    } else {
      groups.later.push(task);
    }
  });

  return groups;
};
