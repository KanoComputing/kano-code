export function debounce(func : Function, wait : number) : Function {
    let timeout : number|null;
    return (...args : any[]) => {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout || undefined);
        timeout = window.setTimeout(later, wait);
    };
}

export default debounce;
