module.exports=(currencies,axios,CircularJSON,knex)=>{
    currencies.get('/currencies/ticker',(req,res)=>{
        axios
        .get("https://api.nomics.com/v1/currencies?key="+process.env.Nomics_API_key+"&attributes=original_symbol,name,description,website_url,logo_url,blog_url,discord_url,facebook_url,github_url,medium_url,reddit_url,telegram_url,twitter_url,youtube_url")
        .then((data) =>{
            var maindata=CircularJSON.stringify(data)
            var data1= JSON.parse(maindata)
            var i=0;
            console.log('Total data is',(data1.data.length))
            var myfunc = setInterval(function(){
                knex('Currency').insert(data1.data[i])
                .then((data)=>{
                }).catch((err)=>{ 
                    console.log('err');
                })
                console.log(i+1,'data is inserting')
                i = i + 1;
                if(i==data1.data.length-1) {
                    clearInterval(myfunc);
                }

            }, 1000);
            console.log('data inserted sucessfully') 
            res.send('data inserted sucessfully')
        }).catch((err) =>{
            console.log(err);
        })  
    })
    currencies.get('/currency_data',(req,res)=>{
        knex.select('*').from('Currency').then((data)=>{
            var count = 0
            var data_list = []
            var new_list = []
            for(let one_data of data){
                if (count == 10) {
                    new_list.push(data_list)
                    data_list =[]
                    count=0
                }else{
                    data_list.push(one_data)
                    count+=1
                }
            }
            res.send(new_list)
            var i=0;

            var myfunc = setInterval(function(){

                console.log(new_list[i]); 
                i = i + 1;

                if(i==data.length-1) {
                    clearInterval(myfunc);
                }

            }, 1000);    
            
        }).catch((err)=>{
            res.send(err.masseag)
        })
    })
}
