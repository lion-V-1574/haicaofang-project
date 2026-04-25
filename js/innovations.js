// ================================================================
// innovations.js — 海草房创新功能模块
// 1. 濒危倒计时实时计算
// 2. 四维指数维度详情弹窗
// 3. 苫匠决策路径叙事游戏
// ================================================================

// ── 1. 濒危倒计时 ──────────────────────────────────────────────
(function initCountdown() {
    // 按年均减少30间，9500间还剩约316年
    var totalSeconds = 316 * 365.25 * 24 * 3600;
    var startTime = new Date('2025-01-01T00:00:00').getTime();

    function update() {
        var now = Date.now();
        var elapsed = (now - startTime) / 1000;
        var remaining = Math.max(0, totalSeconds - elapsed);

        var years  = Math.floor(remaining / (365.25 * 24 * 3600));
        var days   = Math.floor((remaining % (365.25 * 24 * 3600)) / (24 * 3600));
        var hours  = Math.floor((remaining % (24 * 3600)) / 3600);

        var yEl = document.getElementById('countdown-years');
        var dEl = document.getElementById('countdown-days');
        var hEl = document.getElementById('countdown-hours');
        if (yEl) yEl.textContent = years;
        if (dEl) dEl.textContent = days;
        if (hEl) hEl.textContent = hours;
    }

    update();
    setInterval(update, 1000);
})();

// ── 2. 四维指数维度详情弹窗 ────────────────────────────────────
var dimData = {
    resource: {
        icon: '🌿',
        title: '资源稀缺度',
        score: 89,
        color: '#c4614a',
        summary: '海草床面积较1980年减少44%，原材料极度稀缺',
        details: [
            { label: '荣成近海海草床面积', value: '2800公顷', note: '1980年峰值5000公顷' },
            { label: '年均采集量', value: '约120吨', note: '较需求缺口约35%' },
            { label: '海草质量评级', value: '中等偏下', note: '盐度变化影响品质' },
            { label: '替代材料可行性', value: '极低', note: '无法复制天然海草特性' }
        ],
        insight: '资源稀缺是最根本的制约因素。即使有足够的匠人，没有足够的海草原料，海草房也无法新建或修缮。',
        source: '数据来源：荣成市海洋与渔业局 2024年监测报告'
    },
    craft: {
        icon: '🔨',
        title: '技艺断层度',
        score: 76,
        color: '#e6a345',
        summary: '在册苫匠仅18人，平均年龄63.5岁，传承断层严峻',
        details: [
            { label: '国家级传承人', value: '1人', note: '刘玉启，68岁' },
            { label: '省级传承人', value: '3人', note: '平均年龄61岁' },
            { label: '市县级传承人', value: '14人', note: '平均年龄62岁' },
            { label: '在学徒弟', value: '约8人', note: '坚持学习者不足3人' }
        ],
        insight: '按现有传承速度，10年内核心技艺传承人将减少至个位数。苫顶技艺需要至少10年才能掌握，时间窗口极为紧迫。',
        source: '数据来源：荣成市非物质文化遗产保护中心 2024年统计'
    },
    stock: {
        icon: '🏠',
        title: '存量衰减度',
        score: 42,
        color: '#6b8c5a',
        summary: '现存9500间，较1980年减少68%，保护措施已见效',
        details: [
            { label: '1980年存量', value: '约30000间', note: '历史峰值' },
            { label: '2024年存量', value: '9500间', note: '威海全市统计' },
            { label: '年均减少量', value: '约30间', note: '较2000年前大幅下降' },
            { label: '保护修缮率', value: '约12%', note: '每年约1140间得到维护' }
        ],
        insight: '存量衰减速度已从年均600间降至30间，保护措施效果显著。但绝对数量仍在减少，需要持续投入。',
        source: '数据来源：荣成市文化和旅游局 2024年普查数据'
    },
    protect: {
        icon: '🛡️',
        title: '保护完善度',
        score: 31,
        color: '#2c5f7e',
        summary: '已列入国家级非遗，但资金与政策支持仍需加强',
        details: [
            { label: '非遗级别', value: '国家级', note: '2008年列入' },
            { label: '年度保护资金', value: '约200万元', note: '覆盖率不足30%' },
            { label: '保护规划完善度', value: '中等', note: '缺乏长期系统规划' },
            { label: '数字化存档进度', value: '约40%', note: '仍有大量未记录技艺' }
        ],
        insight: '保护完善度是四个维度中得分最低的，说明现有保护体系与实际需求之间存在较大差距，需要政策和资金的双重加强。',
        source: '数据来源：荣成市文化遗产保护办公室 2024年评估报告'
    }
};

function showDimDetail(dim) {
    var d = dimData[dim];
    if (!d) return;
    var html = '<div style="margin-bottom:20px;">'
        + '<div style="font-size:2.5rem;margin-bottom:12px;">' + d.icon + '</div>'
        + '<h3 style="color:' + d.color + ';font-family:Noto Serif SC,serif;font-size:1.5rem;margin:0 0 6px;">' + d.title + '</h3>'
        + '<div style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:20px;padding:3px 14px;margin-bottom:12px;">'
        + '<span style="color:' + d.color + ';font-size:2rem;font-weight:900;">' + d.score + '</span>'
        + '<span style="color:rgba(245,240,232,0.5);font-size:0.8rem;margin-left:4px;">/ 100</span>'
        + '</div>'
        + '<p style="color:rgba(245,240,232,0.7);font-size:0.88rem;line-height:1.7;margin:0;">' + d.summary + '</p>'
        + '</div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">';
    d.details.forEach(function(item) {
        html += '<div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;">'
            + '<div style="color:rgba(245,240,232,0.45);font-size:0.7rem;margin-bottom:4px;">' + item.label + '</div>'
            + '<div style="color:#f5f0e8;font-size:1rem;font-weight:700;margin-bottom:2px;">' + item.value + '</div>'
            + '<div style="color:rgba(245,240,232,0.4);font-size:0.68rem;">' + item.note + '</div>'
            + '</div>';
    });
    html += '</div>';

    html += '<div style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.25);border-radius:10px;padding:14px;margin-bottom:14px;">'
        + '<div style="color:#c9a96e;font-size:0.75rem;font-weight:700;margin-bottom:6px;">💡 数据洞察</div>'
        + '<p style="color:rgba(245,240,232,0.75);font-size:0.82rem;line-height:1.7;margin:0;">' + d.insight + '</p>'
        + '</div>';

    html += '<div style="color:rgba(245,240,232,0.3);font-size:0.68rem;">' + d.source + '</div>';

    document.getElementById('dimDetailContent').innerHTML = html;
    document.getElementById('dimDetailModal').style.display = 'block';
}

function closeDimDetail() {
    document.getElementById('dimDetailModal').style.display = 'none';
}

// 维度卡片悬停效果
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dim-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});

// ── 3. 苫匠决策路径叙事游戏 ────────────────────────────────────
var storyChoices = {};

var storyData = {
    // 第二幕：根据第一幕选择分支
    scene2: {
        A: {
            narration: '你接受了商业化改造。旅游公司很满意，游客络绎不绝。但三个月后，你发现自己在用玻璃纤维替代海草，用机器代替手工……',
            question: '📋 第二个选择：你的徒弟小王来找你，说想学真正的传统工艺，但公司不允许。你怎么做？',
            choices: [
                { id: 'AA', text: '遵守合同，告诉小王这是现实，传统工艺已经不合时宜了', color: '#c4614a' },
                { id: 'AB', text: '私下教小王传统工艺，利用业余时间保留真正的技艺', color: '#c9a96e' },
                { id: 'AC', text: '向公司提出修改合同，要求保留一部分传统工艺展示', color: '#6b8c5a' }
            ]
        },
        B: {
            narration: '你选择了文化展示合作。收入不高，但每天都有游客围观你苫顶，孩子们的眼睛里有光。两年后，有三个年轻人表示想拜师学艺……',
            question: '📋 第二个选择：三个年轻人中，一个是大学生，一个是返乡农民，一个是外地人。你能收几个徒弟？',
            choices: [
                { id: 'BA', text: '只收返乡农民，他最了解本地文化，传承最纯正', color: '#c4614a' },
                { id: 'BB', text: '三个都收，传承越广越好，不拘一格', color: '#c9a96e' },
                { id: 'BC', text: '收大学生，他能用现代方式记录和传播技艺', color: '#6b8c5a' }
            ]
        },
        C: {
            narration: '你拒绝了商业化，靠政府补贴维持。生活清苦，但你的技艺纯正。政府文化局找到你，希望你参与一个"海草房数字化存档"项目……',
            question: '📋 第二个选择：数字化存档需要你配合拍摄、录制，但会占用大量时间，影响实际传承教学。你怎么选？',
            choices: [
                { id: 'CA', text: '全力配合数字化，让技艺永久留存，哪怕减少教学时间', color: '#c4614a' },
                { id: 'CB', text: '拒绝数字化，认为技艺只能手把手传授，不能靠视频', color: '#c9a96e' },
                { id: 'CC', text: '部分配合，让徒弟参与拍摄，边记录边学习', color: '#6b8c5a' }
            ]
        }
    },
    // 第三幕：根据前两幕选择
    scene3: {
        question: '�� 最后的选择：十年后，你已经78岁，身体大不如前。海草房保护基金会邀请你去北京做最后一次公开演示，但路途遥远，你的身体可能承受不住……',
        choices: [
            { id: 'X', text: '去北京，用最后的力气让更多人看见这门技艺', color: '#c4614a' },
            { id: 'Y', text: '留在荣成，把最后的时间留给徒弟，手把手传授最后的秘诀', color: '#6b8c5a' },
            { id: 'Z', text: '让徒弟代替你去北京，你在家录制完整的技艺视频', color: '#c9a96e' }
        ]
    },
    // 结局
    endings: {
        X: {
            icon: '🏛️',
            title: '薪火相传',
            color: '#c9a96e',
            ei_change: -8,
            text: '你去了北京，演示引发全国关注。政府拨款500万专项保护资金，三所大学开设海草房研究课程。你的徒弟们接过了你的工具，海草房的故事还在继续……',
            impact: '濒危指数下降8点，传承人数量增加至35人'
        },
        Y: {
            icon: '🌿',
            title: '根植于土',
            color: '#6b8c5a',
            ei_change: -5,
            text: '你留在了荣成。那个冬天，你把最后的秘诀——如何判断海草的最佳晾晒时机——传给了三个徒弟。他们记住了，也传下去了。有些东西，只有在现场才能学会。',
            impact: '濒危指数下降5点，核心技艺完整保留'
        },
        Z: {
            icon: '📹',
            title: '数字永存',
            color: '#2c5f7e',
            ei_change: -3,
            text: '你录制了48小时的完整技艺视频，上传至国家非遗数字档案库。徒弟在北京的演示也很成功。但你知道，视频里没有海草的气味，没有手上的温度……',
            impact: '濒危指数下降3点，数字存档完整度提升至85%'
        }
    }
};

function makeChoice(scene, choiceId) {
    storyChoices['scene' + scene] = choiceId;

    // 禁用当前场景的按钮
    var currentScene = document.getElementById('story-scene-' + scene);
    if (currentScene) {
        currentScene.querySelectorAll('.story-choice-btn').forEach(function(btn) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'default';
        });
        // 高亮选中的按钮
        currentScene.querySelectorAll('.story-choice-btn').forEach(function(btn) {
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').indexOf("'" + choiceId + "'") !== -1) {
                btn.style.opacity = '1';
                btn.style.borderWidth = '2px';
                btn.style.boxShadow = '0 0 12px rgba(201,169,110,0.4)';
            }
        });
    }

    // 更新进度条
    var prog = document.getElementById('story-progress-' + scene);
    if (prog) prog.style.width = '100%';
    var nextStep = document.getElementById('story-step-' + (scene < 3 ? scene + 1 : 'end'));
    if (nextStep) {
        nextStep.style.background = '#c9a96e';
        nextStep.style.color = '#1a0a00';
        nextStep.style.border = 'none';
    }

    setTimeout(function() {
        if (scene === 1) {
            showScene2(choiceId);
        } else if (scene === 2) {
            showScene3();
        } else if (scene === 3) {
            showEnding(choiceId);
        }
    }, 400);
}

function showScene2(choice1) {
    var data = storyData.scene2[choice1];
    if (!data) return;

    var html = '<div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:20px;">'
        + '<div style="font-size:2.5rem;flex-shrink:0;">👴</div>'
        + '<div style="background:rgba(245,240,232,0.06);border-radius:12px;padding:16px 20px;border-left:3px solid #c9a96e;">'
        + '<p style="color:#f5f0e8;font-size:0.92rem;line-height:1.8;margin:0;">' + data.narration + '</p>'
        + '</div></div>';

    html += '<div style="background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.2);border-radius:10px;padding:16px 20px;margin-bottom:20px;">'
        + '<div style="color:#c9a96e;font-size:0.8rem;font-weight:700;margin-bottom:12px;">' + data.question + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:10px;">';

    data.choices.forEach(function(c) {
        html += '<button class="story-choice-btn" onclick="makeChoice(2,\'' + c.id + '\')" '
            + 'style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.3);color:#f5f0e8;padding:12px 16px;border-radius:8px;cursor:pointer;text-align:left;font-size:0.85rem;transition:all 0.3s;line-height:1.6;">'
            + '<strong style="color:' + c.color + ';">' + c.id.slice(-1) + '.</strong> ' + c.text
            + '</button>';
    });

    html += '</div></div>';

    var scene2 = document.getElementById('story-scene-2');
    scene2.innerHTML = html;
    scene2.style.display = 'block';
    scene2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showScene3() {
    var data = storyData.scene3;
    var html = '<div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:20px;">'
        + '<div style="font-size:2.5rem;flex-shrink:0;">⏳</div>'
        + '<div style="background:rgba(245,240,232,0.06);border-radius:12px;padding:16px 20px;border-left:3px solid #c9a96e;">'
        + '<p style="color:#f5f0e8;font-size:0.92rem;line-height:1.8;margin:0;">十年过去了。你的徒弟们已经能独立苫顶，荣成的海草房保护工作也有了起色。但你知道，时间不多了……</p>'
        + '</div></div>';

    html += '<div style="background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.2);border-radius:10px;padding:16px 20px;margin-bottom:20px;">'
        + '<div style="color:#c9a96e;font-size:0.8rem;font-weight:700;margin-bottom:12px;">' + data.question + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:10px;">';

    data.choices.forEach(function(c) {
        html += '<button class="story-choice-btn" onclick="makeChoice(3,\'' + c.id + '\')" '
            + 'style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.3);color:#f5f0e8;padding:12px 16px;border-radius:8px;cursor:pointer;text-align:left;font-size:0.85rem;transition:all 0.3s;line-height:1.6;">'
            + '<strong style="color:' + c.color + ';">' + c.id + '.</strong> ' + c.text
            + '</button>';
    });

    html += '</div></div>';

    var scene3 = document.getElementById('story-scene-3');
    scene3.innerHTML = html;
    scene3.style.display = 'block';
    scene3.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showEnding(finalChoice) {
    var ending = storyData.endings[finalChoice];
    if (!ending) return;

    var newEI = 58 + ending.ei_change;
    var html = '<div style="text-align:center;padding:20px 0;">'
        + '<div style="font-size:3.5rem;margin-bottom:16px;">' + ending.icon + '</div>'
        + '<h3 style="color:' + ending.color + ';font-family:Noto Serif SC,serif;font-size:1.6rem;margin:0 0 16px;">' + ending.title + '</h3>'
        + '<div style="background:rgba(245,240,232,0.06);border-radius:12px;padding:20px;margin-bottom:20px;text-align:left;">'
        + '<p style="color:#f5f0e8;font-size:0.92rem;line-height:1.9;margin:0;">' + ending.text + '</p>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">'
        + '<div style="background:rgba(28,26,22,0.6);border:1px solid rgba(201,169,110,0.2);border-radius:10px;padding:16px;">'
        + '<div style="color:rgba(245,240,232,0.5);font-size:0.72rem;margin-bottom:6px;">你的选择后，濒危指数</div>'
        + '<div style="font-family:Noto Serif SC,serif;font-size:2rem;font-weight:900;color:' + ending.color + ';">' + newEI + '</div>'
        + '<div style="color:rgba(245,240,232,0.4);font-size:0.7rem;margin-top:4px;">' + (ending.ei_change < 0 ? '↓ 下降' + Math.abs(ending.ei_change) + '点' : '→ 持平') + '</div>'
        + '</div>'
        + '<div style="background:rgba(28,26,22,0.6);border:1px solid rgba(107,140,90,0.2);border-radius:10px;padding:16px;">'
        + '<div style="color:rgba(245,240,232,0.5);font-size:0.72rem;margin-bottom:6px;">实际影响</div>'
        + '<div style="color:#8aad72;font-size:0.82rem;line-height:1.6;">' + ending.impact + '</div>'
        + '</div>'
        + '</div>'
        + '<div style="background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.2);border-radius:10px;padding:14px;text-align:left;">'
        + '<div style="color:#c9a96e;font-size:0.78rem;font-weight:700;margin-bottom:6px;">💭 故事的意义</div>'
        + '<p style="color:rgba(245,240,232,0.65);font-size:0.82rem;line-height:1.7;margin:0;">海草房的命运，取决于每一个人的选择。没有绝对正确的答案，只有不同的权衡与取舍。真实的刘玉启师傅，正在做着和你一样艰难的选择。</p>'
        + '</div>'
        + '</div>';

    var sceneEnd = document.getElementById('story-scene-end');
    sceneEnd.innerHTML = html;
    sceneEnd.style.display = 'block';
    sceneEnd.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // 更新进度条
    var progEnd = document.getElementById('story-progress-3');
    if (progEnd) progEnd.style.width = '100%';

    document.getElementById('story-restart').style.display = 'block';
}

function restartStory() {
    storyChoices = {};
    // 重置所有场景
    ['2','3','end'].forEach(function(s) {
        var el = document.getElementById('story-scene-' + s);
        if (el) { el.innerHTML = ''; el.style.display = 'none'; }
    });
    // 重置进度条
    ['1','2','3'].forEach(function(s) {
        var p = document.getElementById('story-progress-' + s);
        if (p) p.style.width = '0%';
    });
    // 重置步骤点
    ['2','3','end'].forEach(function(s) {
        var dot = document.getElementById('story-step-' + s);
        if (dot) {
            dot.style.background = 'rgba(201,169,110,0.2)';
            dot.style.color = 'rgba(245,240,232,0.4)';
            dot.style.border = '1px solid rgba(201,169,110,0.3)';
        }
    });
    // 重置第一幕按钮
    var scene1 = document.getElementById('story-scene-1');
    if (scene1) {
        scene1.querySelectorAll('.story-choice-btn').forEach(function(btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.boxShadow = '';
        });
    }
    document.getElementById('story-restart').style.display = 'none';
    document.getElementById('story-scene-1').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
