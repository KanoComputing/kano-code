function htmlImport(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.async = true;
        link.rel = 'import';
        link.onload = () => resolve();
        link.onerror = reject;
        link.href = href;
        document.head.appendChild(link);
    });
}

export default { htmlImport };
export { htmlImport };
