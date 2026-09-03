// 奖品列表（含概率权重，总和100）
var prizes = [
  { name: '非洲之星',       image: 'images/african-star.svg',       rarity: '传说', chance: 2,  label: '2%' },
  { name: '海洋之泪',       image: 'images/ocean-tear.svg',         rarity: '传说', chance: 2,  label: '2%' },
  { name: '北极星',         image: 'images/polaris.svg',            rarity: '神秘', chance: 1,  label: '1%' },
  { name: '金枝桂冠',       image: 'images/golden-wreath.svg',      rarity: '史诗', chance: 4,  label: '4%' },
  { name: '阿萨拉酒杯',     image: 'images/asara-cup.svg',          rarity: '史诗', chance: 4,  label: '4%' },
  { name: '珠宝头冠',       image: 'images/jeweled-crown.svg',      rarity: '史诗', chance: 4,  label: '4%' },
  { name: '"蓝宝石"龙舌兰', image: 'images/sapphire-tequila.svg',   rarity: '史诗', chance: 4,  label: '4%' },
  { name: '角墙饰',       image: 'images/horn-decor.svg',         rarity: '稀有', chance: 9,  label: '9%' },
  { name: '马赛克灯台',     image: 'images/mosaic-lamp.svg',        rarity: '稀有', chance: 9,  label: '9%' },
  { name: '典雅咖啡杯',     image: 'images/elegant-coffee-cup.svg', rarity: '稀有', chance: 7,  label: '7%' },
  { name: '海盗弯刀',       image: 'images/pirate-cutlass.svg',     rarity: '稀有', chance: 7,  label: '7%' },
  { name: '后妃耳环',       image: 'images/silver-earring.svg',     rarity: '稀有', chance: 4,  label: '4%' },
  { name: '海盗的银币',     image: 'images/pirate-coin.svg',        rarity: '普通', chance: 16, label: '16%' },
  { name: '望远镜',         image: 'images/telescope.svg',          rarity: '普通', chance: 16, label: '16%' },
  { name: '起舞的女郎',     image: 'images/dancing-lady.svg',       rarity: '普通', chance: 11, label: '11%' }
];

var rarityClass = {
  '神秘': 'rarity-mystery',
  '传说': 'rarity-legend',
  '史诗': 'rarity-epic',
  '稀有': 'rarity-rare',
  '普通': 'rarity-common'
};

// 加权随机抽取
function weightedRandom(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].chance;
  }
  var rand = Math.random() * total;
  var cumulative = 0;
  for (var i = 0; i < items.length; i++) {
    cumulative += items[i].chance;
    if (rand < cumulative) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

var nests = document.querySelectorAll('.nest');
var exploreBtn = document.getElementById('exploreBtn');
var prizeModal = document.getElementById('prizeModal');
var prizeImage = document.getElementById('prizeImage');
var prizeName = document.getElementById('prizeName');
var prizeRarity = document.getElementById('prizeRarity');
var prizeCloseBtn = document.getElementById('prizeCloseBtn');
var helpIcon = document.getElementById('helpIcon');
var prizeListModal = document.getElementById('prizeListModal');
var prizeListGrid = document.getElementById('prizeListGrid');
var prizeListCloseBtn = document.getElementById('prizeListCloseBtn');
var mysteryModal = document.getElementById('mysteryModal');
var mysteryImage = document.getElementById('mysteryImage');
var mysteryName = document.getElementById('mysteryName');
var mysteryCloseBtn = document.getElementById('mysteryCloseBtn');
var mysteryParticles = document.getElementById('mysteryParticles');
var bgMusic = document.getElementById('bgMusic');
var volumeSlider = document.getElementById('volumeSlider');
var volumeIcon = document.getElementById('volumeIcon');
var catReaction = document.getElementById('catReaction');
var catReactionInner = document.getElementById('catReactionInner');
var selectedNest = null;
var particleTimer = null;
var musicStarted = false;

// 保底与历史记录
var drawHistory = [];
var pullsSinceLastLegend = 0;
var pullsSinceLastMystery = 0;

var legendPityEl = document.getElementById('legendPity');
var mysteryPityEl = document.getElementById('mysteryPity');
var historyIcon = document.getElementById('historyIcon');
var historyModal = document.getElementById('historyModal');
var historyList = document.getElementById('historyList');
var historyStats = document.getElementById('historyStats');
var historyCloseBtn = document.getElementById('historyCloseBtn');

// 猫咪反应 SVG
var happyCatSVG = '<svg width="180" height="180" viewBox="0 0 200 200">' +
  '<ellipse cx="100" cy="110" rx="65" ry="55" fill="#f5a623"/>' +
  '<polygon points="50,70 35,20 75,50" fill="#f5a623"/>' +
  '<polygon points="150,70 165,20 125,50" fill="#f5a623"/>' +
  '<polygon points="55,65 42,28 72,52" fill="#ffb347"/>' +
  '<polygon points="145,65 158,28 128,52" fill="#ffb347"/>' +
  '<ellipse cx="78" cy="100" rx="14" ry="16" fill="#fff"/>' +
  '<ellipse cx="122" cy="100" rx="14" ry="16" fill="#fff"/>' +
  '<circle cx="80" cy="102" r="8" fill="#2d2d2d"/>' +
  '<circle cx="124" cy="102" r="8" fill="#2d2d2d"/>' +
  '<circle cx="83" cy="99" r="3" fill="#fff"/>' +
  '<circle cx="127" cy="99" r="3" fill="#fff"/>' +
  '<ellipse cx="100" cy="118" rx="7" ry="5" fill="#ff6b8a"/>' +
  '<path d="M88 128 Q100 142 112 128" stroke="#2d2d2d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<line x1="55" y1="115" x2="20" y2="108" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<line x1="55" y1="125" x2="18" y2="125" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<line x1="145" y1="115" x2="180" y2="108" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<line x1="145" y1="125" x2="182" y2="125" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<circle cx="155" cy="55" r="22" fill="#4CAF50"/>' +
  '<text x="155" y="63" text-anchor="middle" fill="#fff" font-size="28" font-weight="bold">✓</text>' +
'</svg>';

var sadCatSVG = '<svg width="180" height="180" viewBox="0 0 200 200">' +
  '<ellipse cx="100" cy="110" rx="65" ry="55" fill="#9e9e9e"/>' +
  '<polygon points="50,70 35,20 75,50" fill="#9e9e9e"/>' +
  '<polygon points="150,70 165,20 125,50" fill="#9e9e9e"/>' +
  '<polygon points="55,65 42,28 72,52" fill="#bdbdbd"/>' +
  '<polygon points="145,65 158,28 128,52" fill="#bdbdbd"/>' +
  '<ellipse cx="78" cy="100" rx="14" ry="16" fill="#fff"/>' +
  '<ellipse cx="122" cy="100" rx="14" ry="16" fill="#fff"/>' +
  '<circle cx="80" cy="104" r="8" fill="#2d2d2d"/>' +
  '<circle cx="124" cy="104" r="8" fill="#2d2d2d"/>' +
  '<path d="M85 130 Q100 120 115 130" stroke="#2d2d2d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<line x1="55" y1="115" x2="20" y2="108" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<line x1="55" y1="125" x2="18" y2="125" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<line x1="145" y1="115" x2="180" y2="108" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<line x1="145" y1="125" x2="182" y2="125" stroke="#2d2d2d" stroke-width="2" stroke-linecap="round"/>' +
  '<circle cx="45" cy="55" r="22" fill="#f44336"/>' +
  '<text x="45" y="63" text-anchor="middle" fill="#fff" font-size="28" font-weight="bold">✗</text>' +
'</svg>';

// 显示猫咪反应
function showCatReaction(isGood, callback) {
  catReactionInner.innerHTML = isGood ? happyCatSVG : sadCatSVG;
  catReaction.classList.remove('fade-out');
  catReaction.classList.add('show');
  setTimeout(function() {
    catReaction.classList.add('fade-out');
    setTimeout(function() {
      catReaction.classList.remove('show', 'fade-out');
      if (callback) callback();
    }, 300);
  }, 500);
}

// 鸟窝选择
nests.forEach(function(nest) {
  nest.addEventListener('click', function() {
    nests.forEach(function(n) { n.classList.remove('selected'); });
    nest.classList.add('selected');
    selectedNest = nest;
    if (!musicStarted) {
      bgMusic.volume = volumeSlider.value / 100;
      bgMusic.play().catch(function() {});
      musicStarted = true;
    }
  });
});

// 生成彩屑粒子
function spawnParticles() {
  var colors = ['#ffd700', '#ff4444', '#ff8c00', '#ff6347', '#ffa500', '#fff'];
  for (var i = 0; i < 60; i++) {
    (function(index) {
      setTimeout(function() {
        var p = document.createElement('div');
        p.className = 'mystery-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.width = (4 + Math.random() * 8) + 'px';
        p.style.height = (4 + Math.random() * 8) + 'px';
        p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        p.style.animationDuration = (2 + Math.random() * 3) + 's';
        p.style.animationDelay = '0s';
        mysteryParticles.appendChild(p);
        setTimeout(function() { p.remove(); }, 5000);
      }, index * 50);
    })(i);
  }
}

// 清除彩屑
function clearParticles() {
  if (particleTimer) {
    clearInterval(particleTimer);
    particleTimer = null;
  }
  mysteryParticles.innerHTML = '';
}

// 关闭神秘大奖弹窗
function closeMysteryModal() {
  mysteryModal.classList.remove('show');
  clearParticles();
}

// 判断奖品好坏
function isGoodPrize(prize) {
  return prize.rarity === '神秘' || prize.rarity === '传说' || prize.rarity === '史诗' || prize.rarity === '稀有';
}

// 更新保底计数器显示
function updatePityDisplay() {
  legendPityEl.textContent = pullsSinceLastLegend + '/50';
  mysteryPityEl.textContent = pullsSinceLastMystery + '/100';
}

// 按品质筛选奖品池
function getPrizesByRarity(rarity) {
  var result = [];
  for (var i = 0; i < prizes.length; i++) {
    if (prizes[i].rarity === rarity) result.push(prizes[i]);
  }
  return result;
}

// 带保底的抽奖逻辑
function drawPrize() {
  pullsSinceLastLegend++;
  pullsSinceLastMystery++;

  var prize;

  // 100抽神秘保底
  if (pullsSinceLastMystery >= 100) {
    var mysteryPrizes = getPrizesByRarity('神秘');
    prize = mysteryPrizes[Math.floor(Math.random() * mysteryPrizes.length)];
  }
  // 50抽传说保底（含神秘）
  else if (pullsSinceLastLegend >= 50) {
    var legendPrizes = getPrizesByRarity('传说');
    prize = legendPrizes[Math.floor(Math.random() * legendPrizes.length)];
  }
  // 正常抽取
  else {
    prize = weightedRandom(prizes);
  }

  // 更新保底计数
  if (prize.rarity === '神秘') {
    pullsSinceLastMystery = 0;
    pullsSinceLastLegend = 0;
  } else if (prize.rarity === '传说') {
    pullsSinceLastLegend = 0;
  }

  // 记录历史
  drawHistory.push({
    name: prize.name,
    image: prize.image,
    rarity: prize.rarity,
    num: drawHistory.length + 1
  });

  updatePityDisplay();
  return prize;
}

// 掏鸟窝
exploreBtn.addEventListener('click', function() {
  if (!selectedNest) {
    alert('请先选择一个鸟窝！');
    return;
  }
  if (!musicStarted) {
    bgMusic.volume = volumeSlider.value / 100;
    bgMusic.play().catch(function() {});
    musicStarted = true;
  }
  var prize = drawPrize();
  var good = isGoodPrize(prize);
  showCatReaction(good, function() {
    if (prize.rarity === '神秘') {
      mysteryImage.src = prize.image;
      mysteryName.textContent = prize.name;
      mysteryModal.classList.add('show');
      spawnParticles();
      particleTimer = setInterval(spawnParticles, 3000);
    } else {
      prizeImage.src = prize.image;
      prizeName.textContent = prize.name;
      prizeRarity.textContent = prize.rarity;
      prizeModal.classList.add('show');
    }
  });
});

// 关闭抽奖弹窗
prizeCloseBtn.addEventListener('click', function() {
  prizeModal.classList.remove('show');
});

prizeModal.addEventListener('click', function(e) {
  if (e.target === prizeModal) {
    prizeModal.classList.remove('show');
  }
});

// 关闭神秘大奖弹窗
mysteryCloseBtn.addEventListener('click', closeMysteryModal);

mysteryModal.addEventListener('click', function(e) {
  if (e.target === mysteryModal) {
    closeMysteryModal();
  }
});

// 音量控制
volumeSlider.addEventListener('input', function() {
  var vol = volumeSlider.value / 100;
  bgMusic.volume = vol;
  if (vol === 0) {
    volumeIcon.textContent = '🔇';
  } else if (vol < 0.5) {
    volumeIcon.textContent = '🔉';
  } else {
    volumeIcon.textContent = '🔊';
  }
});

volumeIcon.addEventListener('click', function() {
  if (bgMusic.volume > 0) {
    bgMusic.volume = 0;
    volumeSlider.value = 0;
    volumeIcon.textContent = '🔇';
  } else {
    bgMusic.volume = 0.5;
    volumeSlider.value = 50;
    volumeIcon.textContent = '🔊';
  }
});

// 点击问号 — 显示本期奖品列表及概率
helpIcon.addEventListener('click', function() {
  prizeListGrid.innerHTML = '';
  prizes.forEach(function(prize) {
    var item = document.createElement('div');
    item.className = 'prize-list-item';
    item.innerHTML =
      '<img src="' + prize.image + '" alt="' + prize.name + '">' +
      '<span>' + prize.name + '</span>' +
      '<span class="rarity-tag ' + rarityClass[prize.rarity] + '">' + prize.rarity + '</span>' +
      '<span class="chance-text">' + prize.label + '</span>';
    prizeListGrid.appendChild(item);
  });
  prizeListModal.classList.add('show');
});

// 关闭奖品列表弹窗
prizeListCloseBtn.addEventListener('click', function() {
  prizeListModal.classList.remove('show');
});

prizeListModal.addEventListener('click', function(e) {
  if (e.target === prizeListModal) {
    prizeListModal.classList.remove('show');
  }
});

// 点击历史记录图标 — 显示抽奖历史
historyIcon.addEventListener('click', function() {
  historyList.innerHTML = '';

  // 统计信息
  var totalDraws = drawHistory.length;
  var legendCount = 0;
  var mysteryCount = 0;
  var epicCount = 0;
  var rareCount = 0;
  var commonCount = 0;
  for (var i = 0; i < drawHistory.length; i++) {
    if (drawHistory[i].rarity === '神秘') mysteryCount++;
    else if (drawHistory[i].rarity === '传说') legendCount++;
    else if (drawHistory[i].rarity === '史诗') epicCount++;
    else if (drawHistory[i].rarity === '稀有') rareCount++;
    else commonCount++;
  }

  historyStats.innerHTML =
    '<div class="stat-item"><span class="stat-label">总抽数</span><span class="stat-value">' + totalDraws + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">神秘</span><span class="stat-value">' + mysteryCount + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">传说</span><span class="stat-value">' + legendCount + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">史诗</span><span class="stat-value">' + epicCount + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">稀有</span><span class="stat-value">' + rareCount + '</span></div>' +
    '<div class="stat-item"><span class="stat-label">普通</span><span class="stat-value">' + commonCount + '</span></div>';

  if (totalDraws === 0) {
    historyList.innerHTML = '<p class="history-empty">暂无记录，快去掏鸟窝吧！</p>';
  } else {
    // 倒序显示（最新的在前）
    for (var j = drawHistory.length - 1; j >= 0; j--) {
      var record = drawHistory[j];
      var item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML =
        '<img class="history-item-img" src="' + record.image + '" alt="' + record.name + '">' +
        '<div class="history-item-info">' +
          '<span class="history-item-name">' + record.name + '</span>' +
          '<span class="history-item-rarity ' + rarityClass[record.rarity] + '">' + record.rarity + '</span>' +
        '</div>' +
        '<span class="history-item-num">#' + record.num + '</span>';
      historyList.appendChild(item);
    }
  }

  historyModal.classList.add('show');
});

// 关闭历史记录弹窗
historyCloseBtn.addEventListener('click', function() {
  historyModal.classList.remove('show');
});

historyModal.addEventListener('click', function(e) {
  if (e.target === historyModal) {
    historyModal.classList.remove('show');
  }
});
