
// Format date to Thursday 23rd April 2023
export function FormatDateTime(dateTime, options) {
    // Include the day of the week in the options object
    const dayOfWeek = new Date(dateTime).toLocaleDateString('en-US', { weekday: 'long' });
    const dayOfWeekFormatted = `${dayOfWeek}, ${new Date(dateTime).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    return dayOfWeekFormatted;
}
