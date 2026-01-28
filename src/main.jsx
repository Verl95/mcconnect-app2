import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Debug Step 1: Find the box
const rootDiv = document.getElementById('root');

// Debug Step 2: Check if it exists
if (!rootDiv) {
    alert("CRITICAL ERROR: I cannot find the <div id='root'>. Please check index.html");
} else {
    // Debug Step 3: Try to Render
    try {
        const root = ReactDOM.createRoot(rootDiv);
        root.render(<App />);
        // If we get here without error, React has handed off the code
    } catch (e) {
        alert("REACT CRASHED: " + e.message);
    }
}

