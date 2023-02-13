import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ProgressBar} from "./components/progress-bar";
import {TableComponent} from "./components/dataTable";

function App() {
    return (
        <div className="App">
            <TableComponent></TableComponent>
        </div>
    );
}

export default App;
