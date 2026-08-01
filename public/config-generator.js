(function() {
  var STORAGE_KEY = 'mcloud_sign_config_v2';
  var state = {
    common: {},
    accounts: [],
    message: {}
  };
  var editorReady = false;
  var updatingEditor = false;
  var nextAccountId = 0;

  function defaultAccount() {
    return {
      id: ++nextAccountId,
      auth: '',
      nickname: '',
      backupWaitTime: 20,
      tasks: { skipTasks: [], '每月上传任务单日数量': 5 },
      '是否打印今日云朵': true,
      '剩余多少天刷新token': 10,
      'AI新头像': { '开启': false, '每日生成次数': 10 },
      '红包派对': { '开启': true },
      '云朵大作战': {
        '开启': false,
        '邀请用户': [],
        '游戏时间': 300,
        '目标排名': 500,
        '开启兑换': false
      },
      '春日拍拍大作战': { '开启': true },
      '直播口令': { '开启': false },
      mail139: {
        aiChatMessage: '你好',
        sendMailTo: '',
        sendMailSubject: '',
        sendMailContent: ''
      }
    };
  }

  function defaultMessage() {
    return {
      title: 'mcloud-v2 运行推送',
      onlyError: false,
      minLevel: 'info',
      pushplus: { token: '' },
      serverChan: { token: '' },
      workWeixin: { corpid: '', corpsecret: '', agentid: '', touser: '@all', msgtype: 'text' },
      workWeixinBot: { url: '', msgtype: 'text' },
      tgBot: { token: '', chat_id: '', apiHost: 'api.telegram.org' },
      bark: { key: '', level: 'passive' },
      dingTalk: { token: '', secret: '' },
      email: { host: '', port: 465, from: '', pass: '', to: '' },
      twoIm: { key: '', sid: '', msgtype: 'text' },
      customPost: { url: '', method: 'POST', headers: '{}', data: '{}' }
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function merge(defaults, value) {
    var result = clone(defaults);
    if (!value || typeof value !== 'object') return result;
    Object.keys(value).forEach(function(key) {
      if (value[key] && typeof value[key] === 'object' && !Array.isArray(value[key]) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = merge(result[key], value[key]);
      } else {
        result[key] = value[key];
      }
    });
    return result;
  }

  function getPath(object, path) {
    return path.split('.').reduce(function(current, key) { return current && current[key]; }, object);
  }

  function setPath(object, path, value) {
    var parts = path.split('.');
    var current = object;
    parts.slice(0, -1).forEach(function(key) {
      if (!current[key] || typeof current[key] !== 'object') current[key] = {};
      current = current[key];
    });
    current[parts[parts.length - 1]] = value;
  }

  function compactObject(value) {
    if (Array.isArray(value)) return value.map(compactObject);
    if (!value || typeof value !== 'object') return value;
    var result = {};
    Object.keys(value).forEach(function(key) {
      var item = compactObject(value[key]);
      if (item === '' || item === undefined || item === null) return;
      if (Array.isArray(item) && item.length === 0) return;
      if (typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length === 0) return;
      result[key] = item;
    });
    return result;
  }

  function accountForOutput(account) {
    var output = clone(account);
    delete output.id;
    return compactObject(output);
  }

  function parseJsonObject(text) {
    if (!String(text || '').trim()) return {};
    var value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('必须是 JSON 对象');
    return value;
  }

  function buildConfig() {
    var config = {
      version: 2,
      caiyun: state.accounts.filter(function(account) { return account.auth.trim(); }).map(accountForOutput)
    };
    var common = compactObject(state.common);
    if (Object.keys(common).length) config.common = common;

    var message = {};
    var m = state.message;
    if (m.title && m.title !== 'mcloud-v2 运行推送') message.title = m.title;
    if (m.onlyError) message.onlyError = true;
    if (m.minLevel && m.minLevel !== 'info') message.minLevel = m.minLevel;
    if (m.pushplus.token) message.pushplus = { token: m.pushplus.token };
    if (m.serverChan.token) message.serverChan = { token: m.serverChan.token };
    if (m.workWeixin.corpid && m.workWeixin.corpsecret) {
      message.workWeixin = compactObject({
        corpid: m.workWeixin.corpid,
        corpsecret: m.workWeixin.corpsecret,
        agentid: m.workWeixin.agentid === '' ? undefined : Number(m.workWeixin.agentid),
        touser: m.workWeixin.touser,
        msgtype: m.workWeixin.msgtype
      });
    }
    if (m.workWeixinBot.url) message.workWeixinBot = compactObject(m.workWeixinBot);
    if (m.tgBot.token && m.tgBot.chat_id !== '') message.tgBot = compactObject(m.tgBot);
    if (m.bark.key) message.bark = compactObject(m.bark);
    if (m.dingTalk.token) message.dingTalk = compactObject(m.dingTalk);
    if (m.email.host && m.email.from && m.email.pass) message.email = compactObject(m.email);
    if (m.twoIm.key && m.twoIm.sid) message.twoIm = compactObject(m.twoIm);
    if (m.customPost.url) {
      message.customPost = compactObject({
        url: m.customPost.url,
        method: m.customPost.method,
        headers: parseJsonObject(m.customPost.headers),
        data: parseJsonObject(m.customPost.data)
      });
    }
    if (Object.keys(message).length) config.message = message;
    return config;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function load() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!stored) return false;
      state.common = stored.common || {};
      state.message = merge(defaultMessage(), stored.message || {});
      state.accounts = (stored.accounts || []).map(function(account) {
        var merged = merge(defaultAccount(), account);
        merged.id = ++nextAccountId;
        return merged;
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  function renderCommon() {
    var c = state.common;
    document.getElementById('commonForm').innerHTML =
      '<div class="section-title">通用配置（覆盖所有账号默认值）</div>' +
      '<div class="form-row">' +
      field('备份等待时间（秒）', 'common', 'backupWaitTime', c.backupWaitTime == null ? '' : c.backupWaitTime, 'number') +
      field('默认备份目录', 'common', 'catalog', c.catalog || '', 'text') +
      selectField('打印今日云朵', 'common', '是否打印今日云朵', c['是否打印今日云朵'], [['', '自动'], ['true', '是'], ['false', '否']]) +
      field('提前刷新 token（天）', 'common', '剩余多少天刷新token', c['剩余多少天刷新token'] == null ? '' : c['剩余多少天刷新token'], 'number') +
      selectField('彩色输出', 'common', 'colorize', c.colorize, [['', '自动检测'], ['true', '开启'], ['false', '关闭']]) +
      '</div>';
  }

  function field(label, scope, path, value, type, extra) {
    return '<div class="form-group"><label>' + label + '</label><input type="' + (type || 'text') + '" value="' + escapeHtml(value) + '" ' + (extra || '') + ' onchange="window.mcloudSet(\'' + scope + '\',\'' + path + '\',this.value,\'' + (type || 'text') + '\')"></div>';
  }

  function textareaField(label, scope, path, value) {
    return '<div class="form-group"><label>' + label + '</label><textarea onchange="window.mcloudSet(\'' + scope + '\',\'' + path + '\',this.value,\'text\')">' + escapeHtml(value) + '</textarea></div>';
  }

  function selectField(label, scope, path, value, options) {
    var current = value === undefined ? '' : String(value);
    return '<div class="form-group"><label>' + label + '</label><select onchange="window.mcloudSet(\'' + scope + '\',\'' + path + '\',this.value,\'select\')">' + options.map(function(option) {
      return '<option value="' + option[0] + '"' + (current === option[0] ? ' selected' : '') + '>' + option[1] + '</option>';
    }).join('') + '</select></div>';
  }

  function renderAccounts() {
    var html = '<div class="section-title">账号配置</div>';
    state.accounts.forEach(function(a, index) {
      var scope = 'account:' + a.id;
      html += '<article class="account-item"><div class="account-header"><div class="account-title">账号 ' + (index + 1) + (a.auth ? '' : ' <span class="status">未填写 auth</span>') + '</div><button class="danger small" onclick="window.mcloudRemoveAccount(' + a.id + ')">删除</button></div>';
      html += '<div class="form-row">' + field('auth（必填）', scope, 'auth', a.auth, 'text') + field('nickname', scope, 'nickname', a.nickname, 'text') + '</div>';
      html += '<details><summary>高级配置</summary>';
      html += '<div class="section"><div class="section-title">任务与账号行为</div><div class="form-row">' +
        field('备份等待时间（秒）', scope, 'backupWaitTime', a.backupWaitTime, 'number') +
        field('跳过任务 ID（逗号分隔）', scope, 'tasks.skipTasks', a.tasks.skipTasks.join(','), 'text') +
        field('每月上传任务单日数量', scope, 'tasks.每月上传任务单日数量', a.tasks['每月上传任务单日数量'], 'number') +
        selectField('打印今日云朵', scope, '是否打印今日云朵', a['是否打印今日云朵'], [['true', '是'], ['false', '否']]) +
        field('提前刷新 token（天）', scope, '剩余多少天刷新token', a['剩余多少天刷新token'], 'number') +
        '</div></div>';
      html += '<div class="section"><div class="section-title">活动开关</div><div class="form-row">' +
        selectField('AI 新头像（业务暂未实现）', scope, 'AI新头像.开启', a['AI新头像']['开启'], [['false', '关闭'], ['true', '开启']]) +
        field('AI 新头像每日次数', scope, 'AI新头像.每日生成次数', a['AI新头像']['每日生成次数'], 'number') +
        selectField('红包派对', scope, '红包派对.开启', a['红包派对']['开启'], [['true', '开启'], ['false', '关闭']]) +
        selectField('拍拍系列活动', scope, '春日拍拍大作战.开启', a['春日拍拍大作战']['开启'], [['true', '开启'], ['false', '关闭']]) +
        selectField('直播口令自动领取', scope, '直播口令.开启', a['直播口令']['开启'], [['false', '关闭'], ['true', '开启']]) +
        '</div></div>';
      html += '<div class="section"><div class="section-title">云朵大作战</div><div class="form-row">' +
        selectField('开启', scope, '云朵大作战.开启', a['云朵大作战']['开启'], [['false', '关闭'], ['true', '开启']]) +
        field('目标排名', scope, '云朵大作战.目标排名', a['云朵大作战']['目标排名'], 'number') +
        selectField('开启兑换', scope, '云朵大作战.开启兑换', a['云朵大作战']['开启兑换'], [['false', '关闭'], ['true', '开启']]) +
        field('游戏时间（秒）', scope, '云朵大作战.游戏时间', a['云朵大作战']['游戏时间'], 'number') +
        field('邀请用户（逗号分隔）', scope, '云朵大作战.邀请用户', a['云朵大作战']['邀请用户'].join(','), 'text') +
        '</div></div>';
      html += '<div class="section"><div class="section-title">139 邮箱任务</div><div class="form-row">' +
        field('AI 对话消息', scope, 'mail139.aiChatMessage', a.mail139.aiChatMessage, 'text') +
        field('收件人', scope, 'mail139.sendMailTo', a.mail139.sendMailTo, 'email') +
        field('邮件主题', scope, 'mail139.sendMailSubject', a.mail139.sendMailSubject, 'text') +
        textareaField('邮件正文', scope, 'mail139.sendMailContent', a.mail139.sendMailContent) +
        '</div></div>';
      html += '</details></article>';
    });
    document.getElementById('accountsList').innerHTML = html;
  }

  function renderMessage() {
    var m = state.message;
    var scope = 'message';
    document.getElementById('messageForm').innerHTML =
      '<div class="section-title">消息推送</div><div class="form-row">' +
      field('推送标题', scope, 'title', m.title, 'text') +
      selectField('仅运行错误时推送', scope, 'onlyError', m.onlyError, [['false', '否'], ['true', '是']]) +
      selectField('内容最低级别', scope, 'minLevel', m.minLevel, [['error', 'error'], ['warn', 'warn'], ['info', 'info'], ['debug', 'debug']]) +
      '</div><details><summary>推送渠道</summary>' +
      channel('PushPlus', field('Token', scope, 'pushplus.token', m.pushplus.token, 'text')) +
      channel('Server酱', field('SendKey', scope, 'serverChan.token', m.serverChan.token, 'text')) +
      channel('Telegram Bot', '<div class="form-row">' + field('Token', scope, 'tgBot.token', m.tgBot.token, 'text') + field('Chat ID', scope, 'tgBot.chat_id', m.tgBot.chat_id, 'text') + field('API Host', scope, 'tgBot.apiHost', m.tgBot.apiHost, 'text') + '</div>') +
      channel('Bark', '<div class="form-row">' + field('Key', scope, 'bark.key', m.bark.key, 'text') + selectField('通知级别', scope, 'bark.level', m.bark.level, [['passive', 'passive'], ['timeSensitive', 'timeSensitive'], ['active', 'active']]) + '</div>') +
      channel('企业微信应用', '<div class="form-row">' + field('Corp ID', scope, 'workWeixin.corpid', m.workWeixin.corpid, 'text') + field('Corp Secret', scope, 'workWeixin.corpsecret', m.workWeixin.corpsecret, 'password') + field('Agent ID', scope, 'workWeixin.agentid', m.workWeixin.agentid, 'number') + field('接收人', scope, 'workWeixin.touser', m.workWeixin.touser, 'text') + '</div>') +
      channel('企业微信机器人', field('Webhook URL', scope, 'workWeixinBot.url', m.workWeixinBot.url, 'url')) +
      channel('钉钉', '<div class="form-row">' + field('Token', scope, 'dingTalk.token', m.dingTalk.token, 'text') + field('Secret', scope, 'dingTalk.secret', m.dingTalk.secret, 'password') + '</div>') +
      channel('邮件（Node.js 运行时）', '<div class="form-row">' + field('SMTP Host', scope, 'email.host', m.email.host, 'text') + field('Port', scope, 'email.port', m.email.port, 'number') + field('发件人', scope, 'email.from', m.email.from, 'email') + field('授权码', scope, 'email.pass', m.email.pass, 'password') + field('收件人', scope, 'email.to', m.email.to, 'email') + '</div>') +
      channel('回逍 TwoIm', '<div class="form-row">' + field('Key', scope, 'twoIm.key', m.twoIm.key, 'text') + field('SID', scope, 'twoIm.sid', m.twoIm.sid, 'text') + '</div>') +
      channel('自定义请求', '<div class="form-row">' + field('URL', scope, 'customPost.url', m.customPost.url, 'url') + selectField('Method', scope, 'customPost.method', m.customPost.method, [['GET', 'GET'], ['POST', 'POST'], ['PUT', 'PUT']]) + textareaField('Headers（JSON 对象）', scope, 'customPost.headers', m.customPost.headers) + textareaField('Data（JSON 对象）', scope, 'customPost.data', m.customPost.data) + '</div>') +
      '</details>';
  }

  function channel(title, content) {
    return '<div class="section"><div class="section-title">' + title + '</div>' + content + '</div>';
  }

  function render() {
    renderCommon();
    renderAccounts();
    renderMessage();
    updateEditor();
  }

  function updateEditor() {
    if (!editorReady || updatingEditor) return;
    try {
      var config = buildConfig();
      updatingEditor = true;
      window._jsonEditor.setValue(JSON.stringify(config, null, 2));
      document.getElementById('accountCount').textContent = '(' + config.caiyun.length + '/' + state.accounts.length + ')';
    } catch (error) {
      console.warn(error);
    } finally {
      updatingEditor = false;
    }
  }

  function importConfig(config) {
    if (!config || config.version !== 2 || !Array.isArray(config.caiyun)) throw new Error('仅支持 version 为 2 且包含 caiyun 数组的配置');
    state.common = config.common || {};
    state.message = merge(defaultMessage(), config.message || {});
    if (config.message && config.message.customPost && !Array.isArray(config.message.customPost)) {
      state.message.customPost.headers = JSON.stringify(config.message.customPost.headers || {}, null, 2);
      state.message.customPost.data = JSON.stringify(config.message.customPost.data || {}, null, 2);
    }
    state.accounts = config.caiyun.map(function(account) {
      var merged = merge(defaultAccount(), account);
      merged.id = ++nextAccountId;
      return merged;
    });
    if (!state.accounts.length) state.accounts.push(defaultAccount());
    save();
    render();
  }

  window.mcloudSet = function(scope, path, rawValue, type) {
    var value = rawValue;
    if (type === 'number') value = rawValue === '' ? undefined : Number(rawValue);
    if (type === 'select' && (rawValue === 'true' || rawValue === 'false')) value = rawValue === 'true';
    if (scope === 'common' && rawValue === '') value = undefined;
    if (path === 'tasks.skipTasks') value = rawValue.split(',').map(Number).filter(Number.isFinite);
    if (path === '云朵大作战.邀请用户') value = rawValue.split(',').map(function(item) { return item.trim(); }).filter(Boolean);
    var target;
    if (scope === 'common') target = state.common;
    else if (scope === 'message') target = state.message;
    else target = state.accounts.find(function(account) { return account.id === Number(scope.split(':')[1]); });
    if (!target) return;
    setPath(target, path, value);
    save();
    render();
  };

  window.mcloudRemoveAccount = function(id) {
    state.accounts = state.accounts.filter(function(account) { return account.id !== id; });
    if (!state.accounts.length) state.accounts.push(defaultAccount());
    save();
    render();
  };

  document.getElementById('addAccountBtn').addEventListener('click', function() {
    state.accounts.push(defaultAccount());
    save();
    render();
  });

  document.getElementById('copyBtn').addEventListener('click', function() {
    navigator.clipboard.writeText(window._jsonEditor.getValue()).then(function() { alert('配置已复制'); });
  });

  document.getElementById('exportBtn').addEventListener('click', function() {
    var blob = new Blob([window._jsonEditor.getValue()], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'asign.json';
    anchor.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importFileBtn').addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function(event) {
      var file = event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function() {
        try { importConfig(JSON.parse(reader.result)); }
        catch (error) { alert('导入失败：' + error.message); }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  document.getElementById('clearBtn').addEventListener('click', function() {
    if (!confirm('确定清除浏览器中保存的配置吗？')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = { common: {}, accounts: [defaultAccount()], message: defaultMessage() };
    render();
  });

  window.addEventListener('mcloud-editor-ready', function() {
    editorReady = true;
    window._jsonEditor.onDidChangeModelContent(function() {
      if (updatingEditor) return;
      try {
        importConfig(JSON.parse(window._jsonEditor.getValue()));
      } catch (_) {
        // 编辑中的无效 JSON 由 Monaco 诊断，不覆盖表单状态。
      }
    });
    updateEditor();
  });

  if (!load()) {
    state.accounts = [defaultAccount()];
    state.message = defaultMessage();
  } else if (!state.accounts.length) {
    state.accounts = [defaultAccount()];
  }
  if (!Object.keys(state.message).length) state.message = defaultMessage();
  render();
})();
