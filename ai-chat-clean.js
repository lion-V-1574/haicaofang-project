// ==================== 海草房本地智能问答系统 ====================
// 功能：本地知识库 + 快捷问题 + 导出对话 + 清空历史
// ================================================================

const aiFloatBtn = document.getElementById('aiFloatBtn');
const aiChatPopup = document.getElementById('aiChatPopup');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiChatBody = document.getElementById('aiChatBody');
const aiExportBtn = document.getElementById('aiExportBtn');
const aiClearBtn = document.getElementById('aiClearBtn');
const aiCloseBtn = document.getElementById('aiCloseBtn');
const quickQuestions = document.querySelectorAll('.quick-q-btn');
const aiVoiceBtn = document.getElementById('aiVoiceBtn');
const aiSpeakBtn = document.getElementById('aiSpeakBtn');

// 对话历史
let conversationHistory = [];
let isProcessing = false;

// 语音功能相关
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;
let isSpeaking = false;

// 初始化语音识别（Web Speech API）
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        aiInput.value = transcript;
        sendMessage();
    };
    
    recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        isListening = false;
        updateVoiceButton();
    };
    
    recognition.onend = () => {
        isListening = false;
        updateVoiceButton();
    };
}

// 海草房专业知识库（本地模式）
const LOCAL_KNOWLEDGE_BASE = {
    history: {
        keywords: ['历史', '起源', '演变', '发展', '古代', '史前', '秦汉', '明清', '民国', '现代', '多久', '什么时候'],
        responses: [
            '🏛️ 海草房拥有7000年悠久历史！\n\n从史前时期的原始雏形，到明清时期的建筑巅峰，海草房见证了胶东半岛的沧桑变迁。\n\n📅 关键时期：\n• 史前（7000年前）：北辛文化，原始雏形\n• 明清（1368-1912）：鼎盛期，工艺达到巅峰\n• 现代（2008年）：列入国家级非遗\n\n海草房是中国延续时间最长的滨海民居体系！',
            '📜 海草房的历史演变跨越7000年，经历了7个重要阶段：\n\n1️⃣ 史前雏形期（7000年前）\n2️⃣ 先秦成型期（公元前770年）\n3️⃣ 唐宋优化期（220-1368年）\n4️⃣ 明清鼎盛期（1368-1912年）\n5️⃣ 民国峰值期（1912-1949年）\n6️⃣ 建国衰退期（1949-2000年）\n7️⃣ 现代保护期（2000年至今）\n\n每个时期都有独特的建筑特征和文化价值！',
            '⏳ 海草房的历史可以追溯到距今7000-5000年的北辛文化时期！\n\n🌟 发展亮点：\n• 明清时期达到建筑工艺巅峰\n• 单栋建筑寿命可达150年\n• 民国时期数量达到历史峰值\n• 2008年列入国家级非遗\n\n海草房不仅是建筑，更是活着的历史教科书！'
        ]
    },
    villages: {
        keywords: ['村落', '村庄', '哪里', '分布', '东楮岛', '烟墩角', '小西村', '留村', '地方', '位置'],
        responses: [
            '📍 海草房主要分布在山东荣成，有7大核心村落：\n\n🏆 东楮岛村：650栋，规模最大\n🦢 烟墩角村：230栋，天鹅村\n🏛️ 小西村：104栋，清代建筑\n📜 留村：180栋，历史最悠久\n🎨 大庄许家村：120栋，彩绘特色\n⚔️ 东庄+宁津所：210栋，海防风格\n\n每个村落都有独特的魅力，值得一一探访！',
            '🗺️ 荣成是中国唯一的海草房文化保护区！\n\n核心村落分布：\n• 宁津片区：东楮岛、小西村\n• 俚岛片区：烟墩角\n• 成山片区：留村、大庄许家\n\n💡 推荐路线：\n东楮岛（看建筑）→ 烟墩角（看天鹅）→ 小西村（看古建）\n\n从威海高铁站出发，自驾40分钟即可到达！',
            '🏘️ 海草房现存3017栋，分布在18个核心保护区！\n\n🌟 必去村落TOP3：\n1️⃣ 东楮岛：规模最大，有海草房博物馆\n2️⃣ 烟墩角：联合国最佳旅游乡村，冬季可看天鹅\n3️⃣ 小西村：清代建筑最纯正，无现代化改造\n\n每个村落都保留了完整的街巷格局和建筑风貌！'
        ]
    },
    craft: {
        keywords: ['建造', '工艺', '材料', '结构', '怎么建', '海草', '石头', '屋顶', '墙体', '建筑'],
        responses: [
            '🔨 海草房的建造工艺堪称一绝！\n\n🌿 核心材料：\n• 屋顶：浅海大叶藻（需3年晾晒）\n• 墙体：花岗岩毛石（干垒工艺）\n• 辅料：黄泥、麦秸（全生态）\n\n⚙️ 建造工序：\n12道纯手工工序，单栋需6个月，匠人需10年学艺！\n\n整个过程无钢筋、无水泥，纯榫卯+堆叠结构，寿命超百年！',
            '🏗️ 海草房的建筑结构非常科学：\n\n🧱 墙体：毛石干垒，厚60cm，防风抗震\n🏠 屋顶：双坡三角顶，坡度45°，厚50cm\n🌾 海草层：分层堆叠15-20层\n🎯 屋脊：弧形元宝顶，抗台风性能拉满\n\n✨ 核心特点：\n冬暖夏凉、防风抗潮、隔音降噪、生态环保！',
            '🌊 海草房用的"海草"可不是普通的草！\n\n它是浅海大叶藻（海带草），特点：\n• 含盐量高，耐腐蚀\n• 防虫蛀，不易燃\n• 需要3年以上自然晾晒\n• 堆叠后厚度达50cm\n\n🏔️ 墙体用的是天然花岗岩毛石：\n• 无水泥粘合，纯干垒工艺\n• 墙体厚60cm，冬暖夏凉\n\n全生态材料，零污染！'
        ]
    },
    features: {
        keywords: ['特点', '优势', '好处', '为什么', '冬暖夏凉', '防风', '隔音', '环保'],
        responses: [
            '✨ 海草房有5大核心优势：\n\n1️⃣ 恒温隔热：冬暖夏凉，室内温差≤5℃\n2️⃣ 防风抗潮：适配沿海12级台风\n3️⃣ 隔音降噪：海草层吸音，室内静音\n4️⃣ 生态环保：可自然降解，零污染\n5️⃣ 超长寿命：正常维护可使用150年+\n\n这些优势让海草房成为零碳建筑的标杆！',
            '🌡️ 海草房为什么冬暖夏凉？\n\n秘密在于：\n• 50cm厚的海草层：天然保温材料\n• 60cm厚的石墙：蓄热调温\n• 双坡屋顶：空气对流\n\n实测数据：\n夏天室外35℃，室内28℃\n冬天室外-5℃，室内5℃\n\n比现代空调还节能环保！',
            '🛡️ 海草房的抗台风能力超强！\n\n设计巧思：\n• 弧形元宝顶：风从两侧滑过\n• 低矮屋脊：降低风阻\n• 厚重墙体：稳如泰山\n• 海草柔韧：不怕吹\n\n历史记录：\n经历过无数次12级台风，依然屹立不倒！'
        ]
    },
    protection: {
        keywords: ['濒危', '保护', '消失', '为什么少', '传承', '非遗', '匠人', '措施'],
        responses: [
            '⚠️ 海草房面临4大濒危威胁：\n\n1️⃣ 资源枯竭：海草减产90%，无新建材料\n2️⃣ 技艺断层：在册匠人仅18人，平均65岁\n3️⃣ 城市化：年均减少50栋\n4️⃣ 维护困难：纯手工维护成本高\n\n🛡️ 保护措施：\n立法保护、技艺传承、数字化存档、文旅活化、生态修复\n\n2008年已列入国家级非遗，正在全力抢救！',
            '👴 海草房的建造技艺正在失传！\n\n现状：\n• 在册匠人：18人\n• 平均年龄：65岁\n• 国家级传承人：1人\n• 省级传承人：3人\n\n核心技艺：\n海草晾晒、分层苫顶、屋脊塑形\n\n💡 保护行动：\n设立非遗工坊，匠人带徒授艺，培养年轻传承人！',
            '📊 海草房濒危指数：58（重度濒危）\n\n数据分析：\n• 资源指数：89（极度稀缺）\n• 技艺指数：76（重度断层）\n• 存量指数：42（中度衰减）\n• 保护指数：31（轻度完善）\n\n🚨 核心风险：\n材料枯竭与匠人断层\n\n抢救优先级：最高级！'
        ]
    },
    tourism: {
        keywords: ['旅游', '游玩', '攻略', '推荐', '什么时候去', '怎么去', '体验', '民宿'],
        responses: [
            '🎒 海草房旅游全攻略来了！\n\n📅 最佳时间：11月-3月\n（可以同时看天鹅和海草房）\n\n🗺️ 必去村落：\n• 东楮岛：看建筑、逛博物馆\n• 烟墩角：看天鹅、拍大片\n• 小西村：看古建、感受历史\n\n🎯 体验项目：\n民宿住宿、渔家宴、非遗苫草、3D数字化体验\n\n🚗 交通：威海高铁站自驾40分钟直达！',
            '🏨 海草房民宿体验超赞！\n\n特色：\n• 住在真正的海草房里\n• 体验冬暖夏凉的神奇\n• 品尝地道渔家宴\n• 参与非遗苫草活动\n\n💰 价格：200-500元/晚\n\n🌟 推荐村落：\n东楮岛、烟墩角（民宿最成熟）\n\n提前预订，旺季很抢手！',
            '📸 海草房拍照攻略：\n\n🌅 最佳时间：\n• 日出：5:00-6:00\n• 日落：17:00-18:00\n• 冬季天鹅季：11月-3月\n\n📷 最佳机位：\n• 东楮岛：海草房博物馆前\n• 烟墩角：天鹅湖边\n• 小西村：古街巷\n\n💡 拍摄技巧：\n低角度仰拍屋顶，侧光拍墙体纹理！'
        ]
    },
    data: {
        keywords: ['数量', '多少', '现存', '统计', '数据', '面积'],
        responses: [
            '📊 海草房精准数据（2025最新）：\n\n🏠 现存完整海草房：3017栋\n🔧 残缺待修缮：426栋\n🏘️ 核心保护区：18个村落\n📐 总建筑面积：12.8万平方米\n\n村落分布：\n• 东楮岛：650栋\n• 烟墩角：230栋\n• 小西村：104栋\n• 留村：180栋\n\n中国唯一规模化海草房集群！',
            '📈 海草房数量变化趋势：\n\n历史峰值（民国）：覆盖率95%\n建国初期：仍为主流\n80年代：开始衰退\n90年代：快速减少\n2000年：启动保护\n2025年：3017栋\n\n⚠️ 年均减少：50栋\n\n保护刻不容缓！',
            '🏆 海草房之最：\n\n• 规模最大：东楮岛（650栋）\n• 历史最久：留村（600年）\n• 保存最好：小西村（清代原貌）\n• 最受欢迎：烟墩角（天鹅村）\n• 最有特色：大庄许家（彩绘）\n\n每个村落都是独一无二的文化瑰宝！'
        ]
    },
    general: {
        keywords: ['你好', '介绍', '什么', '是什么', '了解'],
        responses: [
            '👋 你好！我是海草房AI顾问！\n\n🏠 海草房是什么？\n海草房是胶东半岛独有的生态民居，用海草苫顶、石头垒墙，距今已有7000年历史！\n\n✨ 核心特点：\n冬暖夏凉、防风抗潮、生态环保、寿命150年+\n\n📍 主要分布：\n山东荣成，现存3017栋\n\n💡 你可以问我：\n历史、村落、工艺、保护、旅游等任何问题！',
            '🌊 海草房是中国独有的世界级民居文化遗产！\n\n🎯 五大价值：\n1️⃣ 历史价值：7000年滨海民居活化石\n2️⃣ 生态价值：零碳建筑标杆\n3️⃣ 艺术价值：北方滨海民居唯一形制\n4️⃣ 科研价值：海洋气候适配建筑样本\n5️⃣ 文化价值：胶东渔家文化核心载体\n\n2008年列入国家级非遗，正在全力保护中！',
            '🏛️ 海草房 = 海草屋顶 + 石头墙体\n\n🌿 海草：浅海大叶藻，3年晾晒，厚50cm\n🪨 石头：花岗岩毛石，干垒工艺，厚60cm\n\n🎨 建筑特色：\n• 弧形元宝顶（抗台风）\n• 双坡三角顶（排水快）\n• 低矮屋脊（降风阻）\n\n📍 分布：山东荣成，7大核心村落\n📅 历史：7000年，2008年国家级非遗'
        ]
    }
};

// 本地智能匹配函数（返回响应和分类）
function getLocalResponse(question) {
    const q = question.toLowerCase();
    for (const [category, data] of Object.entries(LOCAL_KNOWLEDGE_BASE)) {
        for (const keyword of data.keywords) {
            if (q.includes(keyword)) {
                const responses = data.responses;
                const randomIndex = Math.floor(Math.random() * responses.length);
                return { text: responses[randomIndex], category: category };
            }
        }
    }
    return { 
        text: LOCAL_KNOWLEDGE_BASE.general.responses[Math.floor(Math.random() * LOCAL_KNOWLEDGE_BASE.general.responses.length)],
        category: 'general'
    };
}

// 切换聊天窗口
aiFloatBtn.onclick = () => {
    aiChatPopup.style.display = aiChatPopup.style.display === 'flex' ? 'none' : 'flex';
};

aiCloseBtn.onclick = () => {
    aiChatPopup.style.display = 'none';
};

// 快捷问题
quickQuestions.forEach(btn => {
    btn.onclick = () => {
        const question = btn.getAttribute('data-question');
        aiInput.value = question;
        sendMessage();
    };
});

// 导出对话
aiExportBtn.onclick = () => {
    if (conversationHistory.length === 0) {
        alert('暂无对话记录');
        return;
    }
    let exportText = '=== 海草房 AI 对话记录 ===\n';
    exportText += `导出时间：${new Date().toLocaleString()}\n\n`;
    conversationHistory.forEach((msg) => {
        const role = msg.role === 'user' ? '👤 用户' : '🤖 AI';
        exportText += `${role}：\n${msg.content}\n\n`;
    });
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `海草房AI对话_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};

// 清空历史
aiClearBtn.onclick = () => {
    if (confirm('确定要清空所有对话记录吗？')) {
        conversationHistory = [];
        aiChatBody.innerHTML = '<div class="ai-message ai">👋 对话已清空！我是海草房 AI 顾问，有什么想了解的吗？</div>';
    }
};

// 发送消息
aiSendBtn.onclick = sendMessage;
aiInput.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

// 语音识别按钮
if (aiVoiceBtn && recognition) {
    aiVoiceBtn.onclick = toggleVoiceRecognition;
} else if (aiVoiceBtn) {
    aiVoiceBtn.style.display = 'none'; // 浏览器不支持则隐藏
}

// 语音播报开关按钮
if (aiSpeakBtn) {
    aiSpeakBtn.onclick = toggleSpeech;
}

// 切换语音识别
function toggleVoiceRecognition() {
    if (isListening) {
        recognition.stop();
        isListening = false;
    } else {
        recognition.start();
        isListening = true;
    }
    updateVoiceButton();
}

// 更新语音识别按钮状态
function updateVoiceButton() {
    if (aiVoiceBtn) {
        if (isListening) {
            aiVoiceBtn.innerHTML = '🎤';
            aiVoiceBtn.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)';
            aiVoiceBtn.classList.add('listening');
        } else {
            aiVoiceBtn.innerHTML = '🎙️';
            aiVoiceBtn.style.background = '';
            aiVoiceBtn.classList.remove('listening');
        }
    }
}

// 切换语音播报
function toggleSpeech() {
    isSpeaking = !isSpeaking;
    if (aiSpeakBtn) {
        if (isSpeaking) {
            aiSpeakBtn.innerHTML = '🔊';
            aiSpeakBtn.style.background = 'linear-gradient(135deg, #5f27cd 0%, #341f97 100%)';
            aiSpeakBtn.title = '关闭语音播报';
        } else {
            aiSpeakBtn.innerHTML = '🔇';
            aiSpeakBtn.style.background = '';
            aiSpeakBtn.title = '开启语音播报';
            // 停止当前播报
            synthesis.cancel();
        }
    }
}

// 语音播报函数
function speakText(text) {
    if (!isSpeaking || !synthesis) return;
    
    // 清理文本中的emoji和特殊符号
    const cleanText = text.replace(/[🏛️📅📜⏳🌟💡🎯✨🌡️🛡️⚠️👴📊🚨🎒📍🗺️🏨📸🌅📷🏠🔧🏘️📐📈🏆👋🌊🎨🔨🌿🪨🏗️🧱🌾🎯]/g, '')
                          .replace(/\n/g, '，')
                          .replace(/•/g, '')
                          .replace(/\d+️⃣/g, '第');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.1; // 语速
    utterance.pitch = 1.0; // 音调
    utterance.volume = 1.0; // 音量
    
    synthesis.speak(utterance);
}

// 发送消息（纯本地模式）
async function sendMessage() {
    const text = aiInput.value.trim();
    if (!text || isProcessing) return;
    
    isProcessing = true;
    aiInput.disabled = true;
    aiSendBtn.disabled = true;
    aiSendBtn.textContent = '发送中...';
    
    addMessage(text, 'user');
    aiInput.value = '';
    
    const loadingMsg = addMessage('🤔 AI 正在思考中...', 'ai', true);
    await new Promise(resolve => setTimeout(resolve, 500));
    loadingMsg.remove();
    
    const localResponse = getLocalResponse(text);
    await typewriterEffect(localResponse.text, localResponse.category);
    
    // 语音播报AI回答
    speakText(localResponse.text);
    
    conversationHistory.push(
        { role: 'user', content: text },
        { role: 'assistant', content: localResponse.text }
    );
    
    if (conversationHistory.length > 40) {
        conversationHistory = conversationHistory.slice(-40);
    }
    
    isProcessing = false;
    aiInput.disabled = false;
    aiSendBtn.disabled = false;
    aiSendBtn.textContent = '发送';
    aiInput.focus();
}

// 添加消息到聊天窗口
function addMessage(text, type, isLoading = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${type}`;
    msgDiv.textContent = text;
    if (isLoading) msgDiv.classList.add('typing');
    aiChatBody.appendChild(msgDiv);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
    return msgDiv;
}

// 打字机效果（带跳转按钮）
async function typewriterEffect(text, category = 'general') {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-message ai';
    aiChatBody.appendChild(msgDiv);
    let currentText = '';
    const chars = text.split('');
    for (let i = 0; i < chars.length; i++) {
        currentText += chars[i];
        msgDiv.innerHTML = currentText.replace(/\n/g, '<br>');
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
        const delay = chars[i].match(/[，。！？、；：]/) ? 80 : 20;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // 添加"查看详情"按钮
    const sectionMap = {
        'history': { id: 'history', name: '历史沿革' },
        'villages': { id: 'distribution-analysis', name: '村落分布' },
        'craft': { id: 'structure', name: '建造工艺' },
        'features': { id: 'structure', name: '建筑特点' },
        'protection': { id: 'heritage', name: '保护传承' },
        'tourism': { id: 'experience', name: '旅游体验' },
        'data': { id: 'distribution-analysis', name: '数据分析' }
    };
    
    if (sectionMap[category]) {
        const btnDiv = document.createElement('div');
        btnDiv.style.marginTop = '10px';
        btnDiv.innerHTML = `<button class="ai-detail-btn" onclick="scrollToSection('${sectionMap[category].id}')">
            📍 查看${sectionMap[category].name}详情
        </button>`;
        msgDiv.appendChild(btnDiv);
    }
    
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

// 页面跳转函数
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // 关闭AI对话框
        aiChatPopup.style.display = 'none';
        
        // 平滑滚动到目标区域
        section.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // 高亮显示目标区域（添加闪烁效果）
        section.style.transition = 'all 0.3s ease';
        section.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
        setTimeout(() => {
            section.style.boxShadow = '';
        }, 2000);
        
        // 更新导航栏激活状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });
    }
}
