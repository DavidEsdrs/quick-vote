import { useEffect, useState } from "react";

export function TimeRemaining({ poll, absolute }) {
    const [timer, setTimer] = useState();

    function calculateTimeRemaining(expiresIn) {
        const timeDiff = (new Date(expiresIn).getTime() - new Date().getTime()) / 1000;
        const numHours = Math.floor(timeDiff / 3600);
        const numMinutes = Math.floor((timeDiff % 3600) / 60);
        const numSeconds = Math.floor(timeDiff % 60);
        return { numHours, numMinutes, numSeconds };
    }
    
    function renderTime(num, unit) {
        return (
            <span>
                {num >= 10 ? num : `0${num}`}{unit}
            </span>
        );
    }

    const isPollClosed = (poll) => {
        return new Date() > new Date(poll.expiresIn)
    }
    
    const isClosed = isPollClosed(poll);
    const { numHours, numMinutes, numSeconds } = calculateTimeRemaining(poll.expiresIn.toLocaleString());
    
    let timeRemaining = null;
      
    if (!isClosed) {
        timeRemaining = renderTime(numHours, ':');
        
        const renderedMinutes = renderTime(numMinutes, ':');
        timeRemaining = timeRemaining ? [timeRemaining, renderedMinutes] : renderedMinutes;

        const renderedSeconds = renderTime(numSeconds);
        timeRemaining = timeRemaining ? [timeRemaining, renderedSeconds] : renderedSeconds;
    }

    useEffect(() => {
        const interval = setInterval(() => setTimer(timeRemaining), 1000);
        return () => clearInterval(interval);
    }, [setTimer, timer, timeRemaining]);

    return timeRemaining ? 
            <span className={`${absolute && "absolute"} w-fit right-2 bottom-2 bg-gradient-to-br from-green-500 to-blue-300 text-gray font-semibold px-2 rounded`}>
                lasts in: {timeRemaining}
            </span> : 
            <span className={`${absolute && "absolute"} w-fit right-2 bottom-2 bg-gradient-to-br from-green-500 to-blue-300 text-gray font-semibold px-2 rounded`}>
                poll closed
            </span>
}