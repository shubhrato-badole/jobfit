import { React , useState } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import API from "../Components/Api"





const Analysze = () => {

const navigate = useNavigate();
const location = useLocation();


const jobData = location.state || {}
const [from , setForm] = useState({
    company : jobData.compnay || '',
    role : jobData.role || '',
    jobDesc : jobData.jobDesc || ''

})

const  [error , setError]= useState('');
const [status , setStatus]= useState('ideal');
const [result , setResult] = useState();
const [saved , setSaved]= useState(false);

const handleChnage = (e) =>{
    setForm(prev => {
({ ...prev, [e.target.name]: e.target.value })
    })
    setError('')
}

const handleSubmit = async ()  =>{
    if (!form.company.trim()) return setError('Company name is required')
    if (!form.role.trim())    return setError('Job title is required')
    if (form.jobDesc.trim().length < 50)
      return setError('Job description is too short — paste the full JD')

    setStatus('uploading')
     setError('')
    setResult(null)
    setSaved(false)


    try{
        const {data} = await API.post("/api/ai/analyze" , from)
        setResult(data)
        setStatus('done')
    }catch(err){
        setError(err.response?.data?.error || 'Analysis failed. Please try again.') 
         setStatus('error')
    }
}

const hnadleReAnalyzing = () =>{
    setError('')
    setForm({ company: '', role: '', jobDesc: '' })
    setResult(null)
    setSaved('false')
    setStatus('ideal')

}
return(
<div className="max-w-2xl mx-auto px-6 py-10 ">  {/* main div for screen */}

 <div >     {/* div for card */}
     <div className="mb-7">
        <h2 className="text-xl font-semibold text-gray-900 mb-1 ">Analyze a job</h2>
        <p className="text-sm text-gray-500">Paste any job description and get your AI match score instantly.</p>
     </div>

    { status !== 'done' && 
      
      <div>
        <div>
            <div>
        <label>Company name</label>
        <input type="text" 
        name="company"
        placeholder="compnay"
         onChange={handleChnage}
         value={from.company}/>

         <label>Role</label>
        <input type="text" 
        name="role"
        placeholder="Frontend Developer"
         onChange={handleChnage}
         value={from.role}/>
        </div>
        </div>

        <div>
         <label>Job description</label>
        <textarea 
        name="jobDesc"
        placeholder="Paste the full job description here..."
         onChange={handleChnage}
         value={from.jobDesc} 
         rows={8}/>

         <p className="text-xs text-gray-400 mt-1">
              {form.jobDesc.length} characters
              {form.jobDesc.length > 0 && form.jobDesc.length < 50 && (
                <span className="text-amber-500"> — paste more of the JD for accurate results</span>
              )}
            </p>
         
       </div>
          {error && 
           <div> {error}</div>}

             <button 
              onClick={handleSubmit}
             disabled={status === 'loading'}
              > 
             {status=== 'uploading'? (

              <div>
                  <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/>
                </svg>
                Analyzing — usually takes 3-4 seconds...
              </>
              </div>) : 'Analyze match' }
             </button>
              <p className="text-xs text-gray-400 text-center mt-2">
            Uses your uploaded resume · AI-powered by Gemini
          </p>

      </div>
}

       {status === 'done' && result && ( <div>
          
      </div>  ) }
       
     
    
    
              







 </div>     {/* div for card */}




</div> /* main div for screen */



)








}





export default Analysze;



