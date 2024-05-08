export function startCountdownTimer(
    startTime: number,
    duration: number,
    updateInterval: number,
    setCountdown: React.Dispatch<React.SetStateAction<{ hours: string, minutes: string, seconds: string }>>
): void {
    const timer = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingSeconds = startTime + duration - currentTime;

        if (remainingSeconds <= 0) {
            clearInterval(timer);
            setCountdown({ hours: '00', minutes: '00', seconds: '00' });
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
