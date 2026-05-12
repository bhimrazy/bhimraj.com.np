"use client";

import { useEffect } from "react";

/**
 * Mounts after the article renders and injects a copy button into every
 * <pre> element that Shiki produced. Purely DOM-based so it doesn't
 * interfere with the static HTML from dangerouslySetInnerHTML.
 */
export default function CodeCopyButtons() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLPreElement>("article pre");

    const cleanups: (() => void)[] = [];

    for (const pre of pres) {
      if (pre.querySelector(".code-copy-btn")) continue;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.setAttribute("title", "Copy code");
      btn.innerHTML = copyIcon();
      btn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        border: 1px solid var(--site-border);
        background: var(--site-bg-secondary);
        color: var(--site-text-tertiary);
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.15s, color 0.15s;
        z-index: 10;
      `;

      const showBtn = () => {
        btn.style.opacity = "1";
      };
      const hideBtn = () => {
        btn.style.opacity = "0";
      };

      pre.addEventListener("mouseenter", showBtn);
      pre.addEventListener("mouseleave", hideBtn);

      const onClick = async () => {
        const code = pre.querySelector("code");
        const text = code?.innerText ?? pre.innerText;
        await navigator.clipboard.writeText(text);
        btn.innerHTML = checkIcon();
        btn.style.color = "var(--site-accent)";
        btn.style.borderColor = "var(--site-accent)";
        setTimeout(() => {
          btn.innerHTML = copyIcon();
          btn.style.color = "var(--site-text-tertiary)";
          btn.style.borderColor = "var(--site-border)";
        }, 2000);
      };

      btn.addEventListener("click", onClick);
      pre.appendChild(btn);

      cleanups.push(() => {
        pre.removeEventListener("mouseenter", showBtn);
        pre.removeEventListener("mouseleave", hideBtn);
        btn.removeEventListener("click", onClick);
        btn.remove();
      });
    }

    return () => {
      for (const fn of cleanups) fn();
    };
  }, []);

  return null;
}

function copyIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>`;
}

function checkIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`;
}
