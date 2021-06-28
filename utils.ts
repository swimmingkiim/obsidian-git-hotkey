
const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

export const getTimeStampInKST = () => {
    const currentTime = new Date();
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60 * 1000);
    const krTime = new Date(utc + (KR_TIME_DIFF));
    return krTime.toLocaleString('ko-KR');
}