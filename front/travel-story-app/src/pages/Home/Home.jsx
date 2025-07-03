import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Input/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/cards/TravelStoryCard';

function Home() {
  const navigate = useNavigate();
  const [userinfo, setuserinfo] = useState(null);
  const [allstories, setallstories] = useState([]);

  // Get user info
  const gatheruserinfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setuserinfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all travel stories
  const getallstories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setallstories(response.data.stories);
      }
    } catch (error) {
      // Optionally handle error
    }
  };


  // Handle edit story click
  const handleviewstory = (data) => {}


  // Handle update favorite 
  const upadteisfavorite = async (storydata) => {}


  useEffect(() => {
    getallstories();
    gatheruserinfo();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar userinfo={userinfo} />

      <div className='container mx-auto py-10'>
        <div className='flex gap-3'>
          <div className='flex-1'>
            {allstories.length > 0 ? (
              <div className='grid grid-cols-2 gap-4'>
                {allstories.map((item) => (
                  <TravelStoryCard 
                    key={item._id} 
                    imgurl={item.imgurl}
                    title={item.title}
                    story={item.story}
                    date={item.visiteddate} 
                    visitedlocation={item.visitedlocation}
                    isFavourite={item.isFavourite}
                    onClick={() => handleviewstory(item)}
                    onFavourite={() => upadteisfavorite(item)}
                  />
                ))}
              </div>
            ) : (
              <>Empty Card Here</>
            )}
          </div>
          <div className='w-[320px]'>
            {/* Sidebar or additional content can go here */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;