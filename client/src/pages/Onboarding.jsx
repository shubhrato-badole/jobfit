import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import API from "../Components/Api"




const OnBoarding = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [file, setFile] = useState(null);
  const [error, seterror] = useState('');
  const [Dragging, setDragging] = useState(false);
  const [Status, setStatus] = useState('');

  const handleFile = (selected) => {
    if (!selected) return
    if (selected.type !== 'application/pdf') {
      seterror("the file should be pdf")
      return
    }


    if (selected.size > 5 * 1024 * 1024) {
      seterror("the file should be below 5mb")
      return
    }
    setFile(selected);
    seterror('')
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false)
    handleFile(e.dataTransfer.files[0])

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      seterror('Please select a PDF file first')
      return
    }
    setStatus('uploading')
    seterror('')

    const formData = new FormData()
    formData.append('resume', file)


    try {
      const result = await API.post("/auth/resume/upload", formData, {
        headers: { "Content-Type": 'multipart/form-data' }
      })
      setStatus('done')
      setTimeout(() => navigate('/dashboard'), 1200)
    }
    catch (err) {
      setStatus('error')
      seterror(err.response?.data?.error || 'Upload failed. Please try again.')

    }
  }



  return (

    <div className=" min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-10 ">
        <p className="text-gray-900 text-[25px] font-semibold">Job<span className="text-blue-600">Fit</span></p>
      </div>







      <div className="flex items-center gap-2 mb-10 ">
        {[
          { n: 1, label: 'Account', state: 'done' },
          { n: 2, label: 'Resume', state: 'active' },
          { n: 3, label: 'Analyze', state: 'pending' },
        ].map((step, i) => (
          <div key={step.n} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${step.state === 'done' ? 'bg-gray-900 text-white' :
                step.state === 'active' ? 'bg-blue-600 text-white' :
                  'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>

                {step.state === 'done'
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : step.n
                }
              </div>
              <span className="text-xs text-gray-400">{step.label}</span>
            </div>
            {i < 2 && (
              <div className={`w-10 h-px mb-4 ${step.state === 'done' ? 'bg-gray-900' : 'bg-gray-200'}`} />)}
          </div>
        ))}
      </div >











      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">

     { Status === 'done'?( <div className="text-center py-6">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 11l5 5 9-9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
       </div>
        
        <div>
          <h2 className="text-base text-gray-900 font-semibold mb-1 ">Resume uploaded</h2>
          <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </div>
           
     </div>)  













      : Status === 'uploading' ?
      ( <div> <h2>Uploading your resume</h2>
           <p className="mb-5">Extracting your skills and experience — this takes a few seconds.</p>
           
<div className="bg-gray-100 rounded-xl p-4  mb-5">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="10" height="12" rx="2" stroke="#6b7280" strokeWidth="1"/>
                  <path d="M4 5h6M4 7h6M4 9h4" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                {file?.name}
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
              <p className="text-xs text-gray-400">Extracting text from PDF...</p>
</div>
<button disabled className=" px-2.5 py-2  cursor-not-allowed rounded-xl bg-gray-800 text-white w-full font-semibold ">  Processing...</button>
       </div> ) : (













        <div >
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-gray-900 mb-1 ">Upload your resume</h2>
            <p className="text-[13.5px] text-gray-500 mb-6 leading-relaxed">We extract your skills and experience once. Every future job analysis uses this — no re-uploading needed.</p>
          </div>

          <div onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-4
            ${ Dragging ? 'border-blue-400 bg-blue-50'
                  : file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }  `}>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />


            {file ? <div>
              <div className=" w-10 h-10 rounded-lg flex flex-center bg-green-300 items-center justify-center
          mx-auto mb-3"><svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4 4 8-8" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg> </div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {(file.size / 1024).toFixed(0)} KB · Click to change</p>
            </ div> :
              <div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex flex-col justify-center items-center bg-gray-500
 mx-auto mb-3 ">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2v9M5 6l4-4 4 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 13h12a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a1 1 0 011-1z" stroke="#9ca3af" strokeWidth="1.5" />
                  </svg>
                </div>
                 
                <p className="text-xl font-semibold mb-0.5 text-gray-700">Drag and drop your resume here</p>
                <p className="text-sm"> or <span className="text-blue-600"> browse files</span> — PDF only, max 5MB</p>
              </div>}

 </div>
              
              
               <div className="flex gap-4 mb-4">
                {['PDF format only', 'Max 5MB', 'Text must be selectable'].map(data =>
                  <div key={data} className="flex gap-1.5 text-[13px] text-gray-400 ">
                    <span className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                     {data}
                  </div>
                )}
               </div>


            {error && <div className="text-sm bg-red-100 rounded-lg 
            text-center border border-red-200 px-3 py-2.5 mb-4 text-red-600">
                   {error}
            </div> }
          
          
          <button 
           onClick={handleSubmit}
            disabled={!file} className="text-sm text-white font-semibold bg-gray-900 w-full px-4 py-2 rounded-xl
           hover:bg-gray-700 transition-colors disabled:opacity-50  "> Upload resume→ </button>
          <p className="text-xs text-center mt-4 cursor-pointer hover:text-gray-600"> You can do this later —<span  onClick={() => navigate('/dashboard')}
           className="text-blue-600"> go to dashboard</span></p>
        
        </div>
    )}

</div>  {/*   card div  */}







    </div> // main div 
  )






}

export default OnBoarding;