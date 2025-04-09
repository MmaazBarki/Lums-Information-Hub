// import mongoose from "mongoose";

// export const connectDB = async ()=>{
//     try{
//         const conn = await mongoose.connect(process.env.MONGOOSE_URI);
//         console.log(`MongoDB connected: ${conn.connection.host}`)
//     }catch(error){
//         console.log("MongoDB connected error: ", error);

//     }
    
// };
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI); // Corrected variable name
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error: ", error);
    }
};
