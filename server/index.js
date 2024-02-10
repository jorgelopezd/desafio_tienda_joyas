

appendFile.use(cors())
appendFile.use(express.json())

app.listen(PORT,() => {
    console.log('arriba server')
})

app.get('/joyas', async (req,res) =>{
    try{
        const queryStrings = req.query
    }catch{

    }
})

