class AppManager {
    constructor() {
        this.installedApps = JSON.parse(localStorage.getItem('webos-apps') || '[]');
        this.initDefaultApps();
    }

    initDefaultApps() {
        const defaultApps = ['settings', 'calculator', 'camera', 'browser', 'appstore', 'photos'];
        defaultApps.forEach(app => {
            if (!this.installedApps.find(a => a.id === app)) {
                this.installedApps.push({
                    id: app,
                    name: document.querySelector(`[onclick*="${app}"] .app-icon-name`)?.textContent || app,
                    icon: document.querySelector(`[onclick*="${app}"] .app-icon-image`)?.textContent || '📱',
                    system: true
                });
            }
        });
        this.saveApps();
    }

    installApp(appData) {
        if (!this.installedApps.find(a => a.id === appData.id)) {
            this.installedApps.push(appData);
            this.saveApps();
            this.renderHomeScreen();
        }
    }

    uninstallApp(appId) {
        this.installedApps = this.installedApps.filter(a => a.id !== appId);
        this.saveApps();
        this.renderHomeScreen();
    }

    saveApps() {
        localStorage.setItem('webos-apps', JSON.stringify(this.installedApps));
    }

    renderHomeScreen() {
        const homeScreen = document.querySelector('.home-screen');
        homeScreen.innerHTML = '';
        
        this.installedApps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'app-icon';
            icon.innerHTML = `
                <div class="app-icon-image">${app.icon}</div>
                <div class="app-icon-name">${app.name}</div>
            `;
            icon.onclick = () => app.system ? openApp(app.id) : openAppDetail(app);
            homeScreen.appendChild(icon);
        });
    }
}

const appManager = new AppManager();
