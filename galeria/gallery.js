let topic=document.body.dataset.topic;
const list=document.getElementById('albums'),detail=document.getElementById('album-detail'),dialog=document.getElementById('photo-dialog'),large=document.getElementById('large-photo'),caption=document.getElementById('photo-caption');
function showPhoto(src,alt){large.src=src;large.alt=alt;caption.textContent=alt;dialog.showModal()}
document.querySelectorAll('[data-cover]').forEach(b=>b.addEventListener('click',()=>showPhoto(b.dataset.cover,b.dataset.caption)));
document.getElementById('close-photo').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{large.removeAttribute('src')});
function asset(path){if(typeof path!=='string'||!/^\.\.\/assets\/[a-zA-Z0-9_./-]+$/.test(path)||path.includes('/../'))throw Error('Invalid asset path');return path}

const albumData=fetch('albums.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('load');return r.json()});
function renderAlbums(data){
list.closest('section').hidden=false;detail.replaceChildren();detail.hidden=true;
const photos=data.albums.filter(album=>album.topic===topic).flatMap(album=>album.photos.map(photo=>({...photo,albumTitle:album.title})));
if(!photos.length){if(list.querySelector('.empty strong')?.textContent==='Novas fotografias em breve')return;list.replaceChildren();list.className='';const box=document.createElement('div');box.className='empty';const title=document.createElement('strong');title.textContent='Novas fotografias em breve';const message=document.createElement('p');message.textContent='As fotografias dos nossos encontros serão partilhadas aqui.';box.append(title,message);list.append(box);return}
list.replaceChildren();list.className='';
const grid=document.createElement('div');grid.className='photo-grid';grid.style.cssText='grid-template-columns:repeat(auto-fill,minmax(150px,206px));align-items:start';
photos.forEach((photo,index)=>{const button=document.createElement('button');button.type='button';button.style.aspectRatio='1';const img=document.createElement('img');img.src=asset(photo.src);img.alt=photo.alt||photo.albumTitle+' — fotografia '+(index+1);img.width=206;img.height=206;img.loading='lazy';img.decoding='async';img.style.cssText='width:100%;height:100%;object-fit:contain;aspect-ratio:1';button.setAttribute('aria-label','Ampliar: '+img.alt);button.append(img);button.addEventListener('click',()=>showPhoto(img.src,img.alt));grid.append(button)});list.append(grid);
}
function showError(){list.innerHTML='<p class="error">Não foi possível carregar os álbuns. Atualize a página para tentar novamente.</p>'}
albumData.then(renderAlbums).catch(showError);
let navigationId=0;
async function changeTopic(url,push){
const id=++navigationId;
try{
const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw Error('page');
const page=new DOMParser().parseFromString(await response.text(),'text/html');
const nextTopic=page.body.dataset.topic,nextIntro=page.querySelector('.intro'),nextCrumb=page.querySelector('.crumb');
if(!nextTopic||!nextIntro||!nextCrumb)throw Error('topic');
const image=nextIntro.querySelector('img');if(image){const preload=new Image();preload.src=new URL(image.getAttribute('src'),url).href;try{await preload.decode()}catch{}}
const data=await albumData;
if(id!==navigationId)return;
if(push)history.pushState({},'',url);
topic=nextTopic;document.body.dataset.topic=topic;document.title=page.title;
document.querySelector('.intro').replaceWith(document.importNode(nextIntro,true));
document.querySelector('.crumb').replaceWith(document.importNode(nextCrumb,true));
document.querySelectorAll('.topics a').forEach(link=>{const slug=new URL(link.href).pathname.split('/').pop().replace('.html','');if(slug===topic||(slug==='index'&&topic==='cultos-celebracoes'))link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
renderAlbums(data);
}catch{if(id===navigationId)location.assign(url)}
}
document.querySelector('.topics').addEventListener('click',event=>{
const link=event.target.closest('a');if(!link||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
const url=new URL(link.href);if(url.origin!==location.origin)return;
event.preventDefault();changeTopic(url.href,true);
});
window.addEventListener('popstate',()=>changeTopic(location.href,false));
