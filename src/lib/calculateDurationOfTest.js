const calculateDurationOfTest = (start, end) => {
    if (typeof start === 'string') start = new Date(start);
    if (typeof end === 'string') end = new Date(end);
    if (!(start instanceof Date) || !(end instanceof Date)) {
        throw new Error('Both start and end must be Date objects.');
    }
    const startTime = start.getTime();
    const endTime = end.getTime();
    const durationMs = endTime - startTime;
    if (durationMs < 0) {
        throw new Error('End time must be after start time.');
    }
    const timeDifferenceMinutes = durationMs / (1000 * 60);
    return {
        "minutes": Math.floor(timeDifferenceMinutes),
        "seconds": Math.round((timeDifferenceMinutes - Math.floor(timeDifferenceMinutes)) * 60)
    }
}

export default calculateDurationOfTest; 