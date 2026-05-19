const COLORS=[
  {bg:'#476EAE',tagBg:'rgba(255,255,255,0.2)',tagColor:'#fff',titleColor:'#fff',metaColor:'rgba(255,255,255,0.75)',d1:'#6B8FCC',d2:'#2a4f8a'},
  {bg:'#48B3AF',tagBg:'rgba(255,255,255,0.2)',tagColor:'#fff',titleColor:'#fff',metaColor:'rgba(255,255,255,0.75)',d1:'#70CECA',d2:'#2a8a87'},
  {bg:'#A7E399',tagBg:'rgba(30,80,30,0.15)',tagColor:'#1a4a1a',titleColor:'#1a3a1a',metaColor:'rgba(26,74,26,0.7)',d1:'#C5F0BA',d2:'#6ab85a'},
  {bg:'#F6FF99',tagBg:'rgba(30,60,10,0.15)',tagColor:'#2a3a00',titleColor:'#2a3a00',metaColor:'rgba(42,58,0,0.65)',d1:'#FFFFCC',d2:'#c8d44a'},
  {bg:'#476EAE',tagBg:'rgba(255,255,255,0.2)',tagColor:'#fff',titleColor:'#fff',metaColor:'rgba(255,255,255,0.75)',d1:'#7A9FD4',d2:'#1a3f80'},
  {bg:'#48B3AF',tagBg:'rgba(255,255,255,0.2)',tagColor:'#fff',titleColor:'#fff',metaColor:'rgba(255,255,255,0.75)',d1:'#80D4D0',d2:'#1a7875'},
  {bg:'#A7E399',tagBg:'rgba(30,80,30,0.15)',tagColor:'#1a4a1a',titleColor:'#1a3a1a',metaColor:'rgba(26,74,26,0.7)',d1:'#C8F0BA',d2:'#5aaa44'},
];

const TOPICS={
  ai:{q:'artificial intelligence clinical decision support machine learning',label:'AI'},
  nlp:{q:'natural language processing electronic health records clinical notes',label:'NLP'},
  imaging:{q:'deep learning radiology medical imaging diagnosis',label:'Imaging'},
};

const FALLBACK=[
  {title:'Zero-shot prompting outperforms clinician-reviewed few-shot in atrial fibrillation cohort NLP',authors:'Turchioe MR, Shamnath A et al.',journal:'npj Digital Medicine',time:'2024 Dec',url:'https://pubmed.ncbi.nlm.nih.gov/39614089/',tag:'NLP'},
  {title:'Large language models for clinical decision support: systematic review of implementation outcomes',authors:'Johnson KW, Torres Soto J et al.',journal:'JAMIA',time:'2024 Nov',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
  {title:'Vision-language models for radiology report generation on CheXpert and MIMIC-CXR',authors:'Dalla Serra F, Wang C et al.',journal:'Medical Image Analysis',time:'2024 Oct',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'Imaging'},
  {title:'Federated learning for privacy-preserving AI across multi-institutional health networks',authors:'Rieke N, Hancox J et al.',journal:'npj Digital Medicine',time:'2024 Sep',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
  {title:'BERT-based models extract social determinants of health from clinical notes with 91% F1',authors:'Lybarger K, Ostendorf M et al.',journal:'JAMIA',time:'2024 Aug',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'NLP'},
  {title:'Ambient AI documentation tools reduce physician burnout by 34% in multisite pilot RCT',authors:'NEJM Evidence Editorial',journal:'NEJM Evidence',time:'2024 Jul',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
  {title:'AlphaFold3 structure predictions accelerate hit identification in kinase drug discovery',authors:'Jumper J, Evans R et al.',journal:'Nature',time:'2024 Jun',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
  {title:'Graph neural networks for drug-drug interaction prediction across 100K compound pairs',authors:'Sun M, Zhao S et al.',journal:'Bioinformatics',time:'2024 May',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
  {title:'Pathology foundation models trained on digital slides enable pan-cancer classification',authors:'Chen RJ, Ding J et al.',journal:'Nature',time:'2024 Apr',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'Imaging'},
  {title:'Automated ICD coding from clinical narratives using transformer architectures',authors:'Cao P, Chen X et al.',journal:'Journal of Biomedical Informatics',time:'2024 Mar',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'NLP'},
  {title:'Multimodal AI integrating radiology reports and images improves cancer staging accuracy',authors:'Radiology AI Editorial',journal:'Radiology AI',time:'2024 Feb',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'Imaging'},
  {title:'Instruction tuning of LLMs on biomedical corpora improves clinical reasoning benchmarks',authors:'Chen S, Kasner E et al.',journal:'Bioinformatics',time:'2024 Jan',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
  {title:'Wearable-based AI predicts atrial fibrillation onset before ECG detection',authors:'Hannun AY, Rajpurkar P et al.',journal:'Nature Medicine',time:'2023 Dec',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
  {title:'Social determinants of health extracted from EHR notes with transformer models',authors:'Lybarger K et al.',journal:'JAMIA',time:'2023 Nov',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'NLP'},
  {title:'GPT-4 achieves expert-level performance on USMLE Step 1 and Step 2 examinations',authors:'Nori H, King N et al.',journal:'PLOS Digital Health',time:'2023 Oct',url:'https://pubmed.ncbi.nlm.nih.gov/',tag:'AI'},
];

/* STATE */
let selCount=5, selTopic='ai';
let customKeywords=[];
let articles=[], current=0, queue=[], cardEls=[];
let dragging=false, startX=0, startY=0, curX=0, curY=0, dir=null;
let library=[];
let pendingArticle=null;

/* SCREEN */
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
}

/* LIBRARY STORAGE */
function loadLibrary(cb){
  chrome.storage.local.get(['hapLibrary'],r=>{
    library=r.hapLibrary||[];
    if(cb)cb();
  });
}
function persistLibrary(){
  chrome.storage.local.set({hapLibrary:library});
}

/* SETTINGS WIRING */
document.querySelectorAll('.count-opt').forEach(o=>{
  o.addEventListener('click',()=>{
    document.querySelectorAll('.count-opt').forEach(x=>x.classList.remove('active'));
    o.classList.add('active');
    selCount=parseInt(o.dataset.v);
  });
});
document.querySelectorAll('.mode-opt').forEach(r=>{
  r.addEventListener('click',()=>{
    document.querySelectorAll('.mode-opt').forEach(x=>x.classList.remove('active'));
    r.classList.add('active');
    selTopic=r.dataset.m;
  });
});
document.getElementById('applyBtn').addEventListener('click',startFeed);
document.getElementById('fSettingsBtn').addEventListener('click',()=>show('s-settings'));
document.getElementById('skipBtn').addEventListener('click',doSkip);
document.getElementById('readBtn').addEventListener('click',doRead);
document.getElementById('queueBtn').addEventListener('click',doQueue);
document.getElementById('qBadge').addEventListener('click',()=>{renderQueue();show('s-queue');});
document.getElementById('qBack').addEventListener('click',()=>show('s-feed'));
document.getElementById('doneQBtn').addEventListener('click',()=>{renderQueue();show('s-queue');});
document.getElementById('doneRestartBtn').addEventListener('click',startFeed);

/* KEYWORDS */
function renderKeywordTags(){
  const container=document.getElementById('kwTags');
  container.innerHTML='';
  if(!customKeywords.length){
    const hint=document.createElement('span');
    hint.style.cssText='font-size:11px;color:rgba(255,255,255,0.22);align-self:center;';
    hint.textContent='No custom keywords yet';
    container.appendChild(hint);
    return;
  }
  customKeywords.forEach((kw,i)=>{
    const tag=document.createElement('div');tag.className='kw-tag';
    const label=document.createElement('span');label.textContent=kw;
    const btn=document.createElement('button');btn.className='kw-tag-x';btn.textContent='x';
    btn.addEventListener('click',()=>{customKeywords.splice(i,1);renderKeywordTags();});
    tag.appendChild(label);tag.appendChild(btn);
    container.appendChild(tag);
  });
}
function addKeyword(){
  const input=document.getElementById('kwInput');
  const val=input.value.trim().toLowerCase();
  if(!val)return;
  if(customKeywords.includes(val)){input.value='';return;}
  if(customKeywords.length>=8){showToast('Max 8 keywords');return;}
  customKeywords.push(val);input.value='';
  renderKeywordTags();
}
document.getElementById('kwAdd').addEventListener('click',addKeyword);
document.getElementById('kwInput').addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();addKeyword();}
});
renderKeywordTags();

/* FETCH PUBMED */
async function startFeed(){
  queue=[];current=0;articles=[];
  updateBadge();
  show('s-loading');
  try{
    const kwExtra=customKeywords.length>0?' AND ('+customKeywords.join(' OR ')+')':'';
    const q=TOPICS[selTopic].q+kwExtra;
    const poolSize=Math.min(80,selCount*5);
    const retstart=Math.floor(Math.random()*40);
    const sr=await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term='+encodeURIComponent(q)+'&retmax='+poolSize+'&retstart='+retstart+'&sort=date&retmode=json');
    const sd=await sr.json();
    let ids=sd.esearchresult?.idlist||[];
    if(ids.length){
      ids=ids.sort(()=>Math.random()-0.5).slice(0,selCount);
      const sumr=await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+ids.join(',')+'&retmode=json');
      const sumd=await sumr.json();
      const res=sumd.result||{};
      articles=ids.map((id,i)=>{
        const a=res[id];if(!a)return null;
        const auths=(a.authors||[]).slice(0,2).map(x=>x.name).join(', ')+((a.authors||[]).length>2?' et al.':'');
        return{
          title:(a.title||'').replace(/[.]$/,'').replace(/<[^>]+>/g,''),
          authors:auths,
          journal:a.fulljournalname||a.source||'PubMed',
          time:a.pubdate?a.pubdate.split(' ').slice(0,2).join(' '):'',
          url:'https://pubmed.ncbi.nlm.nih.gov/'+id+'/',
          tag:TOPICS[selTopic].label,
          col:COLORS[i%COLORS.length],
        };
      }).filter(Boolean);
    }
  }catch(e){console.error(e);}
  if(!articles.length){
    const shuffled=[...FALLBACK].sort(()=>Math.random()-0.5);
    articles=shuffled.slice(0,selCount).map((a,i)=>({...a,col:COLORS[i%COLORS.length]}));
  }
  show('s-feed');
  buildDots();renderDeck();updateCounter();
}

/* DOTS / COUNTER */
function buildDots(){
  const el=document.getElementById('dots');el.innerHTML='';
  const n=Math.min(articles.length,8);
  for(let i=0;i<n;i++){
    const d=document.createElement('div');
    d.className='dot'+(i===0?' active':'');
    if(i===0&&articles[0])d.style.background=articles[0].col.d1;
    el.appendChild(d);
  }
}
function updateDots(){
  document.getElementById('dots').querySelectorAll('.dot').forEach((d,i)=>{
    const on=i===current;
    d.classList.toggle('active',on);
    d.style.background=on&&articles[current]?articles[current].col.d1:'rgba(255,255,255,0.18)';
    d.style.width=on?'18px':'5px';
  });
}
function updateCounter(){
  document.getElementById('fCtr').textContent=(Math.min(current+1,articles.length))+' / '+articles.length;
}
function updateBadge(){
  document.getElementById('qCnt').textContent=queue.length;
  document.getElementById('qBadge').classList.toggle('hidden',queue.length===0);
}

/* DECK */
function renderDeck(){
  const deck=document.getElementById('deck');
  deck.innerHTML='';cardEls=[];
  const slice=articles.slice(current,current+3);
  slice.forEach((a,i)=>{
    const card=makeCard(a,slice.length-i);
    if(i===1){card.style.transform='scale(0.93) translateY(14px) rotate(-2deg)';card.style.opacity='0.72';}
    if(i===2){card.style.transform='scale(0.87) translateY(28px) rotate(-4deg)';card.style.opacity='0.42';}
    deck.appendChild(card);
    cardEls.push(card);
  });
  if(cardEls[0])attachDrag(cardEls[0]);
}

function makeCard(a,z){
  const c=a.col;
  const card=document.createElement('div');
  card.className='card';
  card.style.cssText='background:'+c.bg+';z-index:'+z+';';

  const d1=document.createElement('div');d1.className='deco';
  d1.style.cssText='width:175px;height:175px;top:-52px;right:-42px;background:'+c.d1+';';
  card.appendChild(d1);
  const d2=document.createElement('div');d2.className='deco';
  d2.style.cssText='width:105px;height:105px;bottom:-32px;left:12px;background:'+c.d2+';';
  card.appendChild(d2);

  const ol=document.createElement('div');ol.className='sov sov-l';
  ol.innerHTML='READ<span>opens article</span>';card.appendChild(ol);
  const or2=document.createElement('div');or2.className='sov sov-r';
  or2.innerHTML='SKIP<span>swipe right</span>';card.appendChild(or2);
  const ou=document.createElement('div');ou.className='sov sov-u';
  ou.innerHTML='QUEUE<span>read later</span>';card.appendChild(ou);

  /* Library button top-right - before tag so tag stays bottom-left */
  const libBtn=document.createElement('button');
  libBtn.className='card-save-btn';
  const alreadySaved=library.some(l=>l.url===a.url);
  libBtn.textContent=alreadySaved?'Saved':'+ Library';
  if(alreadySaved)libBtn.classList.add('saved');
  libBtn.addEventListener('click',e=>{
    e.stopPropagation();
    if(library.some(l=>l.url===a.url)){showToast('Already in library');return;}
    openNoteModal(a,libBtn);
  });
  const tag=document.createElement('div');tag.className='ctag';tag.textContent=a.tag;
  tag.style.cssText='background:'+c.tagBg+';color:'+c.tagColor+';';card.appendChild(tag);
  card.appendChild(libBtn);

  const body=document.createElement('div');body.className='cbody';
  const title=document.createElement('div');title.className='ctitle';
  title.textContent=a.title;title.style.color=c.titleColor;body.appendChild(title);
  if(a.authors){
    const au=document.createElement('div');au.className='cauths';
    au.textContent=a.authors;au.style.color=c.metaColor;body.appendChild(au);
  }
  const meta=document.createElement('div');meta.className='cmeta';meta.style.color=c.metaColor;
  const srcSpan=document.createElement('span');srcSpan.textContent=a.journal;
  const timeSpan=document.createElement('span');timeSpan.textContent=a.time;
  meta.appendChild(srcSpan);meta.appendChild(timeSpan);
  body.appendChild(meta);
  card.appendChild(body);
  return card;
}

/* DRAG */
function attachDrag(card){
  card.addEventListener('mousedown',onStart);
  card.addEventListener('touchstart',onStart,{passive:true});
  function onStart(e){
    dragging=true;dir=null;
    startX=e.touches?e.touches[0].clientX:e.clientX;
    startY=e.touches?e.touches[0].clientY:e.clientY;
    curX=0;curY=0;
    card.style.transition='none';
    document.addEventListener('mousemove',onMove);
    document.addEventListener('mouseup',onEnd);
    document.addEventListener('touchmove',onMove,{passive:true});
    document.addEventListener('touchend',onEnd);
  }
  function onMove(e){
    if(!dragging)return;
    curX=(e.touches?e.touches[0].clientX:e.clientX)-startX;
    curY=(e.touches?e.touches[0].clientY:e.clientY)-startY;
    if(!dir){
      if(Math.abs(curY)>Math.abs(curX)&&Math.abs(curY)>8)dir='y';
      else if(Math.abs(curX)>8)dir='x';
    }
    const el_l=card.querySelector('.sov-l');
    const el_r=card.querySelector('.sov-r');
    const el_u=card.querySelector('.sov-u');
    if(dir==='y'&&curY<0){
      card.style.transform='translateY('+curY+'px)';
      el_u.style.opacity=Math.min(1,(Math.abs(curY)-20)/60);
      el_l.style.opacity=0;el_r.style.opacity=0;
    } else if(dir==='x'){
      card.style.transform='translateX('+curX+'px) rotate('+(curX*0.07)+'deg)';
      el_l.style.opacity=curX<-30?Math.min(1,(Math.abs(curX)-30)/80):0;
      el_r.style.opacity=curX>30?Math.min(1,(curX-30)/80):0;
      el_u.style.opacity=0;
      if(cardEls[1]){
        const p=Math.min(Math.abs(curX)/130,1);
        cardEls[1].style.transform='scale('+(0.93+0.07*p)+') translateY('+(14-14*p)+'px) rotate('+(-2+2*p)+'deg)';
        cardEls[1].style.opacity=String(0.72+0.28*p);
      }
    }
  }
  function onEnd(){
    if(!dragging)return;
    dragging=false;
    document.removeEventListener('mousemove',onMove);
    document.removeEventListener('mouseup',onEnd);
    document.removeEventListener('touchmove',onMove);
    document.removeEventListener('touchend',onEnd);
    if(dir==='y'&&curY<-90)doQueue();
    else if(dir==='x'&&curX<-100)doRead();
    else if(dir==='x'&&curX>100)doSkip();
    else{
      card.style.transition='transform .4s cubic-bezier(.17,.67,.35,1.2)';
      card.style.transform='none';
      card.querySelectorAll('.sov').forEach(o=>{o.style.opacity='0';});
      if(cardEls[1]){
        cardEls[1].style.transition='transform .4s ease,opacity .4s ease';
        cardEls[1].style.transform='scale(0.93) translateY(14px) rotate(-2deg)';
        cardEls[1].style.opacity='0.72';
      }
    }
    dir=null;
  }
}

/* ACTIONS */
function animateOut(d){
  if(!cardEls[0])return;
  const card=cardEls[0];
  const tx=d==='read'?-520:d==='skip'?520:0;
  const ty=d==='queue'?-520:0;
  const rot=d==='read'?-30:d==='skip'?30:0;
  card.style.transition='transform .3s cubic-bezier(.4,0,.2,1),opacity .3s ease';
  card.style.transform='translateX('+tx+'px) translateY('+ty+'px) rotate('+rot+'deg)';
  card.style.opacity='0';
}
function advance(){
  setTimeout(()=>{
    current++;
    if(current>=articles.length){showDone();return;}
    updateDots();updateCounter();renderDeck();
  },300);
}
function doSkip(){animateOut('skip');advance();}
function doRead(){
  animateOut('read');
  const url=articles[current]?.url;
  if(url)chrome.tabs.create({url:url,active:true});
  advance();
}
function doQueue(){
  const a=articles[current];
  if(a&&!queue.find(q=>q.title===a.title)){
    queue.push(a);updateBadge();showToast('Saved to queue');
  } else {showToast('Already in queue');}
  animateOut('queue');advance();
}

/* DONE */
function showDone(){
  document.getElementById('doneSub').textContent=queue.length>0
    ?'You have '+queue.length+' article'+(queue.length>1?'s':'')+' in your queue.'
    :'Swipe up next time to queue articles.';
  document.getElementById('doneQBtn').style.display=queue.length?'':'none';
  show('s-done');
}

/* QUEUE LIST */
function renderQueue(){
  const list=document.getElementById('qList');
  list.innerHTML='';
  if(!queue.length){
    const empty=document.createElement('div');empty.className='q-empty';
    empty.textContent='Nothing saved yet. Swipe up on any card.';
    list.appendChild(empty);return;
  }
  queue.forEach((a,i)=>{
    const item=document.createElement('div');item.className='qi';item.style.background=a.col.bg;
    const deco=document.createElement('div');deco.className='qi-deco';
    deco.style.cssText='width:80px;height:80px;top:-20px;right:-15px;background:'+a.col.d1+';';
    item.appendChild(deco);
    const num=document.createElement('div');num.className='qi-n';num.style.color=a.col.titleColor;num.textContent=String(i+1);item.appendChild(num);
    const body=document.createElement('div');body.className='qi-b';
    const t=document.createElement('div');t.className='qi-t';t.textContent=a.title;t.style.color=a.col.titleColor;body.appendChild(t);
    const m=document.createElement('div');m.className='qi-m';m.style.color=a.col.metaColor;
    const s1=document.createElement('span');s1.textContent=a.journal;
    const s2=document.createElement('span');s2.textContent=a.time;
    m.appendChild(s1);m.appendChild(s2);body.appendChild(m);
    item.appendChild(body);
    const arr=document.createElement('div');arr.className='qi-arr';arr.textContent='->';arr.style.color=a.col.metaColor;item.appendChild(arr);
    item.addEventListener('click',()=>chrome.tabs.create({url:a.url,active:true}));
    list.appendChild(item);
  });
}

/* TOAST */
function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2000);
}

/* NOTE MODAL */
function openNoteModal(article,triggerBtn){
  pendingArticle={article,triggerBtn};
  document.getElementById('nmTitle').textContent=article.title;
  document.getElementById('nmSub').textContent=article.journal+' - '+article.time;
  document.getElementById('nmText').value='';
  document.getElementById('noteModalBg').classList.add('open');
  setTimeout(()=>document.getElementById('nmText').focus(),300);
}
function closeNoteModal(){
  document.getElementById('noteModalBg').classList.remove('open');
  pendingArticle=null;
}
function saveToLibrary(note){
  if(!pendingArticle)return;
  const {article,triggerBtn}=pendingArticle;
  const entry={
    title:article.title,
    authors:article.authors||'',
    journal:article.journal||'',
    time:article.time||'',
    url:article.url||'',
    tag:article.tag||'',
    col:article.col||COLORS[0],
    note:note?note.trim():'',
    savedAt:Date.now(),
  };
  library.unshift(entry);
  chrome.storage.local.set({hapLibrary:library},()=>{
    if(triggerBtn){triggerBtn.textContent='Saved';triggerBtn.classList.add('saved');}
    showToast('Saved to library!');
    closeNoteModal();
  });
}
document.getElementById('nmSave').addEventListener('click',()=>saveToLibrary(document.getElementById('nmText').value));
document.getElementById('nmSkip').addEventListener('click',()=>saveToLibrary(''));
document.getElementById('nmCancel').addEventListener('click',closeNoteModal);
document.getElementById('noteModalBg').addEventListener('click',e=>{
  if(e.target===document.getElementById('noteModalBg'))closeNoteModal();
});

/* LIBRARY SCREEN */
document.getElementById('libBack').addEventListener('click',()=>show('s-feed'));


function timeAgo(ts){
  if(!ts)return '';
  const diff=Date.now()-ts;
  const m=Math.floor(diff/60000);
  if(m<1)return 'just now';
  if(m<60)return m+'m ago';
  const h=Math.floor(m/60);
  if(h<24)return h+'h ago';
  return Math.floor(h/24)+'d ago';
}

function renderLibrary(){
  const body=document.getElementById('libBody');body.innerHTML='';
  const items=library;
  if(!items.length){
    const empty=document.createElement('div');empty.className='lib-empty';
    empty.innerHTML='Your library is empty.<br>Tap <b style="color:#A7E399">+ Library</b> on any card.';
    body.appendChild(empty);return;
  }
  items.forEach((item,i)=>{
    const div=document.createElement('div');div.className='lib-item';
    div.style.background=item.col?item.col.bg:'#476EAE';
    if(item.col){
      const deco=document.createElement('div');deco.className='lib-item-deco';
      deco.style.cssText='width:100px;height:100px;top:-25px;right:-20px;background:'+item.col.d1+';';
      div.appendChild(deco);
    }
    const top=document.createElement('div');top.className='lib-item-top';
    top.addEventListener('click',()=>chrome.tabs.create({url:item.url,active:true}));
    const num=document.createElement('div');num.className='lib-num';
    num.style.color=item.col?item.col.titleColor:'#fff';num.textContent=String(i+1);top.appendChild(num);
    const content=document.createElement('div');content.className='lib-content';
    const tagRow=document.createElement('div');tagRow.className='lib-tag-row';
    if(item.tag){
      const ptag=document.createElement('span');ptag.className='lib-ptag';ptag.textContent=item.tag;
      ptag.style.cssText=item.col?'background:'+item.col.tagBg+';color:'+item.col.tagColor+';':'background:rgba(255,255,255,0.2);color:#fff;';
      tagRow.appendChild(ptag);
    }
    const savedAt=document.createElement('span');savedAt.className='lib-saved-at';
    savedAt.style.color=item.col?item.col.metaColor:'rgba(255,255,255,0.4)';
    savedAt.textContent=timeAgo(item.savedAt);tagRow.appendChild(savedAt);content.appendChild(tagRow);
    const t=document.createElement('div');t.className='lib-item-title';
    t.textContent=item.title;t.style.color=item.col?item.col.titleColor:'#fff';content.appendChild(t);
    const m=document.createElement('div');m.className='lib-item-meta';
    m.style.color=item.col?item.col.metaColor:'rgba(255,255,255,0.5)';
    const ms1=document.createElement('span');ms1.textContent=item.journal;
    const ms2=document.createElement('span');ms2.textContent=item.time;
    m.appendChild(ms1);m.appendChild(ms2);content.appendChild(m);
    top.appendChild(content);
    const arr=document.createElement('div');arr.className='lib-arr';arr.textContent='->';
    arr.style.color=item.col?item.col.metaColor:'rgba(255,255,255,0.4)';top.appendChild(arr);
    div.appendChild(top);
    const noteArea=document.createElement('div');noteArea.className='lib-note-area';
    const noteBox=document.createElement('textarea');noteBox.className='lib-note-box';
    noteBox.placeholder='Add a note...';noteBox.value=item.note||'';
    noteArea.appendChild(noteBox);
    const noteActions=document.createElement('div');noteActions.className='lib-note-actions';
    const saveNoteBtn=document.createElement('button');saveNoteBtn.className='lib-save-note';
    saveNoteBtn.textContent='Save note';
    saveNoteBtn.addEventListener('click',()=>{
      const idx=library.indexOf(item);
      if(idx>-1){library[idx].note=noteBox.value;persistLibrary();showToast('Note saved');}
    });
    const delBtn=document.createElement('button');delBtn.className='lib-del';delBtn.textContent='Remove';
    delBtn.addEventListener('click',()=>{
      library=library.filter(l=>l.url!==item.url);
      persistLibrary();renderLibrary();showToast('Removed');
    });
    noteActions.appendChild(saveNoteBtn);noteActions.appendChild(delBtn);
    noteArea.appendChild(noteActions);div.appendChild(noteArea);body.appendChild(div);
  });
}

/* INIT */
loadLibrary(()=>{
  const fRight=document.querySelector('.f-right');
  if(fRight){
    const libBtn=document.createElement('button');
    libBtn.className='f-sbtn';libBtn.title='Library';
    libBtn.textContent='Lib';
    libBtn.style.cssText='font-size:10px;font-weight:700;letter-spacing:.04em;width:32px;';
    libBtn.addEventListener('click',()=>{
      loadLibrary(()=>{
        renderLibrary();show('s-library');
      });
    });
    fRight.insertBefore(libBtn,document.getElementById('fSettingsBtn'));
  }
});
