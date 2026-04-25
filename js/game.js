// 海草房搭建游戏模块
const HaicaofangGame = {
    materials: [
        { id: 1, name: '石墙体', icon: '🏛️', order: 1 },
        { id: 2, name: '木屋架', icon: '🪵', order: 2 },
        { id: 3, name: '秸秆层', icon: '🌾', order: 3 },
        { id: 4, name: '黄泥层', icon: '🟤', order: 4 },
        { id: 5, name: '海草层', icon: '🌿', order: 5 }
    ],
    
    currentStep: 0,
    isPlaying: false,
    score: 0,
    
    // 初始化游戏
    init() {
        this.renderMaterials();
        this.renderStepsIndicator();
    },
    
    // 渲染材料卡片
    renderMaterials() {
        const grid = document.getElementById('materialsGrid');
        if (!grid) return;
        
        grid.innerHTML = this.materials.map(m => `
            <div class="material-card" data-id="${m.id}" draggable="true" onclick="game.selectMaterial(${m.id})">
                <i class="fas fa-layer-group"></i>
                <span>${m.icon} ${m.name}</span>
            </div>
        `).join('');
        
        // 添加拖拽事件
        grid.querySelectorAll('.material-card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.dataset.id);
            });
        });
        
        // 放置区域事件
        const slot = document.getElementById('buildingSlot');
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });
        
        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });
        
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const id = parseInt(e.dataTransfer.getData('text/plain'));
            this.placeMaterial(id);
        });
    },
    
    // 渲染步骤指示器
    renderStepsIndicator() {
        const indicator = document.getElementById('stepsIndicator');
        if (!indicator) return;
        
        indicator.innerHTML = this.materials.map((_, i) => `
            <div class="step-dot" id="step-${i}"></div>
        `).join('');
    },
    
    // 开始游戏
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentStep = 0;
        this.score = 0;
        this.resetBuildingSlot();
        this.updateStepsIndicator();
        this.showMessage('开始搭建！请按顺序点击材料卡片', 'success');
        
        document.getElementById('startGameBtn').disabled = true;
        document.getElementById('startGameBtn').textContent = '搭建中...';
    },
    
    // 选择材料
    selectMaterial(id) {
        if (!this.isPlaying) return;
        
        const material = this.materials.find(m => m.id === id);
        const card = document.querySelector(`.material-card[data-id="${id}"]`);
        
        if (card.classList.contains('used')) {
            this.showMessage('该材料已使用', 'error');
            return;
        }
        
        if (material.order === this.currentStep + 1) {
            this.placeMaterial(id);
        } else {
            this.showMessage(`错误！应该先放置${this.materials[this.currentStep].name}`, 'error');
        }
    },
    
    // 放置材料
    placeMaterial(id) {
        const material = this.materials.find(m => m.id === id);
        const slot = document.getElementById('buildingSlot');
        const card = document.querySelector(`.material-card[data-id="${id}"]`);
        
        // 添加到建筑槽
        const placedCard = card.cloneNode(true);
        placedCard.classList.add('used');
        placedCard.style.marginBottom = '10px';
        slot.appendChild(placedCard);
        
        // 标记为已使用
        card.classList.add('used');
        
        // 更新状态
        this.currentStep++;
        this.updateStepsIndicator();
        
        if (this.currentStep === this.materials.length) {
            this.completeGame();
        } else {
            this.showMessage(`正确！第${this.currentStep + 1}步：${this.materials[this.currentStep].name}`, 'success');
        }
    },
    
    // 重置建筑槽
    resetBuildingSlot() {
        const slot = document.getElementById('buildingSlot');
        slot.innerHTML = '';
        
        // 重置所有卡片
        document.querySelectorAll('.material-card').forEach(card => {
            card.classList.remove('used');
        });
    },
    
    // 更新步骤指示器
    updateStepsIndicator() {
        this.materials.forEach((_, i) => {
            const dot = document.getElementById(`step-${i}`);
            if (i < this.currentStep) {
                dot.classList.add('completed');
                dot.classList.remove('active');
            } else if (i === this.currentStep) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });
    },
    
    // 完成游戏
    completeGame() {
        this.isPlaying = false;
        this.score = 100;
        this.showMessage('🎉 恭喜！你成功搭建了海草房！获得 100 分！', 'success');
        
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('startGameBtn').textContent = '再玩一次';
        
        // 添加庆祝动画
        this.confetti();
    },
    
    // 重置游戏
    reset() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.score = 0;
        this.resetBuildingSlot();
        this.updateStepsIndicator();
        this.showMessage('', '');
        
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('startGameBtn').textContent = '开始搭建';
    },
    
    // 显示消息
    showMessage(msg, type) {
        const msgEl = document.getElementById('gameMessage');
        if (!msgEl) return;
        
        msgEl.textContent = msg;
        msgEl.className = 'game-message ' + type;
        
        if (msg) {
            setTimeout(() => {
                msgEl.classList.remove(type);
            }, 3000);
        }
    },
    
    // 庆祝动画
    confetti() {
        const colors = ['#2C5F7E', '#D96C4E', '#5D4A3B'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.transition = 'all 3s ease-out';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.style.transform = `translate(${Math.random() * 200 - 100}px, 100vh) rotate(${Math.random() * 720}deg)`;
                confetti.style.opacity = '0';
            }, 10);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }
};

// 知识问答模块
const HaicaofangQuiz = {
    questions: [
        {
            question: '海草房主要分布在哪个地区？',
            options: ['浙江沿海', '山东荣成', '福建泉州', '广东潮汕'],
            correct: 1,
            explanation: '海草房主要分布在山东半岛最东端的荣成市沿海地区。'
        },
        {
            question: '海草房的屋顶坡度通常是多少度？',
            options: ['30°', '40°', '50°', '60°'],
            correct: 2,
            explanation: '海草房屋顶坡度为 50°，这是最佳的排水排雪角度。'
        },
        {
            question: '海草房的海草层主要来自什么植物？',
            options: ['芦苇', '大叶藻', '蒲草', '茅草'],
            correct: 1,
            explanation: '海草房使用浅海生长的大叶藻（也称海韭菜）作为屋顶材料。'
        },
        {
            question: '海草房的海草层厚度可达多少？',
            options: ['0.5-1 米', '1-2 米', '2-3 米', '3-4 米'],
            correct: 3,
            explanation: '海草层最厚可达 4 米，是普通茅草屋顶的 8 倍。'
        },
        {
            question: '海草房被列入省级非物质文化遗产是在哪一年？',
            options: ['2000 年', '2006 年', '2010 年', '2015 年'],
            correct: 1,
            explanation: '2006 年，海草房营造技艺被列入山东省省级非物质文化遗产名录。'
        },
        {
            question: '海草房的墙体厚度通常是？',
            options: ['20-30cm', '40-50cm', '60-80cm', '100-120cm'],
            correct: 2,
            explanation: '海草房墙体厚度通常为 60-80cm，使用当地花岗岩砌筑。'
        },
        {
            question: '海草房的使用寿命一般有多长？',
            options: ['10-20 年', '30-50 年', '50-100 年', '100-200 年'],
            correct: 2,
            explanation: '海草房使用寿命可达 50-100 年，甚至更长，得益于海草的天然防腐特性。'
        },
        {
            question: '每平方米海草床每年固碳量约为？',
            options: ['23g', '43g', '63g', '83g'],
            correct: 3,
            explanation: '每平方米海草床每年固碳 83g，是热带雨林的 2 倍。'
        }
    ],
    
    currentQuestion: 0,
    score: 0,
    answered: false,
    
    // 初始化问答
    init() {
        this.loadQuestion();
    },
    
    // 加载题目
    loadQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showFinalResult();
            return;
        }
        
        const q = this.questions[this.currentQuestion];
        const questionEl = document.getElementById('quizQuestion');
        const optionsEl = document.getElementById('quizOptions');
        const feedbackEl = document.getElementById('quizFeedback');
        const nextBtn = document.getElementById('nextQuestionBtn');
        
        if (questionEl) {
            questionEl.textContent = `${this.currentQuestion + 1}. ${q.question}`;
        }
        
        if (optionsEl) {
            optionsEl.innerHTML = q.options.map((opt, i) => `
                <div class="quiz-option" onclick="quiz.selectOption(${i})">${opt}</div>
            `).join('');
        }
        
        if (feedbackEl) {
            feedbackEl.className = 'quiz-feedback';
            feedbackEl.style.display = 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        this.answered = false;
        this.updateProgress();
    },
    
    // 选择答案
    selectOption(index) {
        if (this.answered) return;
        
        this.answered = true;
        const q = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        const feedbackEl = document.getElementById('quizFeedback');
        const nextBtn = document.getElementById('nextQuestionBtn');
        
        // 显示正确答案
        options.forEach((opt, i) => {
            if (i === q.correct) {
                opt.classList.add('correct');
            } else if (i === index && i !== q.correct) {
                opt.classList.add('incorrect');
            }
        });
        
        // 计算得分
        if (index === q.correct) {
            this.score += 10;
            if (feedbackEl) {
                feedbackEl.innerHTML = `<strong style="color: #27ae60;">✓ 回答正确!</strong><br>${q.explanation}`;
                feedbackEl.style.background = 'rgba(39, 174, 96, 0.1)';
            }
        } else {
            if (feedbackEl) {
                feedbackEl.innerHTML = `<strong style="color: #c0392b;">✗ 回答错误</strong><br>正确答案：${q.options[q.correct]}<br>${q.explanation}`;
                feedbackEl.style.background = 'rgba(231, 76, 60, 0.1)';
            }
        }
        
        if (feedbackEl) {
            feedbackEl.className = 'quiz-feedback show';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'block';
        }
        
        this.updateProgress();
    },
    
    // 下一题
    nextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
    },
    
    // 更新进度
    updateProgress() {
        const progressEl = document.getElementById('quizProgress');
        const scoreEl = document.getElementById('quizScore');
        
        if (progressEl) {
            const percent = ((this.currentQuestion) / this.questions.length) * 100;
            progressEl.style.width = percent + '%';
        }
        
        if (scoreEl) {
            scoreEl.textContent = `得分：${this.score}`;
        }
    },
    
    // 显示最终结果
    showFinalResult() {
        const questionEl = document.getElementById('quizQuestion');
        const optionsEl = document.getElementById('quizOptions');
        const feedbackEl = document.getElementById('quizFeedback');
        const nextBtn = document.getElementById('nextQuestionBtn');
        
        const totalScore = this.questions.length * 10;
        const percentage = (this.score / totalScore) * 100;
        
        let message = '';
        let icon = '';
        
        if (percentage >= 90) {
            message = '太棒了！你是海草房专家！';
            icon = '🏆';
        } else if (percentage >= 70) {
            message = '很不错！你对海草房有深入了解！';
            icon = '🥇';
        } else if (percentage >= 60) {
            message = '及格了！继续加油学习！';
            icon = '📚';
        } else {
            message = '再接再厉！多了解海草房知识！';
            icon = '🌱';
        }
        
        if (questionEl) {
            questionEl.innerHTML = `${icon} 挑战完成！`;
        }
        
        if (feedbackEl) {
            feedbackEl.innerHTML = `
                <div style="text-align: center; padding: 30px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">${this.score}/${totalScore}</div>
                    <div style="font-size: 1.2rem; margin-bottom: 20px;">${message}</div>
                    <button class="btn btn-primary" onclick="quiz.restart()">再来一次</button>
                </div>
            `;
            feedbackEl.className = 'quiz-feedback show';
        }
        
        if (optionsEl) {
            optionsEl.innerHTML = '';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
    },
    
    // 重新开始
    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        this.loadQuestion();
    }
};

// 热工性能模拟器
const ThermalSimulation = {
    update() {
        const season = document.getElementById('seasonSelect').value;
        const outdoorTempEl = document.getElementById('outdoorTemp');
        const haicaoTempEl = document.getElementById('haicaoTemp');
        const brickTempEl = document.getElementById('brickTemp');
        
        if (season === 'summer') {
            if (outdoorTempEl) outdoorTempEl.textContent = '34°C';
            if (haicaoTempEl) haicaoTempEl.textContent = '26°C';
            if (brickTempEl) brickTempEl.textContent = '34°C';
        } else {
            if (outdoorTempEl) outdoorTempEl.textContent = '-5°C';
            if (haicaoTempEl) haicaoTempEl.textContent = '14°C';
            if (brickTempEl) brickTempEl.textContent = '6°C';
        }
    }
};

// 碳汇计算器
const CarbonCalculator = {
    calculate() {
        const area = parseFloat(document.getElementById('carbonArea').value) || 0;
        const sequestrationEl = document.getElementById('carbonSequestration');
        const treeEl = document.getElementById('treeEquivalent');
        const co2El = document.getElementById('co2Reduction');
        
        // 每平方米年固碳 83g
        const sequestration = area * 83 / 1000; // kg
        // 相当于植树 (每棵树年固碳约 15kg)
        const trees = sequestration / 15;
        // CO2 减排量 (碳分子量转换)
        const co2 = sequestration * 3.67;
        
        if (sequestrationEl) {
            sequestrationEl.textContent = sequestration.toFixed(2) + ' kg';
        }
        if (treeEl) {
            treeEl.textContent = trees.toFixed(2) + ' 棵';
        }
        if (co2El) {
            co2El.textContent = co2.toFixed(2) + ' kg';
        }
    }
};

// 保护承诺
function submitPledge() {
    const text = document.getElementById('pledgeText').value.trim();
    if (!text) {
        alert('请输入你的保护承诺');
        return;
    }
    
    const pledgeWall = document.getElementById('pledgeWall');
    if (pledgeWall) {
        const pledge = document.createElement('div');
        pledge.className = 'pledge-card';
        pledge.textContent = text;
        pledgeWall.appendChild(pledge);
        
        // 清空输入框
        document.getElementById('pledgeText').value = '';
        
        // 保存到本地存储
        const pledges = JSON.parse(localStorage.getItem('haicaofang_pledges') || '[]');
        pledges.push({ text, date: new Date().toISOString() });
        localStorage.setItem('haicaofang_pledges', JSON.stringify(pledges));
        
        alert('感谢你的承诺！已添加到保护墙。');
    }
}

// 加载已保存的承诺
function loadPledges() {
    const pledges = JSON.parse(localStorage.getItem('haicaofang_pledges') || '[]');
    const pledgeWall = document.getElementById('pledgeWall');
    
    if (pledgeWall && pledges.length > 0) {
        pledges.slice(-6).forEach(p => {
            const pledge = document.createElement('div');
            pledge.className = 'pledge-card';
            pledge.textContent = p.text;
            pledgeWall.appendChild(pledge);
        });
    }
}

// 导出为全局对象
window.game = HaicaofangGame;
window.quiz = HaicaofangQuiz;
window.thermalSim = ThermalSimulation;
window.carbonCalc = CarbonCalculator;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    HaicaofangGame.init();
    HaicaofangQuiz.init();
    ThermalSimulation.update();
    CarbonCalculator.calculate();
    loadPledges();
});
