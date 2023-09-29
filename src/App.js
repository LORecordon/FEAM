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
import LogIn from './components/LogIn/LogIn';
import TripPage from './components/TripPage/TripPage';
import TripsNew from './components/TripsPage/TripsNew';
import Profile from './components/Profile/Profile';
import FriendshipTokenHandler from './components/FTH/FTH';
import PostPage from './components/PostPage/PostPage';


function App() {

    return (
        <div className="App">
            <HashRouter>
            <FriendshipTokenHandler />
                <div className="App__content">
                    <TopNav />
                    <Routes>
                        <Route exact path="/" element={<HomePage />} />
                        <Route exact path="/trips" element={<TripsPage />} />
                        <Route exact path="/friends" element={<FriendsPage />} />
                        <Route exact path="/map" element={<MapPage />} />
                        <Route exact path="/search" element={<SearchPage />} />
                        <Route exact path="/login" element={<LogIn />} />
                        <Route path="/trip/:id" element={<TripPage />} />
                        <Route path="/tripsnew" element={<TripsNew />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/post/:id" element={<PostPage />} />
                       

                    </Routes>
                </div>
                <BottomBar />
            </HashRouter>
        </div>

    );
}

export default App;
