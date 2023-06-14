export function getElement(element) {
    if(typeof(element) === "string") {
        return document.getElementById(element);
    }
    if(element instanceof HTMLElement) {
        return element;
    }
    return undefined;
}
