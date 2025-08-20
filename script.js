// Sao chép URL khi nhấn nút
document.getElementById('copyUrl').addEventListener('click', function() {
  const url = 'https://romlayvn-0411.github.io/sileojb/';
  navigator.clipboard.writeText(url).then(function() {
    showNotification('URL đã được sao chép vào clipboard!');
  });
});

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