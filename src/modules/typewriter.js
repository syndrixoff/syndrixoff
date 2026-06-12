export function initTypewriter() {
  class Typewriter {
    constructor(el, delayBackspace = 30, delayType = 65, delayPause = 250) {
      this.el = el;
      this.delayBackspace = delayBackspace;
      this.delayType = delayType;
      this.delayPause = delayPause;
      this.timer = null;
      this.currentTarget = el.innerText;
      this.el.classList.add('typing');
    }
    async transitionTo(targetText, originalText) {
      if (this.currentTarget === targetText) return;
      this.currentTarget = targetText;
      this.stop();
      await this.erase();
      await this.pause(this.delayPause);
      if (targetText === 'SYNDRIX') {
        this.el.classList.add('state-syndrix');
      } else {
        this.el.classList.remove('state-syndrix');
      }
      await this.type(targetText);
    }
    stop() { clearTimeout(this.timer); }
    erase() {
      return new Promise((resolve) => {
        const step = () => {
          const current = this.el.innerText;
          if (current.length > 0) {
            this.el.innerText = current.slice(0, -1);
            this.timer = setTimeout(step, this.delayBackspace);
          } else { resolve(); }
        };
        step();
      });
    }
    type(text) {
      return new Promise((resolve) => {
        let index = 0;
        const step = () => {
          if (index < text.length) {
            this.el.innerText += text[index];
            index++;
            this.timer = setTimeout(step, this.delayType);
          } else { resolve(); }
        };
        step();
      });
    }
    pause(ms) {
      return new Promise((resolve) => { this.timer = setTimeout(resolve, ms); });
    }
  }

  const scrambleTarget = document.querySelector('.scramble-target');
  if (scrambleTarget) {
    const originalText = scrambleTarget.innerText;
    const targetText = scrambleTarget.getAttribute('data-value');
    const typewriter = new Typewriter(scrambleTarget);
    const startLoop = async () => {
      await typewriter.pause(3500);
      while (true) {
        await typewriter.transitionTo(targetText, originalText);
        await typewriter.pause(3000);
        await typewriter.transitionTo(originalText, originalText);
        await typewriter.pause(3500);
      }
    };
    startLoop();
  }
}
