class AppStore {
    constructor() {
        this.availableApps = [
            {
                id: 'notes',
                name: '笔记',
                icon: '📝',
                description: '简单的笔记应用',
                html: '<div class="app-window">...</div>'
            },
            {
                id: 'music',
                name: '音乐',
                icon: '🎵',
                description: '音乐播放器',
                html: '<div class="app-window">...</div>'
            }
        ];
    }

    showAppDetail(appId) {
        const app = this.availableApps.find(a => a.id === appId);
        const detail = document.getElementById('app-detail');
        detail.querySelector('#detail-title').textContent = app.name;
        detail.querySelector('#detail-description').textContent = app.description;
        detail.style.display = 'block';
    }

    handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(e.target.result, "text/html");
            
            const appData = {
                id: `custom-${Date.now()}`,
                name: file.name.replace('.html', ''),
                icon: doc.querySelector('link[rel="icon"]')?.href || '📄',
                description: doc.querySelector('meta[name="description"]')?.content || '自定义应用',
                html: e.target.result,
                custom: true
            };
            
            appManager.installApp(appData);
        };
        reader.readAsText(file);
    }
}

const appStore = new AppStore();

// 在设置应用中添加上传按钮
document.querySelector('#settings-app .app-content').innerHTML += `
    <div class="settings-option">
        <div class="settings-option-title">安装本地应用</div>
        <input type="file" id="html-upload" accept=".html" hidden>
        <button onclick="document.getElementById('html-upload').click()">选择文件</button>
    </div>
`;

document.getElementById('html-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.html')) {
        appStore.handleFileUpload(file);
    }
});
