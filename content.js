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
    const displayName = normalizeFilename(fileData.filename, fileData.url);
    const existBtn = document.getElementById('cx-pdf-download-btn');
    if (existBtn) {
        existBtn.onclick = () => downloadFile(fileData.url, displayName);
        existBtn.innerText = displayName;
        return;
    }

    const btn = document.createElement('div');
    btn.id = 'cx-pdf-download-btn';
    btn.innerText = displayName;
    btn.title = "点击直接下载课件";
    
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
        maxWidth: 'min(560px, calc(100vw - 40px))',
        lineHeight: '1.5',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word'
    });

    btn.onmouseenter = () => { btn.style.backgroundColor = '#45a049'; btn.style.transform = 'scale(1.05)'; };
    btn.onmouseleave = () => { btn.style.backgroundColor = '#4CAF50'; btn.style.transform = 'scale(1)'; };

    btn.onclick = function() {
        downloadFile(fileData.url, displayName);
    };

    document.body.appendChild(btn);
}

function downloadFile(url, filename) {
    chrome.runtime.sendMessage({
        type: 'CX_DOWNLOAD_FILE',
        data: { url, filename }
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('下载请求发送失败:', chrome.runtime.lastError.message);
            return;
        }
        if (!response || !response.ok) {
            console.error('下载失败:', response && response.error ? response.error : '未知错误');
        }
    });
}

function normalizeFilename(filename, url) {
    const decoded = decodeSafe(filename) || decodeSafe(extractNameFromUrl(url)) || 'course_ware.pdf';
    const cleaned = decoded.replace(/[<>:"/\\|?*]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (/\.[a-z0-9]{2,8}$/i.test(cleaned)) {
        return cleaned;
    }
    return `${cleaned || 'course_ware'}.pdf`;
}

function extractNameFromUrl(url) {
    try {
        const pathname = new URL(url).pathname;
        return pathname.split('/').pop() || '';
    } catch (error) {
        return '';
    }
}

function decodeSafe(value) {
    if (!value) {
        return '';
    }
    try {
        return decodeURIComponent(value);
    } catch (error) {
        return value;
    }
}
