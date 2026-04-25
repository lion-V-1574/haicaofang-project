// 海草房可视化模块

class HaicaofangVisualizations {
    constructor() {
        this.charts = {};
    }

    // 初始化所有图表（不包括地图）
    initAll() {
        this.initTimeline();
        this.initTemperatureChart();
        this.initSeagrassChart();
        this.initRestorationChart();
        this.initCraftsmanChart();
        this.initTourismChart();
        this.initSketchChart();
        this.initProtectionChart();
    }

    // 历史时间轴
    initTimeline() {
        const chartDom = document.getElementById('timeline-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const data = HaicaofangData.timeline;

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(params) {
                    const item = data[params[0].dataIndex];
                    return `${item.period}<br/>${item.event}<br/>${item.desc}`;
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
                data: data.map(item => item.period),
                axisLabel: {
                    rotate: 30,
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                name: '繁荣程度',
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: '历史发展',
                    type: 'line',
                    data: data.map(item => item.value),
                    smooth: true,
                    lineStyle: {
                        color: '#2C5F7E',
                        width: 3
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(44, 95, 126, 0.3)' },
                            { offset: 1, color: 'rgba(44, 95, 126, 0)' }
                        ])
                    },
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        color: '#D96C4E'
                    }
                }
            ]
        };

        chart.setOption(option);
        this.charts.timeline = chart;

        // 响应式
        window.addEventListener('resize', () => chart.resize());
    }

    // 使用高德地图创建真实的荣成市地理地图
    initMap() {
        console.log('开始初始化地图...');
        
        const mapContainer = document.getElementById('distributionChart');
        if (!mapContainer) {
            console.error('地图容器未找到');
            return;
        }
        console.log('地图容器已找到');

        try {
            // 检查高德地图API是否加载
            if (typeof AMap === 'undefined') {
                console.error('高德地图API未加载');
                // 显示错误信息
                mapContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f0f8ff;">
                        <i class="fas fa-map-marked-alt" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                        <h3 style="color: #333; margin-bottom: 10px;">地图加载失败</h3>
                        <p style="color: #666; text-align: center; max-width: 300px;">高德地图API未加载</p>
                    </div>
                `;
                return;
            }

            // 初始化高德地图实例
            const map = new AMap.Map(mapContainer, {
                center: [122.3601, 37.1006], // 荣成市中心坐标
                zoom: 12,
                resizeEnable: true,
                viewMode: '3D'
            });
            
            // 设置地图边界限制，只显示荣成市区域
            const bounds = new AMap.Bounds(
                new AMap.LngLat(122.1, 36.9), // 西南角
                new AMap.LngLat(122.6, 37.3)  // 东北角
            );
            
            // 限制地图范围
            map.setLimitBounds(bounds);
            
            // 限制缩放级别
            map.setZoomRange(10, 16);
            
            // 添加控件
            map.addControl(new AMap.ToolBar({
                position: 'RT'
            }));
            
            map.addControl(new AMap.Scale({
                position: 'BL'
            }));

            // 准备数据
            const villages = HaicaofangData.distribution.villages;
            console.log('村落数据:', villages);

            // 添加村落标记
            villages.forEach(village => {
                const position = [village.lng, village.lat];
                
                // 创建自定义标记
                const marker = new AMap.Marker({
                    position: position,
                    icon: new AMap.Icon({
                        size: new AMap.Size(30, 40),
                        image: 'map/标记.png',
                        imageSize: new AMap.Size(30, 40)
                    }),
                    title: village.name
                });
                
                // 添加标记到地图
                marker.setMap(map);
                
                // 根据村落名称获取对应的照片列表
                let photos = [];
                
                if (village.name === '东楮岛村') {
                    photos = [
                        'map/东褚岛1.png',
                        'map/东褚岛2.png',
                        'map/东褚岛3.png',
                        'map/东褚岛4.png',
                        'map/东褚岛5png.png'
                    ];
                } else if (village.name === '烟墩角村') {
                    photos = [
                        'map/烟墩角村1.png',
                        'map/烟墩角村2.png',
                        'map/烟墩角村3.png',
                        'map/烟墩角村4.png',
                        'map/烟墩角村5.png'
                    ];
                } else if (village.name === '留村') {
                    photos = [
                        'map/留村1.png',
                        'map/留村2.png',
                        'map/留村3.png',
                        'map/留村4.png'
                    ];
                } else if (village.name === '东墩村') {
                    photos = [
                        'map/东墩村1.png',
                        'map/东墩村2.png',
                        'map/东墩村3.png',
                        'map/东墩村4.png',
                        'map/东墩村5png.png'
                    ];
                } else if (village.name === '大庄许家') {
                    photos = [
                        'map/东褚岛1.png',
                        'map/东褚岛2.png',
                        'map/东褚岛3.png',
                        'map/东褚岛4.png'
                    ];
                } else if (village.name === '渠隔村') {
                    photos = [
                        'map/小西村1.png',
                        'map/小西村2.png',
                        'map/小西村3.png',
                        'map/小西村4.png',
                        'map/小西村5.png'
                    ];
                } else if (village.name === '巍巍村') {
                    photos = [
                        'map/东褚岛1.png',
                        'map/东褚岛2.png',
                        'map/东褚岛3.png'
                    ];
                } else if (village.name === '马栏耩') {
                    photos = [
                        'map/东褚岛1.png',
                        'map/东褚岛2.png',
                        'map/东褚岛3.png'
                    ];
                }
                
                // 生成照片网格HTML
                const photoGrid = photos.map(photo => `
                    <img src="${photo}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px; margin: 3px; border: 1px solid #ddd;">
                `).join('');
                
                // 创建信息窗口
                const infoWindow = new AMap.InfoWindow({
                    content: `
                        <div style="padding: 10px; max-width: 400px;">
                            <h3 style="margin: 0 0 10px; color: #5D4A3B; font-size: 18px; font-weight: bold;">${village.name}</h3>
                            <div style="margin-bottom: 10px;">
                                <p style="margin: 0 0 5px; font-size: 14px;">现存海草房：<strong>${village.count}间</strong></p>
                                <p style="margin: 0 0 5px; font-size: 14px;">户数：<strong>${village.houses}户</strong></p>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <h4 style="margin: 0 0 5px; font-size: 14px; color: #666;">海草房照片：</h4>
                                <div style="display: flex; flex-wrap: wrap; max-width: 380px;">
                                    ${photoGrid}
                                </div>
                            </div>
                            <div style="background-color: #f8f9fa; padding: 8px; border-radius: 5px; font-size: 13px; line-height: 1.4;">
                                <strong>村落特点：</strong>${village.desc}
                            </div>
                        </div>
                    `,
                    offset: new AMap.Pixel(0, -30)
                });
                
                // 添加点击事件
                marker.on('click', function() {
                    infoWindow.open(map, position);
                });
            });

            // 添加地图标注
            const label = new AMap.Text({
                text: '地图号：RC-2026-001',
                position: [122.3601, 36.95],
                offset: new AMap.Pixel(0, 0),
                style: {
                    'background-color': 'rgba(255, 255, 255, 0.8)',
                    'border-color': 'rgba(0, 0, 0, 0.1)',
                    'border-width': '1px',
                    'border-radius': '3px',
                    'padding': '5px',
                    'font-size': '12px',
                    'color': '#666',
                    'text-align': 'center'
                }
            });
            label.setMap(map);

            const sourceLabel = new AMap.Text({
                text: '数据来源：荣成市文化和旅游局，2024年普查数据',
                position: [122.3601, 36.94],
                offset: new AMap.Pixel(0, 0),
                style: {
                    'background-color': 'rgba(255, 255, 255, 0.8)',
                    'border-color': 'rgba(0, 0, 0, 0.1)',
                    'border-width': '1px',
                    'border-radius': '3px',
                    'padding': '3px',
                    'font-size': '10px',
                    'color': '#999',
                    'text-align': 'center'
                }
            });
            sourceLabel.setMap(map);

            console.log('地图初始化完成');
        } catch (error) {
            console.error('地图初始化错误:', error);
            // 显示错误信息
            const mapContainer = document.getElementById('distributionChart');
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f0f8ff;">
                        <i class="fas fa-map-marked-alt" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                        <h3 style="color: #333; margin-bottom: 10px;">地图加载失败</h3>
                        <p style="color: #666; text-align: center; max-width: 300px;">请检查网络连接或稍后重试</p>
                        <button onclick="window.viz.initMap()" style="margin-top: 20px; padding: 10px 20px; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            重新加载地图
                        </button>
                    </div>
                `;
            }
        }
    }

    // 温度对比图表
    initTemperatureChart() {
        const chartDom = document.getElementById('tempChart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const temp = HaicaofangData.architecture.temperature;

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['海草房', '砖混房']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['夏季', '冬季']
            },
            yAxis: {
                type: 'value',
                name: '温度 (°C)'
            },
            series: [
                {
                    name: '海草房',
                    type: 'bar',
                    data: [temp.summer.haicaofang, temp.winter.haicaofang],
                    itemStyle: { color: '#2C5F7E' },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}°C'
                    }
                },
                {
                    name: '砖混房',
                    type: 'bar',
                    data: [temp.summer.brickHouse, temp.winter.brickHouse],
                    itemStyle: { color: '#D96C4E' },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}°C'
                    }
                }
            ]
        };

        chart.setOption(option);
        this.charts.temp = chart;

        window.addEventListener('resize', () => chart.resize());
    }

    // 海草床面积变化
    initSeagrassChart() {
        const chartDom = document.getElementById('seagrass-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const data = HaicaofangData.ecology.seagrassArea;

        const option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    const item = data[params[0].dataIndex];
                    return `${item.year}<br/>面积: ${item.area}公顷<br/>${item.note}`;
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
                data: data.map(item => item.year)
            },
            yAxis: {
                type: 'value',
                name: '面积 (公顷)'
            },
            series: [
                {
                    name: '海草床面积',
                    type: 'line',
                    data: data.map(item => item.area),
                    smooth: true,
                    lineStyle: {
                        color: '#2C5F7E',
                        width: 3
                    },
                    areaStyle: {
                        color: 'rgba(44, 95, 126, 0.1)'
                    },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    }
                }
            ]
        };

        chart.setOption(option);
        this.charts.seagrass = chart;

        window.addEventListener('resize', () => chart.resize());
    }

    // 曹妃甸修复成效
    initRestorationChart() {
        const chartDom = document.getElementById('restoration-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const data = HaicaofangData.ecology.caofeidian;

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['修复前', '修复后']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['面积(公顷)', '生物量指数', '生物种类(种)']
            },
            yAxis: {
                type: 'value',
                name: '数值'
            },
            series: [
                {
                    name: '修复前',
                    type: 'bar',
                    data: [data.before.area, data.before.biomass, data.before.species],
                    itemStyle: { color: '#D96C4E' }
                },
                {
                    name: '修复后',
                    type: 'bar',
                    data: [data.after.area, data.after.biomass, data.after.species],
                    itemStyle: { color: '#2C5F7E' }
                }
            ]
        };

        chart.setOption(option);
        this.charts.restoration = chart;

        window.addEventListener('resize', () => chart.resize());
    }

    // 苫匠人数变化
    initCraftsmanChart() {
        const chartDom = document.getElementById('craftsman-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const data = HaicaofangData.heritage.craftsmen;

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.year)
            },
            yAxis: {
                type: 'value',
                name: '人数'
            },
            series: [
                {
                    name: '苫匠人数',
                    type: 'line',
                    data: data.map(item => item.count),
                    smooth: true,
                    lineStyle: { color: '#5D4A3B', width: 3 },
                    areaStyle: { color: 'rgba(93, 74, 59, 0.1)' }
                }
            ]
        };

        chart.setOption(option);
        this.charts.craftsman = chart;

        window.addEventListener('resize', () => chart.resize());
    }

    // 旅游收入
    initTourismChart() {
        const chartDom = document.getElementById('tourismChart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const data = HaicaofangData.heritage.tourism;

        const option = {
            tooltip: {
                trigger: 'axis',
                formatter: '年份: {b}<br/>收入: {c}万元'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.year)
            },
            yAxis: {
                type: 'value',
                name: '收入 (万元)'
            },
            series: [
                {
                    name: '旅游收入',
                    type: 'bar',
                    data: data.map(item => item.revenue),
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2C5F7E' },
                            { offset: 1, color: '#5D4A3B' }
                        ])
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}万'
                    }
                }
            ]
        };

        chart.setOption(option);
        this.charts.tourism = chart;

        window.addEventListener('resize', () => chart.resize());
    }

    // 写生基地人数
    initSketchChart() {
        const chartDom = document.getElementById('sketch-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const data = HaicaofangData.heritage.sketchBase;

        const option = {
            tooltip: {
                trigger: 'axis',
                formatter: '年份: {b}<br/>人数: {c}人次'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.year)
            },
            yAxis: {
                type: 'value',
                name: '人数 (人次)'
            },
            series: [
                {
                    name: '写生人数',
                    type: 'line',
                    data: data.map(item => item.count),
                    smooth: true,
                    lineStyle: { color: '#D96C4E', width: 3 },
                    areaStyle: { color: 'rgba(217, 108, 78, 0.1)' }
                }
            ]
        };

        chart.setOption(option);
        this.charts.sketch = chart;

        window.addEventListener('resize', () => chart.resize());
    }

    // 保护规划预测
    initProtectionChart() {
        const chartDom = document.getElementById('protection-chart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const data = HaicaofangData.heritage.protection;

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['乐观预测', '悲观预测', '实际数量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.year)
            },
            yAxis: {
                type: 'value',
                name: '数量 (间)'
            },
            series: [
                {
                    name: '乐观预测',
                    type: 'line',
                    data: data.map(item => item.optimistic),
                    lineStyle: { color: '#2C5F7E', type: 'dashed' }
                },
                {
                    name: '悲观预测',
                    type: 'line',
                    data: data.map(item => item.pessimistic),
                    lineStyle: { color: '#D96C4E', type: 'dashed' }
                },
                {
                    name: '实际数量',
                    type: 'bar',
                    data: data.map(item => item.actual),
                    itemStyle: { color: '#5D4A3B' }
                }
            ]
        };

        chart.setOption(option);
        this.charts.protection = chart;

        window.addEventListener('resize', () => chart.resize());
    }

    // 添加热力图 (辅助方法)
    addHeatmap(map, villages) {
        // 需要引入BMapGLLib Heatmap
        if (typeof BMapGLLib === 'undefined') return;

        const heatmap = new BMapGLLib.Heatmap(map);

        const points = villages.map(v => ({
            lng: v.lng,
            lat: v.lat,
            count: v.count / 100 // 权重
        }));

        heatmap.setDataSet({
            max: 13,
            data: points
        });

        heatmap.show();
    }
}