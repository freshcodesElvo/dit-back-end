
// const express = require('express');
// const app = express();
// const tasks = require('./routes/tasks');
// const connectDB = require('./db/connect')
// const not_found = require('./middleware/not-found')
// const error_handler_middleware = require('./middleware/error')
require('dotenv').config()

//MIDDLEWARE

app.use(express.static('./public'))

app.use(express.json());
//ROUTES
app.use('/api/v1/tasks', tasks)
app.use(not_found)
app.use(error_handler_middleware)
const port = process.env.PORT || 3000;

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server listening on port ${port}...`))
    }
    catch (err){
        console.log(err)

    }

}
start()
