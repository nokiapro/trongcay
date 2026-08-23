// Custom web dialogs (thay alert / confirm)
const Dialog = {
  _resolve: null,

  show({ title = 'Thông báo', message = '', type = 'info', confirmText = 'OK', cancelText = null, onConfirm = null }) {
    return new Promise((resolve) => {
      this._resolve = resolve;
      const overlay = document.getElementById('dialogOverlay');
      const box = document.getElementById('dialogBox');
      if (!overlay || !box) {
        resolve(false);
        return;
      }

      const icons = { info: '💬', success: '✅', warn: '⚠️', danger: '🚫', confirm: '❓' };
      const icon = icons[type] || icons.info;

      box.innerHTML = `
        <div class="dialog-icon">${icon}</div>
        <h3 class="dialog-title">${title}</h3>
        <p class="dialog-msg">${message}</p>
        <div class="dialog-actions">
          ${cancelText ? `<button class="dialog-btn dialog-btn-cancel" id="dialogCancel">${cancelText}</button>` : ''}
          <button class="dialog-btn dialog-btn-ok ${type === 'danger' ? 'danger' : ''}" id="dialogOk">${confirmText}</button>
        </div>
      `;
      overlay.classList.add('show');

      document.getElementById('dialogOk').onclick = () => {
        overlay.classList.remove('show');
        if (onConfirm) onConfirm();
        resolve(true);
      };
      const cancelBtn = document.getElementById('dialogCancel');
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          overlay.classList.remove('show');
          resolve(false);
        };
      }
      overlay.onclick = (e) => {
        if (e.target === overlay && cancelText) {
          overlay.classList.remove('show');
          resolve(false);
        }
      };
    });
  },

  alert(message, title = 'Thông báo', type = 'info') {
    return this.show({ title, message, type, confirmText: 'Đã hiểu' });
  },

  success(message, title = 'Thành công') {
    return this.show({ title, message, type: 'success', confirmText: 'OK' });
  },

  warn(message, title = 'Chú ý') {
    return this.show({ title, message, type: 'warn', confirmText: 'OK' });
  },

  error(message, title = 'Lỗi') {
    return this.show({ title, message, type: 'danger', confirmText: 'Đóng' });
  },

  confirm(message, title = 'Xác nhận') {
    return this.show({
      title,
      message,
      type: 'confirm',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy'
    });
  }
};
