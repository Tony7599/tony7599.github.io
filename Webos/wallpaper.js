class Wallpaper {
    constructor() {
        this.currentWallpaper = localStorage.getItem('webos-wallpaper') || '';
        this.applyWallpaper();
    }

    applyWallpaper() {
        document.body.style.backgroundImage = this.currentWallpaper 
            ? `url(${this.currentWallpaper})`
            : 'none';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    setWallpaper(url) {
        this.currentWallpaper = url;
        localStorage.setItem('webos-wallpaper', url);
        this.applyWallpaper();
    }

    showWallpaperPicker() {
        const picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = 'image/*';
        picker.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setWallpaper(e.target.result);
            };
            reader.readAsDataURL(file);
        };
        picker.click();
    }
}

const wallpaper = new Wallpaper();
