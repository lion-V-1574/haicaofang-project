/**
 * 海草房可视化 - 主入口模块
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async () => {
    console.log('海草房可视化启动...');

    // 初始化加载动画
    initLoader();

    // 初始化数据
    await initData();

    // 初始化可视化
    initVisualizations();

    // 初始化数字滚动
    initStatsCounter();

    // 初始化滚动动画
    initScrollAnimations();

    // 初始化导航栏滚动效果
    initNavbarScroll();

    // 初始化平滑滚动
    initSmoothScroll();

    // 初始化图表交互
    initChartInteractions();

    // 初始化模态框动画
    initModalAnimations();

    // 初始化响应式导航
    initResponsiveNav();

    // 初始化地图（使用内联脚本的实现）
    if (typeof SeaweedHouseApp !== 'undefined' && SeaweedHouseApp.charts) {
        // 延迟初始化，确保页面元素已加载
        setTimeout(() => {
            SeaweedHouseApp.charts.initDistributionChart();
        }, 1000);
    } else {
        console.error('SeaweedHouseApp 未加载，地图初始化失败');
    }
});

/**
 * 初始化加载动画
 */
function initLoader() {
    const loader = document.querySelector('.loader-wrapper');

    if (!loader) {
        console.warn('加载动画元素未找到');
        return;
    }

    // 预加载图片资源
    preloadImages([
        'images/haicaofang-1.png',
        'images/haicaofang-2.png',
        'images/haicaofang3.png'
    ]).then(() => {
        // 图片加载完成后隐藏加载动画
        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.classList.add('loaded');

            // 移除loader
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    });
}

/**
 * 预加载图片
 */
function preloadImages(urls) {
    const promises = urls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // 即使加载失败也继续
            img.src = url;
        });
    });

    return Promise.all(promises);
}

/**
 * 初始化数据
 */
async function initData() {
    // 确保数据可用
    if (!window.HaicaofangData) {
        console.warn('数据未加载，使用默认数据');
        window.HaicaofangData = HaicaofangData;
    }

    // 生成时间轴卡片
    generateTimelineCards();

    // 生成村落统计卡片
    generateVillageCards();

    // 生成建筑层
    generateArchLayers();
}

/**
 * 生成时间轴卡片
 */
function generateTimelineCards() {
    const container = document.getElementById('timelineCards');
    if (!container || !HaicaofangData) return;

    const periods = [
        { period: '新石器时代', desc: '海草房雏形出现', year: '前5000年' },
        { period: '秦汉时期', desc: '出现真正海草房', year: '前200年' },
        { period: '唐宋时期', desc: '技术基本定型', year: '700年' },
        { period: '元明时期', desc: '达到鼎盛', year: '1400年' },
        { period: '近现代', desc: '列入非遗', year: '2006年' }
    ];

    container.innerHTML = periods.map((p, index) => `
        <div class="timeline-card" data-index="${index}">
            <h3>${p.period}</h3>
            <p>${p.desc}</p>
            <span class="timeline-year">${p.year}</span>
        </div>
    `).join('');
}

/**
 * 生成村落卡片
 */
function generateVillageCards() {
    const container = document.getElementById('villageStats');
    if (!container || !HaicaofangData) return;

    const villages = HaicaofangData.distribution.villages.slice(0, 3);

    container.innerHTML = villages.map(v => `
        <div class="stat-card hover-lift">
            <i class="fas fa-map-marker-alt"></i>
            <h4>${v.name}</h4>
            <p class="stat-value">${v.count}间</p>
            <p class="stat-desc">${v.houses}户 · ${v.desc}</p>
        </div>
    `).join('');
}

/**
 * 生成建筑层
 */
function generateArchLayers() {
    const container = document.getElementById('archLayers');
    if (!container || !HaicaofangData) return;

    const layers = HaicaofangData.architecture.layers;

    container.innerHTML = layers.map(l => `
        <div class="layer layer-${l.name}" style="height: ${l.thickness / 2}px">
            ${l.name}
            <span class="layer-thickness">${l.thickness}cm</span>
        </div>
    `).reverse().join('');
}

/**
 * 初始化可视化
 */
function initVisualizations() {
    if (typeof HaicaofangVisualizations !== 'undefined') {
        window.viz = new HaicaofangVisualizations();
        viz.initAll();
    } else {
        console.error('可视化模块未加载');
    }
    
    // 初始化文化传承模块图表
    initHeritageCharts();
}

/**
 * 初始化文化传承模块图表
 */
function initHeritageCharts() {
    // 初始化传承人年龄分布图表
    initInheritorAgeChart();
    
    // 初始化传承人等级构成图表
    initInheritorLevelChart();
}

/**
 * 初始化传承人年龄分布图表
 */
function initInheritorAgeChart() {
    const container = document.getElementById('inheritorAgeChart');
    if (!container) return;
    
    try {
        const chart = echarts.init(container);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['40岁以下', '40-50岁', '50-60岁', '60-70岁', '70岁以上'],
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '人数'
            },
            series: [{
                name: '传承人数量',
                type: 'bar',
                data: [2, 4, 6, 4, 2],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#5D4A3B' },
                        { offset: 1, color: '#8B7355' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#3D2A1B' },
                            { offset: 1, color: '#5D4A3B' }
                        ])
                    }
                }
            }]
        };
        
        chart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', () => chart.resize());
    } catch (error) {
        console.error('传承人年龄分布图表初始化错误:', error);
    }
}

/**
 * 初始化传承人等级构成图表
 */
function initInheritorLevelChart() {
    const container = document.getElementById('inheritorLevelChart');
    if (!container) return;
    
    try {
        const chart = echarts.init(container);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}人 ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: 10,
                data: ['国家级', '省级', '市级', '县级']
            },
            series: [{
                name: '传承人等级',
                type: 'pie',
                radius: '60%',
                center: ['50%', '45%'],
                data: [
                    { value: 1, name: '国家级' },
                    { value: 3, name: '省级' },
                    { value: 6, name: '市级' },
                    { value: 8, name: '县级' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                color: ['#e74c3c', '#f39c12', '#3498db', '#27ae60']
            }]
        };
        
        chart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', () => chart.resize());
    } catch (error) {
        console.error('传承人等级构成图表初始化错误:', error);
    }
}

/**
 * 展示技艺详情
 */
function showSkillDetail(skillType) {
    const skillDetails = {
        seaweed: {
            name: '海草晾晒',
            desc: '海草房的海草需要经过3年自然晾晒，使其含盐量降低，增强耐腐蚀性能。晾晒过程中需要定期翻动，确保海草均匀干燥。',
            steps: ['收割新鲜海草', '自然晾晒3年', '定期翻动确保均匀干燥', '分类整理备用'],
            importance: 65
        },
        thatch: {
            name: '分层苫顶',
            desc: '海草房的苫顶需要15-20层海草，每层厚度均匀，坡度保持45°以确保雨水顺利流下。苫顶过程需要丰富的经验和技巧。',
            steps: ['铺设底层海草', '逐层叠加海草', '调整坡度至45°', '压实固定'],
            importance: 45
        },
        ridge: {
            name: '屋脊塑形',
            desc: '屋脊采用元宝形弧顶设计，不仅美观，还能有效抵御台风。塑形过程需要精确的计算和熟练的手工技巧。',
            steps: ['测量屋脊长度', '制作屋脊模板', '塑形元宝弧顶', '加固固定'],
            importance: 38
        },
        wall: {
            name: '石墙干垒',
            desc: '海草房的墙体采用天然花岗岩，无水泥纯干垒工艺，依靠石块之间的摩擦力和重力保持稳定，体现了传统建筑的智慧。',
            steps: ['挑选合适石块', '逐层干垒石块', '调整石块位置', '加固墙体'],
            importance: 72
        }
    };
    
    const detail = skillDetails[skillType];
    if (!detail) return;
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '2000';
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    modal.style.transition = 'all 0.3s ease';
    
    modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #5D4A3B; font-size: 1.5rem;">${detail.name}技艺详情</h3>
                <button class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; line-height: 1.6; color: #333;">${detail.desc}</p>
                <h4 style="margin: 1.5rem 0 1rem; color: #5D4A3B;">工艺流程</h4>
                <ol style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: #333;">
                    ${detail.steps.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('')}
                </ol>
                <h4 style="margin: 1.5rem 0 1rem; color: #5D4A3B;">传承重要性</h4>
                <div style="width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${detail.importance}%; height: 100%; background: linear-gradient(90deg, #5D4A3B, #8B7355); border-radius: 10px;"></div>
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">重要性: ${detail.importance}%</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 显示模态框
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // 关闭模态框
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

/**
 * 初始化数字滚动
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');

    function triggerAnimate(el) {
        const targetValue = el.getAttribute('data-target');
        if (targetValue && !el.getAttribute('data-animated')) {
            el.setAttribute('data-animated', '1');
            const value = parseInt(targetValue);
            const suffix = el.getAttribute('data-suffix') || '';
            animateNumber(el, 0, value, 2000, suffix);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerAnimate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -10px 0px' });

    statNumbers.forEach(num => {
        const rect = num.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            triggerAnimate(num);
        } else {
            observer.observe(num);
        }
    });
}

/**
 * 数字动画
 */
function animateNumber(element, start, end, duration, suffix = '') {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;

        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);

        element.textContent = currentValue + suffix;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end + suffix;
        }
    };

    window.requestAnimationFrame(step);
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.section-title, .section-subtitle, .stat-card, .timeline-card, .heritage-card, .chart-card, .gallery-item, .structure-card, .experience-item, .video-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/**
 * 初始化导航栏滚动效果
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * 初始化平滑滚动
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 初始化图表交互
 */
function initChartInteractions() {
    // 为图表容器添加悬停效果
    const chartContainers = document.querySelectorAll('.chart-card');
    chartContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.style.transform = 'translateY(-5px)';
            container.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
        });
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'translateY(0)';
            container.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        });
    });
}

/**
 * 初始化模态框动画
 */
function initModalAnimations() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.opacity = '0';
                modal.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
        }
    });
}

/**
 * 初始化响应式导航
 */
function initResponsiveNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // 点击菜单项后关闭菜单
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

/**
 * 加载百度地图
 */
function loadBaiduMap() {
    // 使用环境变量或配置文件管理AK
    const ak = '1mFt8zQ8Hb0pGTSv3Hvo1drUgT73HXMA'; // 替换为实际密钥

    // 动态加载百度地图API（使用WebGL版本）
    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?type=webgl&v=1.0&ak=${ak}&callback=initBaiduMap`;
    script.type = 'text/javascript';
    script.async = true;
    
    // 全局回调函数
    window.initBaiduMap = function() {
        console.log('百度地图加载成功');
        // 在百度地图API加载完成后初始化地图
        if (typeof HaicaofangVisualizations !== 'undefined' && window.viz) {
            window.viz.initMap();
        }
    };
    
    script.onerror = () => {
        console.warn('百度地图加载失败，使用备用地图方案');
        initFallbackMap();
    };
    
    document.head.appendChild(script);
}

/**
 * 初始化备用地图（使用ECharts散点图）
 */
function initFallbackMap() {
    const mapContainer = document.getElementById('distributionChart');
    if (!mapContainer) return;
    
    try {
        // 初始化ECharts实例
        const chart = echarts.init(mapContainer);
        
        // 准备数据
        const villages = HaicaofangData.distribution.villages;
        
        // 转换数据格式
        const data = villages.map(village => {
            return {
                name: village.name,
                value: [village.lng, village.lat, village.count]
            };
        });
        
        // 地图配置
        const option = {
            backgroundColor: '#fff',
            title: {
                text: '山东荣成市海草房分布地图',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 18,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const village = villages.find(v => v.name === params.name);
                    if (village) {
                        return `
                            <div style="padding: 10px; max-width: 300px;">
                                <h3 style="margin: 0 0 10px; color: #5D4A3B; font-size: 16px; font-weight: bold;">${village.name}</h3>
                                <p style="margin: 0 0 5px; font-size: 14px;">现存海草房：<strong>${village.count}间</strong></p>
                                <p style="margin: 0 0 5px; font-size: 14px;">户数：<strong>${village.houses}户</strong></p>
                                <p style="margin: 0; font-size: 13px; line-height: 1.4;"><strong>村落特点：</strong>${village.desc}</p>
                            </div>
                        `;
                    }
                    return params.name;
                }
            },
            xAxis: {
                type: 'value',
                scale: true,
                name: '经度',
                min: 122.1,
                max: 122.6,
                axisLabel: {
                    formatter: '{value}°E'
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                name: '纬度',
                min: 36.9,
                max: 37.3,
                axisLabel: {
                    formatter: '{value}°N'
                }
            },
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    bottom: 20,
                    style: {
                        text: '地图号：RC-2026-001',
                        fontSize: 12,
                        color: '#666'
                    }
                },
                {
                    type: 'text',
                    left: 'center',
                    bottom: 5,
                    style: {
                        text: '数据来源：荣成市文化和旅游局，2024年普查数据',
                        fontSize: 10,
                        color: '#999'
                    }
                }
            ],
            series: [
                {
                    name: '海草房数量',
                    type: 'scatter',
                    data: data,
                    symbol: 'pin',
                    symbolSize: function(val) {
                        return Math.max(35, Math.min(55, val[2] / 2));
                    },
                    encode: {
                        x: 0,
                        y: 1,
                        value: 2
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        fontSize: 14,
                        color: '#333',
                        fontWeight: 'bold'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            color: '#e74c3c'
                        }
                    },
                    itemStyle: {
                        color: '#e74c3c'
                    }
                }
            ]
        };
        
        // 使用配置项设置图表
        chart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', () => chart.resize());
        
        console.log('备用地图初始化完成');
    } catch (error) {
        console.error('备用地图初始化错误:', error);
        mapContainer.innerHTML = `
            <div class="map-fallback">
                <i class="fas fa-map"></i>
                <p>地图加载失败，请检查网络连接</p>
            </div>
        `;
    }
}

// 错误处理
window.addEventListener('error', (e) => {
    if (e.target && e.target.src) {
        console.error('资源加载错误:', e.target.src);
    } else {
        console.error('资源加载错误:', e.message);
    }
});

// 性能监控
window.addEventListener('load', () => {
    if (window.performance) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`页面加载时间: ${loadTime}ms`);
    }
});