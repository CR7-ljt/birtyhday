import { Mail, MapPin, BriefcaseBusiness, GraduationCap, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { MotionDiv, MotionSection, fadeUp, stagger } from '@/components/motion';

const skills = ['Python', 'PyTorch', 'Scikit-learn', 'NLP', '推荐系统', 'SQL', '特征工程', '模型评估', '数据可视化', 'Next.js'];
const projects = [
  '客服会话意图识别与低置信度接管模型',
  '求职投递行为预测与任务优先级排序',
  '内容异常检测与运营指标看板',
];

export default function ResumePage() {
  return (
    <>
      <SiteHeader />
      <main className="shell section">
        <MotionSection variants={stagger} initial="hidden" animate="show">
          <MotionDiv variants={fadeUp} className="resume-hero card glass">
            <div>
              <p className="eyebrow">ONLINE RESUME</p>
              <h1 className="page-title">Jack Lee</h1>
              <p className="muted" style={{ fontSize: 18, lineHeight: 1.75 }}>目标岗位：算法工程师。目标城市：上海。关注机器学习、NLP、推荐排序和数据智能产品落地。</p>
            </div>
            <div className="resume-contact">
              <span><BriefcaseBusiness size={16} /> 算法工程师</span>
              <span><MapPin size={16} /> 上海</span>
              <a href="mailto:lijt2025@qq.com"><Mail size={16} /> lijt2025@qq.com</a>
            </div>
          </MotionDiv>

          <div className="grid resume-grid">
            <MotionDiv variants={fadeUp} className="card resume-card"><GraduationCap size={22} color="var(--brand)" /><h2>教育背景</h2><p className="muted"><b>SJTU</b> · Naval Architecture and Ocean Engineering。具备工程建模、数值分析与跨学科问题拆解背景，可迁移到算法建模、数据分析和 AI 工程落地。</p></MotionDiv>
            <MotionDiv variants={fadeUp} className="card resume-card"><Code2 size={22} color="var(--brand)" /><h2>技术能力</h2><div className="skill-cloud" style={{ marginTop: 16 }}>{skills.map((skill) => <span key={skill} className="card skill-pill">{skill}</span>)}</div></MotionDiv>
          </div>

          <MotionDiv variants={fadeUp} className="card resume-card" style={{ marginTop: 20 }}>
            <h2>代表项目</h2>
            <div className="grid" style={{ marginTop: 16 }}>{projects.map((project, index) => <Link key={project} href={`/cases/${index === 0 ? 'ai-support' : index === 1 ? 'job-tracker' : 'content-analytics'}`} className="resume-project-row"><span>0{index + 1}</span><b>{project}</b><ArrowRight size={16} /></Link>)}</div>
          </MotionDiv>

          <MotionDiv variants={fadeUp} className="card dark-panel" style={{ marginTop: 20 }}>
            <h2 style={{ position: 'relative', zIndex: 1 }}>联系 Jack Lee</h2>
            <p style={{ position: 'relative', zIndex: 1, opacity: 0.75 }}>邮箱：lijt2025@qq.com · 目标城市：上海 · 目标岗位：算法工程师</p>
          </MotionDiv>
        </MotionSection>
      </main>
    </>
  );
}
