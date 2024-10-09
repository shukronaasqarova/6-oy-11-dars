import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [majorFilter, setMajorFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [majorsList, updateMajorsList] = useState([])

  useEffect(() => {
    getDevelopers()
  }, [])

  useEffect(() => {
    const majors = []
    developers.forEach(developer => {
      if (!majors.includes(developer.major)) {
        majors.push(developer.major)
      }
    })
    updateMajorsList(majors)
  }, [developers])

  const getDevelopers = () => {
    setLoading(true)
    axios.get(`https://json-api.uz/api/project/11-dars/developers`, {
      params: {
        skip: pageCount * 10,
        limit: 10
      }
    })
    .then(response => {
      if (response.data && response.data.data) {
        setDevelopers(oldDevelopers => [...oldDevelopers, ...response.data.data])
        setPageCount(oldCount => oldCount + 1)
      }
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const showMoreDevelopers = () => {
    getDevelopers()
  }

  const filteredDevelopers = developers.filter(developer => 
    (majorFilter === '' || developer.major === majorFilter) &&
    (genderFilter === '' || developer.gender === genderFilter)
  )

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      <h1 className="text-5xl font-bold mb-12 text-center text-blue-700 shadow-text">Dasturchilar ro'yxati</h1>
      
      <div className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 p-6">
        <div className="w-full sm:w-1/2 max-w-xs">
          <label htmlFor="major-filter" className="block text-sm font-medium text-gray-700 mb-2">Yo'nalish bo'yicha filtrlash</label>
          <select 
            id="major-filter"
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            value={majorFilter} 
            onChange={(e) => setMajorFilter(e.target.value)}
          >
            <option value="">Barcha yo'nalishlar</option>
            {majorsList.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-1/2 max-w-xs">
          <label htmlFor="gender-filter" className="block text-sm font-medium text-gray-700 mb-2">Jins bo'yicha filtrlash</label>
          <select 
            id="gender-filter"
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            value={genderFilter} 
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">Barcha jinslar</option>
            <option value="Male">Erkak</option>
            <option value="Female">Ayol</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {filteredDevelopers.map((developer) => (
          <div key={developer.id} className="card bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-sm">
            <div className="card-body p-6">
              <h2 className="card-title text-2xl font-bold text-blue-700 mb-4">{developer.fullName}</h2>
              <p className="text-gray-700 mb-2"><span className="font-semibold text-blue-600">Yosh:</span> {developer.age}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold text-blue-600">Jinsi:</span> {developer.gender === 'Male' ? 'Erkak' : 'Ayol'}</p>
              <p className="text-gray-700"><span className="font-semibold text-blue-600">Yo'nalish:</span> {developer.major}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-12">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-700"></div>
        </div>
      ) : (
        pageCount * 10 < 315 && (
          <div className="mt-12 text-center">
            <button className="btn btn-primary bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={showMoreDevelopers}>
              Yana 10 ta ko'rsatish
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default App