// control-center.js
class ControlCenter {
    constructor() {
        this.isShowing = false;
        this.initElements();
        this.setupEventListeners();
        this.updateStatus();
    }

    initElements() {
        // 创建控制中心DOM结构
        const ccHTML = `
            <div class="control-center">
                <div class="cc-header">
                    <div class="cc-time">${this.getCurrentTime()}</div>
                    <div class="cc-title">控制中心</div>
                </div>
                <div class="cc-grid">
                    <!-- 快速设置 -->
                    <div class="cc-quick-settings">
                        <div class="cc-item" data-action="wifi">
                            <div class="cc-icon">📶</div>
                            <div class="cc-label">Wi-Fi</div>
                        </div>
                        <div class="cc-item" data-action="bluetooth">
                            <div class="cc-icon">🔵</div>
                            <div class="cc-label">蓝牙</div>
                        </div>
                        <div class="cc-item" data-action="darkmode">
                            <div class="cc-icon">🌓</div>
                            <div class="cc-label">深色模式</div>
                        </div>
                        <div class="cc-item" data-action="rotation">
                            <div class="cc-icon">🔄</div>
                            <div class="cc-label">旋转锁定</div>
                        </div>
                    </div>
                    
                    <!-- 亮度控制 -->
                    <div class="cc-brightness">
                        <div class="cc-icon">🔆</div>
                        <input type="range" min="0" max="100" value="80" class="cc-slider">
                    </div>
                    
                    <!-- 媒体控制 -->
                    <div class="cc-media-control">
                        <div class="cc-media-info">
                            <div class="cc-media-artist">未播放</div>
                            <div class="cc-media-title">无媒体</div>
                        </div>
                        <div class="cc-media-buttons">
                            <button class="cc-media-btn" data-action="prev">⏮</button>
                            <button class="cc-media-btn" data-action="play">⏯</button>
                            <button class="cc-media-btn" data-action="next">⏭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', ccHTML);
    }

    setupEventListeners() {
        // 触摸事件处理
        let startY = 0;
        let isDragging = false;

        document.addEventListener('touchstart', e => {
            if (window.scrollY === 0 && e.touches[0].clientY < 50) {
                startY = e.touches[0].clientY;
                isDragging = true;
            }
        });

        document.addEventListener('touchmove', e => {
            if (!isDragging) return;
            
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0 && !this.isShowing) {
                const progress = Math.min(deltaY / 200, 1);
                this.setOpenProgress(progress);
            } else if (deltaY < 0 && this.isShowing) {
                const progress = 1 - Math.min(-deltaY / 200, 1);
                this.setOpenProgress(progress);
            }
        });

        document.addEventListener('touchend', e => {
            if (!isDragging) return;
            isDragging = false;
            
            const currentY = e.changedTouches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 100 && !this.isShowing) {
                this.show();
            } else if (deltaY < -100 && this.isShowing) {
                this.hide();
            } else {
                this.isShowing ? this.show() : this.hide();
            }
        });

        // 按钮点击事件
        document.querySelectorAll('.cc-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleAction(action);
            });
        });

        // 亮度滑块
        document.querySelector('.cc-slider').addEventListener('input', e => {
            this.setBrightness(e.target.value);
        });

        // 媒体控制按钮
        document.querySelectorAll('.cc-media-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleMediaAction(action);
            });
        });
    }

    handleAction(action) {
        switch(action) {
            case 'wifi':
                this.toggleWifi();
                break;
            case 'bluetooth':
                this.toggleBluetooth();
                break;
            case 'darkmode':
                this.toggleDarkMode();
                break;
            case 'rotation':
                this.toggleRotationLock();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleMediaAction(action) {
        // 这里可以集成实际的媒体控制逻辑
        console.log('Media action:', action);
    }

    toggleWifi() {
        const wifiItem = document.querySelector('.cc-item[data-action="wifi"]');
        const isActive = wifiItem.classList.toggle('active');
        localStorage.setItem('cc-wifi', isActive);
        console.log('Wi-Fi:', isActive ? '开启' : '关闭');
    }

    toggleBluetooth() {
        const btItem = document.querySelector('.cc-item[data-action="bluetooth"]');
        const isActive = btItem.classList.toggle('active');
        localStorage.setItem('cc-bluetooth', isActive);
        console.log('蓝牙:', isActive ? '开启' : '关闭');
    }

    toggleDarkMode() {
        const darkModeItem = document.querySelector('.cc-item[data-action="darkmode"]');
        const isActive = darkModeItem.classList.toggle('active');
        document.documentElement.setAttribute('data-theme', isActive ? 'dark' : 'light');
        localStorage.setItem('webos-theme', isActive ? 'dark' : 'light');
    }

    toggleRotationLock() {
        const rotationItem = document.querySelector('.cc-item[data-action="rotation"]');
        const isActive = rotationItem.classList.toggle('active');
        localStorage.setItem('cc-rotation', isActive);
        screen.orientation.lock(isActive ? 'portrait' : 'any').catch(e => {
            console.log('Orientation lock failed:', e);
        });
    }

    setBrightness(value) {
        document.documentElement.style.setProperty('--brightness', `${value}%`);
        localStorage.setItem('cc-brightness', value);
    }

    setOpenProgress(progress) {
        document.querySelector('.control-center').style.transform = `translateY(${(progress - 1) * 100}%)`;
        document.querySelector('.control-center').style.opacity = progress;
    }

    show() {
        this.isShowing = true;
        document.querySelector('.control-center').style.transform = 'translateY(0)';
        document.querySelector('.control-center').style.opacity = '1';
        this.updateStatus();
    }

    hide() {
        this.isShowing = false;
        document.querySelector('.control-center').style.transform = 'translateY(-100%)';
        document.querySelector('.control-center').style.opacity = '0';
    }

    toggle() {
        this.isShowing ? this.hide() : this.show();
    }

    updateStatus() {
        // 更新Wi-Fi状态
        const wifiActive = localStorage.getItem('cc-wifi') === 'true';
        if (wifiActive) {
            document.querySelector('.cc-item[data-action="wifi"]').classList.add('active');
        }

        // 更新蓝牙状态
        const btActive = localStorage.getItem('cc-bluetooth') === 'true';
        if (btActive) {
            document.querySelector('.cc-item[data-action="bluetooth"]').classList.add('active');
        }

        // 更新深色模式状态
        const darkModeActive = localStorage.getItem('webos-theme') === 'dark';
        if (darkModeActive) {
            document.querySelector('.cc-item[data-action="darkmode"]').classList.add('active');
        }

        // 更新旋转锁定状态
        const rotationLocked = localStorage.getItem('cc-rotation') === 'true';
        if (rotationLocked) {
            document.querySelector('.cc-item[data-action="rotation"]').classList.add('active');
        }

        // 更新亮度
        const brightness = localStorage.getItem('cc-brightness') || 80;
        document.querySelector('.cc-slider').value = brightness;
        document.documentElement.style.setProperty('--brightness', `${brightness}%`);

        // 更新时间
        document.querySelector('.cc-time').textContent = this.getCurrentTime();
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// 初始化控制中心
const controlCenter = new ControlCenter();

// 全局访问
window.toggleControlCenter = () => controlCenter.toggle();
window.toggleDarkMode = () => controlCenter.toggleDarkMode();
