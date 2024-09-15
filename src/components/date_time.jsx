export const options = {
    weekday: 'long',  // "long", "short", "narrow" (e.g., "Saturday")
    year: 'numeric',  // "numeric", "2-digit" (e.g., "2024")
    month: 'long',    // "numeric", "2-digit", "long", "short", "narrow" (e.g., "August")
    day: 'numeric'    // "numeric", "2-digit" (e.g., "24")
};
export function FormatDate(dateTime) {
    let dateObject = new Date(dateTime)
    return dateObject.toLocaleDateString('en-US', options)
}
export function FormatTime(dateTime) {
    let dateObject = new Date(dateTime)
    return dateObject.toLocaleTimeString('en-US', options)
}

export const GetTimeDifference = (props) => {
    let now = new Date();
    let daysLeft, hoursLeft, minutesLeft, secondsLeft

    let timeDifference = new Date(props.futureDate) - now;
    if (timeDifference > 0){
        daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);
    }
    else{
        daysLeft = hoursLeft = minutesLeft = secondsLeft = 0
    }


    return (
        <div className="d-flex flex-row justify-content-center align-items-end">
            <span className="mx-1">
                <span className="fs-5 text-danger">{daysLeft}</span>
                <span className="small"> days</span>
            </span>

            <span className="mx-1">
                <span className="fs-5 text-danger">{hoursLeft}</span>
                <span className="small"> hrs</span>
            </span>

            <span className="mx-1">
                <span className="fs-5 text-danger">{minutesLeft}</span>
                <span className="small"> min</span>
            </span>

            <span className="mx-1">
                <span className="fs-5 text-danger">{secondsLeft}</span>
                <span className="small"> sec</span>
            </span>
        </div>
    )

}
