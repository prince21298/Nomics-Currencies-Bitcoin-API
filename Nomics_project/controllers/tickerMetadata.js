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
                if(i==parsedata.data.length) {
                    clearInterval(myfunc);
                }

            },80);
            console.log('data inserted sucessfully');
        }).catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })
    ticker_m_data.get('/ticker_meta_get_data',(req,res)=>{
        new_list = []
        knex.select('*').table('ticker_meta_data')
        .then((data)=>{
            let index=0
            var rec_f=setInterval(function(){   
            var my_dict=Object.assign({},data[index])

            knex.select("price_change","price_change_pct","volume","volume_change","volume_change_pct","market_cap_change","market_cap_change_pct")
            .from("Ticker_1d").where("id",data[index].id)
            .then((result_1d)=>{
                my_dict["1d"]=Object.assign({},result_1d[0])                    
            }).catch((reject_1d)=>{
                console.log(reject_1d)
            })

            knex.select("price_change","price_change_pct","volume","volume_change","volume_change_pct","market_cap_change","market_cap_change_pct")
            .from("Ticker_7d").where("id",data[index].id)
            .then((result_1d)=>{
                my_dict["7d"]=Object.assign({},result_1d[0])                    
            }).catch((reject_1d)=>{
                console.log(reject_1d)
            })

            knex.select("price_change","price_change_pct","volume","volume_change","volume_change_pct","market_cap_change","market_cap_change_pct")
            .from("Ticker_30d").where("id",data[index].id)
            .then((result_1d)=>{
                my_dict["30d"]=Object.assign({},result_1d[0])                    
            }).catch((reject_1d)=>{
                console.log(reject_1d)
            })

            knex.select("price_change","price_change_pct","volume","volume_change","volume_change_pct","market_cap_change","market_cap_change_pct")
            .from("Ticker_365d").where("id",data[index].id)
            .then((result_1d)=>{
                my_dict["365d"]=Object.assign({},result_1d[0])                    
            }).catch((reject_1d)=>{
                console.log(reject_1d)
            })

            knex.select("price_change","price_change_pct","volume","volume_change","volume_change_pct","market_cap_change","market_cap_change_pct")
            .from("Ticker_ytd").where("id",data[index].id)
            .then((result_1d)=>{
                my_dict["ytd"]=Object.assign({},result_1d[0])                    
            }).catch((reject_1d)=>{
                console.log(reject_1d)
            })


            new_list.push(my_dict)
            index+=1
            if (index==data.length){
                clearInterval(rec_f)
            }
            if(data.length==index){
                res.send(new_list)
                console.log(new_list);
            }
        },0)
        }).catch((err)=>{
            res.send(err.message)
            console.log(err.message);
        })
    })



    ticker_m_data.get('/ticker_meta_get_data_table',(req,res)=>{
        knex.select('*').table('ticker_meta_data')
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{
            res.send(err.message)
            console.log(err.message);
        })
    })
}