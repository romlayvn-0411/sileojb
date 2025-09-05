// ====== SILEOJB ADVANCED TERMINAL v3.0 ======
// Advanced JavaScript with enhanced effects and interactions

class SileoJBTerminal {
    constructor() {
        this.terminalOutput = document.getElementById('terminalOutput');
        this.commandInput = document.getElementById('commandInput');
        this.notificationContainer = document.getElementById('notificationContainer');
        this.isTyping = false;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentTheme = 'dark';
        this.cpuUsage = 42;
        this.ramUsage = 1.2;
        this.audioEnabled = localStorage.getItem('sileojb-audio') !== 'false';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startSystemMonitoring();
        this.playBootSequence();
        this.setInitialTheme();
        this.handleMobileOptimizations();
        this.setupAutoScroll();
    }

    setupEventListeners() {
        // Command input events
        this.commandInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.commandInput.addEventListener('input', () => this.playKeySound());
        
        // Window focus events
        window.addEventListener('focus', () => this.commandInput.focus());
        
        // Window resize events for responsive adjustments
        window.addEventListener('resize', () => this.handleMobileOptimizations());
        
        // Prevent context menu on terminal
        document.querySelector('.terminal-wrapper').addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Auto-focus input when clicking anywhere on terminal
        document.querySelector('.terminal-wrapper').addEventListener('click', () => {
            this.commandInput.focus();
        });
        
        // Prevent scroll on mobile when typing
        this.commandInput.addEventListener('focus', () => {
            if (this.isMobile()) {
                setTimeout(() => {
                    this.scrollToBottom();
                }, 300);
            }
        });
    }

    handleMobileOptimizations() {
        const isMobile = this.isMobile();
        const terminalWrapper = document.querySelector('.terminal-wrapper');
        
        if (isMobile) {
            // Optimize for mobile
            terminalWrapper.style.height = '100vh';
            terminalWrapper.style.borderRadius = window.innerHeight < 600 ? '10px' : '15px';
            
            // Adjust font sizes for mobile
            const output = this.terminalOutput;
            output.style.fontSize = window.innerWidth < 480 ? '12px' : '13px';
            
            // Fix viewport height issues on mobile
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        } else {
            // Reset desktop styles
            terminalWrapper.style.height = '';
            terminalWrapper.style.borderRadius = '';
            this.terminalOutput.style.fontSize = '';
        }
    }

    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    setupAutoScroll() {
        // Smart auto-scroll that respects user interaction
        let userScrolled = false;
        let scrollTimeout;
        
        this.terminalOutput.addEventListener('scroll', () => {
            const terminal = this.terminalOutput;
            const isAtBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 50;
            
            userScrolled = !isAtBottom;
            
            // Reset user scroll flag after 3 seconds of no scrolling
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                userScrolled = false;
            }, 3000);
        });
        
        // Enhanced scroll to bottom
        this.originalScrollToBottom = this.scrollToBottom;
        this.scrollToBottom = () => {
            setTimeout(() => {
                const terminal = this.terminalOutput;
                
                // Only auto-scroll if user hasn't manually scrolled or if typing
                if (!userScrolled || this.isTyping) {
                    terminal.scrollTo({
                        top: terminal.scrollHeight,
                        behavior: this.isTyping ? 'smooth' : 'auto'
                    });
                }
            }, this.isTyping ? 100 : 50);
        };
    }

    handleKeyPress(event) {
        switch(event.key) {
            case 'Enter':
                if (this.commandInput.value.trim() && !this.isTyping) {
                    this.executeCommand(this.commandInput.value.trim());
                    this.commandInput.value = '';
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.navigateHistory('up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.navigateHistory('down');
                break;
            case 'Tab':
                event.preventDefault();
                this.autoComplete();
                break;
            case 'Escape':
                this.commandInput.value = '';
                break;
        }
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === 'up') {
            this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
        } else {
            this.historyIndex = Math.max(this.historyIndex - 1, -1);
        }
        
        this.commandInput.value = this.historyIndex >= 0 ? this.commandHistory[this.historyIndex] : '';
    }

    autoComplete() {
        const availableCommands = ['help', 'about', 'status', 'packages', 'link', 'copy', 'addsileo', 'addzebra', 'time', 'clear', 'matrix', 'reboot', 'light', 'dark', 'audio', 'stats', 'weather', 'crypto'];
        const currentValue = this.commandInput.value.toLowerCase();
        
        const matches = availableCommands.filter(cmd => cmd.startsWith(currentValue));
        if (matches.length === 1) {
            this.commandInput.value = matches[0];
        } else if (matches.length > 1) {
            this.showNotification(`Suggestions: ${matches.join(', ')}`, 'info');
        }
    }

    executeCommand(command) {
        // Add to history
        this.commandHistory.unshift(command);
        if (this.commandHistory.length > 50) this.commandHistory.pop();
        this.historyIndex = -1;

        // Display command
        this.addCommandLine(command);

        // Execute command
        this.processCommand(command.toLowerCase());
    }

    addCommandLine(command) {
        const commandElement = document.createElement('div');
        commandElement.className = 'command-line';
        commandElement.innerHTML = `
            <span style="color: var(--success-color);">root</span><span style="color: var(--text-muted);">@</span><span style="color: var(--accent-color);">sileojb</span><span style="color: var(--text-muted);">:</span><span style="color: var(--warning-color);">~</span><span style="color: var(--primary-color);"># </span><span style="color: var(--text-primary);">${command}</span>
        `;
        commandElement.style.marginBottom = '15px';
        commandElement.style.fontFamily = 'var(--font-mono)';
        commandElement.style.textAlign = 'center';
        commandElement.style.padding = '10px';
        commandElement.style.background = 'rgba(0, 0, 0, 0.3)';
        commandElement.style.borderRadius = '6px';
        commandElement.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        this.terminalOutput.appendChild(commandElement);
        this.scrollToBottom();
    }

    processCommand(command) {
        let response = '';
        
        switch(command) {
            case 'help':
                response = this.getHelpResponse();
                break;
            case 'about':
                response = this.getAboutResponse();
                break;
            case 'status':
                response = this.getStatusResponse();
                break;
            case 'packages':
                response = this.getPackagesResponse();
                break;
            case 'link':
                response = this.getLinkResponse();
                break;
            case 'copy':
                this.copyRepoUrl();
                return;
            case 'addsileo':
                response = '🚀 Launching Sileo with repository...';
                this.addToSileo();
                break;
            case 'addzebra':
                response = '🦓 Launching Zebra with repository...';
                this.addToZebra();
                break;
            case 'time':
                response = this.getTimeResponse();
                break;
            case 'stats':
                response = this.getStatsResponse();
                break;
            case 'weather':
                response = this.getWeatherResponse();
                break;
            case 'crypto':
                response = this.getCryptoResponse();
                break;
            case 'matrix':
                this.startMatrixEffect();
                response = '🟢 Matrix effect activated! Press ESC or click to stop.';
                break;
            case 'reboot':
                response = '🔄 System reboot initiated...';
                setTimeout(() => location.reload(), 3000);
                break;
            case 'clear':
                this.clearTerminal();
                return;
            case 'light':
                this.setTheme('light');
                response = '☀️ Light mode activated.';
                break;
            case 'dark':
                this.setTheme('dark');
                response = '🌙 Dark mode activated.';
                break;
            case 'audio':
                this.toggleAudio();
                response = `🔊 Audio ${this.audioEnabled ? 'enabled' : 'disabled'}.`;
                break;
            default:
                response = this.getErrorResponse(command);
        }

        this.typeResponse(response);
    }

    getHelpResponse() {
        return `╭─ 🔧 SILEOJB ADVANCED COMMAND INTERFACE v3.0 ─╮
│                                                │
│  📋 INFORMATION COMMANDS:                      │
│  • help      - Show this help menu            │
│  • about     - Repository information         │
│  • status    - System status & health         │
│  • packages  - Available tweaks list          │
│  • stats     - Performance statistics         │
│                                                │
│  🔗 REPOSITORY COMMANDS:                       │
│  • link      - Display repository URL         │
│  • copy      - Copy URL to clipboard          │
│  • addsileo  - Add to Sileo package manager   │
│  • addzebra  - Add to Zebra package manager   │
│                                                │
│  🎨 INTERFACE COMMANDS:                        │
│  • light     - Switch to light theme          │
│  • dark      - Switch to dark theme           │
│  • audio     - Toggle audio on/off            │
│  • matrix    - Activate Matrix rain effect    │
│                                                │
│  ⚡ SYSTEM COMMANDS:                            │
│  • time      - Display current time & date    │
│  • weather   - Weather information            │
│  • crypto    - Cryptocurrency prices          │
│  • clear     - Clear terminal output          │
│  • reboot    - Restart the terminal           │
│                                                │
│  💡 TIPS:                                      │
│  • Use ↑/↓ arrows for command history         │
│  • Press TAB for auto-completion              │
│  • Press ESC to clear current input           │
│                                                │
╰────────────────────────────────────────────────╯`;
    }

    getAboutResponse() {
        return `╭─ 🚀 SILEOJB ADVANCED REPOSITORY v3.0 ─╮
│                                         │
│  📱 Platform: iOS 14.0 - 17.6          │
│  🔓 Type: Premium Jailbreak Repository  │
│  🌍 Region: Vietnam & Global            │
│  📦 Packages: 45+ Premium Tweaks       │
│  🔄 Updates: Real-time Automated       │
│  💬 Support: @romlayvn (Telegram)      │
│  🏆 Rating: ⭐⭐⭐⭐⭐ (4.9/5)         │
│  🌐 CDN: Global Edge Deployment        │
│                                         │
│  🛡️ SECURITY FEATURES:                 │
│  • All packages digitally signed       │
│  • Malware scanning enabled            │
│  • Rootless & RootFull support         │
│  • SSL/TLS encrypted connections       │
│                                         │
│  📊 STATISTICS:                         │
│  • Total Downloads: 127K+              │
│  • Active Users: 1,247                 │
│  • Success Rate: 99.8%                 │
│  • Uptime: 99.95%                      │
│                                         │
╰─────────────────────────────────────────╯`;
    }

    getStatusResponse() {
        const uptime = this.formatUptime(Date.now() - 1693900800000); // Sample uptime
        return `🟢 REPOSITORY STATUS: ONLINE

⚡ PERFORMANCE METRICS:
├── Server Response: ${Math.floor(Math.random() * 20) + 5}ms
├── CDN Latency: ${Math.floor(Math.random() * 15) + 8}ms
├── Uptime: ${uptime}
├── Load Average: ${(Math.random() * 2).toFixed(2)}
└── Memory Usage: ${(Math.random() * 40 + 60).toFixed(1)}%

📊 REPOSITORY HEALTH:
├── Available Packages: 45
├── Last Update: ${new Date().toLocaleString('vi-VN')}
├── Mirror Status: 🟢 All mirrors online
├── SSL Certificate: 🔒 Valid (expires in 89 days)
└── Backup Status: ✅ Last backup 2 hours ago

👥 USER METRICS:
├── Active Sessions: ${Math.floor(Math.random() * 50) + 150}
├── Downloads Today: ${Math.floor(Math.random() * 500) + 800}
├── Bandwidth Used: ${(Math.random() * 10 + 5).toFixed(1)} GB
└── Peak Concurrent: ${Math.floor(Math.random() * 30) + 80}

🌍 GLOBAL STATUS:
├── 🇻🇳 Vietnam: 🟢 Optimal
├── 🇺🇸 US East: 🟢 Optimal  
├── 🇪🇺 Europe: 🟢 Optimal
├── 🇯🇵 Asia Pacific: 🟢 Optimal
└── 🇧🇷 South America: 🟡 Good`;
    }

    getPackagesResponse() {
        return `📦 FEATURED PACKAGES CATALOG:

🎨 INTERFACE & THEMES:
├── CC26 v0.4.9.9b - Advanced Control Center
├── NeoWave16 v1.0.0 - Elegant Icon Theme
├── TWIGalaxy v1.10 - Premium Theme Collection
├── SolidGlass RL - Translucent UI Elements
└── SwitchTheme3 v1.0.0 - Dynamic Theme Switcher

🖱️ INTERACTION & GESTURES:
├── TouchVis v4.0.1 - Touch Visualization
├── VHSquidGesture Pro v1.0.1b - Gesture Controls
├── HorizontalSliders v0.0.1 - Custom Sliders
└── PulloverPro v2.1.6 - Enhanced Notifications

📺 CONNECTIVITY & REMOTE:
├── TrollVNC v2.0 - Remote Desktop Access
├── RxTikTok v1.4.5 - TikTok Enhancements
└── Vitreux v1.1 - Transparency Effects

🔧 SYSTEM & UTILITIES:
├── Orion Runtime v1.0.2 - iOS 14-17 Support
├── Cephei v2.0 - Tweak Preference Support
├── Alderis Color Picker v1.2.3 - Color Tools
├── LG v1.0.0 - System Utilities
└── Presets v1.0 - Quick Settings

🛡️ PRIVACY & SECURITY:
├── Blacklist v0.0.3-1 - App Blocking
└── HidePullover v0.0.1 - Notification Privacy

📱 SOCIAL & MEDIA:
├── IGFormat v1.85 - Instagram Enhancements
└── NCT v0.0.1 - Notification Center Tools

💡 Type 'addsileo' or 'addzebra' to install repository`;
    }

    getLinkResponse() {
        this.playNotificationSound();
        this.showNotification('✅ Repository URL displayed!', 'success');
        return `🔗 REPOSITORY INFORMATION:

📋 PRIMARY URL:
https://romlayvn-0411.github.io/sileojb/

🌐 MIRROR URLS:
├── Mirror 1: https://github.com/romlayvn-0411
├── Mirror 2: https://t.me/romlayvn
└── Mirror 3: https://x.com/romlayvn

📱 QUICK ADD LINKS:
├── Sileo: sileo://source/https://romlayvn-0411.github.io/sileojb/
└── Zebra: zbra://source/add/https://romlayvn-0411.github.io/sileojb/

📋 Ready to copy! Use 'copy' command to copy to clipboard.`;
    }

    getTimeResponse() {
        const now = new Date();
        const options = { 
            timeZone: 'Asia/Ho_Chi_Minh',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        return `🕐 SYSTEM TIME INFORMATION:

🇻🇳 Vietnam Time (Local):
${now.toLocaleDateString('vi-VN', options)}

🌍 World Clocks:
├── 🇺🇸 New York: ${new Date().toLocaleString('en-US', {...options, timeZone: 'America/New_York'})}
├── 🇬🇧 London: ${new Date().toLocaleString('en-GB', {...options, timeZone: 'Europe/London'})}
├── 🇯🇵 Tokyo: ${new Date().toLocaleString('ja-JP', {...options, timeZone: 'Asia/Tokyo'})}
└── 🇦🇺 Sydney: ${new Date().toLocaleString('en-AU', {...options, timeZone: 'Australia/Sydney'})}

⏰ UNIX TIMESTAMP: ${Math.floor(now.getTime() / 1000)}
🌐 ISO 8601: ${now.toISOString()}
📅 Day of Year: ${Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / 86400000)}`;
    }

    getStatsResponse() {
        return `📊 PERFORMANCE STATISTICS:

💻 SYSTEM RESOURCES:
├── CPU Usage: ${this.cpuUsage}%
├── Memory Usage: ${this.ramUsage}GB / 4GB
├── Disk I/O: ${(Math.random() * 100).toFixed(1)} MB/s
└── Network: ${(Math.random() * 50 + 10).toFixed(1)} Mbps

📈 REPOSITORY METRICS:
├── Total Requests: ${(Math.random() * 10000 + 50000).toFixed(0)}
├── Unique Visitors: ${(Math.random() * 1000 + 5000).toFixed(0)}
├── Package Downloads: ${(Math.random() * 5000 + 20000).toFixed(0)}
├── Error Rate: ${(Math.random() * 0.5).toFixed(2)}%
└── Cache Hit Rate: ${(Math.random() * 10 + 85).toFixed(1)}%

🌐 GEOGRAPHIC DISTRIBUTION:
├── 🇻🇳 Vietnam: ${(Math.random() * 20 + 40).toFixed(1)}%
├── 🇺🇸 United States: ${(Math.random() * 15 + 20).toFixed(1)}%
├── 🇪🇺 Europe: ${(Math.random() * 10 + 15).toFixed(1)}%
├── 🇯🇵 Asia Pacific: ${(Math.random() * 10 + 10).toFixed(1)}%
└── 🌍 Others: ${(Math.random() * 5 + 5).toFixed(1)}%`;
    }

    getWeatherResponse() {
        const conditions = ['☀️ Sunny', '⛅ Partly Cloudy', '☁️ Cloudy', '🌧️ Rainy', '⛈️ Thunderstorm'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = Math.floor(Math.random() * 15) + 25; // 25-40°C for Vietnam
        
        return `🌤️ WEATHER INFORMATION:

📍 Ho Chi Minh City, Vietnam:
├── Condition: ${condition}
├── Temperature: ${temp}°C / ${Math.floor(temp * 9/5 + 32)}°F
├── Humidity: ${Math.floor(Math.random() * 30) + 60}%
├── Wind: ${Math.floor(Math.random() * 15) + 5} km/h
└── Pressure: ${Math.floor(Math.random() * 50) + 1000} hPa

🌍 Other Cities:
├── 🇺🇸 New York: ${Math.floor(Math.random() * 20) + 10}°C
├── 🇬🇧 London: ${Math.floor(Math.random() * 15) + 5}°C
├── 🇯🇵 Tokyo: ${Math.floor(Math.random() * 25) + 15}°C
└── 🇦🇺 Sydney: ${Math.floor(Math.random() * 20) + 15}°C

💡 Weather data simulated for demo purposes`;
    }

    getCryptoResponse() {
        return `₿ CRYPTOCURRENCY PRICES:

🔝 TOP CRYPTOCURRENCIES:
├── Bitcoin (BTC): $${(Math.random() * 10000 + 40000).toFixed(0)}
├── Ethereum (ETH): $${(Math.random() * 1000 + 2000).toFixed(0)}
├── Binance Coin (BNB): $${(Math.random() * 100 + 200).toFixed(0)}
├── Cardano (ADA): $${(Math.random() * 2).toFixed(2)}
└── Solana (SOL): $${(Math.random() * 50 + 100).toFixed(0)}

📈 MARKET OVERVIEW:
├── Total Market Cap: $${(Math.random() * 500 + 1500).toFixed(0)}B
├── 24h Volume: $${(Math.random() * 50 + 100).toFixed(0)}B
├── Bitcoin Dominance: ${(Math.random() * 10 + 40).toFixed(1)}%
└── Fear & Greed Index: ${Math.floor(Math.random() * 100)}

💡 Prices are simulated for demo purposes
🔄 Real-time data available in production version`;
    }

    getErrorResponse(command) {
        const suggestions = this.getSuggestions(command);
        this.playErrorSound();
        this.showNotification('⚠️ Invalid command!', 'error');
        
        return `❌ Command not found: '${command}'

💡 Did you mean?
${suggestions.length > 0 ? suggestions.map(s => `• ${s}`).join('\n') : '• Type "help" for available commands'}

📚 Use 'help' to see all available commands
⌨️  Use TAB for auto-completion`;
    }

    getSuggestions(command) {
        const commands = ['help', 'about', 'status', 'packages', 'link', 'copy', 'addsileo', 'addzebra', 'time', 'clear', 'matrix', 'reboot', 'light', 'dark', 'audio', 'stats', 'weather', 'crypto'];
        return commands.filter(cmd => {
            return this.levenshteinDistance(command.toLowerCase(), cmd) <= 2;
        }).slice(0, 3);
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }

    typeResponse(text, speed = 12) {
        this.isTyping = true;
        const responseContainer = document.createElement('div');
        responseContainer.className = 'response-container';
        responseContainer.style.marginBottom = '20px';
        responseContainer.style.textAlign = 'center'; // Căn chỉnh nội dung ra giữa
        this.terminalOutput.appendChild(responseContainer);

        // In ra ngay lập tức thay vì hiệu ứng chạy chữ
        const responseElement = document.createElement('pre');
        responseElement.style.margin = '0';
        responseElement.style.fontFamily = 'inherit';
        responseElement.style.whiteSpace = 'pre-wrap';
        responseElement.className = 'fade-in-text';
        responseElement.textContent = text;
        responseContainer.appendChild(responseElement);

        this.isTyping = false;
        this.scrollToBottom();
    }

    copyRepoUrl() {
        const repoUrl = 'https://romlayvn-0411.github.io/sileojb/';
        navigator.clipboard.writeText(repoUrl)
            .then(() => {
                this.playNotificationSound();
                this.showNotification('📋 URL copied to clipboard!', 'success');
                this.typeResponse('✅ Repository URL copied to clipboard successfully!\n\n📋 Copied: https://romlayvn-0411.github.io/sileojb/');
            })
            .catch(() => {
                this.playErrorSound();
                this.showNotification('⚠️ Copy operation failed!', 'error');
                this.typeResponse('❌ Copy failed. Please manually copy the URL:\nhttps://romlayvn-0411.github.io/sileojb/');
            });
    }

    addToSileo() {
        const repoURL = "https://romlayvn-0411.github.io/sileojb/";
        try {
            window.location.href = `sileo://source/${repoURL}`;
            this.showNotification('🚀 Opening Sileo...', 'success');
        } catch (error) {
            this.showNotification('❌ Cannot open Sileo. URL copied instead.', 'warning');
            navigator.clipboard.writeText(repoURL);
        }
        this.playNotificationSound();
    }

    addToZebra() {
        const repoURL = "https://romlayvn-0411.github.io/sileojb/";
        try {
            window.location.href = `zbra://source/add/${repoURL}`;
            this.showNotification('🦓 Opening Zebra...', 'success');
        } catch (error) {
            this.showNotification('❌ Cannot open Zebra. URL copied instead.', 'warning');
            navigator.clipboard.writeText(repoURL);
        }
        this.playNotificationSound();
    }

    clearTerminal() {
        this.terminalOutput.innerHTML = `
            <div class="boot-sequence">
                <div class="boot-logo">
                    <div class="ascii-art">
    ███████╗██╗██╗     ███████╗ ██████╗      ██╗██████╗ 
    ██╔════╝██║██║     ██╔════╝██╔═══██╗     ██║██╔══██╗
    ███████╗██║██║     █████╗  ██║   ██║     ██║██████╔╝
    ╚════██║██║██║     ██╔══╝  ██║   ██║██   ██║██╔══██╗
    ███████║██║███████╗███████╗╚██████╔╝╚█████╔╝██████╔╝
    ╚══════╝╚═╝╚══════╝╚══════╝ ╚═════╝  ╚════╝ ╚═════╝ 
                    </div>
                </div>
                
                <div class="system-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">System:</span>
                            <span class="info-value">iOS Jailbreak Repository</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Version:</span>
                            <span class="info-value">1.0.0-RELEASE</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Architecture:</span>
                            <span class="info-value">ARM64</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Packages:</span>
                            <span class="info-value">20+ Tweaks</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span class="info-value status-online">🟢 ONLINE</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Security:</span>
                            <span class="info-value">🔒 ENCRYPTED</span>
                        </div>
                    </div>
                </div>

                <div class="welcome-message">
                    <h1 class="welcome-title">🔓 Welcome to SileoJB Advanced Terminal</h1>
                    <p class="welcome-subtitle">🇻🇳 Kho lưu trữ tinh chỉnh chuyên nghiệp dành cho cộng đồng Việt Nam</p>
                    <p class="welcome-instruction">💻 Type <span class="command-highlight">help</span> to explore available commands</p>
                </div>

                <div class="loading-container">
                    <div class="loading-text">Terminal Ready...</div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="loading-percentage">100%</div>
                </div>
            </div>
        `;
        this.playNotificationSound();
        this.showNotification('🧹 Terminal cleared!', 'success');
    }

    startMatrixEffect() {
        const matrixCanvas = document.createElement('canvas');
        matrixCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: black;
            cursor: pointer;
        `;
        document.body.appendChild(matrixCanvas);

        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const charArray = chars.split("");
        const font_size = 20;
        const columns = matrixCanvas.width / font_size;
        const drops = Array.from({length: columns}, () => 1);

        let animationId;

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = '#00ff88';
            ctx.font = font_size + 'px Fira Code';

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * font_size, drops[i] * font_size);

                if (drops[i] * font_size > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationId = requestAnimationFrame(draw);
        };

        draw();

        const stopMatrix = () => {
            cancelAnimationFrame(animationId);
            document.body.removeChild(matrixCanvas);
            document.removeEventListener('keydown', handleStop);
            matrixCanvas.removeEventListener('click', handleStop);
            this.commandInput.focus();
        };

        const handleStop = (e) => {
            if (e.type === 'keydown' && e.key === 'Escape') {
                stopMatrix();
            } else if (e.type === 'click') {
                stopMatrix();
            }
        };

        document.addEventListener('keydown', handleStop);
        matrixCanvas.addEventListener('click', handleStop);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        const body = document.body;
        
        // Smooth transition effect
        body.style.transition = 'all 0.3s ease-in-out';
        
        if (theme === 'light') {
            body.classList.add('light-mode');
            // Update theme toggle icon
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('light-mode');
            // Update theme toggle icon
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        
        localStorage.setItem('sileojb-theme', theme);
        this.showNotification(`🎨 ${theme === 'light' ? 'Light' : 'Dark'} theme activated!`, 'success');
        
        // Remove transition after theme change
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        localStorage.setItem('sileojb-audio', this.audioEnabled.toString());
        this.showNotification(`🔊 Audio ${this.audioEnabled ? 'enabled' : 'disabled'}!`, 'success');
    }

    setInitialTheme() {
        const savedTheme = localStorage.getItem('sileojb-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            const hour = new Date().getHours();
            this.setTheme(hour >= 18 || hour < 6 ? 'dark' : 'light');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        this.notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    scrollToBottom() {
        setTimeout(() => {
            const terminal = this.terminalOutput;
            const isNearBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 100;
            
            // Only auto-scroll if user is near the bottom or new content was added
            if (isNearBottom || this.isTyping) {
                terminal.scrollTo({
                    top: terminal.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }

    playKeySound() {
        if (!this.audioEnabled) return;
        
        try {
            // Try to play audio file first
            const keySound = document.getElementById('keySound');
            if (keySound && keySound.readyState >= 2) {
                keySound.currentTime = 0;
                keySound.play().catch(() => {
                    // If audio file fails, create synthetic sound
                    this.createSyntheticKeySound();
                });
            } else {
                // Create synthetic sound as fallback
                this.createSyntheticKeySound();
            }
        } catch (error) {
            // Silently handle audio errors
        }
    }

    createSyntheticKeySound() {
        if (!this.audioEnabled) return;
        
        try {
            if (window.AudioContext || window.webkitAudioContext) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        } catch (error) {
            // Silently handle audio context errors
        }
    }

    playNotificationSound() {
        if (!this.audioEnabled) return;
        
        try {
            const notificationSound = document.getElementById('notificationSound');
            if (notificationSound && notificationSound.readyState >= 2) {
                notificationSound.currentTime = 0;
                notificationSound.play().catch(() => {
                    // If audio file fails, create synthetic sound
                    this.createSyntheticNotificationSound();
                });
            } else {
                // Create synthetic sound as fallback
                this.createSyntheticNotificationSound();
            }
        } catch (error) {
            // Silently handle audio errors
        }
    }

    createSyntheticNotificationSound() {
        if (!this.audioEnabled) return;
        
        try {
            if (window.AudioContext || window.webkitAudioContext) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }
        } catch (error) {
            // Silently handle audio context errors
        }
    }

    playErrorSound() {
        // Create error sound effect
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    playBootSequence() {
        // Simulate boot sounds and animations
        setTimeout(() => {
            this.showNotification('🚀 SileoJB Terminal v1.0 Initialized!', 'success');
        }, 1000);
    }

    startSystemMonitoring() {
        setInterval(() => {
            // Simulate CPU and RAM usage changes
            this.cpuUsage = Math.max(10, Math.min(90, this.cpuUsage + (Math.random() - 0.5) * 10));
            this.ramUsage = Math.max(0.5, Math.min(3.8, this.ramUsage + (Math.random() - 0.5) * 0.2));
            
            const cpuElement = document.getElementById('cpu');
            const ramElement = document.getElementById('ram');
            
            if (cpuElement) cpuElement.textContent = `${Math.floor(this.cpuUsage)}%`;
            if (ramElement) ramElement.textContent = `${this.ramUsage.toFixed(1)}GB`;
        }, 2000);
    }

    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        return `${days}d ${hours}h ${minutes}m`;
    }
}

// ====== GLOBAL FUNCTIONS ======
function executeCommand(command) {
    if (window.terminal) {
        window.terminal.commandInput.value = command;
        window.terminal.executeCommand(command);
    }
}

function toggleTheme() {
    if (window.terminal) {
        const newTheme = window.terminal.currentTheme === 'dark' ? 'light' : 'dark';
        window.terminal.setTheme(newTheme);
    }
}

function animateClose() {
    document.querySelector('.terminal-wrapper').style.animation = 'terminalEntrance 0.5s ease reverse';
    setTimeout(() => {
        if (confirm('🔒 Close SileoJB Terminal?')) {
            window.close();
        } else {
            document.querySelector('.terminal-wrapper').style.animation = '';
        }
    }, 500);
}

function animateMinimize() {
    const terminal = document.querySelector('.terminal-wrapper');
    terminal.style.transform = 'scale(0.1)';
    terminal.style.opacity = '0';
    setTimeout(() => {
        terminal.style.transform = '';
        terminal.style.opacity = '';
    }, 1000);
}

function animateMaximize() {
    const terminal = document.querySelector('.terminal-wrapper');
    terminal.classList.toggle('maximized');
    if (terminal.classList.contains('maximized')) {
        terminal.style.width = '100vw';
        terminal.style.height = '100vh';
        terminal.style.borderRadius = '0';
        terminal.style.margin = '0';
    } else {
        terminal.style.width = '';
        terminal.style.height = '';
        terminal.style.borderRadius = '';
        terminal.style.margin = '';
    }
}

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen first
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        
        // Simulate loading progress
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            let progress = 0;
            const loadingInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(loadingInterval);
                    
                    // Hide loading screen and initialize terminal
                    setTimeout(() => {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            initializeTerminal();
                        }, 500);
                    }, 500);
                }
                progressBar.style.width = `${progress}%`;
            }, 100);
        } else {
            // Fallback if no loading screen
            setTimeout(initializeTerminal, 1000);
        }
    } else {
        initializeTerminal();
    }
});

// ====== AUDIO INITIALIZATION ======
function initializeAudio() {
    try {
        const keySound = document.getElementById('keySound');
        const notificationSound = document.getElementById('notificationSound');
        
        // Add error event listeners
        if (keySound) {
            keySound.addEventListener('error', () => {
                console.log('Key sound file not found, using synthetic audio');
            });
            keySound.addEventListener('canplaythrough', () => {
                console.log('Key sound loaded successfully');
            });
        }
        
        if (notificationSound) {
            notificationSound.addEventListener('error', () => {
                console.log('Notification sound file not found, using synthetic audio');
            });
            notificationSound.addEventListener('canplaythrough', () => {
                console.log('Notification sound loaded successfully');
            });
        }
    } catch (error) {
        console.log('Audio initialization failed, using synthetic audio fallback');
    }
}

function initializeTerminal() {
    window.terminal = new SileoJBTerminal();
    
    // Initialize audio elements with error handling
    initializeAudio();
    
    // Focus input when page loads
    setTimeout(() => {
        window.terminal.commandInput.focus();
    }, 1000);
    
    // Add performance optimizations
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    
    // Optimize for mobile keyboards
    if (window.terminal.isMobile()) {
        document.querySelector('meta[name=viewport]').setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Add some easter eggs
    const easterEggs = {
        'konami': () => {
            document.body.style.animation = 'rainbow 1s infinite';
            setTimeout(() => document.body.style.animation = '', 5000);
        }
    };
    
    // Konami code detection
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            easterEggs.konami();
            konamiCode = [];
        }
    });
}

// ====== CSS ANIMATIONS FOR RAINBOW EFFECT ======
const style = document.createElement('style');
style.textContent = `
@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}
`;
document.head.appendChild(style);
