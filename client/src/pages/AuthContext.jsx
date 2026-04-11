import React from "react"
import{useState , useContext , createContext , useEffect} from "react-router-dom"
import API from "../Components/Api"



const AuthContext =createContext(null);

const authProvider =   ({children}) => {
 const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
const checkAuth = async () => {
    try{
   const {data} = await API.get("/api/auth/me")
  setUser(data.user)
    } catch {
        setUser(null)
    }finally{
        setLoading(false)
    }
    checkAuth();
} 
  } , [])

const login = (userData) => setUser(userData)

  const logout = async () =>{
    try{
await API.post("/api/auth/logout")} catch {}
setUser("null")
  }

  
return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )


}
export const useAuth = () => useContext(AuthContext)
export default AuthContext

