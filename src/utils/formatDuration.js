export function formatDuration(minutes) {
    if (!minutes) return 'None';

    if (minutes < 60) {
        return `${minutes} minutes`;
    }

    if (minutes % 60 === 0) {
        return `${minutes / 60} hours`;
    }

    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
