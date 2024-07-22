import express from 'express'
import cors from 'cors'
const app=express()
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.get('/login',(req,res)=>{
    console.log('hiii')
})
app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });