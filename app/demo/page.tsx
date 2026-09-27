import { AlertTriangle } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { DemoConsole } from '@/components/demo-console';
import { MotionDiv, fadeUp } from '@/components/motion';

export default function DemoPage() {
  return (
    <>
      <SiteHeader />
      <main className="shell section">
        <MotionDiv variants={fadeUp} initial="hidden" animate="show">
          <div className="demo-banner">
            <AlertTriangle size={16} style={{ verticalAlign: '-3px', marginRight: 7 }} />
            <b>Demo Mode：</b>此为作品集演示版本，所有业务数据均为模拟数据。
          </div>
          <p className="eyebrow">THE PROOF · INTERACTIVE DEMO</p>
          <h1 className="page-title">AI 意图识别与回复生成 Demo</h1>
          <p className="muted" style={{ maxWidth: 760, lineHeight: 1.78, marginBottom: 30 }}>
            这是面向算法工程师作品集的可交互 Demo：切换模型指标周期、筛选会话样本、维护知识条目、生成 AI 回复，并通过低置信度阈值展示模型兜底策略。
          </p>
        </MotionDiv>
        <DemoConsole />
      </main>
    </>
  );
}
