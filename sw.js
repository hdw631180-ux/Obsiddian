const V='synapse-v20',SHELL=['./','index.html','m.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,x)=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
 if(['script','style','font'].includes(r.destination))e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))))});
