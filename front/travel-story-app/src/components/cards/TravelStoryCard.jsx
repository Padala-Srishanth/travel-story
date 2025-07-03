import React from 'react'
import { FaHeart} from "react-icons/fa6"
import { GrMapLocation } from "react-icons/gr"

const TravelStoryCard = ({imgurl,
    title,
    date,
    story,
    visitedLocation,
    isFavorite,
    onFavoriteclick,
    onClick,
}) => {
  return (
    <div>
        <img 
        src={imgurl}
        alt={title}
        className='w-full h-56 object-cover rounded-lg'
        onClick={onClick} 
        />
    </div>
  )
}

export default TravelStoryCard