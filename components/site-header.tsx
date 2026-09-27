'use client';
import Link from 'next/link';
import { Anchor, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
const navItems=[['/','首页'],['/resistance','阻力预测'],['/energy','能耗优化'],['/route-risk','航线风险'],['/anomaly','异常检测'],['/methodology','技术方法'],['/#contact','联系我']] as const;
export function SiteHeader(){const {theme,setTheme}=useTheme();const [open,setOpen]=useState(false);return <header className="site-header"><div className="shell header-inner"><Link href="/" className="brand" onClick={()=>setOpen(false)}><Anchor size={18}/><span>MARINE</span> AI LAB</Link><nav className="desktop-nav">{navItems.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}<button aria-label="切换深浅色模式" className="icon-button" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button></nav><button className="mobile-menu-button icon-button" onClick={()=>setOpen(!open)} aria-label="打开导航菜单">{open?<X/>:<Menu/>}</button></div>{open&&<nav className="mobile-nav-panel shell">{navItems.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}<button className="btn btn-secondary" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>切换深浅色模式</button></nav>}</header>}
