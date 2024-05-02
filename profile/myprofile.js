import React from 'react';
//import './myprofile.css'; // Import CSS for styling
import './myprofile.css';
import SubjectPost from './subjectPost';
import BookingUI from '../ui/bookingUI';
import CalendarUI from '../ui/calendar';
import {db} from "../auth/firebase";
import firebase from "../auth/firebase";
import {collection, doc,getDoc} from "firebase/firestore";

import { useState,useEffect } from 'react';


function ProfilePage({firebase_uid}) {


    const posts = [
        {
           subject:"Mathematics",
            year_level: 12,
            description:"Hello bello! aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        },

        {
            subject:"Mathematics",
             year_level: 12,
             description:"Hello bello! aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
         },

    ];

    const handleSignOut = () => {
        firebase.auth().signOut()
          .then(() => {
            console.log('User signed out successfully');
          })
          .catch((error) => {
            console.error('Error signing out:', error);
          });
      };

    const user= firebase.auth().currentUser;
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from Firestore when the component mounts
        console.log("USE EFFECT");

        const fetchData = async () => {
        try {
            console.log("FETCHING");
            const docRef = doc(collection(db,"profiles"),user.uid);
            await getDoc(docRef).then((snapshot) => {
                console.log("Snapshot:",snapshot.data());
                const fetchedData={id:snapshot.id, ...snapshot.data()};
                setData(fetchedData);

            });
            console.log("HI");

            

        } catch (error) {
            console.error('Error fetching data: ', error);
        }
        };

        fetchData();

        // Clean up the listener when the component unmounts
        return () => {};
    }, []);

    const name = data.name;
    const bio = data.bio;
    const schedule = data.schedule;

    console.log("data:",data);

    return (
        <div className='full-profile-page'>
            <div className="profile-container">

                <div className="profile-header">
                    <img src="profile.jpg" alt="Profile" className="profile-picture" />
                    <div className="profile-info">
                        <h2 className="profile-name">{name}</h2>
                        <p className="profile-bio">{bio}</p>
                    </div>
                </div>

            </div>
            <div className="booking">
                <CalendarUI onSelection={(v) => {

                }} schedule={schedule}
                />
            </div>
            <button onClick={handleSignOut}>Sign Out</button>
            <div className="subject-posts-list">
                {posts.map(post => (
                    <div className="subject-post-div"> 
                
                        <SubjectPost subject={post.subject} year_level={post.year_level} description={post.description} />
                    </div>
                        ))}
            </div>
            
        </div>
    );
}

export default ProfilePage;