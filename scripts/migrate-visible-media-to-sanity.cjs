// Preserves the current site's media; only missing CMS fields are populated.
const fs=require('fs'),crypto=require('crypto'),{createClient}=require('@sanity/client');
for(const line of (fs.existsSync('.env.local')?fs.readFileSync('.env.local','utf8'):'').split('\n')){const i=line.indexOf('=');if(i>0&&!process.env[line.slice(0,i)])process.env[line.slice(0,i)]=line.slice(i+1)}
const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_WRITE_TOKEN});
const image=(id)=>({_type:'image',asset:{_type:'reference',_ref:id}}),file=(id)=>({_type:'file',asset:{_type:'reference',_ref:id}});
const posters=['photo-1556911220-bff31c812d0c','photo-1524758631624-e2822e304a36','photo-1517248135467-4c7edcad34c4','photo-1616486338812-3dadae4b4ace'];
(async()=>{
 if(!process.argv.includes('--commit')){console.log('Use --commit to populate missing media fields.');return}
 const known=await client.fetch('*[_type in ["sanity.imageAsset","sanity.fileAsset"]]{_id,sha1hash}');const hashes=new Map(known.map(a=>[a.sha1hash,a._id]));
 async function upload(type,data,name){const hash=crypto.createHash('sha1').update(data).digest('hex');if(hashes.has(hash))return hashes.get(hash);const a=await client.assets.upload(type,data,{filename:name});hashes.set(hash,a._id);console.log('Prepared '+name);return a._id}
 async function stock(id,name,width=800){const r=await fetch('https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+width+'&q=80');if(!r.ok)throw Error('Image download failed: '+name);return image(await upload('image',Buffer.from(await r.arrayBuffer()),name+'.jpg'))}
 let home=await client.getDocument('homePage');const set={};
 if(home.heroImage===undefined)set.heroImage=await stock('photo-1505693416388-ac5ce068fe85','existing-hero-poster',1600);
 if(home.heroVideoFile===undefined)set.heroVideoFile=file(await upload('file',fs.readFileSync('public/hero-video.mp4'),'hero-video.mp4'));
 const reels=structuredClone(home.aboutReels||[]);for(let i=0;i<reels.length;i++){const reel=reels[i];if(reel.videoFile===undefined&&/^\/videos\/video[1-4]\.mp4$/.test(reel.videoUrl||''))reel.videoFile=file(await upload('file',fs.readFileSync('public'+reel.videoUrl),reel.videoUrl.split('/').pop()));if(reel.posterImage===undefined&&posters[i]){const poster='/tmp/fab-reel-'+(i+1)+'.jpg';require('child_process').execFileSync('ffmpeg',['-loglevel','error','-ss','0.5','-i','public'+reel.videoUrl,'-frames:v','1','-y',poster]);reel.posterImage=image(await upload('image',fs.readFileSync(poster),'client-video-'+(i+1)+'-poster.jpg'));}}
 if(JSON.stringify(reels)!==JSON.stringify(home.aboutReels))set.aboutReels=reels;
 if(Object.keys(set).length)await client.patch(home._id).ifRevisionId(home._rev).set(set).commit();
 const draft=await client.getDocument('drafts.homePage');if(draft){const fields={};for(const key of ['heroImage','heroVideoFile'])if(draft[key]===undefined&&set[key])fields[key]=set[key];const dr=structuredClone(draft.aboutReels||[]);let changed=false;for(const r of dr){const original=reels.find(x=>x._key===r._key&&x.videoUrl===r.videoUrl);if(original)for(const key of ['videoFile','posterImage'])if(r[key]===undefined&&original[key]){r[key]=original[key];changed=true}}if(changed)fields.aboutReels=dr;if(Object.keys(fields).length)await client.patch(draft._id).ifRevisionId(draft._rev).set(fields).commit()}
 for(const [type,id] of [['office','photo-1522071820081-009f0129c71c'],['hospitality','photo-1566073771259-6a8506099945']]){
  const docs=await client.fetch('*[_type=="solutionPage" && type==$type]{_id,_rev,secondaryImage}',{type});for(const doc of docs){if(doc.secondaryImage?.asset)continue;const secondary=await stock(id,'existing-'+type+'-secondary',1200);await client.patch(doc._id).ifRevisionId(doc._rev).set({secondaryImage:secondary}).commit();}
 }
 console.log('Visible hero/reel media and solution secondary photos are prepared in Sanity. Existing valid client fields retained.');
})().catch(e=>{console.error('Media migration failed:',e.statusCode||e.message);process.exitCode=1});
