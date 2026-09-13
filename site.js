document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus()}});
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('pending');observer.observe(el)})}
const carousel=document.querySelector('.spotlight');
if(carousel){const slides=[...carousel.querySelectorAll('.slide')];const pause=carousel.querySelector('[data-pause]');let current=0,timer=null,paused=reduced.matches,hover=false,focused=false;
 const show=n=>{slides[current].hidden=true;slides[current].classList.remove('active');current=(n+slides.length)%slides.length;slides[current].hidden=false;slides[current].classList.add('active')};
 const schedule=()=>{clearInterval(timer);timer=null;pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');if(!paused&&!hover&&!focused&&!document.hidden)timer=setInterval(()=>show(current+1),6500)};
 carousel.querySelector('[data-next]').addEventListener('click',()=>{show(current+1);schedule()});carousel.querySelector('[data-prev]').addEventListener('click',()=>{show(current-1);schedule()});pause.addEventListener('click',()=>{paused=!paused;schedule()});carousel.addEventListener('mouseenter',()=>{hover=true;schedule()});carousel.addEventListener('mouseleave',()=>{hover=false;schedule()});carousel.addEventListener('focusin',()=>{focused=true;schedule()});carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget)){focused=false;schedule()}});document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',e=>{paused=e.matches;schedule()});schedule();}
const form=document.querySelector('#enquiry-form');
if(form){
  const choice=new URLSearchParams(location.search).get('service');
  const service=form.elements.service;
  if([...service.options].some(option=>option.value===choice))service.value=choice;

  const createDraft=()=>{
    const recipient=form.dataset.recipient||'sipho.makam@gmail.com';
    const label=service.selectedOptions[0].text;
    const name=form.elements.name.value.trim();
    const sender=form.elements.email.value.trim();
    const organisation=form.elements.organisation.value.trim();
    const brief=form.elements.brief.value.trim();
    const subject=`VEMAK website enquiry: ${label}${organisation?' — '+organisation:''}`;
    const body=[`Name: ${name}`,`Email: ${sender}`,`Organisation: ${organisation||'Not provided'}`,`Service: ${label}`,'','Enquiry:',brief].join('\n');
    return {recipient,subject,body};
  };

  const setStatus=message=>{document.querySelector('#form-status').textContent=message};

  form.addEventListener('submit',event=>{
    event.preventDefault();
    const {recipient,subject,body}=createDraft();
    setStatus(`Opening an email addressed to ${recipient}… Review it and press Send.`);
    window.location.href=`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const gmailLink=form.querySelector('#gmail-compose');
  if(gmailLink)gmailLink.addEventListener('click',event=>{
    if(!form.reportValidity()){event.preventDefault();return}
    const {recipient,subject,body}=createDraft();
    gmailLink.href=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(`Opening a prepared Gmail message to ${recipient}… Review it and press Send.`);
  });
}
