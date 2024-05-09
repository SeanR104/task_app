import React, { useState } from 'react';
import './App.css';
import { LoginForm } from './Components/LoginForm/LoginForm';
import { SignUpForm } from './Components/SignUpForm/SignUpForm';
import { TaskList } from './Components/TaskList/TaskList';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showTaskList, setShowTaskList] = useState(false);
  
  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const toggleTaskList = () => {
    setShowTaskList(!showTaskList);
  }

  return (
    <div>
      {showTaskList ? (
        <TaskList />
      ) : (
        showLoginForm ? <LoginForm switchToSignUpForm={toggleForm} switchToTaskList={toggleTaskList}/> : <SignUpForm switchToLoginForm={toggleForm} switchToTaskList={toggleTaskList}/>
      )}
    </div>
  );
}

export default App;
