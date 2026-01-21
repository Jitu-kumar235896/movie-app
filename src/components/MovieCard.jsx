import React from 'react'

const MovieCard = ({ movie: { Poster, Title, Year, Type } }) => {
    return (
        <div className='movie-card'>
            <img src={Poster} alt={Title} />

            <div className="mt-4">
                <h3>{Title}</h3>

                <div className="content text-white">
                    <div className="rating">
                        <img src="Rating.svg" alt="rating-logo" />

                        <span>Y-</span>
                        <p>{Year}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MovieCard
