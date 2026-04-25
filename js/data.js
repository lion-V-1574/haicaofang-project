// 海草房数据模块

const HaicaofangData = {
    // 基本信息
    basic: {
        totalCount: 9500,
        villages: 317,
        history: 2000,
        craftsmen: 18
    },

    // 历史时间轴数据
    timeline: [
        { period: '新石器时代', year: -5000, event: '海草房雏形出现', value: 10, desc: '先民利用海草搭建简易窝棚' },
        { period: '秦汉时期', year: -200, event: '出现真正海草房', value: 30, desc: '主要供渔民季节性居住' },
        { period: '唐宋时期', year: 700, event: '技术基本定型', value: 60, desc: '成为沿海主要民居形式' },
        { period: '元明时期', year: 1400, event: '达到鼎盛', value: 100, desc: '形成完整建筑体系和营造技艺' },
        { period: '清代', year: 1800, event: '持续发展', value: 90, desc: '遍布荣成沿海' },
        { period: '1980年代', year: 1980, event: '开始减少', value: 70, desc: '受城镇化影响，数量下降' },
        { period: '2006年', year: 2006, event: '列入省级非遗', value: 45, desc: '保护意识开始觉醒' },
        { period: '2024年', year: 2024, event: '保护性开发', value: 50, desc: '文旅融合探索' }
    ],

    // 地理分布数据
    distribution: {
        villages: [
            { name: '东楮岛村', count: 650, lat: 37.0405, lng: 122.5641, desc: '保存最完整', houses: 144 },
            { name: '烟墩角村', count: 1300, lat: 37.2955, lng: 122.5659, desc: '天鹅栖息地', houses: 380 },
            { name: '留村', count: 140, lat: 37.08, lng: 122.45, desc: '元代古墓群', houses: 45 },
            { name: '大庄许家', count: 280, lat: 37.15, lng: 122.55, desc: '海带展览馆', houses: 82 },
            { name: '渠隔村', count: 190, lat: 37.12, lng: 122.48, desc: '非遗展馆', houses: 56 },
            { name: '巍巍村', count: 220, lat: 37.21, lng: 122.58, desc: '传承人刘玉启', houses: 68 },
            { name: '马栏耩', count: 160, lat: 37.05, lng: 122.52, desc: '传统村落', houses: 47 },
            { name: '东墩村', count: 310, lat: 36.96, lng: 122.51, desc: '谷牧旧居', houses: 95 }
        ],

        // 历史变化
        historicalChange: [
            { year: 1980, count: 30000, source: '普查数据' },
            { year: 1990, count: 25000, source: '估算' },
            { year: 2000, count: 18000, source: '文物普查' },
            { year: 2010, count: 12000, source: '非遗调查' },
            { year: 2020, count: 9800, source: '最新普查' },
            { year: 2024, count: 9500, source: '实地调研' }
        ]
    },

    // 建筑参数
    architecture: {
        roofSlope: 50, // 度
        wallThickness: 80, // cm
        maxThatchThickness: 400, // cm
        avgThatchThickness: 180, // cm

        // 温度对比数据
        temperature: {
            summer: {
                haicaofang: 26,
                brickHouse: 34
            },
            winter: {
                haicaofang: 14,
                brickHouse: 6
            }
        },

        // 各层材料
        layers: [
            { name: '海草层', thickness: 180, color: '#5D4A3B' },
            { name: '黄泥层', thickness: 5, color: '#B6955E' },
            { name: '秸秆层', thickness: 10, color: '#E2BE6E' },
            { name: '木屋架', thickness: 20, color: '#8B5A2B' },
            { name: '石墙体', thickness: 80, color: '#7F8C8D' }
        ]
    },

    // 海草生态数据
    ecology: {
        // 荣成近海海草床面积变化 (公顷)
        seagrassArea: [
            { year: 1980, area: 5000, note: '历史高峰' },
            { year: 1990, area: 3800, note: '开始退化' },
            { year: 2000, area: 2500, note: '持续减少' },
            { year: 2010, area: 1800, note: '低点' },
            { year: 2020, area: 2200, note: '修复开始' },
            { year: 2024, area: 2800, note: '持续恢复' }
        ],

        // 曹妃甸修复案例
        caofeidian: {
            before: {
                area: 120,
                biomass: 100,
                species: 60
            },
            after: {
                area: 380,
                biomass: 321,
                species: 111
            }
        },

        // 碳汇数据
        carbonSequestration: {
            perSquareMeter: 83, // g/年
            forestComparison: 2, // 倍
            totalHistorical: 15000 // 吨
        }
    },

    // 传承数据
    heritage: {
        // 苫匠人数变化
        craftsmen: [
            { year: 1980, count: 120 },
            { year: 1990, count: 85 },
            { year: 2000, count: 45 },
            { year: 2010, count: 25 },
            { year: 2020, count: 18 },
            { year: 2024, count: 16 }
        ],

        // 旅游收入 (万元)
        tourism: [
            { year: 2015, revenue: 45 },
            { year: 2017, revenue: 78 },
            { year: 2019, revenue: 112 },
            { year: 2021, revenue: 156 },
            { year: 2023, revenue: 208 }
        ],

        // 写生基地人数
        sketchBase: [
            { year: 2015, count: 1200 },
            { year: 2017, count: 2400 },
            { year: 2019, count: 3800 },
            { year: 2021, count: 4600 },
            { year: 2023, count: 6200 }
        ],

        // 保护规划预测
        protection: [
            { year: 2024, actual: 9500, optimistic: 9800, pessimistic: 9200 },
            { year: 2026, actual: null, optimistic: 10200, pessimistic: 8800 },
            { year: 2028, actual: null, optimistic: 10800, pessimistic: 8300 },
            { year: 2030, actual: null, optimistic: 11500, pessimistic: 7800 }
        ]
    },

    // 辅助方法
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HaicaofangData;
}