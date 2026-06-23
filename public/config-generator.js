(function() {
  var STORAGE_KEY = 'mcloud_sign_config';
  var accounts = [];
  var accountCounter = 0;
  var isUpdatingFromJSON = false;
  var isUpdatingFromForm = false;

  function getDefaultConfig() {
    return {
      shake: { enable: true, num: 6, delay: 2 },
      backupWaitTime: 20,
      tasks: { skipTasks: [], '每月上传任务单日数量': 5 },
      catalog: '/',
      '是否打印今日云朵': true,
      '剩余多少天刷新token': 10,
      '微信抽奖': { '次数': 1, '间隔': 500 },
      'AI新头像': { '开启': false, '每日生成次数': 5 },
      '红包派对': { '开启': false },
      '云朵大作战': { '开启': false, '目标排名': 500, '开启兑换': false, '邀请用户': [], '游戏时间': 300 },
      '春日拍拍大作战': { '开启': false }
    };
  }

  function mergeConfig(defaults, user) {
    var result = {};
    for (var key in defaults) {
      if (user && user.hasOwnProperty(key)) {
        if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
          result[key] = mergeConfig(defaults[key], user[key] || {});
        } else {
          result[key] = user[key];
        }
      } else {
        result[key] = defaults[key];
      }
    }
    return result;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function hasValidAuth(account) {
    return account.auth && account.auth.trim().length > 0;
  }

  function saveToStorage() {
    try {
      var data = { accounts: accounts, counter: accountCounter };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function loadFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (data.accounts && Array.isArray(data.accounts)) {
        accounts = data.accounts;
        accountCounter = data.counter || accounts.length;
        return true;
      }
    } catch (e) {}
    return false;
  }

  function updateAuthStatus(id) {
    var account = accounts.find(function(a) { return a.id === id; });
    if (!account) return;
    var el = document.getElementById('auth-status-' + id);
    var input = document.getElementById('auth-' + id);
    if (el) el.innerHTML = hasValidAuth(account) ? '' : ' <span style="color:#e53e3e;font-size:12px;">(未填写auth)</span>';
    if (input) input.style.borderColor = account.auth ? '' : '#e53e3e';
  }

  function updateFormFromAccount(account) {
    var authInput = document.getElementById('auth-' + account.id);
    var nickInput = document.getElementById('nick-' + account.id);
    if (authInput) {
      authInput.value = account.auth;
      authInput.style.borderColor = account.auth ? '' : '#e53e3e';
    }
    if (nickInput) nickInput.value = account.nickname;
    updateAuthStatus(account.id);

    var c = account.config;
    var fields = [
      ['shake-enable-' + account.id, c.shake.enable ? 'true' : 'false'],
      ['shake-num-' + account.id, c.shake.num],
      ['shake-delay-' + account.id, c.shake.delay],
      ['tasks-upload-' + account.id, c.tasks['每月上传任务单日数量']],
      ['tasks-skip-' + account.id, (c.tasks.skipTasks || []).join(',')],
      ['lottery-num-' + account.id, c['微信抽奖']['次数']],
      ['lottery-interval-' + account.id, c['微信抽奖']['间隔']],
      ['avatar-enable-' + account.id, c['AI新头像']['开启'] ? 'true' : 'false'],
      ['avatar-daily-' + account.id, c['AI新头像']['每日生成次数']],
      ['redpacket-enable-' + account.id, c['红包派对']['开启'] ? 'true' : 'false'],
      ['battle-enable-' + account.id, c['云朵大作战']['开启'] ? 'true' : 'false'],
      ['battle-rank-' + account.id, c['云朵大作战']['目标排名']],
      ['battle-exchange-' + account.id, c['云朵大作战']['开启兑换'] ? 'true' : 'false'],
      ['battle-time-' + account.id, c['云朵大作战']['游戏时间']],
      ['battle-invite-' + account.id, (c['云朵大作战']['邀请用户'] || []).join(',')],
      ['spring-enable-' + account.id, c['春日拍拍大作战']['开启'] ? 'true' : 'false']
    ];
    fields.forEach(function(pair) {
      var el = document.getElementById(pair[0]);
      if (el) el.value = pair[1];
    });
  }

  window._addAccount = function() {
    var id = ++accountCounter;
    accounts.push({ id: id, auth: '', nickname: '', config: getDefaultConfig() });
    renderAccounts();
    updateJSON();
    saveToStorage();
  };

  window._removeAccount = function(id) {
    accounts = accounts.filter(function(a) { return a.id !== id; });
    renderAccounts();
    updateJSON();
    saveToStorage();
  };

  window._updateAccount = function(id, field, value) {
    if (isUpdatingFromJSON) return;
    isUpdatingFromForm = true;
    var account = accounts.find(function(a) { return a.id === id; });
    if (account) {
      account[field] = value;
      if (field === 'auth') updateAuthStatus(id);
      updateJSON();
      saveToStorage();
    }
    isUpdatingFromForm = false;
  };

  window._updateConfig = function(id, path, value) {
    if (isUpdatingFromJSON) return;
    isUpdatingFromForm = true;
    var account = accounts.find(function(a) { return a.id === id; });
    if (!account) return;
    var parts = path.split('.');
    var obj = account.config;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    updateJSON();
    saveToStorage();
    isUpdatingFromForm = false;
  };

  function renderAccounts() {
    var container = document.getElementById('accountsList');
    if (!container) return;
    
    var html = '';
    for (var i = 0; i < accounts.length; i++) {
      var a = accounts[i];
      var c = a.config;
      var authValid = hasValidAuth(a);
      
      html += '<div class="account-item">';
      html += '<div class="account-header">';
      html += '<span class="account-title">账号 ' + (i + 1) + '<span id="auth-status-' + a.id + '">' + (authValid ? '' : ' <span style="color:#e53e3e;font-size:12px;">(未填写auth)</span>') + '</span></span>';
      html += '<button class="btn btn-danger btn-sm" onclick="window._removeAccount(' + a.id + ')">删除</button>';
      html += '</div>';
      
      html += '<div class="form-row">';
      html += '<div class="form-group"><label>auth (必填)</label>';
      html += '<input id="auth-' + a.id + '" type="text" value="' + escapeHtml(a.auth) + '" oninput="window._updateAccount(' + a.id + ',\'auth\',this.value)" placeholder="输入 authorization 值"' + (!a.auth ? ' style="border-color:#e53e3e;"' : '') + '></div>';
      html += '<div class="form-group"><label>nickname (可选)</label>';
      html += '<input id="nick-' + a.id + '" type="text" value="' + escapeHtml(a.nickname) + '" oninput="window._updateAccount(' + a.id + ',\'nickname\',this.value)" placeholder="用于区分多账号"></div>';
      html += '</div>';
      
      html += '<details><summary>展开高级配置</summary>';
      
      html += '<div class="section"><div class="section-title">摇一摇配置</div>';
      html += '<div class="form-row">';
      html += '<div class="form-group"><label>开启</label>';
      html += '<select id="shake-enable-' + a.id + '" onchange="window._updateConfig(' + a.id + ',\'shake.enable\',this.value===\'true\')">';
      html += '<option value="true"' + (c.shake.enable ? ' selected' : '') + '>开启</option>';
      html += '<option value="false"' + (!c.shake.enable ? ' selected' : '') + '>关闭</option></select></div>';
      html += '<div class="form-group"><label>次数 (0-100)</label>';
      html += '<input id="shake-num-' + a.id + '" type="number" min="0" max="100" value="' + c.shake.num + '" oninput="window._updateConfig(' + a.id + ',\'shake.num\',parseInt(this.value))"></div>';
      html += '</div>';
      html += '<div class="form-row full"><div class="form-group"><label>间隔时间 (秒)</label>';
      html += '<input id="shake-delay-' + a.id + '" type="number" min="1" max="60" value="' + c.shake.delay + '" oninput="window._updateConfig(' + a.id + ',\'shake.delay\',parseInt(this.value))"></div></div>';
      html += '</div>';
      
      html += '<div class="section"><div class="section-title">任务配置</div>';
      html += '<div class="form-row">';
      html += '<div class="form-group"><label>每月上传任务单日数量</label>';
      html += '<input id="tasks-upload-' + a.id + '" type="number" min="1" max="99" value="' + c.tasks['每月上传任务单日数量'] + '" oninput="window._updateConfig(' + a.id + ',\'tasks.每月上传任务单日数量\',parseInt(this.value))"></div>';
      html += '<div class="form-group"><label>跳过的任务ID (逗号分隔)</label>';
      html += '<input id="tasks-skip-' + a.id + '" type="text" placeholder="如: 585,586" onchange="window._updateConfig(' + a.id + ',\'tasks.skipTasks\',this.value.split(\',\').filter(Boolean).map(Number))"></div>';
      html += '</div></div>';
      
      html += '<div class="section"><div class="section-title">微信抽奖配置</div>';
      html += '<div class="form-row">';
      html += '<div class="form-group"><label>次数 (0-50)</label>';
      html += '<input id="lottery-num-' + a.id + '" type="number" min="0" max="50" value="' + c['微信抽奖']['次数'] + '" oninput="window._updateConfig(' + a.id + ',\'微信抽奖.次数\',parseInt(this.value))"></div>';
      html += '<div class="form-group"><label>间隔 (毫秒)</label>';
      html += '<input id="lottery-interval-' + a.id + '" type="number" min="100" max="5000" value="' + c['微信抽奖']['间隔'] + '" oninput="window._updateConfig(' + a.id + ',\'微信抽奖.间隔\',parseInt(this.value))"></div>';
      html += '</div></div>';
      
      html += '<div class="section"><div class="section-title">AI新头像配置</div>';
      html += '<div class="form-row">';
      html += '<div class="form-group"><label>开启</label>';
      html += '<select id="avatar-enable-' + a.id + '" onchange="window._updateConfig(' + a.id + ',\'AI新头像.开启\',this.value===\'true\')">';
      html += '<option value="false"' + (!c['AI新头像']['开启'] ? ' selected' : '') + '>关闭</option>';
      html += '<option value="true"' + (c['AI新头像']['开启'] ? ' selected' : '') + '>开启</option></select></div>';
      html += '<div class="form-group"><label>每日生成次数</label>';
      html += '<input id="avatar-daily-' + a.id + '" type="number" min="1" max="20" value="' + c['AI新头像']['每日生成次数'] + '" oninput="window._updateConfig(' + a.id + ',\'AI新头像.每日生成次数\',parseInt(this.value))"></div>';
      html += '</div></div>';
      
      html += '<div class="section"><div class="section-title">红包派对配置</div>';
      html += '<div class="form-row full"><div class="form-group"><label>开启</label>';
      html += '<select id="redpacket-enable-' + a.id + '" onchange="window._updateConfig(' + a.id + ',\'红包派对.开启\',this.value===\'true\')">';
      html += '<option value="false"' + (!c['红包派对']['开启'] ? ' selected' : '') + '>关闭</option>';
      html += '<option value="true"' + (c['红包派对']['开启'] ? ' selected' : '') + '>开启</option></select></div></div></div>';
      
      html += '<div class="section"><div class="section-title">云朵大作战配置</div>';
      html += '<div class="form-row">';
      html += '<div class="form-group"><label>开启</label>';
      html += '<select id="battle-enable-' + a.id + '" onchange="window._updateConfig(' + a.id + ',\'云朵大作战.开启\',this.value===\'true\')">';
      html += '<option value="false"' + (!c['云朵大作战']['开启'] ? ' selected' : '') + '>关闭</option>';
      html += '<option value="true"' + (c['云朵大作战']['开启'] ? ' selected' : '') + '>开启</option></select></div>';
      html += '<div class="form-group"><label>目标排名</label>';
      html += '<input id="battle-rank-' + a.id + '" type="number" min="1" value="' + c['云朵大作战']['目标排名'] + '" oninput="window._updateConfig(' + a.id + ',\'云朵大作战.目标排名\',parseInt(this.value))"></div>';
      html += '</div>';
      html += '<div class="form-row">';
      html += '<div class="form-group"><label>开启兑换</label>';
      html += '<select id="battle-exchange-' + a.id + '" onchange="window._updateConfig(' + a.id + ',\'云朵大作战.开启兑换\',this.value===\'true\')">';
      html += '<option value="false"' + (!c['云朵大作战']['开启兑换'] ? ' selected' : '') + '>关闭</option>';
      html += '<option value="true"' + (c['云朵大作战']['开启兑换'] ? ' selected' : '') + '>开启</option></select></div>';
      html += '<div class="form-group"><label>游戏时间 (秒)</label>';
      html += '<input id="battle-time-' + a.id + '" type="number" min="60" max="600" value="' + c['云朵大作战']['游戏时间'] + '" oninput="window._updateConfig(' + a.id + ',\'云朵大作战.游戏时间\',parseInt(this.value))"></div>';
      html += '</div>';
      html += '<div class="form-row full"><div class="form-group"><label>邀请用户 (手机号逗号分隔)</label>';
      html += '<input id="battle-invite-' + a.id + '" type="text" placeholder="如: 13800138000" onchange="window._updateConfig(' + a.id + ',\'云朵大作战.邀请用户\',this.value.split(\',\').filter(Boolean))"></div></div>';
      html += '</div>';
      
      html += '<div class="section"><div class="section-title">春日拍拍大作战配置</div>';
      html += '<div class="form-row full"><div class="form-group"><label>开启</label>';
      html += '<select id="spring-enable-' + a.id + '" onchange="window._updateConfig(' + a.id + ',\'春日拍拍大作战.开启\',this.value===\'true\')">';
      html += '<option value="false"' + (!c['春日拍拍大作战']['开启'] ? ' selected' : '') + '>关闭</option>';
      html += '<option value="true"' + (c['春日拍拍大作战']['开启'] ? ' selected' : '') + '>开启</option></select></div></div></div>';
      
      html += '</details></div>';
    }
    container.innerHTML = html;
  }

  function getEditorValue() {
    return window._jsonEditor ? window._jsonEditor.getValue() : '';
  }

  function setEditorValue(text) {
    if (window._jsonEditor) {
      window._jsonEditor.setValue(text);
    }
  }

  function updateJSON() {
    var validAccounts = accounts.filter(hasValidAuth);
    
    var config = { caiyun: validAccounts.map(function(account) {
      var result = {};
      result.auth = account.auth;
      if (account.nickname) result.nickname = account.nickname;
      
      var defaultCfg = getDefaultConfig();
      var userCfg = account.config;
      
      Object.keys(userCfg).forEach(function(key) {
        if (JSON.stringify(userCfg[key]) !== JSON.stringify(defaultCfg[key])) {
          result[key] = userCfg[key];
        }
      });
      
      return result;
    })};
    
    if (!isUpdatingFromJSON) {
      setEditorValue(JSON.stringify(config, null, 2));
    }
    
    var countEl = document.getElementById('accountCount');
    if (countEl) {
      countEl.textContent = validAccounts.length + '/' + accounts.length;
    }
  }

  function syncFromJSON() {
    if (isUpdatingFromForm) return;
    isUpdatingFromJSON = true;
    
    var jsonStr = getEditorValue().trim();
    
    if (!jsonStr) {
      isUpdatingFromJSON = false;
      return;
    }
    
    try {
      var config = JSON.parse(jsonStr);
      importFromJSON(config);
    } catch (e) {
    }
    
    isUpdatingFromJSON = false;
  }

  function importFromJSON(config) {
    accounts = [];
    accountCounter = 0;
    
    var caiyunList = config.caiyun || [];
    if (!Array.isArray(caiyunList)) {
      caiyunList = [caiyunList];
    }
    
    caiyunList.forEach(function(item) {
      var id = ++accountCounter;
      var defaultCfg = getDefaultConfig();
      var nickname = item.nickname || '';
      var mergedConfig = mergeConfig(defaultCfg, item);
      
      accounts.push({
        id: id,
        auth: item.auth || '',
        nickname: nickname,
        config: mergedConfig
      });
    });
    
    renderAccounts();
    saveToStorage();
  }

  window._copyConfig = function() {
    var text = getEditorValue() || '';
    if (text === '{"caiyun": []}' || text.includes('"caiyun": []')) {
      alert('请至少填写一个账号的 auth');
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      alert('配置已复制到剪贴板！');
    });
  };

  document.getElementById('addAccountBtn').addEventListener('click', window._addAccount);
  document.getElementById('copyBtn').addEventListener('click', window._copyConfig);

  function setupEditor() {
    if (window._jsonEditor) {
      window._jsonEditor.onDidChangeModelContent(function() {
        syncFromJSON();
      });
    }
  }

  if (_editorReady) {
    setupEditor();
  } else {
    window._onEditorReady = setupEditor;
  }

  if (!loadFromStorage()) {
    window._addAccount();
  } else {
    renderAccounts();
    updateJSON();
  }
})();
