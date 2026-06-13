const style = document.createElement('style');
style.textContent = `
  syndra-toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    z-index: 100;
    transform: translate(-50%, 150%);
    max-width: calc(100% - 2rem);
    border: 1px solid rgba(94,197,189,0.25);
    border-radius: var(--radius-sm, 16px);
    background: rgba(18,16,14,0.55);
    backdrop-filter: blur(24px) saturate(1.4);
    color: var(--ink);
    padding: 0.9rem 1.4rem;
    box-shadow: 0 20px 48px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(232,223,206,0.15);
    transition: transform 0.4s var(--ease, cubic-bezier(0.16,1,0.3,1));
    font-size: 0.9rem;
    pointer-events: none;
  }
  syndra-toast.show { transform: translate(-50%, 0); }
  syndra-toast[data-type="error"] { border-color: rgba(217,79,58,0.3); background: rgba(217,79,58,0.08); }
  syndra-toast[data-type="success"] { border-color: rgba(149,184,90,0.3); background: rgba(149,184,90,0.06); }
`;
document.head.appendChild(style);

class SyndraToast extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
    this.setAttribute('aria-atomic', 'true');
  }
}
customElements.define('syndra-toast', SyndraToast);
