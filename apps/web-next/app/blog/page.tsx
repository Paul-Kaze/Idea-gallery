"use client"

import { useState } from 'react'
import Link from 'next/link'
import styles from './blog.module.css'
import {
  BookOpen,
  Glasses,
  Sparkles,
  Laptop,
  Camera,
  Copy,
  Check,
  ArrowRight,
  Info,
  Compass,
  Briefcase,
  User,
  Workflow,
  Cpu,
  Layers,
  Heart
} from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  desc: string
  path: string
  category: 'academia' | 'geek' | 'cozy'
}

interface PromptRecipe {
  id: string
  title: string
  model: string
  description: string
  prompt: string
}

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<'academia' | 'geek' | 'cozy'>('academia')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  // 15 Pinterest high-definition reference screenshots
  const galleryItems: GalleryItem[] = [
    // 知性学术风 (Academia & Intellectual Core)
    {
      id: 'acad-1',
      title: '英伦古典学院风',
      desc: '经典粗花呢背心与金丝圆框眼镜的完美融合',
      path: '/hot_nerd_images/male_academia_sweater.jpg',
      category: 'academia'
    },
    {
      id: 'acad-2',
      title: '沉浸藏书馆之海',
      desc: '高耸书柜环绕下，深邃知性的思考神态',
      path: '/hot_nerd_images/female_library_books.jpg',
      category: 'academia'
    },
    {
      id: 'acad-3',
      title: '金丝细边偏光写真',
      desc: '微光下，细腻肤质与极简金属镜框的黄金比例',
      path: '/hot_nerd_images/female_chic_glasses_portrait.jpg',
      category: 'academia'
    },
    {
      id: 'acad-4',
      title: '高智感圆框雕琢人像',
      desc: '金属细圆镜框对眼部与下颌线条的极度提神效果',
      path: '/hot_nerd_images/male_chic_wire_glasses.jpg',
      category: 'academia'
    },
    {
      id: 'acad-5',
      title: '英伦复古户外学徒',
      desc: '双排扣风衣与古朴木质大门的知性故事感',
      path: '/hot_nerd_images/male_smart_casual_door.jpg',
      category: 'academia'
    },

    // 摩登极客与科技风 (Geek Chic & Tech Aesthetic)
    {
      id: 'geek-1',
      title: '头戴式耳机极客',
      desc: '前沿头戴耳机与科技宅男日常的自信凝视',
      path: '/hot_nerd_images/male_tech_headphones.jpg',
      category: 'geek'
    },
    {
      id: 'geek-2',
      title: '白板公式前的高光思索',
      desc: '写满繁琐物理公式的白板前，知性自信的侧颜',
      path: '/hot_nerd_images/male_whiteboard_math.jpg',
      category: 'geek'
    },
    {
      id: 'geek-3',
      title: '复古大耳麦机能少女',
      desc: '金属框架耳机、复古旁轴相机与胶片抓拍质感',
      path: '/hot_nerd_images/female_vintage_headphones.jpg',
      category: 'geek'
    },
    {
      id: 'geek-4',
      title: '社交沙龙日常休闲极客',
      desc: '轻解纽扣的白衬衫与粗框眼镜，流露随性吸引力',
      path: '/hot_nerd_images/male_casual_glasses_beer.jpg',
      category: 'geek'
    },

    // 日常舒适与阅读风 (Cozy Reading & Casual Study)
    {
      id: 'cozy-1',
      title: '深夜红酒智感微醺',
      desc: '指尖微动，沉溺在旧书卷与红酒香气中的深夜研读',
      path: '/hot_nerd_images/male_intellectual_wine.jpg',
      category: 'cozy'
    },
    {
      id: 'cozy-2',
      title: '书桌旁小憩的学者',
      desc: '略显疲倦地趴在凌乱电脑与书籍中，流露慵懒防备感',
      path: '/hot_nerd_images/male_cozy_laptop.jpg',
      category: 'cozy'
    },
    {
      id: 'cozy-3',
      title: '松弛凌乱的书桌角落',
      desc: '午后斜光洒在乱序摆放的纸张、咖啡杯与电脑前',
      path: '/hot_nerd_images/female_cozy_study_desk.jpg',
      category: 'cozy'
    },
    {
      id: 'cozy-4',
      title: '床榻上的松弛晨读',
      desc: '在柔软羽绒枕上，慵懒阅读原版精装大部头',
      path: '/hot_nerd_images/male_cozy_bed_reading.jpg',
      category: 'cozy'
    },
    {
      id: 'cozy-5',
      title: '执书半遮面少女',
      desc: '复古胶皮硬封书轻微遮面，双眼闪烁明亮睿智',
      path: '/hot_nerd_images/female_shy_book.jpg',
      category: 'cozy'
    },
    {
      id: 'cozy-6',
      title: '红色硬封书下的禁欲微光',
      desc: '大面积书封遮挡下半张脸，用极度专注的眼神对话镜头',
      path: '/hot_nerd_images/male_book_cover_face.jpg',
      category: 'cozy'
    }
  ]

  // 4 Golden prompts ready to copy
  const promptRecipes: PromptRecipe[] = [
    {
      id: 'recipe-1',
      title: '写实杂志感 Hot Nerd (通用首选)',
      model: 'Nano Banana Pro',
      description: '极致的皮肤质感与胶片氛围，完美还原毛孔细节、眼镜镜片高光与深色西装纹理。',
      prompt: 'A professional editorial fashion portrait of an intelligent and attractive hot nerd, wearing sleek retro tortoiseshell glasses, white oxford shirt, loose tie, tailored grey tweed vest, sitting in a vintage university study room, surrounded by piles of academic books, a soft warm desk lamp illuminating the table, subtle confident and sharp expression, geek chic aesthetic, cinematic photography, highly detailed skin texture, raw photo, filmed on 35mm lens, f/2.0 shallow depth of field, natural lighting'
    },
    {
      id: 'recipe-2',
      title: 'Librarian Core / 知性图书馆馆员 (女性偏向)',
      model: 'GPT-Image-2',
      description: '强调画面情节故事性与肢体语言细节，极佳的复古羊毛针织质地与温润的书香氛围。',
      prompt: 'An elegant portrait of a confident young woman with intellectual beauty, wearing thin gold-rimmed round glasses, a vintage cream knit cardigan over a crisp white button-up shirt, holding an open antique book in a quiet dimly lit library, soft warm volumetric lighting, librarian core, subtle matte lipstick, calm and intelligent direct gaze, cinematic fashion portrait, realistic skin, analog film grain, highly detailed'
    },
    {
      id: 'recipe-3',
      title: 'Geek Chic / 时髦极客智感 (男性偏向)',
      model: 'Nano Banana Pro',
      description: '突出现代写字桌、经典大耳麦等科技感元素，展现冷峻的理工精英感与慵懒松弛态度。',
      prompt: 'A close-up portrait of a handsome intellectual young man, wearing stylish rectangular black-rimmed glasses, a structured white shirt with rolled-up sleeves, a dark leather strap watch, leaning thoughtfully on a rustic wooden table with a vintage notebook and a ceramic coffee cup, tall bookshelves in a soft-focused background, smart and reserved gaze, geek chic fashion style, warm cinematic light, f/1.8 shallow depth of field, real photo'
    },
    {
      id: 'recipe-4',
      title: 'Dark Academia / 暗黑学术禁欲系',
      model: '两模型通用',
      description: '哥特风古老学院氛围，蜡烛般的局部聚光效果，高对比的禁欲美感。',
      prompt: 'Dark academia hot nerd portrait, a stylish person wearing elegant round metal glasses, a black cashmere turtleneck sweater, a classic dark brown wool blazer, inside an old gothic library at night, soft warm candle-like lighting casting beautiful shadows, mysterious and intellectual mood, confident calm gaze, photorealistic, cinematic grading, high skin detail'
    }
  ]

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setShowToast(true)
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }).catch(err => {
      console.error('Failed to copy text: ', err)
    })
  }

  const filteredGallery = galleryItems.filter(item => item.category === activeTab)

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={12} /> Hot Nerd Style Guide
        </div>
        <h1 className={styles.title}>
          Hot Nerd <span>智性恋与书呆子性感风</span> 写真全指南
        </h1>
        <p className={styles.subtitle}>
          解锁当今社媒最热的“智力吸引力”美学。通过高级 AI 生图技术，一键还原英伦复古、知性克制与极客时髦的反差视觉盛宴。
        </p>
      </section>

      {/* Intro Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <BookOpen size={20} /> 1. 什么是 Hot Nerd？
        </h2>
        <div className={styles.noteBox}>
          <div className={styles.noteTitle}>
            <Info size={16} /> 权威与标签释义
          </div>
          <strong>Hot Nerd (有吸引力的书呆子 / 极客时髦)</strong> 并非简单的扮丑，而是完美利用“眼睛、羊毛衫、书本”等旧式学霸道具，在极度克制、清醒、严谨的理工学术框架下，流露出隐秘且极致的高智性感。核心张力在于<strong>“智力即是最大性感 (Sapiosexual)”</strong>的奇妙反差。
        </div>
        <p className={styles.paragraph}>
          该风格近年来在 Pinterest、小红书 等主流视觉设计平台的检索热度持续爆表。要精准拿捏 Hot Nerd 写真，需厘清它与相邻风格的交叉边界。请参考以下<strong>“智感美学比对矩阵”</strong>：
        </p>

        {/* Comparison Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>美学流派</th>
                <th>核心特质与心理磁场</th>
                <th>经典视觉符号</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.highlightRow}>
                <td>
                  <strong>Hot Nerd</strong>
                  <span className={styles.highlightBadge}>本期主打</span>
                </td>
                <td>智力感与性吸引力的反差，外表理性严谨，眼神透露专注与疏离</td>
                <td>金丝/粗框眼镜、松散窄领带、针织开衫、英文精装书、略显蓬乱的发丝</td>
              </tr>
              <tr>
                <td><strong>Geek Chic</strong></td>
                <td>中性且前卫的时装化态度，将典型笨拙科技要素穿成超前流行</td>
                <td>撞色粗黑框眼镜、科技发光面料、大耳麦、几何解构配饰、Y2K撞色</td>
              </tr>
              <tr>
                <td><strong>Librarian Core</strong></td>
                <td>沉静、温馨、复古知性，带有古典文艺气息与午后阳光的温润感</td>
                <td>粗针开衫、过膝格纹裙、半框眼镜、羊皮纸笔记本、老旧黄铜台灯</td>
              </tr>
              <tr>
                <td><strong>Dark Academia</strong></td>
                <td>古典、厚重、神秘且偏向哥特文学院，对经典人文历史的执念</td>
                <td>黑灰羊毛呢大衣、风衣、英伦皮鞋、羽毛笔、古老砖墙、烛光光影</td>
              </tr>
              <tr>
                <td><strong>Office Siren</strong></td>
                <td>极致干练的职场通勤魅力，在严谨高压的职场规范中散发克制气场</td>
                <td>薄款窄框猫眼眼镜、紧身白衬衫、高腰铅笔包臀裙、黑色细高跟鞋</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual Formula Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Workflow size={20} /> 2. Hot Nerd 写真的四大黄金法则
        </h2>
        <p className={styles.paragraph}>
          完美的写真不是堆砌昂贵的衣服，而是用极具“信息密度”的符号，建立一个富有深层叙事感的空间。我们将这一公式总结如下：
        </p>

        <div className={styles.formulaContainer}>
          <div className={styles.formulaCard}>
            <div className={styles.formulaIconWrapper}>
              <Glasses size={20} />
            </div>
            <h4>造型单品</h4>
            <p>金丝圆框/经典粗黑框眼镜是灵魂，搭配挺阔白衬衫、西装背心或复古羊毛衫。</p>
          </div>

          <div className={styles.formulaCard}>
            <div className={styles.formulaIconWrapper}>
              <Layers size={20} />
            </div>
            <h4>道具点缀</h4>
            <p>厚重的精装原版书、手写公式纸张、银色笔记本电脑、玻璃杯冰美式、墨水笔。</p>
          </div>

          <div className={styles.formulaCard}>
            <div className={styles.formulaIconWrapper}>
              <Compass size={20} />
            </div>
            <h4>场景构建</h4>
            <p>老校舍木桌、满墙藏书馆、写满微积分公式的白板前、或温馨私人书房。</p>
          </div>

          <div className={styles.formulaCard}>
            <div className={styles.formulaIconWrapper}>
              <Camera size={20} />
            </div>
            <h4>光影氛围</h4>
            <p>深夜复古绿罩银行灯暖光、或冷调电脑屏幕蓝光、或率性自然的胶片闪光灯。</p>
          </div>

          <div className={styles.formulaResult}>
            核心姿势公式：<span>低头沉浸研读 ➜ 轻轻扶住镜框 ➜ 缓缓抬眼直视镜头 ➜ 释放清醒与克制的张力</span>
          </div>
        </div>

        <div className={styles.formulaBlockGrid}>
          <div className={styles.formulaBlock}>
            <h5><User size={16} /> 👧 女性写真企划方案</h5>
            <ul>
              <li><strong>造型核心：</strong>廓形白衬衫（微敞一粒扣） + 细黑领带 + 深灰折裙。</li>
              <li><strong>眼镜镜框：</strong>极简黑框猫眼眼镜 / 玳瑁复古金丝镜框。</li>
              <li><strong>妆容发型：</strong>微卷松散长发，抓出蓬松碎发；哑光低饱和肉桂唇色，彰显冷清。</li>
              <li><strong>出片姿势：</strong>双手展开厚重大部头置于腿部，专注看书，在微弱侧光下缓缓侧脸直视。</li>
            </ul>
          </div>
          <div className={styles.formulaBlock}>
            <h5><User size={16} /> 👦 男性写真企划方案</h5>
            <ul>
              <li><strong>造型核心：</strong>精细牛津白衬衫 + 麻花编制针织背心 + 驼色/灰质宽松西裤。</li>
              <li><strong>眼镜镜框：</strong>经典半框眉线（Browline）眼镜 / 质感黑框方眼镜。</li>
              <li><strong>妆容发型：</strong>富有层次感的微凌乱碎发，修饰干净锋利的下颌骨。</li>
              <li><strong>出片姿势：</strong>慵懒靠在古董书柜旁，领带微松，眼神沉稳而专注地看向镜头斜下方。</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pinterest Reference Gallery */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Camera size={20} /> 3. 真实各类风格参考图集 (Pinterest Real Gallery)
        </h2>
        <p className={styles.paragraph}>
          以下 15 张超清真实 Pinterest 参考图已完美同步存放于当前项目。您可以将它们作为 AI 生图时的<strong>风格参考图 (Style Ref)</strong> 或 <strong>姿势控制图 (Pose Ref)</strong>，帮助模型锁定顶级高级感。
        </p>

        {/* Tab Buttons */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'academia' ? styles.activeTabButton : ''}`}
            onClick={() => setActiveTab('academia')}
          >
            <BookOpen size={16} /> 知性学术风 (Academia)
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'geek' ? styles.activeTabButton : ''}`}
            onClick={() => setActiveTab('geek')}
          >
            <Cpu size={16} /> 摩登极客与科技风 (Geek Chic)
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'cozy' ? styles.activeTabButton : ''}`}
            onClick={() => setActiveTab('cozy')}
          >
            <Laptop size={16} /> 日常舒适与阅读风 (Cozy)
          </button>
        </div>

        {/* Grid Images */}
        <div className={styles.galleryGrid}>
          {filteredGallery.map((item) => (
            <div key={item.id} className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.path}
                  alt={item.title}
                  className={styles.galleryImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}>
                  <p className={styles.overlayText}>{item.desc}</p>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <h4 className={styles.cardTitle}>{item.title}</h4>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prompt Engineering Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Cpu size={20} /> 4. 最新 AI 模型生图与提示词工程 (Prompt Engineering)
        </h2>
        <p className={styles.paragraph}>
          要在 AI 中完美生出上述质感样片，不能仅仅靠短句。大模型（如 <strong>GPT-Image-2</strong> 与 <strong>Nano Banana Pro</strong>）需要高精度、结构化的提示词指令。
          我们为您整理了如下<strong>提示词模块化公式</strong>：
        </p>
        <div className={styles.noteBox} style={{ borderLeftColor: '#0c0f14', background: '#f8fafc' }}>
          <strong>公式：[主体属性描述] + [细致服装搭配] + [交互姿势与动作] + [精致场景与氛围灯光] + [画质相机细节]</strong>
        </div>

        {/* Recipe Grid */}
        <div className={styles.recipeGrid}>
          {promptRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeCard}>
              <div className={styles.recipeHeader}>
                <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                <span className={styles.recipeModelTag}>{recipe.model}</span>
              </div>
              <div className={styles.recipeContent}>
                <p className={styles.paragraph} style={{ fontSize: '13px', marginBottom: '16px' }}>
                  {recipe.description}
                </p>
                <div className={styles.promptLabel}>Prompt Template (点击下方按钮复制)</div>
                <div className={styles.promptBox}>{recipe.prompt}</div>
                <button
                  className={`${styles.copyButton} ${copiedId === recipe.id ? styles.copyButtonActive : ''}`}
                  onClick={() => handleCopy(recipe.prompt, recipe.id)}
                >
                  {copiedId === recipe.id ? (
                    <>
                      <Check size={16} /> ✓ 已复制到剪贴板
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> 复制黄金提示词
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commercialization Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Briefcase size={20} /> 5. 商业化变现与写真产品交付 (MVP Pipeline)
        </h2>
        <p className={styles.paragraph}>
          Hot Nerd 绝不仅是一种视觉游戏，它极具商业变现能力。无论是作为线上定制照相馆、还是线下写真工作室，都可以快速包装为以下 <strong>5 大变现主题模板</strong>：
        </p>

        <div className={styles.cardGrid}>
          <div className={styles.commercialCard}>
            <h4>1. Hot Nerd / 极智学霸</h4>
            <p>核心定位在金丝细框眼镜与学术课桌，重点表现专注看书时的一丝疏离微笑，男女客户普适性最高。</p>
          </div>
          <div className={styles.commercialCard}>
            <h4>2. Librarian / 图书馆馆员</h4>
            <p>浓郁英伦深色开衫羊毛质地，大面积深红棕色木质背景，流露令人心动的复古温柔书卷气。</p>
          </div>
          <div className={styles.commercialCard}>
            <h4>3. Dark Academia / 暗黑学术派</h4>
            <p>中世纪哥特走廊或深夜烛光，黑色高领羊毛衫，营造极其低调内敛、高贵禁欲的智性氛围。</p>
          </div>
          <div className={styles.commercialCard}>
            <h4>4. Geek Chic / 时髦摩登极客</h4>
            <p>大型头戴式耳机，白色板写满复杂公式，突出科技碰撞的潮流感与极其松弛的理工反差。</p>
          </div>
          <div className={styles.commercialCard}>
            <h4>5. Office Siren / 智性通勤精英</h4>
            <p>利落窄猫眼眼镜，挺阔西装领扣微松，极具高级感和成熟职场的精英压迫感与魅力。</p>
          </div>
        </div>

        <h3 className={styles.sectionTitle} style={{ fontSize: '20px', marginTop: '40px', borderBottom: 'none' }}>
          写真定制最小可行性落地流程 (MVP)
        </h3>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>Step 1: 客户正面人像收集</h4>
              <p>向客户收集 1-3 张面部清晰、无遮挡物、光线明亮的日常正面肖像照片作为生图的基础模版。</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>Step 2: 确定风格主题与多图控制</h4>
              <p>选择上述 5 大模板之一。大模型生图时，将客户的照片作为 Face Control（人物特征参考），将本站 gallery 提供的对应 Pinterest 样片作为 Style Control（风格及构图参考）。</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>Step 3: 调用黄金提示词输出样片</h4>
              <p>设置图片参考权重在 0.55 ~ 0.65，套用第四章节提供的专业黄金提示词，在 GPT-Image-2 或 Nano Banana Pro 中一键运行，输出多张高精度样片。</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>Step 4: 精细后期与成品交付</h4>
              <p>挑选最完美的一张，进行局部色彩微调、增加胶片微弱噪点噪光，实现“零 AI 塑料感”的高级感物理细节，秒速交付超预期成品。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button / CTA Block */}
      <div className={styles.ctaBox}>
        <h2>开启你的 Hot Nerd 写真之旅</h2>
        <p>
          觉得这些 Prompt 与视觉公式足够震撼？立刻切换到我们的 Dommi 创作台，开启最新的云端模型，生成一张属于你自己的专属高智感写真照片。
        </p>
        <Link href="/" className={styles.ctaButton}>
          立即开启 AI 写真创作 <ArrowRight size={18} />
        </Link>
      </div>

      {/* Interactive Floating Toast */}
      {showToast && (
        <div className={styles.toast}>
          <Check size={16} /> 复制成功！黄金提示词已保存至剪贴板，可直接前往模型创作台使用。
        </div>
      )}
    </div>
  )
}
