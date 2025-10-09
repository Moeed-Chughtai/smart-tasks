# SmartTasks

A cross-platform React Native task management app built with Expo that uses natural language processing to intelligently parse task inputs.

## Features

### 🧠 Smart Input Parser
- **Natural Language Processing**: Type tasks in natural language like "Pay rent by Friday" or "Call John ASAP"
- **Date Detection**: Automatically extracts due dates from phrases like "tomorrow", "next week", "Friday"
- **Priority Detection**: Recognizes urgency keywords like "ASAP", "urgent", "critical" for high priority
- **Clean Titles**: Removes date phrases from task titles for cleaner display

### 📱 Core Functionality
- **Local Database**: All data stored locally using SQLite (expo-sqlite)
- **Smart Sorting**: Tasks sorted by due date, priority, and completion status
- **Task Management**: Add, complete, and delete tasks
- **Visual Priority**: Color-coded priority levels (High: Red, Normal: Orange, Low: Green)
- **Due Date Display**: Formatted due dates (Today, Tomorrow, Day of week, etc.)

### 🎨 User Interface
- **Modern Design**: Built with React Native Paper for Material Design
- **Responsive Layout**: Works on both iOS and Android
- **Task Banner**: Shows count of tasks due today
- **Empty State**: Helpful message when no tasks exist
- **Keyboard Handling**: Proper keyboard avoidance for better UX

## Example Usage

Type any of these natural language inputs:

```
"Pay rent by Friday"
"Buy milk tomorrow"
"Call mom ASAP"
"Submit report next week"
"Fix bug urgent"
"Learn React Native someday"
```

The app will automatically:
- Extract the task title
- Parse the due date
- Set the appropriate priority
- Store it in the local database

## Technical Architecture

### Database Layer (`src/database/database.js`)
- SQLite database with `tasks` table
- Functions: `addTask`, `getTasks`, `updateTask`, `deleteTask`
- Automatic database initialization

### Smart Parser (`src/utils/taskParser.js`)
- Uses `chrono-node` for date parsing
- Keyword detection for priority levels
- Title cleaning to remove date phrases
- Date formatting utilities

### Task Models (`src/types/Task.js`)
- Task validation and creation
- Sorting algorithms
- Grouping by date ranges
- Priority constants

### UI Components
- `Header`: App title and today's task count
- `TaskInput`: Natural language input field
- `TaskList`: Scrollable list of tasks with actions

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-tasks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `w` for web
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## Dependencies

- **expo**: React Native framework
- **expo-sqlite**: Local database storage
- **chrono-node**: Natural language date parsing
- **date-fns**: Date formatting utilities
- **react-native-paper**: Material Design components
- **react-native-safe-area-context**: Safe area handling

## Project Structure

```
smart-tasks/
├── App.js                 # Main app component
├── src/
│   ├── components/        # UI components
│   │   ├── Header.js
│   │   ├── TaskInput.js
│   │   └── TaskList.js
│   ├── database/          # Database layer
│   │   └── database.js
│   ├── types/             # Data models
│   │   └── Task.js
│   └── utils/             # Utilities
│       └── taskParser.js
└── README.md
```

## Features Implemented

✅ Smart input parsing with natural language  
✅ SQLite database with CRUD operations  
✅ Task sorting by due date and priority  
✅ Visual priority indicators  
✅ Task completion functionality  
✅ Modern Material Design UI  
✅ Cross-platform compatibility  
✅ Offline-first architecture  

## Future Enhancements

- Task categories/tags
- Recurring tasks
- Task search and filtering
- Export/import functionality
- Push notifications for due tasks
- Dark mode theme
- Task sharing capabilities

## License

MIT License - feel free to use this project for learning or as a starting point for your own task management app!
