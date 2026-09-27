'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Disc3, ImagePlus, Trash2, X } from 'lucide-react';
import { InterestAccent } from './InterestAccent';
import { ThreeAmbientOrb } from './ThreeAmbientOrb';
import { BirthdayBadges, BirthdayEnvelope, ConstellationCanvas } from './BirthdayEnhancements';
import { AudioAtmosphere, MidnightNote, PosterMaker } from './BirthdayExtras';
import { ScrollProgress, TiltEffect, CustomCursor, ParallaxHero, CountUp, RevealText } from './PremiumEnhancements';
import { celebrationContent } from '@/data/celebration';

function AtmosphereCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const compact = window.matchMedia('(max-width: 700px)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0; let particles: { x:number; y:number; r:number; s:number; a:number }[] = [];
    const resize = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); particles = Array.from({ length: compact ? 28 : 64 }, () => ({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: Math.random()*1.7+.3, s: Math.random()*.32+.06, a: Math.random()*.45+.08 })); };
    resize(); addEventListener('resize', resize);
    const draw = () => { ctx.clearRect(0,0,innerWidth,innerHeight); particles.forEach((p,i) => { p.y += p.s; p.x += Math.sin(frame/80+i)*.08; if(p.y>innerHeight+6){p.y=-6;p.x=Math.random()*innerWidth;} ctx.beginPath();ctx.fillStyle=`rgba(212,175,55,${p.a})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill(); }); frame++; requestAnimationFrame(draw); };
    const id = requestAnimationFrame(draw); return () => { cancelAnimationFrame(id); removeEventListener('resize',resize); };
  }, []);
  return <canvas ref={ref} className="atmosphere" aria-hidden />;
}

function CakeStage() {
  const [burst, setBurst] = useState<number | null>(null);
  const [wishState, setWishState] = useState<'ready' | 'celebrating' | 'complete'>('ready');
  const [candles, setCandles] = useState<{ one: boolean; eight: boolean }>({ one: true, eight: true });
  const toggleCandle = (which: 'one' | 'eight') => {
    if (wishState !== 'ready') return;
    setCandles(prev => {
      const next = { ...prev, [which]: !prev[which] };
      if (!next.one && !next.eight) {
        window.setTimeout(() => {
          setWishState('celebrating');
          window.setTimeout(() => setWishState('complete'), 2400);
        }, 700);
      }
      return next;
    });
  };
  const relight = () => {
    if (wishState === 'complete') {
      setCandles({ one: true, eight: true });
      setWishState('ready');
    }
  };
  const reactToPointer = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    event.currentTarget.style.setProperty('--cake-x', `${x * 9}deg`);
    event.currentTarget.style.setProperty('--cake-y', `${y * 7}deg`);
    event.currentTarget.classList.add('cake-near');
  };
  const resetPointer = (event: React.MouseEvent<HTMLDivElement>) => event.currentTarget.classList.remove('cake-near');
  return <div className={`cake-stage wish-${wishState}`} onMouseMove={reactToPointer} onMouseLeave={resetPointer}>
    {/* 兴趣点缀：无标识夜场轮廓与低饱和绿茵，仅为蛋糕舞台增添个人运动氛围。 */}
    <div className="night-stadium" aria-hidden="true"><div className="stadium-lights" /><div className="stadium-sweep" /><div className="stadium-seats" /><span>THE NIGHT STADIUM</span></div>
    <div className="night-turf" aria-hidden="true"><i /><i /><i /></div>
    <ThreeAmbientOrb /><div className="stage-glow" /><div className="cake-shadow" />
    <div className={`cake ${!candles.one && !candles.eight ? 'all-blown' : ''}`}>
      <button type="button" className={`candle candle-one ${candles.one ? '' : 'blown'}`} onClick={() => toggleCandle('one')} aria-label="吹灭数字 1 蜡烛"><i /><b>1</b></button>
      <button type="button" className={`candle candle-eight ${candles.eight ? '' : 'blown'}`} onClick={() => toggleCandle('eight')} aria-label="吹灭数字 8 蜡烛"><i /><b>8</b></button>
      <div className="icing" /><div className="cake-top" /><div className="cake-middle" /><div className="cake-base" />
      {wishState === 'ready' && <span className="wish-prompt">点击蜡烛吹灭许愿</span>}
      {wishState === 'complete' && <button type="button" className="relight-candles" onClick={relight}>重新点燃蜡烛</button>}
    </div>
    {wishState !== 'ready' && <div className="wish-celebration" aria-live="polite"><div className="wish-ring" />{Array.from({length:28},(_,i)=><i key={i} style={{'--x':`${((i*47)%220)-110}px`,'--y':`${-50-((i*73)%220)}px`,'--d':`${(i%7)*.055}s`} as React.CSSProperties} />)}<div className="wish-message"><span>MAKE A WISH</span><strong>{celebrationContent.wish}</strong></div></div>}
    {wishState === 'complete' && <div className="golden-smoke" aria-hidden="true"><i/><i/><i/><i/></div>}
    {[{x:'7%',y:'30%'},{x:'78%',y:'19%'},{x:'86%',y:'66%'},{x:'-1%',y:'69%'}].map((p,i)=><button key={i} className={`orb orb-${i}`} style={{left:p.x,top:p.y}} onClick={()=>setBurst(i)} aria-label="Celebrate"><span>⬡</span>{burst===i&&<em className="burst">✦ ✦ ✦</em>}</button>)}
  </div>;
}

function CollectionModal({ open, onClose }: {open:boolean; onClose:()=>void}) {
  const [photos, setPhotos] = useState<string[]>([]); const [wish,setWish]=useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);
  const addPhotos=(e:ChangeEvent<HTMLInputElement>)=>{const f=Array.from(e.target.files||[]).slice(0,3-photos.length); Promise.all(f.map(x=>new Promise<string>(r=>{const rd=new FileReader();rd.onload=()=>r(String(rd.result));rd.readAsDataURL(x)}))).then(x=>setPhotos(v=>[...v,...x])); e.target.value='';};
  const removePhoto=(index:number)=>setPhotos(v=>v.filter((_,i)=>i!==index));
  return <AnimatePresence>{open&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.section className="collection-modal" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} onClick={e=>e.stopPropagation()}><button ref={closeButtonRef} className="close" onClick={onClose} aria-label="关闭收藏夹"><X size={18}/></button><p className="kicker">CELEBRATION ARCHIVE</p><h2>我的庆典收藏夹</h2><p className="modal-copy">留住属于自己的珍贵片段，也写下一句给未来的期许。</p><div className="polaroids">{[0,1,2].map(i=><div className="polaroid" key={i}>{photos[i]?<><img src={photos[i]} alt={`庆典记忆照片 ${i+1}`}/><button className="remove-photo" onClick={()=>removePhoto(i)} aria-label={`删除第 ${i+1} 张照片`}><Trash2 size={14}/></button></>:<label className="photo-upload"><ImagePlus size={19}/><span>添加照片</span><input type="file" accept="image/*" onChange={addPhotos}/></label>}</div>)}</div><textarea maxLength={80} value={wish} onChange={e=>setWish(e.target.value)} placeholder="写给未来的自己…"/><div className="signature">— {wish ? 'ME, WITH HOPE' : 'MY SIGNATURE'}</div></motion.section></motion.div>}</AnimatePresence>;
}

/* =====================================================================
 * 主界面容器：默认隐藏（aria-hidden + 不可交互），
 * 等入场仪式（烟花 2s → siu~ 爱心 5s）走完后由 active 激活淡入。
 * ===================================================================== */
export function BirthdayExperience({ active = false, enableInterestAccent = true }: { active?: boolean; enableInterestAccent?: boolean }) {
  const [modal,setModal]=useState(false),[archiveClicks,setArchiveClicks]=useState(0),[secret,setSecret]=useState(false);
  const loaded = active;
  const closingRef=useRef<HTMLElement>(null);
  const closingLit=useInView(closingRef,{once:true,amount:.3});
  const moveSpotlight = (event: React.MouseEvent<HTMLElement>) => { const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--spot-x', `${event.clientX-bounds.left}px`); event.currentTarget.style.setProperty('--spot-y', `${event.clientY-bounds.top}px`); };
  return <main className="birthday-page" onMouseMove={moveSpotlight}><AtmosphereCanvas /><ConstellationCanvas />
    {active && <BirthdayBadges />}
    {active && <><ScrollProgress /><TiltEffect /><CustomCursor /><ParallaxHero /></>}
    <div className={`birthday-main ${active?'is-visible':''}`} aria-hidden={!active}>
    <nav className="birthday-nav"><span className="monogram">XVIII</span><span className="birthday-date" aria-label="生日庆典">A NIGHT TO REMEMBER<small>18TH EDITION</small></span><AudioAtmosphere /></nav>
    <section className="hero-birthday"><div className="hero-copy"><motion.p className="kicker" initial={{opacity:0,y:18}} animate={loaded?{opacity:1,y:0}:{}} transition={{delay:.15}}>CHAPTER EIGHTEEN</motion.p><motion.h1 initial={{opacity:0,y:28}} animate={loaded?{opacity:1,y:0}:{}} transition={{delay:.3}}>HAPPY <em><CountUp target={18} duration={1800} delay={500} />TH</em><br/>· {celebrationContent.name}</motion.h1><motion.p className="intro" initial={{opacity:0,y:22}} animate={loaded?{opacity:1,y:0}:{}} transition={{delay:.5}}>今夜，聚光灯落在你身上。<br/>为成长、热爱与所有值得被庆祝的瞬间举杯。</motion.p><motion.a href="#wishes" className="explore" initial={{opacity:0,y:16}} animate={loaded?{opacity:1,y:0}:{}} transition={{delay:.7}}>SCROLL TO CELEBRATE <span>↓</span></motion.a></div><motion.div initial={{opacity:0,scale:.88,y:24}} animate={loaded?{opacity:1,scale:1,y:0}:{}} transition={{delay:.45,type:'spring',stiffness:110}}><CakeStage /></motion.div></section>
    <section className="moment-strip"><span>MAKE A WISH</span><i/> <span>LIGHTS ON</span><i/> <span>THE ERA BEGINS</span></section>
    <section id="wishes" className="wish-section"><div className="section-head"><p className="kicker">WORDS FOR THE NEW CHAPTER</p><h2><RevealText text="祝福，正向你汇聚" /></h2><p>每一句都很珍贵，每一份爱都被好好收藏。</p></div><div className="wish-wall">{celebrationContent.messages.slice(0,2).map((m,i)=><WishCard key={m.from} {...m} delay={i} active={active}/>) }{enableInterestAccent&&<InterestAccent />}{celebrationContent.messages.slice(2).map((m,i)=><WishCard key={m.from} {...m} delay={i+2} active={active}/>)}</div></section>
    <section className="moments-section" aria-labelledby="moments-title"><div className="moments-heading"><p className="kicker">A SMALL ARCHIVE OF GROWING UP</p><h2 id="moments-title"><RevealText text="成长瞬间 · 先从这里开始" /></h2><p>六个可替换的记忆坐标，留给成长路上的每一次抵达。</p><p className="moments-scroll-hint">横向滑动查看更多 →</p></div><div className="moments-track">{celebrationContent.moments.map((moment, index)=><motion.article className="moment-card" key={moment.mark} initial={{opacity:0,y:22}} animate={active?{opacity:1,y:0}:{}} transition={{delay:.3+index*.07}}><span className="moment-index">{moment.mark}</span><div className="moment-frame"><i>✦</i><b>{moment.year}</b></div><time>{moment.year}</time><h3>{moment.title}</h3><p>{moment.note}</p></motion.article>)}</div></section>
    <BirthdayEnvelope />
    <section ref={closingRef} className={`closing${closingLit?' is-lit':''}`}><p className="kicker">A NOTE TO EIGHTEEN</p><blockquote>“{celebrationContent.wish}”</blockquote><PosterMaker wish={celebrationContent.wish}/><div>HAPPY BIRTHDAY · 18</div></section>
    <MidnightNote />
    {secret && <div className="seven-secret" aria-live="polite"><span>7</span><small>A SMALL MOMENT, JUST FOR YOU</small></div>}
    <button className={`celebration-fab ${modal?'is-open':''}`} onClick={()=>{const next=archiveClicks+1;setArchiveClicks(next);if(next===7){setSecret(true);window.setTimeout(()=>setSecret(false),3000);setArchiveClicks(0);}setModal(true);}} aria-label="打开我的庆典收藏夹" data-tooltip="MY ARCHIVE"><Disc3 size={25}/></button><CollectionModal open={modal} onClose={()=>setModal(false)} />
    </div>
  </main>;
}
function WishCard({from,text,tone,delay,active,detail}:{from:string;text:string;tone:string;delay:number;active:boolean;detail?:string}){const [expanded,setExpanded]=useState(false);const [lit,setLit]=useState(false);return <motion.article className={`wish-card ${tone} ${expanded?'expanded':''} ${lit?'is-lit':''}`} initial={{opacity:0,y:20}} animate={active?{opacity:1,y:0}:{}} transition={{delay:.25+delay*.08}}><span>{from} · WITH LOVE</span><p>{text}</p><AnimatePresence initial={false}>{expanded&&<motion.small className="wish-detail" initial={{height:0,opacity:0,marginTop:0}} animate={{height:'auto',opacity:1,marginTop:13}} exit={{height:0,opacity:0,marginTop:0}} transition={{duration:.35,ease:'easeInOut'}}>{detail || '这一份祝福，会被好好收藏在十八岁的开篇。'}</motion.small>}</AnimatePresence><button onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded}>{expanded?'收起祝福':'展开祝福'}</button><button className={`wish-star${lit?' is-lit':''}`} onClick={()=>setLit(v=>!v)} aria-label={lit?'取消点亮':'点亮这份祝福'} aria-pressed={lit}>✦</button></motion.article>}
