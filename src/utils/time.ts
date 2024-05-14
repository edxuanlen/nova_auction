export function startCountdownTimer(
    startTime: number,
    duration: number,
    updateInterval: number,
    setCountdown: React.Dispatch<React.SetStateAction<{ hours: string, minutes: string, seconds: string }>>,
    onCountdownEnd: () => void
): void {
    const timer = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingSeconds = startTime + duration - currentTime;

        if (remainingSeconds <= 0) {
            clearInterval(timer);
            setCountdown({ hours: '00', minutes: '00', seconds: '00' });
            onCountdownEnd();
            return;
        }

        const hours = Math.floor((remainingSeconds % 86400) / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = Math.floor((remainingSeconds % 3600) % 60);

        setCountdown({
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
        });
    }, updateInterval * 1000);
}

export function convertSecTsToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}


export const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
};
