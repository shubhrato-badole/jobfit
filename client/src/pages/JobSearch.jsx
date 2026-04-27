import Recat from "react";
import API from "../components/Api";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";








const JobCard = ({ job, onSave }) => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)


  const handleAnalyze = () => {
    navigate('/analyze', {
      compnay: job.company,
      title: job.title,
      description: job.description,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await API.post(`/api/jobs/saved`, {
        title: job.title,
        company: job.company,
        location: job.location,
        jobUrl: job.url,
        jobDescription: job.description
      })
    } catch (err) {
      if (err.response?.status === 409) onSave(job.id)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className=" border rounded-xl p-4 py-2.5 border-gray-200 ">

    </div>
  )




}








const Jobsearch = () => {

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());


  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return setError("Please enter a job title or keyword")

    setError('')
    setLoading(true)
    setSearched(true)

    try {
      const param = new URLSearchParams()
      param.append('q', query.trim())
      if (location.trim()) param.append('location', location.trim())

      const { data } = await API.get(`/api/jobs/search?${param}`)
      setJobs(data.jobs)

      if (data.jobs?.length === 0) {
        setError('No jobs found. Try a different search term or location.')
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch jobs. Please try again.')
      setJobs([])
    }

    finally {
      setLoading(false)
    }
  }

  const handleSave = (id) => {
    setSavedIds(prev => new Set([...prev, id]))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-xl text-gray-900 font-semibold mb-1">Job Search</h1>
        <p className="text-sm text-gray-600 ">Search real listings from LinkedIn, Indeed and Glassdoor. Click Analyze to instantly check your match.</p>
      </div>
      <div>
        <form onSubmit={handleSearch} className="border bg-white border-gray-200 px-6 py-5 rounded-2xl">
          <div className="flex gap-3 ">
            <div className="flex-1">
              <label className=" block text-sm text-gray-900 font-medium mb-1.5">Job title or skill</label>
              <input
                className=" w-full text-sm tex-gray-400 bg-gray-200 px-3 py-2.5 border border-gray-300 rounded-xl
         text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
                type="text"
                placeholder="React developer, Full stack, Node.js..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError('') }}
                required />
            </div>

            <div className="w-48">
              <label className="text-sm text-gray-900 font-medium m-4">Location (optional)</label>
              <input
                className=" w-full text-sm tex-gray-400 bg-gray-200 px-3 py-2.5 border border-gray-300 rounded-xl
         text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors"
                type="text"
                placeholder="Mumbai, Remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>


            <div className="flex items-end">
              <button
                disabled={loading}
                className=" flex items-center gap-2 mt-5 justify-content
        px-6 py-2.5 tetx-sm text-white rounded-xl 
        font-semibold bg-gray-900
        hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        whitespace-nowrap"
                type="submit"
              >
                {loading ? <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg> Searching...</>
                  : 'Search jobs'}
              </button>
            </div>
          </div>


          <div className="flex flex-wrap gap-3 mt-5">
            <span className="text-xs text-gray-400 py-1">Quick search:</span>

            {['React developer', 'Full stack Node',
              'Frontend engineer', 'JavaScript developer'].map((item => (
                <button type="button" key={item} onClick={() => { setQuery(item); setTimeout(() => handleSearch(), 100) }}
                  className="text-xs text-gray-900 px-3 py-1 border border-gray-300 rounded-xl
  hover:bg-gray-500  hover:text-white transition-colors ">
                  {item}</button>
              )))}
          </div>


        </form>
      </div>



      {error && (<div >
        <p className="text-xs mt-5 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 ">{error}</p>
      </div>)}


      {searched && !loading && jobs.length > 0 && (
        <p>
          Found <span>{jobs.length}</span> jobs for "{query}"
          {location ? ` in ${location}` : ''}
        </p>
      )}
      <div>

        {!loading && !searched && (
          <div className="text-center py-16 mt-10">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M16.5 16.5L21 21" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-sm text-gray-900 font-semibold mb-1.5"> search for jobs</h2>
            <p className="text-sm text-gray-400 mb-1  max-w-sm mx-auto">  Type a role or skill above.
              Click Analyze on any result to instantly see your match score.</p>
          </div>
        )}

        {loading && (
          <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-white  border border-gray-200 rounded-lg p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div >

                <div className="flex gap-2 mb-3">
                  <div className="h-5 bg-gray-100 rounded-full w-20" />
                  <div className="h-5 bg-gray-100 rounded-full w-16" />
                </div>
                <div>
                  <div className="h-3 bg-gray-100 rounded mb-1.5" />
                  <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
                    <div className="w-16 h-8 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>


      <div>
        {!loading && jobs.length > 0 &&
          (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSave={handleSave}
                  savedIds={savedIds}
                />

              ))}
            </div>
          )}





      </div>
    </div>

  )
}

export default Jobsearch;


