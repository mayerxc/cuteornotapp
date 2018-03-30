const router = require('express').Router();

const pictures = require('../models/schemas/pictures');


router.get('/api/crud/:user',(req,res)=>{ // random pic fetcher
      pictures.find({},(err,pics)=>{
        if(err){
          throw err
        }
        else{
          const picToSend = randomPic(pics,req.params.user)
          res.json(picToSend ? picToSend : null)
        }
      })
})

router.get('/api/crud/profilePics/:user',verifyAuthentication,(req,res)=>{ // profile pics fetcher
    const query = {owner:req.params.user}
    pictures.find(query,(err,pics)=>{
      if(err){
        throw err
      }
      else{
        res.json(pics)
      }
    })
})

router.post('/api/crud',verifyAuthentication,(req,res)=>{ // Creates new pic
  const newPicture = req.body
  pictures.create(newPicture,(err,pics)=>{
    if(err){
      throw err
    }
    else{
      res.json(pics)
    }
  })
})

router.put('/api/crud/:_id', (req, res)=>{ // update pic
   const updateInfo = {
     totalRatings:req.body.totalRatings,
     avgRating:req.body.avgRating,
     voted:req.body.voted
   };
   const picID = req.params._id;

   const update = { '$set': updateInfo};
   const modified = {new: true}; //optional, if true responds with the modified document
   pictures.findByIdAndUpdate(picID, update, modified, (err, pic)=>{
       if(err){
         throw err;
       }
       else{
         res.json(pic);
       }
   })
})

router.delete('/api/crud/:_id',verifyAuthentication,(req,res)=>{ //deletes pic
    const query = {_id: req.params._id};
    pictures.remove(query, (err, pic)=>{
      if(err){
        throw err;
      }
      else{
        res.json(pic);
      }
    })
})


module.exports = router


function randomPic(picArr,user){
  if(!picArr.length){
    return null
  }
  //UNCOMMENT BELOW FOR PRODUCTION
  // let foundPic = false
  // let alreadyVoted=[]
  // let chosenPic=undefined

  // while (!foundPic){
  //   const randNum = Math.floor(Math.random() * (picArr.length));
  //   if(picArr[randNum].voted.includes(user)){
  //     alreadyVoted.push(randNum)
  //   }
  //   else{
  //     foundPic = true
  //     chosenPic=picArr[randNum]
  //   }
  //   if (alreadyVoted.length===picArr.length){
  //     break;
  //   }
  // }
  // return chosenPic



  //test code to help with view DELETE FOR PRODUCTION

  const randNum = Math.floor(Math.random() * (picArr.length));

  return picArr[randNum];
}

function verifyAuthentication(req,res,next){
    if(req.user){
      //need to get auth service to verify authentication
      const allAuthServices = ["google","twitter"]
      const authService = allAuthServices.filter((a)=>{
        return (req.user[a].username)
      })[0]
      if(req.user[authService].username===req.query.username){
        return next();
      }
    }
    res.end("Access Denied!!")
  }
