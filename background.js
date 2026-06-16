chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.type !== 'CX_DOWNLOAD_FILE' || !message.data) {
        return undefined;
    }

    chrome.downloads.download({
        url: message.data.url,
        filename: message.data.filename,
        saveAs: false,
        conflictAction: 'uniquify'
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            sendResponse({
                ok: false,
                error: chrome.runtime.lastError.message
            });
            return;
        }

        sendResponse({
            ok: true,
            downloadId
        });
    });

    return true;
});
