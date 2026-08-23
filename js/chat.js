// Public chat + report
function openChat() {
  let html = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>💬 Chat cộng đồng</h2>
    <div class="chat-box" id="chatBox"></div>
    <div class="chat-input-row">
      <input id="chatInput" placeholder="Nhập tin nhắn..." maxlength="200" onkeydown="if(event.key==='Enter')sendChat()" />
      <button onclick="sendChat()">Gửi</button>
    </div>`;
  if (isAdmin) html += `<p style="font-size:0.75rem;color:#c62828;margin-top:8px;text-align:center">Admin có thể xóa tin nhắn</p>`;
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');

  const box = document.getElementById('chatBox');
  box.innerHTML = '<p style="text-align:center;color:#888">Đang tải…</p>';

  db.ref('chat').orderByChild('time').limitToLast(50).once('value').then(snap => {
    box.innerHTML = '';
    const msgs = [];
    snap.forEach(c => msgs.push({ key: c.key, ...c.val() }));
    msgs.forEach(m => appendChatMsg(m, m.key));
    box.scrollTop = box.scrollHeight;
  });

  if (window._chatOff) window._chatOff();
  let first = true;
  const ref = db.ref('chat').orderByChild('time').limitToLast(50);
  const handler = snap => {
    if (first) return;
    appendChatMsg(snap.val(), snap.key);
    const b = document.getElementById('chatBox');
    if (b) b.scrollTop = b.scrollHeight;
  };
  ref.on('child_added', handler);
  window._chatOff = () => ref.off('child_added', handler);
  setTimeout(() => { first = false; }, 1200);
}

function appendChatMsg(m, key) {
  const box = document.getElementById('chatBox');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'chat-msg' + (m.uid === currentUser.uid ? ' me' : '');
  div.dataset.key = key;
  const time = new Date(m.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  let actions = '';
  if (isAdmin || m.uid === currentUser.uid) {
    actions += ` <span style="cursor:pointer;color:#e53935;font-size:0.75rem" onclick="deleteChatMsg('${key}')">✕</span>`;
  }
  if (m.uid !== currentUser.uid) {
    actions += ` <span style="cursor:pointer;color:#ef6c00;font-size:0.75rem" onclick="reportMsg('${key}','${(m.name || '').replace(/'/g, '')}')">⚠</span>`;
  }
  div.innerHTML = `<div class="meta">${m.avatar || '🌿'} <b>${m.name || 'Ẩn'}</b> ${m.isAdmin ? '<span class="admin-tag">ADMIN</span>' : ''} • ${time}${actions}</div>
    <div>${escapeHtml(m.text)}</div>`;
  box.appendChild(div);
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = (input.value || '').trim();
  if (!text || !currentUser) return;
  input.value = '';
  try {
    await db.ref('chat').push({
      uid: currentUser.uid,
      name: state.displayName,
      avatar: state.avatar,
      isAdmin,
      text: text.slice(0, 200),
      time: Date.now()
    });
  } catch (e) {
    Dialog.error('Lỗi gửi: ' + e.message);
  }
}

async function deleteChatMsg(key) {
  const _ok = await Dialog.confirm('Xóa tin nhắn này?'); if (!_ok) return;
  try {
    await db.ref('chat/' + key).remove();
    const el = document.querySelector(`.chat-msg[data-key="${key}"]`);
    if (el) el.remove();
  } catch (e) {
    Dialog.error('Lỗi: ' + e.message);
  }
}

async function reportMsg(key, name) {
  const _ok2 = await Dialog.confirm('Báo cáo tin nhắn của ' + name + '?'); if (!_ok2) return;
  try {
    await db.ref('reports').push({
      msgKey: key,
      reporter: currentUser.uid,
      reporterName: state.displayName,
      targetName: name,
      time: Date.now()
    });
    setMsg('Đã gửi báo cáo. Admin sẽ xem xét.', 'success');
  } catch (e) {
    Dialog.error('Lỗi: ' + e.message);
  }
}
