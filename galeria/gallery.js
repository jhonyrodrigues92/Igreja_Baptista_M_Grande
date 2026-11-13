let topic=document.body.dataset.topic;
const list=document.getElementById('albums'),detail=document.getElementById('album-detail'),dialog=document.getElementById('photo-dialog'),large=document.getElementById('large-photo'),caption=document.getElementById('photo-caption');
function showPhoto(src,alt){large.src=src;large.alt=alt;caption.textContent=alt;dialog.showModal()}
document.querySelectorAll('[data-cover]').forEach(b=>b.addEventListener('click',()=>showPhoto(b.dataset.cover,b.dataset.caption)));
document.getElementById('close-photo').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{large.removeAttribute('src')});
function asset(path){if(typeof path!=='string'||!/^\.\.\/assets\/[a-zA-Z0-9_./-]+$/.test(path)||path.includes('/../'))throw Error('Invalid asset path');return path}
function dateLabel(value){const d=new Date(value+'T12:00:00');return Number.isNaN(d.getTime())?value:new Intl.DateTimeFormat('pt-PT',{day:'numeric',month:'long',year:'numeric'}).format(d)}

const albumData=fetch('albums.json').then(r=>{if(!r.ok)throw Error('load');return r.json()});
function renderAlbums(data){if(!data.albums.some(a=>a.topic===topic)&&!new URLSearchParams(location.search).has('album')){detail.replaceChildren();detail.hidden=true;if(list.querySelector('.empty strong')?.textContent==='Novos álbuns em breve')return;list.className='';list.innerHTML="<div class=\"empty\"><strong>Novos álbuns em breve</strong><p>As fotografias dos nossos encontros serão partilhadas aqui, organizadas por evento e data.</p></div>";return}list.replaceChildren();list.className='';detail.replaceChildren();detail.hidden=true;

const albums=data.albums.filter(a=>a.topic===topic).sort((a,b)=>b.date.localeCompare(a.date));
const selected=new URLSearchParams(location.search).get('album');
if(selected){const album=albums.find(a=>a.id===selected);if(!album){detail.hidden=false;detail.textContent='Este álbum não está disponível. Escolha outro álbum abaixo.'}else{
detail.hidden=false;const h=document.createElement('h2');h.textContent=album.title;detail.append(h);const time=document.createElement('time');time.dateTime=album.date;time.textContent=dateLabel(album.date);detail.append(time);
const grid=document.createElement('div');grid.className='photo-grid';album.photos.forEach((p,i)=>{const b=document.createElement('button');b.type='button';const img=document.createElement('img');img.src=asset(p.src);img.alt=p.alt||album.title+' — fotografia '+(i+1);img.loading='lazy';b.append(img);b.setAttribute('aria-label','Ampliar: '+img.alt);b.addEventListener('click',()=>showPhoto(img.src,img.alt));grid.append(b)});detail.append(grid)}}
if(!albums.length){list.innerHTML='<div class="empty"><strong>Novos álbuns em breve</strong><p>As fotografias dos nossos encontros serão partilhadas aqui, organizadas por evento e data.</p></div>';return}
list.className='album-grid';albums.forEach(a=>{const link=document.createElement('a');link.className='album';link.href='?album='+encodeURIComponent(a.id)+'#album-detail';const img=document.createElement('img');img.src=asset(a.cover);img.alt=a.title;img.loading='lazy';const box=document.createElement('div'),time=document.createElement('time'),h=document.createElement('h3'),count=document.createElement('small');time.dateTime=a.date;time.textContent=dateLabel(a.date);h.textContent=a.title;count.textContent=a.photos.length+' fotografia'+(a.photos.length===1?'':'s');box.append(time,h,count);link.append(img,box);list.append(link)})}
function showError(){list.innerHTML='<p class="error">Não foi possível carregar os álbuns. Atualize a página para tentar novamente.</p>'}
albumData.then(renderAlbums).catch(showError);
let navigationId=0;
async function changeTopic(url,push){
const id=++navigationId;
try{
const response=await fetch(url);if(!response.ok)throw Error('page');
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
