import { getState, setState } from "../../store";

export function setViewport(viewport) {
    setState({
        viewport: {
            x: viewport.x,
            y: viewport.y,
            zoom: viewport.zoom
        }
    });

    return viewport;
}

export function getViewport() {
    const { viewport } = getState();
    return viewport;
}

export function zoomIn(factor = 1.2) {
    const { viewport } = getState();
    const newViewport = {
        x: viewport.x,
        y: viewport.y,
        zoom: Math.min(viewport.zoom * factor, 2)
    };

    setViewport(newViewport);
    return newViewport;
}

export function zoomOut(factor = 0.8) {
    const { viewport } = getState();

    const newViewport = {
        x: viewport.x,
        y: viewport.y,
        zoom: Math.max(viewport.zoom * factor, 0.5)
    };

    setViewport(newViewport);
    return newViewport;
}

export function resetViewport() {
    const newViewport = {
        x: 0,
        y: 0,
        zoom: 1
    };

    setViewport(newViewport);
    return newViewport;
}

export function centerViewport(x, y) {
    const { viewport } = getState();

    const newViewport = {
        x: -x * viewport.zoom + window.innerWidth / 2,
        y: -y * viewport.zoom + window.innerHeight / 2,
        zoom: viewport.zoom
    };

    setViewport(newViewport);
    return newViewport;
}
