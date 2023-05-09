export default function formatDateString(ISOString: string): string {
    return new Date(ISOString)
        .toLocaleDateString('en-EN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/\//g, '.');
}
