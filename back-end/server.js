const  express = require("express");
const  cors =  require("cors");
const {promises} = require("fs");;
const app = express();
const PORT =  process.env.PORT || 5000;


app.use(cors({
  origin : ["http://localhost:3000"]
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Home
app.post("/record-liquidity" ,async (req, res) => {
    //secure this route with middleware
    try{
        const {record} = req.body;
        console.log(record)
        let data =  await promises.readFile('./liquidity.json','utf8');
        data = (typeof data === 'string' && data.length == 0) ? [] : JSON.parse(data);
        console.log(data)
        data.push(record);
        await promises.writeFile('./liquidity.json',JSON.stringify(data),'utf8');
        console.log(data);
        return res.status(200).json({ message : "Welcome to Pennyswap.exchange"});
    }catch(error){
       console.log(error)
    }

});



app.use((err,req,res,next) => {
  console.log(err)
  res.status(500).send({message : err.message,status:false});
})


app.listen(PORT, ()=> {
  console.log("listening to port "+ PORT)
})


