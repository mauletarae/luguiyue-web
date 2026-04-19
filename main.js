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
    appItems.forEach(item=>{
        item.addEventListener('click',()=>{ goTo(+item.dataset.screen); resetTimer(); });
    });

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
   SECTION NUM — subtle parallax
   ============================================================ */
const tagNums=document.querySelectorAll('.tag-num');
window.addEventListener('scroll',()=>{
    const sy=scrollY;
    tagNums.forEach((el,i)=>{
        el.style.transform=`translateY(${(sy*(0.03+i*.008)).toFixed(1)}px)`;
    });
},{passive:true});
