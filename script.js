// Sao chép URL khi nhấn nút
const copyBtn = document.getElementById('copyUrl');
if (copyBtn) {
  copyBtn.addEventListener('click', function() {
    const url = copyBtn.getAttribute('data-url') || 'https://romlayvn-0411.github.io/sileojb/';
    navigator.clipboard.writeText(url).then(function() {
      showNotification(document.documentElement.lang === 'vi' ? 'URL đã được sao chép vào clipboard!' : 'URL has been copied to clipboard!');
    });
  });
}

// Mở Sileo khi nhấn nút
document.getElementById('sileoBtn').addEventListener('click', function() {
  // URL scheme để mở Sileo và thêm nguồn
  const sileoUrl = 'sileo://source/https://romlayvn-0411.github.io/sileojb/';
  
  // Thử mở Sileo
  window.location.href = sileoUrl;
  
  // Fallback nếu không mở được Sileo
  setTimeout(function() {
    if (document.hidden) {
      showNotification('Không thể mở Sileo. Vui lòng thêm thủ công.');
    }
  }, 500);
});

// Hiển thị thông báo
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(function() {
    notification.classList.remove('show');
  }, 3000);
}

// Hiệu ứng cho các phần tử khi cuộn
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
});

// Chuyển đổi chế độ sáng/tối
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    // Đổi icon
    if (document.body.classList.contains('light')) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    // Lưu trạng thái
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
  // Khôi phục trạng thái
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}
// Đặt mặc định là dark mode
if (!localStorage.getItem('theme')) {
  document.body.classList.remove('light');
}

// Chuyển đổi ngôn ngữ
const langToggle = document.getElementById('lang-toggle');
const langIcon = document.getElementById('lang-icon');
function setLanguage(lang) {
  document.documentElement.lang = lang;
  if (langIcon) {
    langIcon.textContent = lang === 'vi' ? '🇻🇳' : '🇬🇧';
  }
  // Thay đổi nội dung giao diện
  document.querySelector('h1').textContent = lang === 'vi' ? 'Sileo Jailbreak' : 'Sileo Jailbreak';
  document.querySelector('.subtitle').textContent = lang === 'vi'
    ? 'Kho lưu trữ các tinh chỉnh iOS cao cấp dành cho thiết bị đã jailbreak. Cập nhật thường xuyên với các tweak mới nhất.'
    : 'Premium iOS tweaks repository for jailbroken devices. Frequently updated with the latest tweaks.';
  document.querySelector('.card h2').innerHTML = lang === 'vi'
    ? '<i class="fas fa-book"></i> Hướng dẫn sử dụng'
    : '<i class="fas fa-book"></i> Usage Guide';
  document.querySelectorAll('.card ol li')[0].textContent = lang === 'vi'
    ? 'Mở Sileo hoặc Zebra trên thiết bị đã jailbreak'
    : 'Open Sileo or Zebra on your jailbroken device';
  document.querySelectorAll('.card ol li')[1].textContent = lang === 'vi'
    ? 'Vào mục Sources → Add Source'
    : 'Go to Sources → Add Source';
  document.querySelectorAll('.card ol li')[2].textContent = lang === 'vi'
    ? 'Khám phá và cài đặt các tweak thú vị!'
    : 'Discover and install awesome tweaks!';
  document.querySelector('.personal-info-card h2').innerHTML = lang === 'vi'
    ? '<i class="fas fa-user"></i> Thông tin cá nhân'
    : '<i class="fas fa-user"></i> Personal Info';
  document.querySelectorAll('.personal-info-card li')[0].innerHTML = lang === 'vi'
    ? '<strong>Tên:</strong> Ròm lầy VN'
    : '<strong>Name:</strong> Rom lay VN';
  document.querySelectorAll('.personal-info-card li')[1].innerHTML = lang === 'vi'
    ? '<strong>Telegram:</strong> <a href="https://t.me/romlayvn" target="_blank">Liên hệ</a>'
    : '<strong>Telegram:</strong> <a href="https://t.me/romlayvn" target="_blank">Contact</a>';
  document.querySelectorAll('.personal-info-card li')[2].innerHTML = lang === 'vi'
    ? '<strong>Twitter:</strong> <a href="https://x.com/romlayvn" target="_blank">Liên hệ</a>'
    : '<strong>Twitter:</strong> <a href="https://x.com/romlayvn" target="_blank">Contact</a>';
  document.querySelector('footer p').textContent = lang === 'vi'
    ? '© 2025 Romlayvn — Sileo Jailbreak.'
    : '© 2025 Romlayvn — Sileo Jailbreak.';
  document.querySelector('.sileo-btn').innerHTML = lang === 'vi'
    ? '<i class="fas fa-plus-circle"></i> Thêm vào Sileo'
    : '<i class="fas fa-plus-circle"></i> Add to Sileo';
  // Update copy and sileo button labels/aria
  const copyBtnEl = document.querySelector('.copy-btn');
  const sileoBtnEl = document.querySelector('.sileo-btn');
  if (copyBtnEl) {
    const lbl = copyBtnEl.querySelector('.btn-label');
    if (lbl) lbl.textContent = lang === 'vi' ? 'Sao chép' : 'Copy';
    copyBtnEl.setAttribute('aria-label', lang === 'vi' ? 'Sao chép' : 'Copy');
    copyBtnEl.setAttribute('title', lang === 'vi' ? 'Sao chép' : 'Copy');
  }
  if (sileoBtnEl) {
    const lbl = sileoBtnEl.querySelector('.btn-label');
    if (lbl) lbl.textContent = lang === 'vi' ? 'Thêm vào Sileo' : 'Add to Sileo';
    sileoBtnEl.setAttribute('aria-label', lang === 'vi' ? 'Thêm vào Sileo' : 'Add to Sileo');
  }
}
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);
  });
  // Khôi phục trạng thái
  if (localStorage.getItem('lang')) {
    setLanguage(localStorage.getItem('lang'));
  } else {
    setLanguage(document.documentElement.lang || 'vi');
  }
}