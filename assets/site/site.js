/* Shared script for the First-Time Buyers Guide and the city pages. */

/* 1. Paste your Google Sheet web app link between the quotes.
      Every "Want Otis to call you?" form on the site uses this one link. */
var OTIS_SHEET_URL = "";

/* Videos: show the poster first, load the player only when someone taps it */
(function(){
  [].slice.call(document.querySelectorAll('a.vplay')).forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var yt = a.getAttribute('data-yt'), name = a.getAttribute('aria-label') || 'Video';
      var el;
      if (yt){
        el = document.createElement('iframe');
        el.src = 'https://www.youtube-nocookie.com/embed/' + yt + '?autoplay=1&rel=0&playsinline=1';
        el.title = name;
        el.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        el.allowFullscreen = true;
      } else {
        el = document.createElement('video');
        el.src = a.getAttribute('href');
        el.poster = (a.querySelector('img') || {}).src || '';
        el.controls = true; el.autoplay = true; el.playsInline = true;
        el.setAttribute('playsinline', '');
      }
      a.replaceWith ? a.replaceWith(wrap(el, a)) : a.parentNode.replaceChild(wrap(el, a), a);
      if (el.play) { var p = el.play(); if (p && p.catch) p.catch(function(){}); }
    });
  });
  function wrap(el, a){
    var d = document.createElement('div');
    d.className = a.className;
    d.appendChild(el);
    return d;
  }
})();

/* Contact forms: send name, contact and city to the Google Sheet */
(function(){
  [].slice.call(document.querySelectorAll('form[data-lead]')).forEach(function(form){
    var msg = form.querySelector('.msg'), body = form.parentNode;
    function say(t){ msg.textContent = t; msg.hidden = false; }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.name.value.trim(), contact = form.contact.value.trim();
      if (form.website && form.website.value) return;
      if (!name){ say('Add your name so Otis knows who to ask for.'); form.name.focus(); return; }
      if (contact.replace(/\D/g,'').length < 7 && !/^\S+@\S+\.\S+$/.test(contact)){ say('Add a phone number or an email so Otis can reach you.'); form.contact.focus(); return; }
      if (!OTIS_SHEET_URL){ say('This form is not connected yet. Call Otis at (415) 756-1695.'); return; }
      var btn = form.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending';
      var data = new URLSearchParams(new FormData(form)); data.append('page', location.pathname);
      fetch(OTIS_SHEET_URL, {method:'POST', mode:'no-cors', body:data}).then(function(){
        body.innerHTML = '<div class="done" role="status"><b>Got it.</b><span>Otis will reach out within one day. If you need him sooner, call <span style="white-space:nowrap">(415) 756-1695</span>.</span></div>';
      }).catch(function(){
        btn.disabled = false; btn.textContent = 'Have Otis contact me';
        say('That did not send. Check your connection and try again, or call Otis at (415) 756-1695.');
      });
    });
  });
})();

/* Guide: monthly cost calculator */
(function(){
  var f = document.getElementById('calc');
  if (!f) return;
  var out = {
    loan: document.getElementById('c-loan'), tax: document.getElementById('c-tax'),
    ins: document.getElementById('c-ins'), mi: document.getElementById('c-mi'),
    tot: document.getElementById('c-tot'), two: document.getElementById('c-two')
  };
  function num(id){ var v = parseFloat(String(document.getElementById(id).value).replace(/[^0-9.]/g,'')); return isFinite(v) ? v : 0; }
  function fmt(n){ return '$' + (Math.round(n / 10) * 10).toLocaleString('en-US'); }
  function run(){
    var price = num('c-price'), down = num('c-down') / 100, rate = num('c-rate') / 100 / 12;
    var fha = document.getElementById('c-fha').checked;
    var loan = price * (1 - down);
    var pi = rate > 0 ? loan * rate / (1 - Math.pow(1 + rate, -360)) : loan / 360;
    var tax = price * 0.011 / 12, ins = 100, mi = fha ? loan * 0.0055 / 12 : 0;
    var tot = pi + tax + ins + mi;
    out.loan.textContent = 'about ' + fmt(pi);
    out.tax.textContent = 'about ' + fmt(tax);
    out.ins.textContent = 'about ' + fmt(ins);
    out.mi.textContent = fha ? 'about ' + fmt(mi) : '$0';
    out.tot.textContent = 'about ' + fmt(tot);
    out.two.textContent = fmt(tot / 2);
  }
  f.addEventListener('input', run);
  f.addEventListener('submit', function(e){ e.preventDefault(); run(); });
  run();
})();

/* Guide: filter the cities by how you get to San Francisco */
(function(){
  var bar = document.getElementById('city-filter');
  if (!bar) return;
  var cities = [].slice.call(document.querySelectorAll('.city[data-ride]'));
  var note = document.getElementById('city-count');
  bar.hidden = false;
  bar.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    [].slice.call(bar.querySelectorAll('button')).forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    var want = b.getAttribute('data-ride'), shown = 0;
    cities.forEach(function(c){
      var ok = want === 'all' || c.getAttribute('data-ride').split(' ').indexOf(want) > -1;
      c.hidden = !ok; if (ok) shown++;
    });
    if (note) note.textContent = shown + (shown === 1 ? ' city' : ' cities') + ' shown';
  });
})();

/* Guide: which hidden costs to check in your city */
(function(){
  var sel = document.getElementById('cost-city');
  if (!sel) return;
  var items = [].slice.call(document.querySelectorAll('#cost-list li[data-city]'));
  var none = document.getElementById('cost-none');
  sel.closest('.picker').hidden = false;
  function run(){
    var c = sel.value, shown = 0;
    items.forEach(function(li){
      var ok = c === 'all' || li.getAttribute('data-city').split(' ').indexOf(c) > -1;
      li.hidden = !ok; if (ok) shown++;
    });
    if (none) none.hidden = shown > 0;
  }
  sel.addEventListener('change', run); run();
})();

/* Guide: "Do this week" checklist, saved on this device */
(function(){
  var boxes = [].slice.call(document.querySelectorAll('.do input[type=checkbox]'));
  if (!boxes.length) return;
  var key = 'otis-guide-done', saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) {}
  var count = document.getElementById('done-count');
  function show(){
    var n = boxes.filter(function(b){ return b.checked; }).length;
    if (count) count.textContent = n + ' of ' + boxes.length + ' done';
  }
  boxes.forEach(function(b){
    b.closest('.do').classList.add('can-check');
    b.checked = !!saved[b.id];
    b.addEventListener('change', function(){
      saved[b.id] = b.checked;
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch(e) {}
      show();
    });
  });
  show();
})();
