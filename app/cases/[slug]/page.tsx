import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { MotionDiv, MotionSection, fadeUp, stagger } from '@/components/motion';
import cases from '@/data/cases.json';

export function generateStaticParams() {
  return cases.map((caseItem) => ({ slug: caseItem.slug }));
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const caseItem = cases.find((item) => item.slug === params.slug);
  if (!caseItem) return notFound();
  const improved = caseItem.after > caseItem.before;
  const diff = Math.abs(caseItem.after - caseItem.before);

  return (
    <>
      <SiteHeader />
      <main>
        <MotionSection className="shell section" variants={stagger} initial="hidden" animate="show">
          <MotionDiv variants={fadeUp}>
            <p className="eyebrow">{caseItem.category} · ALGORITHM CASE</p>
            <h1 className="page-title" style={{ maxWidth: 920 }}>{caseItem.title}</h1>
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="muted">角色：{caseItem.role}</span>
              <span className="muted">周期：{caseItem.period}</span>
              <b style={{ color: 'var(--success)' }}>{caseItem.metric}</b>
            </div>
          </MotionDiv>
        </MotionSection>

        <section className="shell" style={{ paddingBottom: 76 }}>
          <div className="grid case-detail-grid">
            <MotionDiv className="grid" style={{ gap: 18 }} variants={stagger} initial="hidden" animate="show">
              <MotionDiv variants={fadeUp} className="grid before-after-grid">
                <MetricCard label="Before" value={caseItem.before} sub="Baseline" tone="muted" />
                <MetricCard label="After" value={caseItem.after} sub={caseItem.metric} tone="success" />
                <MetricCard label="Delta" value={diff} sub={improved ? '指标提升' : '耗时下降'} tone="brand" />
              </MotionDiv>
              <Chart title="指标迭代趋势" data={caseItem.chart} />
              <Block no="01" title="问题定义" text={caseItem.problem} />
              <Block no="02" title="数据与验证" text={caseItem.research} />
              <MotionDiv variants={fadeUp} className="card glass" style={{ padding: 28 }}>
                <p className="eyebrow">03 · MODEL MATRIX</p>
                <h2 style={{ fontSize: 23, letterSpacing: '-.04em' }}>算法关注：效果、成本与可解释边界</h2>
                <div className="matrix-box">
                  <span className="muted matrix-x">工程成本低 →</span>
                  <span className="muted matrix-y">模型效果高 ↑</span>
                  <i className="matrix-dot best">本方案</i>
                  <i className="matrix-dot baseline">规则 Baseline</i>
                  <i className="matrix-dot heavy">重模型方案</i>
                </div>
              </MotionDiv>
              <Block no="04" title="解决方案" text={caseItem.solution} />
              <Block no="05" title="结果与复盘" text={`核心指标从 ${caseItem.before} 变化至 ${caseItem.after}。通过样本分析、特征优化、阈值调优和反馈闭环，形成可继续迭代的算法工程方案。`} />
            </MotionDiv>
            <MotionDiv variants={fadeUp} initial="hidden" animate="show" className="card sticky-note">
              <p className="eyebrow">ENGINEERING REFLECTION</p>
              <h2 style={{ fontSize: 23, lineHeight: 1.42, letterSpacing: '-.04em' }}>如果重来一次</h2>
              <p style={{ lineHeight: 1.82, fontSize: 15 }}>{caseItem.reflection}</p>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>关键结果</p>
                <b style={{ fontSize: 34, color: 'var(--success)', letterSpacing: '-.06em' }}>{caseItem.metric}</b>
              </div>
            </MotionDiv>
          </div>
        </section>
      </main>
    </>
  );
}

function MetricCard({ label, value, sub, tone }: { label: string; value: number; sub: string; tone: 'muted' | 'success' | 'brand' }) {
  const color = tone === 'success' ? 'var(--success)' : tone === 'brand' ? 'var(--brand)' : 'var(--muted)';
  return <MotionDiv variants={fadeUp} className="card glass metric-card"><p className="eyebrow">{label}</p><b style={{ color }}>{value}</b><span className="muted">{sub}</span></MotionDiv>;
}

function Chart({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value));
  return <MotionDiv variants={fadeUp} className="card" style={{ padding: 28 }}><p className="eyebrow">TREND</p><h2 style={{ fontSize: 24, letterSpacing: '-.04em' }}>{title}</h2><div className="case-chart">{data.map((item, index) => <div key={item.name} className="case-chart-item"><MotionDiv initial={{ height: 0 }} animate={{ height: `${Math.max(18, (item.value / max) * 100)}%` }} transition={{ duration: 0.5, delay: index * 0.08 }} className="case-chart-bar" /><b>{item.value}</b><span>{item.name}</span></div>)}</div></MotionDiv>;
}

function Block({ no, title, text }: { no: string; title: string; text: string }) {
  return <MotionDiv variants={fadeUp} className="card" style={{ padding: 28 }}><p className="eyebrow">{no}</p><h2 style={{ fontSize: 25, margin: '8px 0 12px', letterSpacing: '-.045em' }}>{title}</h2><p className="muted" style={{ lineHeight: 1.82, margin: 0 }}>{text}</p></MotionDiv>;
}
