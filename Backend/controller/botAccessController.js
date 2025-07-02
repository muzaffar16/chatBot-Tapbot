const fs = require('fs');
// const path = require('path');
const { botModel } = require('../model/botModel');
const redis = require('../redisClient');
const crypto = require('crypto');

// async function handleAddWebsite(req, res) {
//   const { websiteName } = req.body;

//   if (!websiteName) {
//     return res.status(400).json({ error: 'websiteName is required' });
//   }

//   const infoFile = req.files?.info?.[0];
//   const promptFile = req.files?.prompt?.[0];

//   if (!infoFile || !promptFile) {
//     return res.status(400).json({ error: 'Both info and prompt files are required' });
//   }

//   // Convert buffer to string
//   const infoContent = infoFile.buffer.toString('utf8');
//   const promptContent = promptFile.buffer.toString('utf8');

//   // Store into database
//   await botModel.create({
//     websiteName,
//     info: infoContent,
//     prompt: promptContent,
//     expire_date: new Date(),
//   });

//   res.status(200).json({ msg: 'Website added successfully', websiteName });
// }



async function handleAddWebsite(req, res) {
  const { websiteName, logo_url, discription, bg_color_code, body_color_code, accent_color } = req.body;

  if (! websiteName || !logo_url|| !discription|| !bg_color_code|| !body_color_code|| !accent_color) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  const result= await botModel.findOne({where :{websiteName:websiteName}})
  if(result){
     return res.status(400).json({ error: 'website is already added' });
  }

  const infoFile = req.files.info[0];
  const promptFile = req.files.prompt[0];
  //  console.log(infoFile)
  if (!infoFile || !promptFile) {
    return res.status(400).json({ error: 'Both info and prompt files are required' });
  }



  const expire_date = new Date()
  const date=expire_date.toString('utf8')
  var hash = crypto.createHash('md5').update(date).digest('hex');
  // console.log(hash)

  // return
    // Store into database
  await botModel.create({
    websiteName,
    logo_url,
    discription,
    expire_date: expire_date,
    license_key : hash,
    bg_color_code,
    body_color_code,
    accent_color

  });

  const infoContent = infoFile.buffer.toString('utf8');
  const promptContent = promptFile.buffer.toString('utf8');

   // Use Redis key like: site:<websiteName>:info
  await redis.set(`site:${websiteName}:info`, infoContent);
  await redis.set(`site:${websiteName}:prompt`, promptContent);

  res.status(200).json({ msg: 'Saved to Redis successfully', websiteName });
}



async function handleUpdateData(req,res) {
    const website = req.params.website;
    const result = await botModel.findOne({where:{websiteName: website}})
    if(!result){
      return res.status(400).json({ error: 'website not found!' });
    }

      // console.log(req.files)

 
      if(req.files.info && !req.files.prompt){
         const infoFile = req.files.info[0];
          const infoContent = infoFile.buffer.toString('utf8');
          await redis.set(`site:${website}:info`, infoContent);
          return res.status(200).json({msg: 'info file update successfully!'});
      }
      if(req.files.prompt && !req.files.info){
        const promptFile = req.files.prompt[0];
        const promptContent = promptFile.buffer.toString('utf8');
        await redis.set(`site:${website}:prompt`, promptContent);
        return res.status(200).json({msg: 'prompt file update successfully!'});
      }
      if (req.files.info && req.files.prompt){
          const infoFile = req.files.info[0];
          const promptFile = req.files.prompt[0];
          const infoContent = infoFile.buffer.toString('utf8');
          const promptContent = promptFile.buffer.toString('utf8');
          await redis.set(`site:${website}:info`, infoContent);
          await redis.set(`site:${website}:prompt`, promptContent);
          return res.status(200).json({msg: 'info and prompt files update successfully!'});
      }
    return res.status(400).json({ error: 'upload info or prompt file for update' });
    
}

 async function handleIsWebsiteExisit(req, res){
  const { website } = req.params;
  // const result = await 
  const result = await botModel.findOne({ where: { websiteName: website } });
  console.log("result ",result)
  if (result == null) return res.status(404).json({ valid: false });
  res.json({ valid: true, result});

};

module.exports = { 
    handleAddWebsite, 
    handleUpdateData ,
    handleIsWebsiteExisit
};
