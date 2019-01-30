function htmlImport(href : string) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.setAttribute('async', '');
        link.rel = 'import';
        link.onload = () => resolve();
        link.onerror = reject;
        link.href = href;
        document.head.appendChild(link);
    });
}

export default { htmlImport };
export { htmlImport };
