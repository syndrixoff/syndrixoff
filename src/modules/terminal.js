export function initTerminal() {
  const out = document.getElementById('termOutput');
  if (!out) return;
  function runSequence(loop) {
    out.innerHTML = "";
    const sequence = [
      { type: 'cmd', text: 'connect --to=your-project', delay: 600 },
      { type: 'gap', delay: 400 },
      { type: 'out-cyan', text: 'Initiating handshake...', delay: 0 },
      { type: 'out', text: 'Connection ready. Reach out at syndrixoff@gmail.com', delay: 600 },
      { type: 'gap', delay: 300 },
      { type: 'cursor', delay: 0 },
    ];
    let i = 0;
    function next() {
      if (i >= sequence.length) {
        if (loop) setTimeout(() => runSequence(true), 4000);
        return;
      }
      const s = sequence[i++];
      setTimeout(() => {
        if (s.type === 'gap') {
          const br = document.createElement('div');
          br.style.height = '6px';
          out.appendChild(br);
        } else if (s.type === 'cursor') {
          const div = document.createElement('div');
          div.className = 'line fade-in';
          div.innerHTML = `<span class="prompt">\u203a</span><span class="blink"></span>`;
          out.appendChild(div);
        } else {
          const div = document.createElement('div');
          div.className = 'line fade-in';
          if (s.type === 'cmd') {
            div.innerHTML = `<span class="prompt">\u203a</span><span class="cmd">${s.text}</span>`;
          } else {
            div.innerHTML = `<span class="${s.type}">${s.text}</span>`;
          }
          out.appendChild(div);
        }
        out.scrollTop = out.scrollHeight;
        next();
      }, s.delay);
    }
    setTimeout(next, 500);
  }
  runSequence(true);
}
