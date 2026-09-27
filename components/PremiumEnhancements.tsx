'use client';

import { useEffect, useRef, useState } from 'react';

/** 顶部细金色渐变滚动进度条 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      el.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}

/** 卡片 3D tilt + 鼠标光影跟随：给所有 .wish-card / .moment-card 绑定 mousemove */
export function TiltEffect() {
  useEffect(() => {
    const cards = document.querySelectorAll('.wish-card, .moment-card');
    const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    cards.forEach((node) => {
      const el = node as HTMLElement;
      if (!el.querySelector('.tilt-glow')) {
        const glow = document.createElement('div');
        glow.className = 'tilt-glow';
        el.appendChild(glow);
      }

      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 8;
        const rotateX = (0.5 - y) * 8;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
      };

      const leave = () => { el.style.transform = ''; };

      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      handlers.push({ el, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
        (el as HTMLElement).style.transform = '';
      });
    };
  }, []);
  return null;
}

/** 自定义金色光标：光点跟随鼠标，悬停交互元素时放大 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 触摸设备不启用
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    // 环形光标缓动跟随
    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // 悬停交互元素时放大
    const interactiveSelector = 'a, button, .wish-card, .moment-card, .cake, .candle, input, textarea, [role="button"]';
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(interactiveSelector)) {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(interactiveSelector)) {
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      }
    };

    document.body.classList.add('custom-cursor-active');
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

/** Hero 滚动视差：蛋糕慢滚（0.3x），文字稍快（0.15x反向） */
export function ParallaxHero() {
  useEffect(() => {
    const cake = document.querySelector('.cake-stage') as HTMLElement | null;
    const heroCopy = document.querySelector('.hero-copy') as HTMLElement | null;
    if (!cake && !heroCopy) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = (document.querySelector('.hero-birthday') as HTMLElement | null)?.offsetHeight || 800;
        // 只在 hero 区域内生效
        if (scrollY < heroHeight) {
          if (cake) cake.style.setProperty('--parallax-y', `${scrollY * 0.3}px`);
          if (heroCopy) heroCopy.style.setProperty('--parallax-y', `${scrollY * -0.12}px`);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return null;
}

/** 数字滚动动画：从 0 缓动到 target */
export function CountUp({ target, duration = 1600, delay = 0 }: { target: number; duration?: number; delay?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now() + delay;
          const animate = (now: number) => {
            if (now < startTime) {
              requestAnimationFrame(animate);
              return;
            }
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo 缓动
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, delay]);

  return <span ref={ref} className="count-up">{value}</span>;
}

/** 文字逐字浮现：把文字拆成单个字符，逐个淡入上移 */
export function RevealText({ text, className = '', delay = 0, stagger = 0.04 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <span ref={ref} className={`reveal-text ${className}`}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          className="reveal-char"
          style={{
            transitionDelay: `${i * stagger}s`,
            display: char === ' ' ? 'inline-block' : undefined,
            width: char === ' ' ? '0.3em' : undefined,
          }}
          data-visible={visible}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
