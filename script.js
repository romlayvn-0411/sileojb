// script.js
const repoURL = "https://romlayvn-0411.github.io/sileojb/";

// Chế độ sáng/tối
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Cập nhật icon
    const icon = document.querySelector('.mode-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Sao chép URL nguồn - Đã cập nhật để tương thích tốt hơn
function copyRepoUrl() {
    const textToCopy = document.getElementById('repoUrl').value;

    // Ưu tiên sử dụng API Clipboard hiện đại
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('URL nguồn đã được sao chép!');
            })
            .catch(err => {
                console.warn('Lỗi khi sao chép bằng API hiện đại, thử phương pháp cũ hơn: ', err);
                fallbackCopyTextToClipboard(textToCopy);
            });
    } else {
        // Sử dụng phương pháp dự phòng cho các trình duyệt cũ hoặc môi trường không an toàn (HTTP)
        console.log('Sử dụng phương pháp sao chép dự phòng.');
        fallbackCopyTextToClipboard(textToCopy);
    }
}

// Hàm dự phòng để sao chép
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Đảm bảo textarea không sichtbar trên màn hình
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('URL nguồn đã được sao chép!');
        } else {
            alert('Sao chép thất bại. Vui lòng sao chép thủ công.');
        }
    } catch (err) {
        console.error('Lỗi khi sao chép bằng phương pháp dự phòng: ', err);
        alert('Sao chép thất bại. Vui lòng sao chép thủ công.');
    }

    document.body.removeChild(textArea);
}


// Thêm vào Sileo
function addToSileo() {
    window.location.href = `sileo://source/${repoURL}`;
}

// Thêm vào Zebra
function addToZebra() {
    window.location.href = `zbra://source/add/${repoURL}`;
}
