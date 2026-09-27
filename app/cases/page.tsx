import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { MotionDiv, MotionSection, fadeUp, stagger } from '@/components/motion';
import cases from '@/data/cases.json';

export default function Cases() {
  return (
    <>
      <SiteHeader />
      <main className="shell section">
        <MotionSection variants={stagger} initial="hidden" animate="show">
          <MotionDiv variants={fadeUp}>
            <p className="eyebrow">CASE STUDIES</p>
            <h1 className="page-title">从证据到交付。</h1>
            <p className="muted" style={{ maxWidth: 680, lineHeight: 1.78 }}>
              每个案例按问题、验证、方案、结果与复盘展开。页面数字是便于替换的演示数据，不代表真实业务承诺。
            </p>
          </MotionDiv>
          <div className="grid" style={{ marginTop: 40 }}>
            {cases.map((caseItem, index) => (
              <MotionDiv key={caseItem.slug} variants={fadeUp} whileHover={{ y: -4 }}>
                <Link href={`/cases/${caseItem.slug}`} className="card case-list-card" style={{ transition: 'border-color .18s ease, transform .18s ease' }}>
                  <b style={{ color: 'var(--brand)', fontSize: 19, letterSpacing: '-.04em' }}>0{index + 1}</b>
                  <div>
                    <p className="eyebrow">{caseItem.category}</p>
                    <h2 style={{ fontSize: 24, margin: '8px 0', letterSpacing: '-.045em', lineHeight: 1.35 }}>{caseItem.title}</h2>
                    <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.68 }}>{caseItem.summary}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
                    <b style={{ color: 'var(--success)', whiteSpace: 'nowrap' }}>{caseItem.metric}</b>
                    <ArrowRight size={17} color="var(--brand)" />
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>
      </main>
    </>
  );
}
