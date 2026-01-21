import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const [movies, setMovies] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const [trendingMovies, setTrendingMovies] = useState([])

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm)
    },
    500,
    [searchTerm]
  )


  const fetchMovies = async (query = '') => {
    try {
      setLoading(true)
      setErrorMessage("")

      const res = query
        ? await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
        : await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=hollywood`)

      if (!res.ok) throw new Error("Failed to fetch movies")

      const data = await res.json()

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies")
        setMovies([])
        return
      }

      setMovies(data.Search || [])

      if (query && data.Search.length > 0) {
        await updateSearchCount(query, data.Search[0])

      }
    } catch (error) {
      console.error(error)
      setErrorMessage("Failed to fetch movies")
    } finally {
      setLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()

      setTrendingMovies(movies)
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMovies(debouncedSearchTerm)
    } else {
      fetchMovies()   // loads hollywood
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies()
  })


  return (
    <main>
      <div className="container">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="Banner Image" />
            <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h1>Trending Movies</h1>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.Title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className='all-movies'>
            <h2>All Movies</h2>
            {
              loading ? (
                <Spinner />
              ) : errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
              ) : (
                <ul>
                  {
                    movies.map((movie) => (
                      <MovieCard key={movie.imdbID} movie={movie} />
                    ))
                  }
                </ul>
              )
            }
          </section>

        </div>
      </div>
    </main>
  )
}

export default App