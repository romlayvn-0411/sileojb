// JavaScript for Liquid Glass Theme

document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('commandInput');
    const terminalOutput = document.querySelector('.terminal-output');
    const body = document.body;

    // Mặc định chế độ tối
    setNightMode();

    // Thêm âm thanh
    const soundEffect = new Audio('notification.mp3'); // Đường dẫn đến file âm thanh

    commandInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const command = commandInput.value.trim();
            handleCommand(command);
            commandInput.value = '';
        }
    });

    function handleCommand(command) {
        // Xóa nội dung cũ để hiển thị nội dung mới nhất
        terminalOutput.innerHTML = '';

        const output = document.createElement('p');
        output.textContent = `$ ${command}`;
        terminalOutput.appendChild(output);

        let response;
        switch (command.toLowerCase()) {
            case 'help':
                response = `
    Help - Các lệnh có thể sử dụng:
    - About - Giới thiệu Website
    - Link - Liên kết Repo
    - Copy - Sao chép liên kết Repo
    - AddSileo - Thêm vào Sileo
    - AddZebra - Thêm vào Zebra
    - Light - Chế độ Sáng
    - Dark - Chế độ Tối
    - Time - Hiển thị ngày giờ hiện tại
    - Clear - Xóa tất cả lệnh vừa nhập
                `;
                break;
            case 'about':
                response = `
    Chào bạn đến với SileoJB 
    - Kho lưu trữ tinh chỉnh dành cho người dùng Việt Nam.
    - Hỗ trợ kho lưu trữ trên các công cụ quản lý tinh chỉnh như Sileo, Zebra.
    - Tất cả các tinh chỉnh đều được cập nhật thường xuyên.
    - Liên hệ Telegram: @romlayvn`;
                break;
            case 'link':
                response = 'Repo URL: https://romlayvn-0411.github.io/sileojb/';
                playSound();
                showToast('Đã hiển thị liên kết repo!');
                break;
            case 'copy':
                navigator.clipboard.writeText('https://romlayvn-0411.github.io/sileojb/')
                    .then(() => {
                        response = 'URL đã được sao chép vào clipboard.';
                        playSound();
                        showToast('URL đã được sao chép!');
                    })
                    .catch(() => {
                        response = 'Sao chép thất bại. Vui lòng thử lại.';
                        playSound();
                        showToast('Sao chép thất bại!');
                    });
                break;
            case 'addsileo':
                response = 'Đang thêm nguồn vào Sileo...';
                addToSileo();
                playSound();
                showToast('Nguồn đã được thêm vào Sileo!');
                break;
            case 'addzebra':
                response = 'Đang thêm nguồn vào Zebra...';
                addToZebra();
                playSound();
                showToast('Nguồn đã được thêm vào Zebra!');
                break;
            case 'time':
                const now = new Date();
                response = `Ngày giờ hiện tại: ${now.toLocaleString()}`;
                playSound();
                showToast('Đã hiển thị ngày giờ!');
                break;
            case 'clear':
                terminalOutput.innerHTML = `
                    <h1>Welcome to SileoJB</h1>
                    <p>Kho lưu trữ tinh chỉnh dành cho người dùng Việt Nam.</p>
                    <p>Nhập \`help\` để bắt đầu.</p>
                `;
                playSound();
                showToast('Đã xóa tất cả lệnh vừa nhập!');
                return;
            case 'light':
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                response = 'Đã chuyển sang chế độ sáng.';
                playSound();
                showToast('Chế độ sáng đã được kích hoạt!');
                break;
            case 'dark':
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                response = 'Đã chuyển sang chế độ tối.';
                playSound();
                showToast('Chế độ tối đã được kích hoạt!');
                break;
            default:
                response = `Command not found: ${command}`;
                playSound();
                showToast('Lệnh không hợp lệ!');
        }

        const responseOutput = document.createElement('p');
        responseOutput.textContent = response;
        terminalOutput.appendChild(responseOutput);
    }

    function setNightMode() {
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
            body.classList.add('dark-mode');
        } else {
            body.classList.add('light-mode');
        }
    }

    function playSound() {
        soundEffect.currentTime = 0;
        soundEffect.play();
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function addToSileo() {
        const repoURL = "https://romlayvn-0411.github.io/sileojb/";
        window.location.href = `sileo://source/${encodeURIComponent(repoURL)}`;
        setTimeout(() => {
            showToast("Nếu không mở được Sileo, hãy sao chép URL và thêm thủ công.");
        }, 1000);
    }

    function addToZebra() {
        const repoURL = "https://romlayvn-0411.github.io/sileojb/";
        window.location.href = `zbra://source/add/${encodeURIComponent(repoURL)}`;
        setTimeout(() => {
            showToast("Nếu không mở được Zebra, hãy sao chép URL và thêm thủ công.");
        }, 1000);
    }
});

