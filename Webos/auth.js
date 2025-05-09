class Auth {
    constructor() {
        this.passwordHash = localStorage.getItem('webos-password');
        this.sessionTimeout = 300000; // 5分钟
    }

    setPassword(password) {
        this.passwordHash = this.hash(password);
        localStorage.setItem('webos-password', this.passwordHash);
    }

    checkPassword(password) {
        return this.hash(password) === this.passwordHash;
    }

    checkSession() {
        const lastActive = localStorage.getItem('webos-last-active');
        return Date.now() - lastActive < this.sessionTimeout;
    }

    updateSession() {
        localStorage.setItem('webos-last-active', Date.now());
    }

    hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }
}

const auth = new Auth();

// 在设置中添加密码设置
document.querySelector('#settings-app .app-content').innerHTML += `
    <div class="settings-option">
        <div class="settings-option-title">设置密码</div>
        <input type="password" id="set-password">
        <button onclick="setNewPassword()">保存</button>
    </div>
`;

function setNewPassword() {
    const password = document.getElementById('set-password').value;
    if (password.length >= 4) {
        auth.setPassword(password);
        alert('密码已设置！');
    } else {
        alert('密码至少需要4位！');
    }
}

function showPasswordPrompt() {
    document.getElementById('password-overlay').style.display = 'flex';
}

function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (auth.checkPassword(input)) {
        auth.updateSession();
        document.getElementById('password-overlay').style.display = 'none';
    } else {
        alert('密码错误！');
    }
}
