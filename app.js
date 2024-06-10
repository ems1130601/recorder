

//調用loadLogs和loadNotes，從localStorage
//等待文檔完全加載後執行
document.addEventListener('DOMContentLoaded', (event) => {
    loadLogs();  //從localstorage加載日制紀錄，顯示在頁面
    loadNotes(); //從localstorage加載備忘錄，顯示在頁面
    setLockStatus(getLockStatusFromStorage());  // 初始設置為解鎖狀態
    updateTime(); //更新當前時間
    setInterval(updateTime, 1000); // 每秒更新一次時間
});

//更新時間並顯示
function updateTime() {
    const now = new Date(); //獲取當前時間
    const hours = now.getHours().toString().padStart(2, '0'); //格式化小時
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('current-time').innerText = currentTimeString;
}

//紀錄藥物時間
function recordTime(medicine) {
    const now = new Date();
    const month = now.getMonth() + 1; // 月份從0開始，所以要加1
    const day = now.getDate(); //獲取日期
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 將時間格式化為中式格式，去掉年份
    const formattedTime = `${month}月${day}日 ${hours}時${minutes}分${seconds}秒`;

    // 顯示記錄
    const logElement = document.getElementById('log'); //獲取新的日志紀錄元素
    const newLog = document.createElement('div'); //創建新的日志紀錄元素
    newLog.innerHTML = `${medicine}，${formattedTime} <span class="delete-btn" onclick="deleteLog(this)">刪除</span>`; //設置日志內容
    logElement.appendChild(newLog); //將新的日志添加到日志紀錄元素中

    // 保存至localStorage
    saveLogs();
}

//保存到localstorage
function saveLogs() {
    const logElement = document.getElementById('log');
    localStorage.setItem('logs', logElement.innerHTML);
}

//從localstorage加載
function loadLogs() {
    const logs = localStorage.getItem('logs');
    if (logs) {
        document.getElementById('log').innerHTML = logs;
    }
}

document.getElementById('notes').addEventListener('input', () => {
    saveNotes(); //調用
});

//保存備忘錄到localstorage
function saveNotes() {
    const notes = document.getElementById('notes').value;
    localStorage.setItem('notes', notes);
}

//加載備忘錄localstorage
function loadNotes() {
    const notes = localStorage.getItem('notes');
    if (notes) {
        document.getElementById('notes').value = notes;
    }
}

function resetAll() {
    // 清除記錄和備忘錄
    if (confirm('您確定要重置嗎？')){
    document.getElementById('log').innerHTML = '';
    document.getElementById('notes').value = '';
    localStorage.removeItem('logs');
    localStorage.removeItem('notes');
    setLockStatus(false); // 重置為解鎖狀態
    }
}

//切換鎖定狀態
function toggleLock() {
    const notes = document.getElementById('notes');
    const isLocked = notes.hasAttribute('readonly');
    setLockStatus(!isLocked); //!是和當前狀態相反
}

//鎖定狀態
function setLockStatus(isLocked) {
    const lockBtn = document.getElementById('lock-btn');
    const notes = document.getElementById('notes');
    
    if (isLocked) {
        notes.setAttribute('readonly', 'true');
        lockBtn.textContent = '解鎖';
    } else {
        notes.removeAttribute('readonly');
        lockBtn.textContent = '鎖定';
    }

    localStorage.setItem('notesLocked', isLocked);
}

//从 localStorage 获取备忘录的锁定状态。
function getLockStatusFromStorage() {
    return JSON.parse(localStorage.getItem('notesLocked')) || false;
}


//刪除藥物紀錄
function deleteLog(element) {
    if (confirm('您確定要刪除此記錄嗎？')) {
        element.parentElement.remove();
        saveLogs();
    }
}