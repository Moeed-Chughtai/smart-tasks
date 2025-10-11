# SmartTasks

A React Native task management app built with Expo that uses natural language processing to intelligently parse task inputs.

## Features
- **Natural Language Processing**: Type tasks in natural language like "Pay rent by Friday" or "Call John ASAP"
- **Date Detection**: Automatically extracts due dates from phrases like "tomorrow", "next week", "Friday"
- **Clean Titles**: Removes date phrases from task titles for cleaner display

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
