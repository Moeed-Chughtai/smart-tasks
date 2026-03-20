import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('smarttasks.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      dueDate TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      sortOrder INTEGER DEFAULT 0,
      tab TEXT DEFAULT 'now'
    );
  `);

  // Migration: add columns for existing installs
  try { db.execSync(`ALTER TABLE tasks ADD COLUMN sortOrder INTEGER DEFAULT 0`); } catch (e) {}
  try { db.execSync(`ALTER TABLE tasks ADD COLUMN tab TEXT DEFAULT 'now'`); } catch (e) {}

  // Assign sort orders to migrated tasks (all will have sortOrder=0)
  const check = db.getFirstSync('SELECT COUNT(*) as cnt FROM tasks WHERE sortOrder > 0');
  if (check.cnt === 0) {
    const rows = db.getAllSync('SELECT id FROM tasks ORDER BY completed ASC, dueDate ASC, createdAt ASC');
    rows.forEach((row, i) => {
      db.runSync('UPDATE tasks SET sortOrder = ? WHERE id = ?', [i, row.id]);
    });
  }
};

const getNextSortOrder = (tab) => {
  const result = db.getFirstSync('SELECT MAX(sortOrder) as mx FROM tasks WHERE tab = ?', [tab]);
  return (result?.mx ?? -1) + 1;
};

export const addTask = (task) => {
  const { id, title, dueDate, completed, tab = 'now' } = task;
  const createdAt = new Date().toISOString();
  const sortOrder = getNextSortOrder(tab);
  db.runSync(
    'INSERT INTO tasks (id, title, dueDate, completed, createdAt, sortOrder, tab) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, title, dueDate, completed ? 1 : 0, createdAt, sortOrder, tab]
  );
};

export const getTasks = (tab) => {
  const rows = db.getAllSync(
    'SELECT * FROM tasks WHERE tab = ? ORDER BY completed ASC, sortOrder ASC',
    [tab]
  );
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    dueDate: r.dueDate,
    completed: Boolean(r.completed),
    createdAt: r.createdAt,
    sortOrder: r.sortOrder,
    tab: r.tab,
  }));
};

export const updateTask = (id, fields) => {
  const updates = [];
  const values = [];
  Object.keys(fields).forEach(key => {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(key === 'completed' ? (fields[key] ? 1 : 0) : fields[key]);
    }
  });
  if (updates.length === 0) return;
  values.push(id);
  db.runSync(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
};

export const deleteTask = (id) => {
  db.runSync('DELETE FROM tasks WHERE id = ?', [id]);
};

export const swapTaskOrder = (id1, id2) => {
  const t1 = db.getFirstSync('SELECT sortOrder FROM tasks WHERE id = ?', [id1]);
  const t2 = db.getFirstSync('SELECT sortOrder FROM tasks WHERE id = ?', [id2]);
  if (!t1 || !t2) return;
  db.runSync('UPDATE tasks SET sortOrder = ? WHERE id = ?', [t2.sortOrder, id1]);
  db.runSync('UPDATE tasks SET sortOrder = ? WHERE id = ?', [t1.sortOrder, id2]);
};

export const moveTaskToTab = (id, newTab) => {
  const order = getNextSortOrder(newTab);
  db.runSync('UPDATE tasks SET tab = ?, sortOrder = ? WHERE id = ?', [newTab, order, id]);
};

export const reorderTasks = (orderedIds) => {
  orderedIds.forEach((id, index) => {
    db.runSync('UPDATE tasks SET sortOrder = ? WHERE id = ?', [index, id]);
  });
};
