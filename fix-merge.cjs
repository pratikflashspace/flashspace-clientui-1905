const fs=require('fs');
const p='src/pages/admin/KYCRequests.tsx';
let lines=fs.readFileSync(p,'utf8').split(/\r?\n/);
let o=[];
let c=false, i=false;
for(let l of lines){
  if(l.startsWith('<<<<<<< HEAD')){c=true;i=false;continue;}
  if(c&&l.startsWith('=======')){i=true;continue;}
  if(c&&l.startsWith('>>>>>>>')){c=false;i=false;continue;}
  if(c){if(i)o.push(l);}else{o.push(l);}
}
fs.writeFileSync(p,o.join('\n'));
