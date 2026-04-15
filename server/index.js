import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import authRoutes from "./src/routes/auth"




dotenv.config()
const app = express();
const port = 3000

app,use(cors ({
    origin:" http://localhost:5174/ ",
    Credential:true,
}))
app.use(express.json())
app.use(cookieParser())


app.use("api/auth ", authRoutes  )

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Something went wrong' })
})


app.listen(port , (res , req) => {
     console.log(`Server running on http://localhost:${PORT}`)
})