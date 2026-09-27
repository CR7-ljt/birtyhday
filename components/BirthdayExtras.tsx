'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Moon, Music2, Volume2, VolumeX } from 'lucide-react';

/** 生日主体：首次交互后可切换的合成氛围声与无歌词生日旋律，无外部音源。 */
export function AudioAtmosphere() {
  const audio = useRef<AudioContext | null>(null);
  const nodes = useRef<OscillatorNode[]>([]);
  const birthdayTimer = useRef<number | null>(null);
  const modeRef = useRef<'off' | 'electronic' | 'field' | 'birthday'>('off');
  const [mode, setMode] = useState<'off' | 'electronic' | 'field' | 'birthday'>('off');
  const stop = () => { if (birthdayTimer.current) window.clearTimeout(birthdayTimer.current); birthdayTimer.current = null; nodes.current.forEach(node => { try { node.stop(); } catch {} }); nodes.current = []; };
  const choose = (next: 'off' | 'electronic' | 'field' | 'birthday') => {
    stop(); modeRef.current = next; setMode(next); if (next === 'off') return;
    const ctx = audio.current ||= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const gain = ctx.createGain(); gain.gain.value = next === 'birthday' ? .07 : next === 'electronic' ? .024 : .018; gain.connect(ctx.destination);
    if (next === 'birthday') {
      const melody = [[261.63,.34],[261.63,.17],[293.66,.51],[261.63,.51],[349.23,.51],[329.63,1],[261.63,.34],[261.63,.17],[293.66,.51],[261.63,.51],[392,.51],[349.23,1]] as const;
      let at = ctx.currentTime + .05;
      nodes.current = melody.map(([frequency, duration]) => {
        const oscillator = ctx.createOscillator(); const noteGain = ctx.createGain();
        oscillator.type = 'triangle'; oscillator.frequency.value = frequency;
        noteGain.gain.setValueAtTime(0, at); noteGain.gain.linearRampToValueAtTime(1, at + .025); noteGain.gain.exponentialRampToValueAtTime(.001, at + duration);
        oscillator.connect(noteGain); noteGain.connect(gain); oscillator.start(at); oscillator.stop(at + duration + .04); at += duration;
        return oscillator;
      });
      const loopDelay = Math.ceil((at - ctx.currentTime) * 1000);
      birthdayTimer.current = window.setTimeout(() => { if (modeRef.current === 'birthday') choose('birthday'); }, loopDelay);
      return;
    }
    const tones = next === 'electronic' ? [174, 261.6, 392] : [92, 138];
    nodes.current = tones.map((frequency, index) => {
      const oscillator = ctx.createOscillator();
      oscillator.type = next === 'electronic' ? (index === 0 ? 'sine' : 'triangle') : 'sine';
      oscillator.frequency.value = frequency; oscillator.detune.value = index * 4;
      oscillator.connect(gain); oscillator.start(); return oscillator;
    });
  };
  useEffect(() => () => stop(), []);
  const options = [{key:'off',label:'静音',Icon:VolumeX},{key:'electronic',label:'轻电子',Icon:Music2},{key:'field',label:'微风草坪',Icon:Volume2},{key:'birthday',label:'祝你生日快乐',Icon:Music2}] as const;
  return <div className="audio-control" aria-label="氛围音效">{options.map(({key,label,Icon}) => <button key={key} className={mode === key ? 'active' : ''} onClick={() => choose(key)} title={label}><Icon size={14}/><span>{label}</span></button>)}</div>;
}

/** 生日主体：完全在本地生成并下载的暗金竖版纪念海报（1080×1920）。 */
export function PosterMaker({ wish }: { wish: string }) {
  const [saved, setSaved] = useState(false);
  const download = () => {
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = 1080, H = 1920;

    // —— 背景：黑金渐变 ——
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0a0a08'); bg.addColorStop(.45, '#1a150a'); bg.addColorStop(.75, '#120e07'); bg.addColorStop(1, '#080806');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // —— 顶部暖金光晕 ——
    const glowTop = ctx.createRadialGradient(W * 0.5, H * 0.12, 20, W * 0.5, H * 0.12, 560);
    glowTop.addColorStop(0, 'rgba(232,200,90,.28)'); glowTop.addColorStop(1, 'rgba(232,200,90,0)');
    ctx.fillStyle = glowTop; ctx.fillRect(0, 0, W, H);

    // —— 底部冷紫光晕 ——
    const glowBottom = ctx.createRadialGradient(W * 0.3, H * 0.92, 20, W * 0.3, H * 0.92, 500);
    glowBottom.addColorStop(0, 'rgba(120,90,180,.18)'); glowBottom.addColorStop(1, 'rgba(120,90,180,0)');
    ctx.fillStyle = glowBottom; ctx.fillRect(0, 0, W, H);

    // —— 金色粒子（确定性伪随机） ——
    ctx.fillStyle = 'rgba(232,200,90,.6)';
    for (let i = 0; i < 36; i++) {
      const rnd = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
      const x = rnd(i + 1) * W, y = rnd(i + 100) * H;
      const r = 0.8 + rnd(i + 200) * 2.2;
      ctx.globalAlpha = 0.25 + rnd(i + 300) * 0.5;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // —— 双层金色边框 ——
    ctx.strokeStyle = 'rgba(232,200,90,.55)'; ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, W - 112, H - 112);
    ctx.strokeStyle = 'rgba(232,200,90,.22)'; ctx.lineWidth = 1;
    ctx.strokeRect(82, 82, W - 164, H - 164);

    // —— 顶部标签 ——
    ctx.fillStyle = '#e8c85a'; ctx.font = '500 26px "DM Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText('CHAPTER EIGHTEEN  ·  A NIGHT TO REMEMBER', W / 2, 185);

    // —— 顶部装饰线 + 两端菱形 ——
    const lineGrad = ctx.createLinearGradient(W * 0.25, 0, W * 0.75, 0);
    lineGrad.addColorStop(0, 'rgba(232,200,90,0)'); lineGrad.addColorStop(.5, 'rgba(232,200,90,.6)'); lineGrad.addColorStop(1, 'rgba(232,200,90,0)');
    ctx.strokeStyle = lineGrad; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(W * 0.28, 225); ctx.lineTo(W * 0.72, 225); ctx.stroke();
    ctx.fillStyle = 'rgba(232,200,90,.7)';
    [[W * 0.28, 225], [W * 0.72, 225]].forEach(([dx, dy]) => {
      ctx.save(); ctx.translate(dx, dy); ctx.rotate(Math.PI / 4); ctx.fillRect(-4, -4, 8, 8); ctx.restore();
    });

    // —— 主标题 HAPPY（白色斜体） ——
    ctx.fillStyle = '#f6efd9'; ctx.font = 'italic 500 130px Georgia, "Playfair Display", serif';
    ctx.textAlign = 'center'; ctx.fillText('HAPPY', W / 2, 430);

    // —— 18TH（金色渐变斜体 + 辉光） ——
    const goldText = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
    goldText.addColorStop(0, '#c9a84a'); goldText.addColorStop(.5, '#f0d782'); goldText.addColorStop(1, '#c9a84a');
    ctx.fillStyle = goldText; ctx.font = 'italic 600 200px Georgia, "Playfair Display", serif';
    ctx.shadowColor = 'rgba(232,200,90,.4)'; ctx.shadowBlur = 30;
    ctx.fillText('18TH', W / 2, 620);
    ctx.shadowBlur = 0;

    // —— 中间圆形 + 内光晕 ——
    ctx.strokeStyle = 'rgba(232,200,90,.5)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(W / 2, 880, 185, 0, Math.PI * 2); ctx.stroke();
    const circleGlow = ctx.createRadialGradient(W / 2, 880, 10, W / 2, 880, 185);
    circleGlow.addColorStop(0, 'rgba(232,200,90,.12)'); circleGlow.addColorStop(1, 'rgba(232,200,90,0)');
    ctx.fillStyle = circleGlow; ctx.beginPath(); ctx.arc(W / 2, 880, 185, 0, Math.PI * 2); ctx.fill();

    // —— 圆形周围 4 个小星星 ——
    ctx.fillStyle = 'rgba(232,200,90,.6)';
    [[W / 2, 660], [W / 2 + 210, 880], [W / 2, 1100], [W / 2 - 210, 880]].forEach(([sx, sy]) => {
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(Math.PI / 4); ctx.fillRect(-3.5, -3.5, 7, 7); ctx.restore();
    });

    // —— 18 大数字 ——
    ctx.fillStyle = '#f6efd9'; ctx.font = '500 170px Georgia, "Playfair Display", serif';
    ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(232,200,90,.35)'; ctx.shadowBlur = 25;
    ctx.fillText('18', W / 2, 940);
    ctx.shadowBlur = 0;

    // —— 祝福语：大号金色引号 + 居中文字 ——
    ctx.fillStyle = 'rgba(232,200,90,.35)'; ctx.font = 'italic 120px Georgia, serif';
    ctx.textAlign = 'center'; ctx.fillText('"', W / 2 - 340, 1240);
    ctx.fillText('"', W / 2 + 340, 1380);

    ctx.fillStyle = '#e7dfcc'; ctx.font = '400 38px Georgia, "PingFang SC", "Microsoft YaHei", serif';
    ctx.textAlign = 'center';
    const maxWidth = 720, lineHeight = 62;
    let line = '', y = 1280;
    Array.from(wish).forEach(char => {
      const testLine = line + char;
      if (ctx.measureText(testLine).width > maxWidth && line !== '') {
        ctx.fillText(line, W / 2, y); line = char; y += lineHeight;
      } else { line = testLine; }
    });
    ctx.fillText(line, W / 2, y);

    // —— 底部装饰线 + 菱形 ——
    ctx.strokeStyle = lineGrad; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(W * 0.28, 1620); ctx.lineTo(W * 0.72, 1620); ctx.stroke();
    ctx.fillStyle = 'rgba(232,200,90,.7)';
    [[W * 0.28, 1620], [W * 0.72, 1620]].forEach(([dx, dy]) => {
      ctx.save(); ctx.translate(dx, dy); ctx.rotate(Math.PI / 4); ctx.fillRect(-4, -4, 8, 8); ctx.restore();
    });

    // —— 底部文字 ——
    ctx.fillStyle = '#e8c85a'; ctx.font = '500 24px "DM Mono", monospace';
    ctx.textAlign = 'center'; ctx.fillText('A NEW CHAPTER  ·  A NIGHT TO KEEP', W / 2, 1690);
    ctx.fillStyle = 'rgba(232,200,90,.4)'; ctx.font = '400 18px "DM Mono", monospace';
    ctx.fillText('FOR A BRIGHT FUTURE', W / 2, 1730);

    // —— 下载 ——
    const link = document.createElement('a'); link.download = 'happy-18th-my-era.png'; link.href = canvas.toDataURL('image/png'); link.click();
    setSaved(true); window.setTimeout(() => setSaved(false), 2200);
  };
  return <button className={`poster-button ${saved ? 'saved' : ''}`} onClick={download}><Download size={15}/>{saved ? 'POSTER SAVED' : '保存这一夜'}</button>;
}

/** 生日主体：阅读结束后切换为安静、适合截图的深夜收尾。 */
export function MidnightNote() {
  const [active, setActive] = useState(false);
  return <section className={`midnight-note ${active ? 'night-active' : ''}`}><div className="midnight-lamp"/><p>THE LAST LIGHT OF TONIGHT</p><h3>18 岁的第一封信</h3><span>把这一晚留给自己，慢一点，也亮一点。</span><button onClick={() => setActive(v => !v)}><Moon size={15}/>{active ? '回到庆典' : '进入深夜模式'}</button></section>;
}
