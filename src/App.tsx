import React, { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import Header from './components/Header'
import TaskSorter from './components/TaskSorter'



const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('home');

  const handleHomeClick = () => {
    setCurrentSection('home')
  }

   // Function to toggle the modal

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
      <Sidebar onHomeClick={handleHomeClick} />
      <MainContent currentSection={currentSection} />   
      </div>
    </div>
  )
}

export default App;