export type CelebrationMessage = {
  from: string;
  text: string;
  tone: string;
  detail?: string;
};

export type CelebrationMoment = {
  year: string;
  title: string;
  note: string;
  mark: string;
};

export type CelebrationContent = {
  name: string;
  wish: string;
  messages: CelebrationMessage[];
  moments: CelebrationMoment[];
};

/** Public-safe, reusable celebration copy. Keep personal details out of this file. */
export const celebrationContent: CelebrationContent = {
  name: 'A NEW CHAPTER',
  wish: '愿每一次出发，都带着热爱、松弛与勇气。',
  messages: [
    { from: 'WITH LOVE', text: '愿你永远拥有选择自己生活的底气。', tone: 'tall', detail: '每一份支持与祝福，都会成为继续向前的力量。' },
    { from: 'A FRIEND', text: '继续闪闪发光，也继续自在做自己。', tone: '', detail: '那些一起大笑、一起成长的时刻，都是最亮的注脚。' },
    { from: 'FAMILY', text: '今天的主角，值得所有温柔的祝福。', tone: '', detail: '无论走到哪里，爱与陪伴始终都在。' },
    { from: 'FRIENDS', text: '新的章节，愿每一页都由你亲手写下。', tone: 'wide', detail: '每一次奔跑和停留，都会成为独一无二的风景。' },
    { from: 'TO MYSELF', text: '不急着成为谁，先认真感受这一刻的盛大。', tone: '', detail: '愿你不必匆忙，也始终保有向光而行的勇气。' },
  ],
  moments: [
    { year: 'THE BEGINNING', title: 'THE FIRST CHAPTER', note: '故事从一束温柔的光开始。', mark: '01' },
    { year: 'EARLY DAYS', title: 'SMALL STEPS', note: '第一次把好奇心带向更远的地方。', mark: '02' },
    { year: 'DISCOVERY', title: 'FINDING JOY', note: '在探索中发现热爱，也认识更完整的自己。', mark: '03' },
    { year: 'GROWTH', title: 'GROWING QUIETLY', note: '在每一次认真里，慢慢认识自己。', mark: '04' },
    { year: 'OWN RHYTHM', title: 'MY OWN RHYTHM', note: '把选择握在手里，把热爱放在心上。', mark: '05' },
    { year: 'NOW', title: 'A NEW CHAPTER', note: '这一刻，走进属于自己的新篇章。', mark: '06' },
  ],
};
