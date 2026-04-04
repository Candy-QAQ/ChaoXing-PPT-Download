// 1. 注入拦截脚本
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected_spy.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);

// 2. 监听消息
window.addEventListener("message", function(event) {
    if (event.source !== window) return;

    if (event.data.type && event.data.type === "CX_PDF_FOUND") {
        showDownloadButton(event.data.data);
    }
});

// 3. 显示按钮
function showDownloadButton(fileData) {
    const existBtn = document.getElementById('cx-pdf-download-btn');
    if (existBtn) {
        existBtn.onclick = () => downloadFile(fileData.url, fileData.filename);
        existBtn.innerText = `下载: ${fileData.filename}`;
        return;
    }

    const btn = document.createElement('div');
    btn.id = 'cx-pdf-download-btn';
    btn.innerText = `发现课件: ${fileData.filename}`;
    btn.title = "点击下载 PDF";
    
    Object.assign(btn.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: '999999',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.3s',
        maxWidth: '300px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    });

    btn.onmouseenter = () => { btn.style.backgroundColor = '#45a049'; btn.style.transform = 'scale(1.05)'; };
    btn.onmouseleave = () => { btn.style.backgroundColor = '#4CAF50'; btn.style.transform = 'scale(1)'; };

    btn.onclick = function() {
        downloadFile(fileData.url, fileData.filename);
    };

    document.body.appendChild(btn);
}

function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}