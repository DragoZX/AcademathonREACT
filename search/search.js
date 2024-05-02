import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./search.css"
import CalendarUI from '../ui/calendar';
import Layout from '../layout';
import ProfilePost from '../ui/post';
import Button from '../ui/button';
import {db} from "../auth/firebase";
import {collection,query,where,getDocs} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


async function searchDocumentByDate(searchDate){
    try{
        const dayName = searchDate.toLocaleDateString('en-US', { weekday: 'long' });
        console.log(`DAY NAME: ${dayName}`);
        const q = query(
            collection(db, 'profiles'),
            where(`schedule.${dayName}`, '!=', [])
          );
        console.log("BEFORE AWAIT");
        const querySnapshot = await getDocs(q);
        console.log("query docs:",querySnapshot);
        const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return fetchedData;
    }catch(error){
        console.error(error);
    }
}


function SearchPage() {
    const [value,onChange] = useState(new Date());
    const [selectedOption,setSelectedOption] = useState(null);
    const navigate = useNavigate();
   // const [posts, setPosts] = useState([]);
    
    /*
    useEffect(() => {
        const fetchPosts = async () => {
          const postsRef = firebase.database().ref('posts');
          const snapshot = await postsRef.once('value');
          const postsData = snapshot.val();
          if (postsData) {
            const postsArray = Object.values(postsData);
            setPosts(postsArray);
          }
        };
    
        fetchPosts();
      }, []);
    */
    const [posts, setPosts] = useState([]);
    const [searchDate, setSearchDate] = useState(new Date()); // Set your search date here

    const handleDateSearch = async () => {
        try {
        const fetchedData = await searchDocumentByDate(searchDate);
        console.log("data:",fetchedData);
        
        setPosts(fetchedData);
        } catch (error) {
        // Handle error
        }
    };
    const tileClassName = ({ date, view }) => {
        // Check if the current date is selected
        if (view === 'month' && date.getDate() === value.getDate() &&  date.getMonth() === value.getMonth()) {
            return 'selected-tile'; // Apply custom class for selected date
        }else{
            return 'normal-tile';
        }
    };
    /*
    const posts = [
        {   
            key:"12",
            name:"Bader",
            bio:"Bio",
            subjects:"subjects",
        },
        {   
            key:"12",
            name:"Bader",
            bio:"this is my bio and like i am SOOOOOO stressed out.... :D \
            oooooh my goooooooooododofk wofkwr o rogj orgjowr gowrj gworg jwrog kjrwogk \n\nsomboedy jhelp me",
            subjects:"subjects",
        },
        {   
            key:"12",
            name:"Bader Ismail",
            bio:"Somebody help me waaah",
            subjects:"subjects",
        }
    ];
    */

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };
    const onSelection = (date) => {
        setSearchDate(date);
        console.log("Selected date:", searchDate);
    } ;

    const colorTile = ({date,view,selectedValue,schedule}) => {
        if(view ==='month' && date.getDate() === selectedValue.getDate() &&  date.getMonth() === selectedValue.getMonth()){
            return 'selected-tile';
        }
        return 'white-tile';
    };

    const search = async () => {
        if(selectedOption==='calendar-option'){
            handleDateSearch();
        }
    };

    const goToProfile = (profile_uid) => {
        navigate(`/viewprofile?uid=${profile_uid}`);
    }

  return (
    <Layout>
    

     <div className="search-container">
            
            <div className="left-column">
                {/* Filter options */}
                <h3>Filters</h3>
                <ul>
                    <li onClick={() => handleOptionClick('calendar-option')}>Calendar Search</li>
                    <li onClick={() => handleOptionClick('text-option')}>Name Search</li>
                    {/* Add more filter options */}
                </ul>
            </div>

            <div className="main-content">
                {/* Main content area */}
                <h2>Search Results</h2>
                <div className="search-fields">
                    {selectedOption === 'calendar-option' && <CalendarUIOption onSelectionFunction={onSelection} coloringFunction={colorTile}/>}
                    {selectedOption === 'text-option' && <TextUIOption/>}
                    <div className="search-button">
                        <Button text="Search" onClick={search}/>
                    </div>
                </div>
                <div className="posts">
                    {posts.map(post => (
                        <div className="profile-post-container">
                            <ProfilePost name={post.name} bio={post.bio} subjects={post.subjects} picture={post.picture} onClick= {() => {
                                goToProfile(post.id);
                            } }/>
                        </div>
                    ))}
                </div>
            </div>
    </div>
    </Layout>
  );
}

function CalendarUIOption({onSelectionFunction, coloringFunction}){
    console.log("Selection:",onSelectionFunction);
    return (<div className="calendar">
        <CalendarUI onSelection={onSelectionFunction} applyTileFunction={coloringFunction}/>
    </div>);
}

function TextUIOption(){
    return (<div className="text-search">
        <h1> Search Here</h1>
    </div>);
}



export default SearchPage;