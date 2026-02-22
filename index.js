const express =require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const errorHandler=require('./middleware/errorMiddleware');

const app=express();  

const authRoutes=require('./routes/authRoutes');
const studentRoutes=require('./routes/studentRoutes');

app.use(express.json());





mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('Connected to MongoDB');            
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
}); 

app.use('/api/auth',authRoutes);
app.use('/api/students',studentRoutes);


//error handling middleware
app.use(errorHandler);


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
