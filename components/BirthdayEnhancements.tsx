'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, X } from 'lucide-react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

/** 生日主体：低频星图，只在偶发时刻呈现，不干扰阅读。 */
export function ConstellationCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf = 0, started = 0, active = false;
    const points = [[.18,.52],[.33,.31],[.49,.61],[.62,.28],[.78,.53]];
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    const draw = (time:number) => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if (!active && Math.random() < .00045) { active = true; started = time; }
      if (active) {
        const age = (time-started)/1000; const opacity = Math.min(age/.7,1,Math.max(0,(3.1-age)/.75))*.42;
        ctx.strokeStyle = `rgba(212,175,55,${opacity})`; ctx.fillStyle = `rgba(242,215,131,${opacity})`; ctx.lineWidth = .7;
        ctx.beginPath(); points.forEach(([x,y],i)=>{const px=x*canvas.width,py=y*canvas.height;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py)});ctx.stroke();
        points.forEach(([x,y])=>{ctx.beginPath();ctx.arc(x*canvas.width,y*canvas.height,2,0,Math.PI*2);ctx.fill();});
        if(age>3.1) active=false;
      }
      raf=requestAnimationFrame(draw);
    };
    resize(); addEventListener('resize',resize); raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize)};
  },[]);
  return <canvas ref={ref} className="constellation-canvas" aria-hidden="true" />;
}

/** 生日主体：写给18岁的信封彩蛋。 */
export function BirthdayEnvelope() {
  const [open,setOpen]=useState(false);
  const ref=useRef<HTMLElement>(null);
  const inView=useInView(ref,{once:true,amount:.4});
  const openLetter=()=>setOpen(true);
  const closeLetter=()=>setOpen(false);
  return <section ref={ref} className={`envelope-section${inView?' is-glowing':''}`}>
    <motion.button className={`birthday-envelope${open?' is-opening':''}`} onClick={openLetter} whileHover={open?{}:{y:-7,rotate:-1}} whileTap={open?{}:{scale:.98}} animate={open?{scale:1.06,filter:'drop-shadow(0 0 30px rgba(232,200,90,.35))'}:{scale:1,filter:'drop-shadow(0 0 0 rgba(232,200,90,0))'}} transition={{duration:.4}} aria-label="打开写给18岁的信">
      <span className="envelope-flap"/><span className="wax-seal">18</span><Mail size={20}/><small>OPEN A LETTER</small>
    </motion.button>
    <AnimatePresence>{open&&<motion.div className="letter-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.35}} onClick={closeLetter}>
      <motion.article className="birthday-letter" initial={{opacity:0,scale:.82,y:60,rotateX:-12}} animate={{opacity:1,scale:1,y:0,rotateX:0}} exit={{opacity:0,scale:.86,y:40,rotateX:-8}} transition={{delay:.28,type:'spring',stiffness:115,damping:18}} onClick={e=>e.stopPropagation()}>
        <button onClick={closeLetter} aria-label="关闭信件"><X size={17}/></button>
        <p>TO MY EIGHTEEN-YEAR-OLD SELF</p>
        <h3>写给十八岁的你</h3>
        <div className="letter-rule"/>
        <blockquote>愿你保持好奇，也保持柔软；在每一个属于自己的选择里，慢慢长成喜欢的模样。</blockquote>
        <footer>A NIGHT TO REMEMBER</footer>
      </motion.article>
    </motion.div>}</AnimatePresence>
  </section>;
}

/** 生日主体：随着阅读章节自然解锁的三枚纪念徽章。 */
export function BirthdayBadges() {
  const [unlocked, setUnlocked] = useState(0);
  useEffect(() => {
    const update = () => {
      const travel = Math.max(document.body.scrollHeight - innerHeight, 1);
      setUnlocked(Math.min(3, Math.max(1, Math.floor((scrollY / travel) * 3) + 1)));
    };
    update();
    addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, []);
  const badges = ['FIRST WISH', 'GOLDEN HOUR', 'NEW CHAPTER'];
  return <aside className="birthday-badges" aria-label="生日纪念徽章"><span>{unlocked}/3</span>{badges.map((badge, index) => <div className={index < unlocked ? 'unlocked' : ''} key={badge}><i>✦</i><small>{badge}</small></div>)}</aside>;
}
