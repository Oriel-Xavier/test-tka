const questions = [
  {q:"Jika 4x + 7 = 31, nilai x adalah …", o:["4","5","6","7"], a:1},
  {q:"Sebuah buku berharga Rp80.000 dan mendapat diskon 15%. Harga setelah diskon adalah …", o:["Rp64.000","Rp68.000","Rp70.000","Rp72.000"], a:1},
  {q:"Hasil dari 3² + 4² adalah …", o:["12","18","25","49"], a:2},
  {q:"Sinonim kata 'akurat' yang paling tepat adalah …", o:["Cepat","Tepat","Lambat","Sulit"], a:1},
  {q:"Jika semua A adalah B, dan semua B adalah C, maka …", o:["Semua C adalah A","Sebagian A bukan C","Semua A adalah C","Tidak ada A yang C"], a:2},
  {q:"Pola bilangan 2, 6, 12, 20, 30, … angka berikutnya adalah …", o:["36","40","42","44"], a:2},
  {q:"Satu jam terdiri dari berapa detik?", o:["600","1.800","3.600","6.000"], a:2},
  {q:"Lawan kata 'optimis' adalah …", o:["Realistis","Pesimis","Aktif","Kreatif"], a:1},
  {q:"Jika 5 pekerja menyelesaikan tugas dalam 12 hari, dengan asumsi sama rata, 10 pekerja memerlukan …", o:["3 hari","6 hari","12 hari","24 hari"], a:1},
  {q:"Ibukota Provinsi Bali adalah …", o:["Singaraja","Gianyar","Denpasar","Tabanan"], a:2},
  {q:"Pecahan 3/4 jika diubah menjadi persen adalah …", o:["25%","50%","75%","80%"], a:2},
  {q:"Planet yang dikenal sebagai Planet Merah adalah …", o:["Venus","Mars","Jupiter","Merkurius"], a:1},
  {q:"Kata baku yang benar adalah …", o:["Resiko","Risiko","Resikko","Resikho"], a:1},
  {q:"Jika sebuah persegi memiliki sisi 9 cm, luasnya adalah …", o:["18 cm²","36 cm²","72 cm²","81 cm²"], a:3},
  {q:"Hasil 120 ÷ 5 × 2 adalah …", o:["12","24","48","60"], a:2},
  {q:"Organ utama untuk memompa darah ke seluruh tubuh adalah …", o:["Paru-paru","Ginjal","Jantung","Hati"], a:2},
  {q:"Manakah yang merupakan sumber energi terbarukan?", o:["Batu bara","Minyak bumi","Gas alam","Tenaga surya"], a:3},
  {q:"Jika hari ini Senin, 10 hari lagi adalah …", o:["Rabu","Kamis","Jumat","Sabtu"], a:1},
  {q:"15% dari 200 adalah …", o:["15","20","30","35"], a:2},
  {q:"Kalimat yang menggunakan tanda baca yang tepat adalah …", o:["Ibu berkata \"Belajar!\"","Ibu berkata, \"Belajar!\"","Ibu, berkata \"Belajar!\"","Ibu berkata \"Belajar\"!"], a:1}
];

const $ = id => document.getElementById(id);
let state = {
  name:"", duration:600, current:0, answers:Array(questions.length).fill(null),
  startedAt:0, questionStartedAt:0, questionTimes:Array(questions.length).fill(0),
  remaining:600, timerId:null, ended:false
};

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
function formatTime(sec){
  sec=Math.max(0,Math.floor(sec));
  const m=Math.floor(sec/60), s=sec%60;
  return `${m}:${String(s).padStart(2,"0")}`;
}
function formatDecimal(sec){ return sec.toFixed(1).replace(".",",")+" detik"; }

function startTest(){
  const name=$("candidateName").value.trim();
  if(!name){
    $("candidateName").classList.add("shake");
    setTimeout(()=>$("candidateName").classList.remove("shake"),400);
    $("candidateName").focus(); return;
  }
  state = {
    name, duration:Number($("duration").value), current:0,
    answers:Array(questions.length).fill(null), startedAt:Date.now(),
    questionStartedAt:Date.now(), questionTimes:Array(questions.length).fill(0),
    remaining:Number($("duration").value), timerId:null, ended:false
  };
  $("greeting").textContent = `Halo, ${name}`;
  $("statusPill").classList.add("live");
  $("statusPill").innerHTML="<span></span> Tes berlangsung";
  showScreen("testScreen");
  renderQuestion();
  if(state.duration>0){
    state.timerId=setInterval(()=>{
      state.remaining--;
      $("timer").textContent=formatTime(state.remaining);
      if(state.remaining<=0){ clearInterval(state.timerId); finishTest(true); }
    },1000);
  } else $("timer").textContent="∞";
}

function recordCurrentTime(){
  const elapsed=(Date.now()-state.questionStartedAt)/1000;
  state.questionTimes[state.current]+=elapsed;
  state.questionStartedAt=Date.now();
}
function renderQuestion(){
  const i=state.current, q=questions[i];
  $("questionNumber").textContent=String(i+1).padStart(2,"0");
  $("questionText").textContent=q.q;
  $("questionTime").textContent=formatDecimal(state.questionTimes[i]);
  $("progressText").textContent=`Soal ${i+1} dari ${questions.length}`;
  const answered=state.answers.filter(v=>v!==null).length;
  $("answeredText").textContent=`${answered} terjawab`;
  $("progressBar").style.width=`${((i+1)/questions.length)*100}%`;
  $("options").innerHTML=q.o.map((text,j)=>`
    <button class="option ${state.answers[i]===j?"selected":""}" data-index="${j}">
      <span class="option-key">${String.fromCharCode(65+j)}</span>
      <span class="option-text">${text}</span>
    </button>`).join("");
  document.querySelectorAll(".option").forEach(btn=>{
    btn.addEventListener("click",()=>{
      state.answers[i]=Number(btn.dataset.index);
      renderQuestion();
      renderNavigator();
    });
  });
  $("prevBtn").disabled=i===0;
  $("prevBtn").style.opacity=i===0?".45":"1";
  $("nextBtn").textContent=i===questions.length-1?"Selesai →":"Berikutnya →";
  renderNavigator();
}
function renderNavigator(){
  $("navCount").textContent=questions.length;
  $("questionNav").innerHTML=questions.map((_,i)=>`
    <button class="nav-q ${i===state.current?"current ":""}${state.answers[i]!==null?"answered":""}" data-q="${i}">${i+1}</button>
  `).join("");
  document.querySelectorAll(".nav-q").forEach(b=>b.addEventListener("click",()=>{
    recordCurrentTime(); state.current=Number(b.dataset.q); renderQuestion();
  }));
}
function next(){
  recordCurrentTime();
  if(state.current<questions.length-1){state.current++;renderQuestion();}
  else finishTest(false);
}
function prev(){
  if(state.current===0)return;
  recordCurrentTime(); state.current--; renderQuestion();
}
function openModal(){ $("confirmModal").classList.remove("hidden"); }
function closeModal(){ $("confirmModal").classList.add("hidden"); }

function finishTest(auto=false){
  if(state.ended)return;
  state.ended=true;
  if(state.timerId)clearInterval(state.timerId);
  recordCurrentTime();
  const totalElapsed=(Date.now()-state.startedAt)/1000;
  const correct=state.answers.reduce((n,a,i)=>n+(a===questions[i].a?1:0),0);
  const answered=state.answers.filter(v=>v!==null).length;
  const accuracy=Math.round(correct/questions.length*100);
  const speed=totalElapsed>0 ? (answered/(totalElapsed/60)) : 0;
  const speedPct=Math.min(100,Math.round(speed/4*100));
  const score=Math.round(accuracy*0.7 + speedPct*0.3);

  $("score").textContent=score;
  $("accuracy").textContent=accuracy+"%";
  $("correctCount").textContent=`${correct} benar • ${questions.length-correct} salah`;
  $("speed").textContent=speed.toFixed(1);
  $("totalTime").textContent=formatTime(totalElapsed);
  $("resultTitle").textContent=auto?"Waktu habis.":"Tes selesai.";
  $("resultSubtitle").textContent=`${state.name}, berikut ringkasan performa kamu dari ${questions.length} soal.`;
  $("accuracyMetric").textContent=accuracy+"%";
  $("speedMetric").textContent=speedPct+"%";
  $("answeredMetric").textContent=`${answered} / ${questions.length}`;
  $("accuracyBar").style.width=accuracy+"%";
  $("speedBar").style.width=speedPct+"%";
  $("answeredBar").style.width=(answered/questions.length*100)+"%";

  let badge="Selesai";
  if(accuracy>=85)badge="Sangat teliti";
  else if(accuracy>=70)badge="Cukup teliti";
  else badge="Perlu latihan";
  $("performanceBadge").textContent=badge;

  const slowest=[...state.questionTimes].map((t,i)=>({t,i})).sort((a,b)=>b.t-a.t).slice(0,3);
  const unanswered=questions.map((_,i)=>i+1).filter((_,i)=>state.answers[i]===null);
  $("summaryList").innerHTML=`
    <li><strong>${correct}/${questions.length}</strong> jawaban benar.</li>
    <li>Rata-rata waktu per soal: <strong>${formatDecimal(totalElapsed/questions.length)}</strong>.</li>
    <li>Soal tercepat: <strong>${formatDecimal(Math.min(...state.questionTimes))}</strong>.</li>
    <li>Waktu terlama ada pada soal <strong>${slowest.map(x=>x.i+1).join(", ")}</strong>.</li>
    ${unanswered.length?`<li><strong>${unanswered.length}</strong> soal belum dijawab: ${unanswered.join(", ")}.</li>`:"<li>Semua soal sudah memiliki jawaban. <strong>Bagus!</strong></li>"}
  `;
  $("statusPill").classList.remove("live");
  $("statusPill").innerHTML="<span></span> Tes selesai";
  showScreen("resultScreen");
}

$("startBtn").addEventListener("click",startTest);
$("nextBtn").addEventListener("click",next);
$("prevBtn").addEventListener("click",prev);
$("submitBtn").addEventListener("click",openModal);
$("cancelSubmit").addEventListener("click",closeModal);
$("confirmSubmit").addEventListener("click",()=>{closeModal();finishTest(false)});
$("retryBtn").addEventListener("click",startTest);
$("homeBtn").addEventListener("click",()=>{
  if(state.timerId)clearInterval(state.timerId);
  $("statusPill").classList.remove("live");
  $("statusPill").innerHTML="<span></span> Siap dimulai";
  showScreen("startScreen");
});
$("candidateName").addEventListener("keydown",e=>{if(e.key==="Enter")startTest()});
window.addEventListener("beforeunload",e=>{
  if($("testScreen").classList.contains("active")&&!state.ended){
    e.preventDefault(); e.returnValue="";
  }
});
