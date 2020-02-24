module.exports=(ticker_m_data,axios,CircularJSON,knex)=>{
    ticker_m_data.get('/ticker_meta_data',(req,res)=>{
        axios.get("https://api.nomics.com/v1/currencies/ticker?key="+process.env.Nomics_API_key)
        .then((data)=>{
            var maindata=CircularJSON.stringify(data)
            var parsedata=JSON.parse(maindata)
            console.log('Total data is',parsedata.data.length)
             res.send({'data inserted':parsedata.data.length})
            var i=0;
            var myfunc = setInterval(function(){ 
                var other_data={}
                for (var [key,value] of Object.entries(parsedata.data[i])){
                    if (key=="id"){
                        var main_id=value
                        other_data[key]=value
                    }else if(key=='1d'){
                        value['id']=main_id
                        knex('Ticker_1d').insert(value)
                        .then(()=>{
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }else if(key=='7d'){
                        value['id']=main_id
                        knex('Ticker_7d').insert(value)
                        .then(()=>{
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }else if(key=='30d'){
                        value['id']=main_id
                        knex('Ticker_30d').insert(value)
                        .then(()=>{
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }else if(key=='365d'){
                        value['id']=main_id
                        knex('Ticker_365d').insert(value)
                        .then(()=>{
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }else if(key=='ytd'){
                        value['id']=main_id
                        knex('Ticker_ytd').insert(value)
                        .then(()=>{
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }else{
                        other_data[key]=value
                    }                 
                }
                knex('ticker_meta_data').insert(other_data)
                        .then(()=>{
                        }).catch((err)=>{
                            console.log(err)
                        })
                console.log(i+1,"data is coming...  ")
                i = i + 1;
                if(i==parsedata.data.length-1) {
                    clearInterval(myfunc);
                }

            }, 1000/4);
            console.log('data inserted sucessfully');
        }).catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })
}
