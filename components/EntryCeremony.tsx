'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

/* =====================================================================
 * 入场仪式动画脚本（严格串行）：
 *   启动页(点击「开始18」) → 全屏烟花 2s → siu~ 文字爱心停留 5s → 主界面
 *
 * 代码结构区分：
 *   LaunchScreen    —— 首页启动页
 *   FireworksStage  —— 烟花动画脚本（canvas 物理粒子，重力下落衰减）
 *   SiuHeart        —— 爱心动画脚本（纯 DOM 文字字符排布，无图片、无 canvas）
 *   主界面容器见 BirthdayExperience（动画流程走完前保持隐藏）
 *
 * 时序实现说明：全程使用定时器 + 纯 CSS 过渡驱动，不依赖任何动画库的
 * exit 回调；「done」为确定性硬卸载节点，保证遮罩层必定移除、滚动必定恢复。
 * ===================================================================== */

export const ENTRY_TIMING = {
  fireworks: 2000, // 烟花完整时长
  heartHold: 5000, // 爱心完整停留
  heartFade: 850,  // 爱心淡出（与主界面淡入重叠，平滑过渡）
} as const;

type EntryStage = 'launch' | 'fireworks' | 'heart' | 'exiting' | 'done';

export function EntryCeremony({ onFinished }: { onFinished: () => void }) {
  const [stage, setStage] = useState<EntryStage>('launch');
  const timers = useRef<number[]>([]);
  const finish = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setStage('exiting');
    onFinished();
    timers.current.push(window.setTimeout(() => {
      setStage('done');
      document.body.style.overflow = '';
    }, ENTRY_TIMING.heartFade + 60));
  };
  const schedule = (callback: () => void, delay: number) => timers.current.push(window.setTimeout(callback, delay));

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const begin = () => {
    if (stage !== 'launch') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      finish();
      return;
    }
    setStage('fireworks');
    schedule(() => setStage('heart'), ENTRY_TIMING.fireworks);
    schedule(finish, ENTRY_TIMING.fireworks + ENTRY_TIMING.heartHold);
  };

  if (stage === 'done') return null;

  return (
    <div className={`entry-overlay${stage === 'exiting' ? ' is-exiting' : ''}`} aria-hidden={stage === 'exiting'}>
      {(stage === 'launch' || stage === 'fireworks') && <LaunchScreen leaving={stage === 'fireworks'} onBegin={begin} onSkip={finish} />}
      {stage === 'fireworks' && <FireworksStage />}
      {stage === 'heart' && <SiuHeart />}
    </div>
  );
}

/* ---------------- 首页启动页 ---------------- */
function LaunchScreen({ leaving, onBegin, onSkip }: { leaving: boolean; onBegin: () => void; onSkip: () => void }) {
  return (
    <div className={`launch-screen${leaving ? ' is-leaving' : ''}`}>
      <div className="launch-halo" aria-hidden />
      <div className="launch-rings" aria-hidden><i /><i /><i /></div>
      <p className="launch-date">A NIGHT OF CELEBRATION</p>
      <div className="launch-18">18</div>
      <h1>HAPPY BIRTHDAY</h1>
      <span className="launch-tagline">A NEW CHAPTER BEGINS</span>
      <button className="launch-btn" onClick={onBegin} aria-label="开始18">
        <span>开始18</span>
        <i className="launch-btn-arrow">↓</i>
      </button>
      <p className="launch-hint">轻触开启，十八岁的第一束烟花</p>
      <button className="launch-skip" type="button" onClick={onSkip}>跳过仪式</button>
    </div>
  );
}

/* ---------------- 全屏烟花动画脚本（canvas 物理粒子） ---------------- */
type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number;
  color: string; spark: boolean; phase: number; tw: number;
};
type Flash = { x: number; y: number; r: number; life: number; max: number };

const PALETTE = ['#ffd97a', '#ff8b45', '#ff8bb9', '#bd8cff', '#86d9ff']; // 金 / 橙 / 粉 / 紫 / 浅蓝

function FireworksStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let particles: Particle[] = [];
    let flashes: Flash[] = [];
    let raf = 0;
    const t0 = performance.now();
    const DEADLINE = 2.02; // 所有粒子在 2s 内完成扩散消散

    const launch = (x: number, y: number, count: number, colors: string[], spawnAt: number) => {
      // 爆点闪光
      flashes.push({ x, y, r: 5, life: 16, max: 16 });
      const frames = Math.max(26, Math.round((DEADLINE - spawnAt) * 60));
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.7 + Math.random() * 4.6;
        const spark = Math.random() < 0.28;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: spark ? Math.round(frames * (0.42 + Math.random() * 0.2)) : frames,
          max: frames,
          size: spark ? 1.0 + Math.random() * 0.9 : 1.6 + Math.random() * 1.7,
          color: colors[(Math.random() * colors.length) | 0],
          spark,
          phase: Math.random() * Math.PI * 2,
          tw: 0.12 + Math.random() * 0.16,
        });
      }
    };

    // 多点起爆，覆盖全屏：位置、数量、配色依次编排
    const SCHEDULE: { t: number; x: number; y: number; n: number; c: number[] }[] = [
      { t: 0.00, x: 0.22, y: 0.26, n: 92, c: [0, 1, 4] },
      { t: 0.45, x: 0.78, y: 0.22, n: 92, c: [2, 3, 4] },
      { t: 0.90, x: 0.50, y: 0.38, n: 124, c: [0, 2, 3] },
      { t: 1.30, x: 0.34, y: 0.58, n: 88, c: [1, 2, 4] },
      { t: 1.62, x: 0.66, y: 0.55, n: 88, c: [0, 3, 4] },
      { t: 1.86, x: 0.50, y: 0.20, n: 72, c: [0, 1, 2, 3, 4] },
    ];
    let cursor = 0;

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      while (cursor < SCHEDULE.length && t >= SCHEDULE[cursor].t) {
        const s = SCHEDULE[cursor];
        launch(s.x * W, s.y * H, s.n, s.c.map(i => PALETTE[i]), s.t);
        cursor++;
      }

      // 半透明叠加尾迹，形成柔和光轨
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(2,3,8,0.22)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life--; f.r += 3.8;
        const a = Math.max(f.life, 0) / f.max;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, `rgba(255,240,200,${(0.5 * a).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
        if (f.life <= 0) flashes.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.048;               // 重力：向下衰减下落
        p.vx *= 0.986; p.vy *= 0.986; // 空气阻力
        p.x += p.vx; p.y += p.vy;
        p.life--; p.phase += p.tw;
        const ratio = Math.max(p.life, 0) / p.max;
        const twinkle = 0.72 + 0.28 * Math.sin(p.phase);
        const alpha = Math.pow(ratio, 1.15) * twinkle;
        if (alpha <= 0.012 || p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        if (p.spark) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2.4, p.y - p.vy * 2.4);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      if (t < DEADLINE || particles.length > 0 || flashes.length > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="fireworks-stage" aria-label="全屏烟花庆祝">
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}

/* ---------------- siu~ 文字爱心（纯 DOM 字符排布） ---------------- */
type CharSpec = { x: number; y: number; size: string; color: string; delay: string };

function SiuHeart() {
  // 确定性伪随机：保证每次渲染字符分布一致（React 严格模式安全）
  const chars = useMemo<CharSpec[]>(() => {
    const rnd = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

    // 心形参数方程：x=16sin³t, y=13cost−5cos2t−2cos3t−cos4t
    const heart = (t: number) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return { px: 50 + (x / 16) * 43, py: 46 - ((y + 17) / 29) * 70 };
    };

    const out: CharSpec[] = [];
    const outline = (count: number, scale: number, basePx: number, vw: number, sMin: number, sMax: number, hueFrom: number, hueTo: number, alpha: number) => {
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count + rnd(i + 7) * 0.02;
        const { px, py } = heart(t);
        const s = sMin + rnd(i + 100) * (sMax - sMin);
        const hue = (hueFrom + (i / count) * (hueTo - hueFrom)) % 360;
        out.push({
          x: px * scale + (1 - scale) * 50,
          y: py * scale + (1 - scale) * 46,
          size: `calc(${(basePx + s * 3.2).toFixed(1)}px + ${(s * vw).toFixed(3)}vw)`,
          color: `hsla(${hue.toFixed(0)}, ${64 + rnd(i + 300) * 12}%, ${74 + rnd(i + 400) * 9}%, ${alpha})`,
          delay: `${(i % 11) * 0.13}s`,
        });
      }
    };

    outline(88, 1, 5.5, 0.62, 0.85, 1.45, 336, 46, 0.9);                 // 主轮廓：粉 → 金 渐变（避免偏绿）
    outline(44, 0.82, 4.6, 0.52, 0.7, 1.15, 252, 312, 0.62);             // 内层回声：柔和紫
    outline(26, 0.42, 3.6, 0.42, 0.6, 1.0, 205, 265, 0.48);              // 内部填充：浅蓝紫，铺满视觉中心
    return out;
  }, []);

  return (
    <div className="siu-heart-shell" aria-label="SIU 爱心祝福">
      <div className="siu-heart">
        <div className="siu-glow" aria-hidden />
        {chars.map((c, i) => (
          <span
            key={i}
            style={{
              left: `${c.x.toFixed(2)}%`,
              top: `${c.y.toFixed(2)}%`,
              fontSize: c.size,
              color: c.color,
              '--d': c.delay,
            } as CSSProperties}
          >
            siu~
          </span>
        ))}
        <small>A NIGHT TO REMEMBER · CHAPTER EIGHTEEN</small>
      </div>
    </div>
  );
}
