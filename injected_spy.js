(function() {
    console.log("PDF 嗅探器已就绪...");

    // 1. 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', function() {
            if (this._url && this._url.indexOf('flag=normal') !== -1) {
                try {
                    const responseData = JSON.parse(this.responseText);
                    checkAndNotify(responseData, "XHR");
                } catch (e) {}
            }
        });
        return originalSend.apply(this, arguments);
    };

    // 2. 拦截 Fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        const clone = response.clone();
        if (response.url && response.url.indexOf('flag=normal') !== -1) {
            try {
                const data = await clone.json();
                checkAndNotify(data, "Fetch");
            } catch (e) {}
        }
        return response;
    };

    function checkAndNotify(json, type) {
        if (json && json.pdf) {
            console.log(`[嗅探成功-${type}] 发现 PDF:`, json.filename);
            window.postMessage({
                type: "CX_PDF_FOUND",
                data: {
                    url: json.pdf,
                    filename: json.filename || "course_ware.pdf"
                }
            }, "*");
        }
    }
})();