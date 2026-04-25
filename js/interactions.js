/**
 * 海草房可视化 - 交互模块
 */

class HaicaofangInteractions {
    constructor() {
        this.initScrollEffects();
        this.initMobileMenu();
        this.initLayerInteractions();
        this.initCycleInteractions();
        this.initTimelineCards();
        this.initMapControls();
        this.initParallax();
        this.initSmoothScroll();
        this.initShareButtons();
        this.initPanorama();
    }

    /**
     * 初始化滚动效果
     */
    initScrollEffects() {
        const navbar = document.getElementById('navbar');
        const heroBg = document.getElementById('hero-bg');

        window.addEventListener('scroll', this.utils.throttle(() => {
            // 导航栏背景变化
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // 视差滚动
            if (heroBg) {
                const scrollY = window.scrollY;
                heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.1}px)`;
            }

            // 滚动激活导航项
            this.updateActiveNavLink();
        }, 100));
    }

    /**
     * 更新激活的导航链接
     */
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * 初始化移动端菜单
     */
    initMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');

        if (!menuBtn || !navMenu) return;

        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击链接后关闭菜单
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /**
     * 初始化建筑层交互
     */
    initLayerInteractions() {
        const layers = document.querySelectorAll('.layer');
        const tooltip = document.getElementById('archTooltip');

        if (!layers.length || !tooltip) return;

        const layerInfo = {
            '海草层': {
                desc: '厚度可达4米，天然含盐分，防腐防潮，保温性能极佳。大叶藻晒干后铺设，使用寿命50年以上。'
            },
            '黄泥层': {
                desc: '密封层，厚约5cm，防止漏水和虫害，同时起到粘合作用。'
            },
            '秸秆层': {
                desc: '找平层，为海草铺设提供平整基础，厚约10cm。'
            },
            '木屋架': {
                desc: '承载结构，采用榫卯连接，不使用铁钉，防止生锈腐蚀。'
            },
            '石墙体': {
                desc: '厚80cm，使用当地花岗岩，天然石材保温蓄热，热阻值高。'
            }
        };

        layers.forEach(layer => {
            layer.addEventListener('mouseenter', (e) => {
                const name = layer.textContent;
                const info = layerInfo[name] || { desc: '点击查看详情' };

                tooltip.querySelector('h4').textContent = name;
                tooltip.querySelector('p').textContent = info.desc;
                tooltip.classList.add('visible');

                // 高亮当前层
                layer.style.transform = 'scale(1.05)';
                layer.style.zIndex = '10';
            });

            layer.addEventListener('mousemove', (e) => {
                const rect = tooltip.parentElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                tooltip.style.left = x + 'px';
                tooltip.style.top = y - 100 + 'px';
            });

            layer.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                layer.style.transform = '';
                layer.style.zIndex = '';
            });

            layer.addEventListener('click', () => {
                const name = layer.textContent;
                this.showLayerDetail(name);
            });
        });
    }

    /**
     * 显示建筑层详情
     */
    showLayerDetail(layerName) {
        const modal = document.createElement('div');
        modal.className = 'modal layer-modal';

        const content = document.createElement('div');
        content.className = 'modal-content';

        const info = {
            '海草层': {
                material: '大叶藻（海韭菜）',
                thickness: '1.5-4米',
                lifespan: '50-80年',
                function: '防水、保温、防腐',
                detail: '使用浅海生长的大叶藻，晒干后层层铺盖。海草含盐分，具有天然防腐特性。每平方米需用海草约50公斤。'
            },
            '黄泥层': {
                material: '黄泥 + 石灰',
                thickness: '5-8厘米',
                lifespan: '20-30年',
                function: '密封、防虫',
                detail: '黄泥与石灰混合，抹在秸秆层上，形成密封层，防止雨水渗入和虫蚁蛀蚀。'
            },
            '秸秆层': {
                material: '小麦/水稻秸秆',
                thickness: '10-15厘米',
                lifespan: '10-20年',
                function: '找平、缓冲',
                detail: '秸秆铺设在木屋架上，为海草提供平整的铺设基础，同时起到缓冲作用。'
            },
            '木屋架': {
                material: '松木/榆木',
                thickness: '15-25厘米',
                lifespan: '100年以上',
                function: '承重、定型',
                detail: '采用传统榫卯结构，不使用铁钉。屋架坡度50°，利于排水排雪。'
            },
            '石墙体': {
                material: '花岗岩',
                thickness: '60-100厘米',
                lifespan: '200年以上',
                function: '承重、保温',
                detail: '使用当地花岗岩，石块之间用黄泥粘合。厚墙体热惰性大，冬暖夏凉。'
            }
        };

        const data = info[layerName] || {};

        content.innerHTML = `
            <h3>${layerName}</h3>
            <div class="layer-detail-grid">
                <div class="detail-item"><span>材料</span> ${data.material || '-'}</div>
                <div class="detail-item"><span>厚度</span> ${data.thickness || '-'}</div>
                <div class="detail-item"><span>寿命</span> ${data.lifespan || '-'}</div>
                <div class="detail-item"><span>功能</span> ${data.function || '-'}</div>
            </div>
            <p class="detail-desc">${data.detail || '暂无详细信息'}</p>
            <button class="close-btn"><i class="fas fa-times"></i></button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 显示模态框
        setTimeout(() => modal.classList.add('visible'), 10);

        // 关闭按钮
        content.querySelector('.close-btn').addEventListener('click', () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('visible');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    /**
     * 初始化循环图交互
     */
    initCycleInteractions() {
        const nodes = document.querySelectorAll('.cycle-node');
        const infoBox = document.getElementById('cycleInfo');

        if (!nodes.length || !infoBox) return;

        const nodeInfo = {
            1: {
                title: '海草生长',
                desc: '大叶藻在浅海生长，形成海草床，每年夏季成熟。海草床是重要的海洋生态系统，提供栖息地、净化水质、固碳。'
            },
            2: {
                title: '自然脱落/打捞',
                desc: '成熟海草自然脱落，或由渔民在风浪后打捞。传统渔民只在风浪后捡拾自然脱落的海草，不破坏活体海草。'
            },
            3: {
                title: '晒干处理',
                desc: '海草需晾晒数月，去除水分和盐分。晒干后的海草呈棕褐色，质地柔韧，不易腐烂。'
            },
            4: {
                title: '苫盖屋顶',
                desc: '由苫匠层层铺盖，形成厚实屋顶。采用压脊、渔网固定，防止被风吹走。'
            },
            5: {
                title: '自然分解',
                desc: '使用30-50年后，海草自然腐殖化。分解后的海草成为有机质，回归自然。'
            },
            6: {
                title: '回归海洋',
                desc: '分解后的海草随雨水流入大海，滋养新海草，形成闭合循环。'
            }
        };

        nodes.forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                const nodeId = node.getAttribute('data-node');
                const info = nodeInfo[nodeId];

                if (info) {
                    infoBox.innerHTML = `
                        <h4>${info.title}</h4>
                        <p>${info.desc}</p>
                    `;
                }

                node.classList.add('active');
            });

            node.addEventListener('mouseleave', () => {
                node.classList.remove('active');
                infoBox.innerHTML = `
                    <h4>点击节点查看详情</h4>
                    <p>海草从生长到回归海洋的完整生命周期，形成一个闭合的生态循环。</p>
                `;
            });

            node.addEventListener('click', () => {
                const nodeId = node.getAttribute('data-node');
                const info = nodeInfo[nodeId];

                if (info) {
                    alert(`${info.title}\n\n${info.desc}`);
                }
            });
        });
    }

    /**
     * 初始化时间轴卡片
     */
    initTimelineCards() {
        const cards = document.querySelectorAll('.timeline-card');
        const chart = window.viz?.charts?.timeline;

        if (!cards.length) return;

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                if (chart) {
                    chart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: index
                    });
                }

                // 滚动到时间轴
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }

    /**
     * 初始化地图年份控制
     */
    initMapControls() {
        const mapBtns = document.querySelectorAll('.map-btn');
        const mapLoading = document.getElementById('mapLoading');

        mapBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                mapBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const year = btn.getAttribute('data-year');

                if (mapLoading) {
                    mapLoading.style.display = 'flex';
                    setTimeout(() => {
                        this.updateMapData(year);
                        mapLoading.style.display = 'none';
                    }, 800);
                } else {
                    this.updateMapData(year);
                }
            });
        });
    }

    /**
     * 更新地图数据
     */
    updateMapData(year) {
        console.log(`切换到${year}年数据`);

        // 更新村落统计卡片
        const villageStats = document.getElementById('villageStats');
        if (villageStats) {
            // 模拟不同年份的数据
            const data = {
                '1980': [
                    { name: '东楮岛村', count: 1200, houses: 280 },
                    { name: '烟墩角村', count: 2500, houses: 520 },
                    { name: '留村', count: 380, houses: 95 }
                ],
                '2000': [
                    { name: '东楮岛村', count: 850, houses: 190 },
                    { name: '烟墩角村', count: 1800, houses: 420 },
                    { name: '留村', count: 220, houses: 68 }
                ],
                '2024': [
                    { name: '东楮岛村', count: 650, houses: 144 },
                    { name: '烟墩角村', count: 1300, houses: 380 },
                    { name: '留村', count: 140, houses: 45 }
                ]
            };

            const yearData = data[year] || data['2024'];

            villageStats.innerHTML = yearData.map(v => `
                <div class="stat-card">
                    <h4>${v.name}</h4>
                    <p class="stat-value">${v.count}间</p>
                    <p class="stat-desc">${v.houses}户</p>
                </div>
            `).join('');
        }
    }

    /**
     * 初始化视差效果
     */
    initParallax() {
        const hero = document.querySelector('.hero');
        const heroBg = document.getElementById('hero-bg');

        if (!hero || !heroBg) return;

        window.addEventListener('scroll', this.utils.throttle(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.5;

            if (scrolled < hero.offsetHeight) {
                heroBg.style.transform = `scale(1.1) translateY(${rate * 0.1}px)`;
            }
        }, 10));
    }

    /**
     * 初始化平滑滚动
     */
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * 初始化分享按钮
     */
    initShareButtons() {
        const shareBtns = document.querySelectorAll('.share-btn');

        shareBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent('海草房 · 千年生态智慧');

                if (btn.classList.contains('wechat')) {
                    alert('请在微信中打开此页面分享');
                } else if (btn.classList.contains('weibo')) {
                    window.open(`http://service.weibo.com/share/share.php?url=${url}&title=${title}`);
                } else if (btn.classList.contains('qq')) {
                    window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${title}`);
                }
            });
        });
    }

    /**
     * 初始化全景体验
     */
    initPanorama() {
        const panoramaBtn = document.getElementById('loadPanorama');
        const panorama = document.getElementById('panorama');

        if (!panoramaBtn || !panorama) return;

        panoramaBtn.addEventListener('click', () => {
            panoramaBtn.disabled = true;
            panoramaBtn.textContent = '加载中...';

            // 模拟加载全景
            setTimeout(() => {
                panorama.innerHTML = `
                    <div class="panorama-placeholder success">
                        <i class="fas fa-check-circle"></i>
                        <p>全景功能预览 (需实际部署Pannellum等库)</p>
                        <button class="btn btn-secondary" onclick="location.reload()">重新加载</button>
                    </div>
                `;
            }, 2000);
        });
    }

    /**
     * 工具函数引用
     */
    get utils() {
        return HaicaofangUtils;
    }
}

// 初始化交互
document.addEventListener('DOMContentLoaded', () => {
    window.interactions = new HaicaofangInteractions();
});