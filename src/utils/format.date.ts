function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleString('en-US', options);
}

function formatDate2(dateString: string) {
    const date: Date = new Date(dateString);
    const diffInMilliseconds: number = new Date().getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else {
        return `${diffInDays} days ago`;
    }
}

export { formatDate, formatDate2 };