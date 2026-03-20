export const createTask = (data) => {
  const {
    id,
    title,
    dueDate = null,
    completed = false,
    tab = 'now',
    createdAt = new Date().toISOString(),
  } = data;

  if (!id || !title) {
    throw new Error('Task must have an id and title');
  }
  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    throw new Error('Invalid due date format');
  }

  return {
    id: String(id),
    title: String(title).trim(),
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    completed: Boolean(completed),
    tab,
    createdAt: String(createdAt),
  };
};
