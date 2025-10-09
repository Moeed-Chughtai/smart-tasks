import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('smarttasks.db');

export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        dueDate TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const addTask = (task) => {
  try {
    const { id, title, dueDate, completed } = task;
    const createdAt = new Date().toISOString();
    
    db.runSync(
      'INSERT INTO tasks (id, title, dueDate, completed, createdAt) VALUES (?, ?, ?, ?, ?)',
      [id, title, dueDate, completed ? 1 : 0, createdAt]
    );
    console.log('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const getTasks = () => {
  try {
    const result = db.getAllSync(
      'SELECT * FROM tasks ORDER BY completed ASC, dueDate ASC, createdAt ASC'
    );
    
    const tasks = result.map(row => ({
      id: row.id,
      title: row.title,
      dueDate: row.dueDate,
      completed: Boolean(row.completed),
      createdAt: row.createdAt
    }));
    
    return tasks;
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

export const updateTask = (id, fields) => {
  try {
    const updates = [];
    const values = [];
    
    Object.keys(fields).forEach(key => {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(key === 'completed' ? (fields[key] ? 1 : 0) : fields[key]);
      }
    });
    
    if (updates.length === 0) {
      return;
    }
    
    values.push(id);
    
    db.runSync(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    console.log('Task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = (id) => {
  try {
    db.runSync(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    console.log('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
