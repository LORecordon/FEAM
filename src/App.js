import './App.css';
import {
    HashRouter,
    Route,
    Routes,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import TripsPage from "./components/TripsPage";
import BottomBar from "./components/BottomBar/BottomBar";
import TopNav from "./components/TopNav/TopNav";
import HomePage from "./components/HomePage/HomePage";
import FriendsPage from "./components/FriendsPage/FriendsPage";
import MapPage from "./components/MapPage/MapPage";
import SearchPage from "./components/SearchPage/SearchPage";
import Profile from './components/LogIn/Profile';
import LogIn from './components/LogIn/LogIn';



function App() {

    return (
        <div className="App">
            <HashRouter>
                <div className="App__content">
                    <TopNav />
                    <h1></h1>
                    <Routes>
                        <Route exact path="/" element={<HomePage />} />
                        <Route exact path="/trips" element={<TripsPage />} />
                        <Route exact path="/friends" element={<FriendsPage />} />
                        <Route exact path="/map" element={<MapPage />} />
                        <Route exact path="/search" element={<SearchPage />} />
                        <Route exact path="/login" element={<LogIn />} />

                       

                    </Routes>
                </div>
                <BottomBar />
            </HashRouter>
        </div>

    );
}

export default App;
