(function(){
  var C=window.CONFIG,$=function(s){return document.querySelector(s)};
  var sudahTiup=false,waktuTiba=false;

  function tampil(id){
    document.querySelectorAll('.scene').forEach(function(e){e.classList.remove('active')});
    $(id).classList.add('active');window.scrollTo(0,0);
  }
  function teks(id,t){$(id).textContent=t}

  teks('#hitung-kecil',C.hitung.kecil);teks('#hitung-judul',C.hitung.judul);teks('#btn-mulai',C.hitung.tombol);
  teks('#kue-judul',C.kue.judul);teks('#kue-petunjuk',C.kue.petunjuk);teks('#btn-tiup',C.kue.tombol);
  teks('#foto-judul',C.fotoJudul);teks('#foto-cap',C.foto.caption);teks('#btn-lanjut1',C.lanjut);
  $('#foto-img').src=C.foto.src;$('#foto-img').alt=C.foto.caption;
  $('#foto-img2').src=C.foto.src;$('#foto-img2').alt=C.foto.caption;
  teks('#akhir-nama',C.foto.caption);teks('#akhir-ucapan',C.akhir.ucapan);teks('#btn-akhir',C.pilih.akhir);
  teks('#tanya-judul',C.tanya.judul);teks('#tanya-kecil',C.tanya.kecil);
  teks('#btn-mau',C.tanya.mau);teks('#btn-nggak',C.tanya.nggak[0]);
  teks('#pilih-judul',C.pilih.judul);teks('#pilih-kecil',C.pilih.kecil);teks('#btn-kembali',C.pilih.kembali);

  // Hati melayang
  for(var n=0;n<14;n++){
    var h=document.createElement('span');h.textContent='♥';
    h.style.left=Math.random()*100+'%';h.style.fontSize=(12+Math.random()*22)+'px';
    h.style.animationDuration=(14+Math.random()*16)+'s';h.style.animationDelay=(-Math.random()*20)+'s';
    $('#hati').appendChild(h);
  }

  function konfeti(){
    var w=['#e8a0b4','#c9566f','#ffd28a','#fbeff0'];
    for(var i=0;i<70;i++){
      var k=document.createElement('i');k.className='konfeti';
      k.style.left=Math.random()*100+'vw';k.style.background=w[i%4];
      k.style.animationDuration=(3+Math.random()*3)+'s';k.style.animationDelay=(Math.random()*1.2)+'s';
      document.body.appendChild(k);setTimeout(function(el){el.remove()},7000,k);
    }
  }

  // Hitung mundur. Tambahkan ?tes di alamat untuk mencoba (hitung 8 detik).
  var target=new Date(C.tanggal).getTime();
  if(/[?&]tes/.test(location.search)) target=Date.now()+8000;
  function dua(n){return (n<10?'0':'')+n}
  function putar(){
    var s=Math.max(0,Math.floor((target-Date.now())/1000));
    teks('#j-h',dua(Math.floor(s/86400)));teks('#j-j',dua(Math.floor(s%86400/3600)));
    teks('#j-m',dua(Math.floor(s%3600/60)));teks('#j-d',dua(s%60));
    if(s<=0){
      if(!waktuTiba){waktuTiba=true;teks('#hitung-judul',C.hitung.judulTiba);teks('#hitung-kecil',C.hitung.kecilTiba);
        $('#btn-mulai').hidden=false;konfeti()}
      return;
    }
    setTimeout(putar,250);
  }
  putar();

  // Tiup lilin
  function tiup(){
    if(sudahTiup) return; sudahTiup=true;
    document.querySelectorAll('.api').forEach(function(a,i){setTimeout(function(){a.classList.add('mati')},i*250)});
    setTimeout(function(){$('#s-kue').classList.add('mati-semua');document.body.classList.add('gelap')},800);
    setTimeout(function(){document.body.classList.remove('gelap');konfeti();tampil('#s-foto')},2400);
  }
  function dengarTiupan(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){teks('#kue-petunjuk','Mikrofon tidak tersedia. Pakai tombol di bawah.');return}
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
      var ctx=new (window.AudioContext||window.webkitAudioContext)(),an=ctx.createAnalyser();an.fftSize=512;
      ctx.createMediaStreamSource(stream).connect(an);
      var buf=new Uint8Array(an.fftSize),lama=0,last=performance.now();
      (function loop(){
        if(sudahTiup){stream.getTracks().forEach(function(t){t.stop()});ctx.close();return}
        an.getByteTimeDomainData(buf);
        var s=0;for(var i=0;i<buf.length;i++){var d=(buf[i]-128)/128;s+=d*d}
        var rms=Math.sqrt(s/buf.length),now=performance.now(),dt=now-last;last=now;
        if(rms>C.sensitivitasTiup){lama+=dt;$('#s-kue').classList.add('tiup')}
        else{lama=Math.max(0,lama-dt*2);$('#s-kue').classList.remove('tiup')}
        if(lama>450) tiup(); else requestAnimationFrame(loop);
      })();
    }).catch(function(){teks('#kue-petunjuk','Izin mikrofon tidak diberikan. Pakai tombol di bawah.')});
  }
  $('#btn-mulai').addEventListener('click',function(){
    if(C.musik){var m=$('#musik');m.src=C.musik;m.volume=.6;m.play().catch(function(){})}
    tampil('#s-kue');dengarTiupan();
  });
  $('#btn-tiup').addEventListener('click',tiup);
  $('#kue').addEventListener('click',tiup);
  $('#btn-lanjut1').addEventListener('click',function(){tampil('#s-tanya')});

  // Tombol "Nggak mau" selalu kabur
  var nggak=$('#btn-nggak'),kali=0;
  function kabur(e){
    if(e){e.preventDefault();e.stopPropagation()}
    kali++;
    teks('#btn-nggak',C.tanya.nggak[Math.min(kali,C.tanya.nggak.length-1)]);
    var w=nggak.offsetWidth,hh=nggak.offsetHeight,m=12;
    nggak.classList.add('kabur');
    nggak.style.left=(m+Math.random()*(innerWidth-w-2*m))+'px';
    nggak.style.top=(m+Math.random()*(innerHeight-hh-2*m))+'px';
    $('#btn-mau').style.transform='scale('+Math.min(1+kali*.1,1.6)+')';
  }
  ['pointerenter','pointerdown','touchstart','click','focus'].forEach(function(ev){nggak.addEventListener(ev,kabur,{passive:false})});
  $('#btn-mau').addEventListener('click',function(){tampil('#s-pilih')});

  // Pilih surat
  var dibaca={};
  C.surat.forEach(function(s,i){
    var w=document.createElement('div');w.className='surat-pilih';
    var b=document.createElement('button');b.className='amplop';b.setAttribute('aria-label','Buka '+s.label);
    b.innerHTML='<span class="segel">♥</span>';
    var p=document.createElement('p');p.textContent=s.label;
    w.appendChild(b);w.appendChild(p);$('#daftar-surat').appendChild(w);
    b.addEventListener('click',function(){
      teks('#kartu-judul',s.judul);var isi=$('#kartu-isi');isi.innerHTML='';
      s.isi.forEach(function(t){var q=document.createElement('p');q.textContent=t;isi.appendChild(q)});
      teks('#kartu-ttd',s.ttd||'');w.classList.add('sudah');dibaca[i]=1;
      if(Object.keys(dibaca).length>=C.surat.length)$('#btn-akhir').hidden=false;
      tampil('#s-surat');
      var k=$('#kartu');k.style.animation='none';void k.offsetWidth;k.style.animation='';
    });
  });
  $('#btn-akhir').addEventListener('click',function(){tampil('#s-akhir');konfeti()});
  $('#btn-kembali').addEventListener('click',function(){tampil('#s-pilih')});
})();
