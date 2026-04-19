/* ============================================================
   PARTICLE CANVAS — lightweight 2D, indigo on light bg
   ============================================================ */
(function initParticles(){
    const canvas = document.getElementById('particles');
    const ctx    = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const N    = 55;
    const DIST = 160;
    const pts  = Array.from({length:N}, () => ({
        x:  Math.random()*W,
        y:  Math.random()*H,
        vx: (Math.random()-.5)*.35,
        vy: (Math.random()-.5)*.35,
    }));

    let mx = W/2, my = H/2;
    document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
    window.addEventListener('resize', ()=>{
        W=canvas.width=window.innerWidth;
        H=canvas.height=window.innerHeight;
    });

    function tick(){
        ctx.clearRect(0,0,W,H);
        for(const p of pts){
            p.x+=p.vx; p.y+=p.vy;
            if(p.x<0)p.x=W; if(p.x>W)p.x=0;
            if(p.y<0)p.y=H; if(p.y>H)p.y=0;
            // gentle mouse repel
            const dx=p.x-mx, dy=p.y-my, d=Math.hypot(dx,dy);
            if(d<90 && d>0){ p.vx+=(dx/d)*.12; p.vy+=(dy/d)*.12; }
            p.vx*=.97; p.vy*=.97;
        }
        // lines
        for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
            const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
            const d=Math.hypot(dx,dy);
            if(d<DIST){
                ctx.beginPath();
                ctx.strokeStyle=`rgba(99,102,241,${.22*(1-d/DIST)})`;
                ctx.lineWidth=.7;
                ctx.moveTo(pts[i].x,pts[i].y);
                ctx.lineTo(pts[j].x,pts[j].y);
                ctx.stroke();
            }
        }
        // dots
        for(const p of pts){
            ctx.beginPath();
            ctx.arc(p.x,p.y,2.2,0,Math.PI*2);
            ctx.fillStyle='rgba(99,102,241,.55)';
            ctx.fill();
        }
        requestAnimationFrame(tick);
    }
    tick();
})();


/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor(){
    const ring = document.getElementById('cursor');
    const dot  = document.getElementById('cursor-dot');
    if(!ring) return;

    let cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    document.addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; });

    (function loop(){
        cx+=(tx-cx)*.11; cy+=(ty-cy)*.11;
        ring.style.left=cx+'px'; ring.style.top=cy+'px';
        dot.style.left=tx+'px';  dot.style.top=ty+'px';
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a,button,.exp-card,.art-card,.feature-item,.project-item').forEach(el=>{
        el.addEventListener('mouseenter',()=>document.body.classList.add('ch'));
        el.addEventListener('mouseleave',()=>document.body.classList.remove('ch'));
    });
})();


/* ============================================================
   NAV
   ============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled', window.scrollY>60);
},{passive:true});

// Burger
const burger   = document.getElementById('burger');
const mobileNav= document.getElementById('mobile-nav');
let mOpen=false;
burger.addEventListener('click',()=>{
    mOpen=!mOpen;
    mobileNav.classList.toggle('open',mOpen);
    const s=burger.querySelectorAll('span');
    if(mOpen){ s[0].style.transform='rotate(45deg) translate(4px,4px)'; s[1].style.transform='rotate(-45deg) translate(4px,-4px)'; }
    else      { s[0].style.transform=''; s[1].style.transform=''; }
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mOpen=false; mobileNav.classList.remove('open');
    burger.querySelectorAll('span').forEach(s=>s.style.transform='');
}));


/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
        const t=document.querySelector(a.getAttribute('href'));
        if(!t) return;
        e.preventDefault();
        window.scrollTo({top:t.getBoundingClientRect().top+scrollY-60, behavior:'smooth'});
    });
});


/* ============================================================
   TYPEWRITER
   ============================================================ */
(function initTypewriter(){
    const el=document.getElementById('typewriter');
    const phrases=[
        '设计出身的 AI 产品经理',
        'Designer-turned AI Product Manager',
        '用审美直觉，构建 AI 产品边界',
        'Intuition meets logic.',
    ];
    let pi=0,ci=0,del=false,delay=120;
    function type(){
        const cur=phrases[pi];
        if(!del){ el.textContent=cur.slice(0,++ci); delay=ci===cur.length?2600:68; if(ci===cur.length)del=true; }
        else    { el.textContent=cur.slice(0,--ci); delay=ci===0?400:36; if(ci===0){del=false;pi=(pi+1)%phrases.length;} }
        setTimeout(type,delay);
    }
    setTimeout(type,1600);
})();


/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const ro=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('vis');ro.unobserve(e.target);} });
},{threshold:.1, rootMargin:'0px 0px -48px 0px'});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));


/* ============================================================
   HERO MINI CAROUSEL
   ============================================================ */
(function initHeroCarousel(){
    const slides = document.querySelectorAll('.hc-slide');
    const dots   = document.querySelectorAll('.hc-dot');
    if(!slides.length) return;
    let cur=0, timer;
    function goHC(idx){
        slides[cur].classList.remove('active');
        dots[cur]?.classList.remove('active');
        cur=idx;
        slides[cur].classList.add('active');
        dots[cur]?.classList.add('active');
    }
    function resetHC(){
        clearInterval(timer);
        timer=setInterval(()=>goHC((cur+1)%slides.length),2800);
    }
    dots.forEach(d=>d.addEventListener('click',()=>{goHC(+d.dataset.hc);resetHC();}));
    resetHC();
})();


/* ============================================================
   APP SCREEN CAROUSEL (5 apps)
   ============================================================ */
(function initAppCarousel(){
    const screens  = document.querySelectorAll('.app-screen');
    const dots     = document.querySelectorAll('.sdot');
    const appItems = document.querySelectorAll('.app-item[data-screen]');
    if(!screens.length) return;

    let current = 0;
    let timer;

    function goTo(idx){
        screens[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        appItems[current]?.classList.remove('active-ai');
        current=idx;
        screens[current].classList.add('active');
        dots[current]?.classList.add('active');
        appItems[current]?.classList.add('active-ai');
    }

    function resetTimer(){
        clearInterval(timer);
        timer=setInterval(()=>goTo((current+1)%screens.length), 4000);
    }

    dots.forEach(dot=>{
        dot.addEventListener('click',()=>{ goTo(+dot.dataset.target); resetTimer(); });
    });
    // app-item clicks are handled by the detail modal — no phone switch on click

    appItems[0]?.classList.add('active-ai');
    resetTimer();
})();


/* ============================================================
   SCREEN 0 INTERACTIONS — 月之案面
   ============================================================ */
(function initYueZhi(){
    const btn     = document.getElementById('yz-gen');
    const panels  = document.querySelectorAll('.yz-panel');
    const status  = document.getElementById('yz-status');
    if(!btn) return;

    let generated = false;

    // Show panels initially hidden
    panels.forEach(p=>p.classList.remove('visible'));

    btn.addEventListener('click', function(){
        if(generated){
            // Re-generate: hide then show again
            panels.forEach(p=>p.classList.remove('visible'));
            status.textContent='';
            generated=false;
            setTimeout(()=>generate(), 80);
            return;
        }
        generate();
    });

    function generate(){
        btn.textContent='生成中...';
        btn.classList.add('loading');
        status.textContent='';
        let i=0;
        const dots=['·','··','···'];
        const dotTimer=setInterval(()=>{
            status.textContent='AI 分镜生成中 '+dots[i%3];
            i++;
        },350);
        setTimeout(()=>{
            clearInterval(dotTimer);
            panels.forEach((p,i)=>{
                setTimeout(()=>{
                    p.classList.add('visible');
                    if(i===panels.length-1){
                        btn.textContent='✦ 重新生成';
                        btn.classList.remove('loading');
                        status.textContent='分镜生成完成 ✓';
                        generated=true;
                    }
                }, i*200);
            });
        }, 900);
    }

    // Click panel to select
    panels.forEach(p=>{
        p.addEventListener('click',()=>{
            panels.forEach(pp=>pp.style.outline='none');
            p.style.outline='1.5px solid rgba(139,92,246,.7)';
        });
    });
})();


/* ============================================================
   SCREEN 1 INTERACTIONS — 情绪岛·伙伴
   ============================================================ */
(function initEmoIsland(){
    const moods   = document.querySelectorAll('.ei-mood');
    const pet     = document.getElementById('ei-pet');
    const label   = document.getElementById('ei-pet-label');
    const bubble  = document.getElementById('ei-bubble');
    const food    = document.getElementById('ei-food');
    if(!moods.length) return;

    moods.forEach(btn=>{
        btn.addEventListener('click',()=>{
            moods.forEach(m=>m.classList.remove('active-mood'));
            btn.classList.add('active-mood');

            const mood  = btn.dataset.mood;
            const emoji = btn.dataset.food;
            const reply = btn.dataset.reply;

            // Pet bounce
            pet.classList.remove('shake');
            void pet.offsetWidth;
            pet.classList.add('shake');

            // Update label
            const labels={happy:'开心 😊',calm:'平静 😌',sad:'难过 😢'};
            label.textContent = labels[mood]||'';

            // Bubble reply (typewriter)
            bubble.style.opacity='0';
            setTimeout(()=>{
                bubble.textContent=reply;
                bubble.style.opacity='1';
            }, 250);

            // Show food
            food.textContent='';
            food.classList.remove('show');
            void food.offsetWidth;
            setTimeout(()=>{
                food.textContent=emoji;
                food.classList.add('show');
            }, 350);
        });
    });
})();


/* ============================================================
   SCREEN 2 INTERACTIONS — 灵感瞬间
   ============================================================ */
(function initLingGan(){
    const mic    = document.getElementById('lg-mic');
    const hint   = document.getElementById('lg-hint');
    const cards  = document.getElementById('lg-cards');
    if(!mic) return;

    const newInspirations=[
        {text:'用声音作为情绪标记的锚点',tag:'洞察'},
        {text:'首页留白减少 30% 试试？',tag:'设计'},
        {text:'如果 AI 能预测我的灵感周期',tag:'产品'},
    ];
    let recIdx=0;
    let recording=false;
    let timer;

    mic.addEventListener('click',()=>{
        if(recording) return;
        recording=true;
        mic.classList.add('recording');
        hint.textContent='录音中...';

        timer=setTimeout(()=>{
            mic.classList.remove('recording');
            hint.textContent='已保存！';
            recording=false;

            // Prepend new card
            const ins = newInspirations[recIdx%newInspirations.length];
            recIdx++;
            const card=document.createElement('div');
            card.className='lg-card';
            card.innerHTML=`<span class="lg-card-time">刚刚</span><span class="lg-card-text">${ins.text}</span><span class="lg-card-tag">${ins.tag}</span>`;
            cards.prepend(card);

            setTimeout(()=>{ hint.textContent='点击录制灵感'; }, 1500);
        }, 1800);
    });
})();


/* ============================================================
   SCREEN 3 INTERACTIONS — Vesper 死得起
   ============================================================ */
(function initVesper(){
    const opts   = document.querySelectorAll('.vp-opt');
    const steps  = {0:document.getElementById('vp-s0'), 1:document.getElementById('vp-s1'), r:document.getElementById('vp-result')};
    const pdots  = [document.getElementById('vpd-0'), document.getElementById('vpd-1')];
    const totalEl= document.getElementById('vp-total');
    const bdEl   = document.getElementById('vp-bd');
    const reset  = document.getElementById('vp-reset');
    if(!opts.length) return;

    let chosen={};

    const data={
        婚礼:{一线:{total:'52.8',lines:[['场地 & 装饰','15万'],['餐饮 & 酒水','18万'],['婚纱摄影','5万'],['服装 & 妆造','3万']]},
              新一线:{total:'31.6',lines:[['场地 & 装饰','8万'],['餐饮 & 酒水','12万'],['婚纱摄影','3万'],['服装 & 妆造','2万']]},
              其他:{total:'17.2',lines:[['场地 & 装饰','4万'],['餐饮 & 酒水','7万'],['婚纱摄影','2万'],['服装 & 妆造','1万']]}},
        住房:{一线:{total:'320',lines:[['首付（30%）','180万'],['中介费','9万'],['装修','30万'],['税费','10万']]},
              新一线:{total:'95',lines:[['首付（30%）','60万'],['中介费','3万'],['装修','15万'],['税费','4万']]},
              其他:{total:'48',lines:[['首付（30%）','28万'],['中介费','1.5万'],['装修','10万'],['税费','2万']]}},
        旅行:{一线:{total:'3.8',lines:[['机票','0.8万'],['酒店','1.2万'],['餐饮体验','1万'],['购物','0.8万']]},
              新一线:{total:'2.4',lines:[['机票','0.6万'],['酒店','0.8万'],['餐饮体验','0.6万'],['购物','0.4万']]},
              其他:{total:'1.2',lines:[['机票','0.3万'],['酒店','0.4万'],['餐饮体验','0.3万'],['购物','0.2万']]}},
        葬礼:{一线:{total:'28.5',lines:[['殡仪馆','5万'],['墓地','18万'],['仪式','3万'],['其他','2.5万']]},
              新一线:{total:'16',lines:[['殡仪馆','3万'],['墓地','10万'],['仪式','2万'],['其他','1万']]},
              其他:{total:'8',lines:[['殡仪馆','1.5万'],['墓地','4万'],['仪式','1.5万'],['其他','1万']]}},
    };

    function showStep(key){
        Object.values(steps).forEach(s=>s&&s.classList.remove('active'));
        steps[key]?.classList.add('active');
        // Update progress dots
        if(key===0){ pdots[0]?.classList.add('active'); pdots[1]?.classList.remove('active'); }
        if(key===1){ pdots[0]?.classList.add('active'); pdots[1]?.classList.remove('active'); }
        if(key==='r'){ pdots[0]?.classList.add('active'); pdots[1]?.classList.add('active'); }
    }

    opts.forEach(opt=>{
        opt.addEventListener('click',()=>{
            const next=opt.dataset.next;
            if(opt.dataset.type) chosen.type=opt.dataset.type;
            if(opt.dataset.city) chosen.city=opt.dataset.city;

            if(next==='r'){
                // Show result
                const d=data[chosen.type]?.[chosen.city];
                if(d){
                    const unit=chosen.type==='住房'?'万元':'万元';
                    totalEl.innerHTML=d.total+'<span>'+unit+'</span>';
                    bdEl.innerHTML=d.lines.map(l=>`<div class="vp-line"><span>${l[0]}</span><span>${l[1]}</span></div>`).join('');
                }
                showStep('r');
            } else {
                showStep(+next);
            }
        });
    });

    reset?.addEventListener('click',()=>{
        chosen={};
        showStep(0);
        // Reset step-0 opts styling
        document.querySelectorAll('#vp-s0 .vp-opt').forEach(o=>o.style.background='');
    });
})();


/* ============================================================
   SCREENSHOT CAROUSELS (screens 0, 2, 4)
   ============================================================ */
(function initScreenshotCarousels(){
    document.querySelectorAll('.ss-wrap').forEach(wrap=>{
        const slides  = wrap.querySelectorAll('.ss-slide');
        const dots    = wrap.querySelectorAll('.ss-dot');
        const capEl   = wrap.querySelector('.ss-cap-text');
        const captions= capEl ? capEl.dataset.captions.split(',') : [];
        let cur = 0;
        let timer;

        function goTo(n){
            slides[cur].classList.remove('ss-active');
            dots[cur].classList.remove('ss-dot-on');
            cur = (n + slides.length) % slides.length;
            slides[cur].classList.add('ss-active');
            dots[cur].classList.add('ss-dot-on');
            if(capEl && captions[cur]) capEl.textContent = captions[cur];
        }

        function startAuto(){
            clearInterval(timer);
            timer = setInterval(()=>goTo(cur+1), 3000);
        }

        wrap.querySelector('.ss-next').addEventListener('click',()=>{ goTo(cur+1); startAuto(); });
        wrap.querySelector('.ss-prev').addEventListener('click',()=>{ goTo(cur-1); startAuto(); });
        dots.forEach((dot,i)=>dot.addEventListener('click',()=>{ goTo(i); startAuto(); }));

        // Swipe support
        let sx=0;
        wrap.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; },{passive:true});
        wrap.addEventListener('touchend',e=>{
            const dx=e.changedTouches[0].clientX-sx;
            if(Math.abs(dx)>30){ goTo(dx<0?cur+1:cur-1); startAuto(); }
        },{passive:true});

        startAuto();
    });
})();

/* ============================================================
   SCREEN 4 INTERACTIONS — 客服小九
   ============================================================ */
(function initKefu(){
    const chat     = document.getElementById('kf-chat');
    const escalate = document.getElementById('kf-escalate');
    if(!chat) return;

    const humanKeywords = ['投诉','纠纷','赔偿','人工','退款'];

    function sendQ(q, a){
        // Remove suggest list if still present
        const suggestList = chat.querySelector('.kf-suggest-list');
        const suggestLabel = chat.querySelector('.kf-suggest-label');
        if(suggestList) suggestList.remove();
        if(suggestLabel) suggestLabel.remove();

        const userMsg=document.createElement('div');
        userMsg.className='kf-msg kf-user';
        userMsg.textContent=q;
        chat.appendChild(userMsg);
        chat.scrollTop=chat.scrollHeight;

        const typing=document.createElement('div');
        typing.className='kf-typing';
        typing.innerHTML='<span></span><span></span><span></span>';
        chat.appendChild(typing);
        chat.scrollTop=chat.scrollHeight;

        setTimeout(()=>{
            chat.removeChild(typing);
            const botMsg=document.createElement('div');
            botMsg.className='kf-msg kf-bot';
            botMsg.innerHTML=a.replace(/\n/g,'<br>');
            chat.appendChild(botMsg);

            // Feedback buttons under bot reply
            const fb=document.createElement('div');
            fb.className='kf-feedback';
            fb.innerHTML='<button class="kf-fb-btn" data-fb="like">👍</button><button class="kf-fb-btn" data-fb="dislike">👎</button>';
            chat.appendChild(fb);
            fb.querySelectorAll('.kf-fb-btn').forEach(btn=>{
                btn.addEventListener('click',()=>{
                    fb.querySelectorAll('.kf-fb-btn').forEach(b=>b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // Detect human service escalation
            if(humanKeywords.some(k=>q.includes(k)||a.includes(k)) && escalate){
                escalate.style.display='flex';
            }

            chat.scrollTop=chat.scrollHeight;
            const msgs=chat.querySelectorAll('.kf-msg');
            if(msgs.length>10) msgs[0].remove();
        }, 1100);
    }

    // Quick suggest items (full-sentence suggestions matching real app)
    document.querySelectorAll('.kf-suggest').forEach(btn=>{
        btn.addEventListener('click',()=>sendQ(btn.dataset.q, btn.dataset.a));
    });

    // Bottom chips
    document.querySelectorAll('.kf-chip').forEach(chip=>{
        chip.addEventListener('click',()=>sendQ(chip.dataset.q, chip.dataset.a));
    });
})();


/* ============================================================
   APP DETAIL MODAL
   ============================================================ */
(function initAppModal(){
    const APP_DATA = [
        {
            emoji:'🎬', name:'月之案面', tag:'短视频 · AI创作',
            desc:'面向内容团队的 AI 分镜工具。输入脚本即可生成可编辑分镜图卡，将内容生产从人力驱动升级为标准化 AI 输出。',
            features:[
                {icon:'✍️', title:'脚本转分镜', desc:'粘贴文案，AI 自动拆解镜头，输出可视化分镜'},
                {icon:'🎞️', title:'视频风格模板', desc:'竖版/横版/混剪多种风格，一键切换'},
                {icon:'📋', title:'历史项目管理', desc:'所有分镜项目归档，随时复用或二次编辑'},
                {icon:'🚀', title:'批量生成', desc:'多镜头并行生成，大幅压缩制作周期'},
            ],
            type:'gallery',
            screens:[
                {src:'imgs/screens/yz-1.png', cap:'创意输入'},
                {src:'imgs/screens/yz-2.png', cap:'视频类型'},
                {src:'imgs/screens/yz-3.png', cap:'历史项目'},
                {src:'imgs/screens/yz-4.jpg', cap:'生成完成'},
            ]
        },
        {
            emoji:'🐱', name:'情绪岛·伙伴', tag:'情感陪伴 · AI宠物',
            desc:'选择你的虚拟宠物，通过日常对话喂养它。AI 识别你的情绪状态，用专属食物与互动陪你度过每一天。',
            features:[
                {icon:'🐾', title:'虚拟宠物养成', desc:'猫猫或狗狗，会因互动频率成长或生气'},
                {icon:'💬', title:'情绪识别对话', desc:'DeepSeek-V3 驱动，理解你的情绪并回应'},
                {icon:'🍖', title:'食物库存系统', desc:'聊天赚取食物，定时喂宠物保持亲密度'},
                {icon:'📊', title:'情绪趋势追踪', desc:'记录每日情绪，可视化你的心理波动'},
            ],
            type:'iframe', src:'app-qydao.html'
        },
        {
            emoji:'💡', name:'灵感瞬间', tag:'效率工具 · 创意管理',
            desc:'专为创意人设计的灵感捕捉工具。语音或文字快速记录，AI 自动整理标签，让每个一闪而过的想法都有迹可循。',
            features:[
                {icon:'⚡', title:'快速记录', desc:'进入即可输入，零操作成本，不打断灵感'},
                {icon:'🏷️', title:'AI 自动打标签', desc:'自动归类灵感，分类浏览从不迷路'},
                {icon:'🗂️', title:'卡片式浏览', desc:'瀑布流排列，一眼扫过所有灵感碎片'},
                {icon:'🔍', title:'全文搜索', desc:'关键词秒查，让旧灵感随时被重新发现'},
            ],
            type:'gallery',
            screens:[
                {src:'imgs/screens/lg-1.png', cap:'主页'},
                {src:'imgs/screens/lg-2.png', cap:'卡片浏览'},
                {src:'imgs/screens/lg-3.png', cap:'记录灵感'},
                {src:'imgs/screens/lg-4.png', cap:'历史记录'},
            ]
        },
        {
            emoji:'✦', name:'Vesper · 死得起', tag:'人生规划 · 消费理性',
            desc:'用数据丈量人生重要时刻的真实成本。一份冷静又温柔的理财清单，帮你在消费主义以外找到属于自己的价格锚点。',
            features:[
                {icon:'🧮', title:'寿命倒计时', desc:'基于年龄与习惯，测算你的剩余时间'},
                {icon:'💸', title:'消费承受力评估', desc:'用真实财务数据量化你能"死得起"什么'},
                {icon:'📝', title:'遗愿清单构建', desc:'列出遗憾，AI 反推优先级与行动计划'},
                {icon:'🤖', title:'AI 人生判官', desc:'综合数据给出犀利又温柔的人生建议'},
            ],
            type:'iframe', src:'app-vesper.html'
        },
        {
            emoji:'🎧', name:'客服小九', tag:'企业效率 · AI 电商客服',
            desc:'基于 DeepSeek-V3 的电商客服助手。支持商品咨询、订单查询、售后处理，并能识别图片商品。智能分级，将人力解决率提升至 65%。',
            features:[
                {icon:'🛍️', title:'商品智能咨询', desc:'自动回答规格、价格、库存等高频问题'},
                {icon:'📦', title:'订单状态查询', desc:'接入物流接口，实时播报包裹动态'},
                {icon:'🔄', title:'售后流程自动化', desc:'退换货规则自动判断，减少人工介入'},
                {icon:'📷', title:'图片识别', desc:'上传商品图片即可识别并推荐相似款'},
            ],
            type:'gallery',
            screens:[
                {src:'imgs/screens/kf-1.png', cap:'首页'},
                {src:'imgs/screens/kf-2.png', cap:'对话中'},
                {src:'imgs/screens/kf-3.png', cap:'关于页'},
            ]
        },
    ];

    const overlay = document.getElementById('adm');
    const closeBtn = document.getElementById('adm-close');
    const emojiEl  = document.getElementById('adm-emoji');
    const nameEl   = document.getElementById('adm-name');
    const tagEl    = document.getElementById('adm-tag');
    const descEl   = document.getElementById('adm-desc');
    const featsEl  = document.getElementById('adm-feats');
    const rightEl  = document.getElementById('adm-right');

    function openModal(idx){
        const d = APP_DATA[idx];
        emojiEl.textContent = d.emoji;
        nameEl.textContent  = d.name;
        tagEl.textContent   = d.tag;
        descEl.textContent  = d.desc;

        featsEl.innerHTML = d.features.map(f=>`
            <div class="adm-feat">
                <span class="adm-feat-icon">${f.icon}</span>
                <div class="adm-feat-text">
                    <div class="adm-feat-title">${f.title}</div>
                    <div class="adm-feat-desc">${f.desc}</div>
                </div>
            </div>`).join('');

        if(d.type === 'gallery'){
            rightEl.classList.remove('adm-iframe-mode');
            rightEl.innerHTML = `
                <div class="adm-gallery">
                    ${d.screens.map(s=>`
                    <div style="display:flex;flex-direction:column;align-items:center">
                        <div class="adm-gframe"><img src="${s.src}" alt="${s.cap}"></div>
                        <div class="adm-gcap">${s.cap}</div>
                    </div>`).join('')}
                </div>
                <div class="adm-gallery-hint">← 左右滑动查看全部截图 →</div>`;
        } else {
            rightEl.classList.add('adm-iframe-mode');
            rightEl.innerHTML = `
                <div class="adm-iframe-bar">
                    <div class="adm-iframe-bar-dot"></div>
                    <div class="adm-iframe-bar-dot"></div>
                    <div class="adm-iframe-bar-dot"></div>
                    <span style="margin-left:4px">可直接互动体验</span>
                </div>
                <iframe class="adm-iframe-full" src="${d.src}" title="${d.name}" loading="lazy"></iframe>`;
        }

        overlay.classList.add('adm-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(){
        overlay.classList.remove('adm-open');
        document.body.style.overflow = '';
        setTimeout(()=>{ rightEl.innerHTML = ''; rightEl.classList.remove('adm-iframe-mode'); }, 350);
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e=>{ if(e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

    document.querySelectorAll('.app-item').forEach((item, idx)=>{
        item.style.cursor = 'pointer';
        item.addEventListener('click', ()=> openModal(idx));
    });
})();

/* ============================================================
   SECTION NUM — subtle parallax
   ============================================================ */
const tagNums=document.querySelectorAll('.tag-num');
window.addEventListener('scroll',()=>{
    const sy=scrollY;
    tagNums.forEach((el,i)=>{
        el.style.transform=`translateY(${(sy*(0.03+i*.008)).toFixed(1)}px)`;
    });
},{passive:true});
