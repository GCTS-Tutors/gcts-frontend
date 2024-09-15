export function titleCase(sentence) {
    var splitStr = sentence.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

export function ColorUrgency(urgency) {
    let urgencyColor, stringSet

    stringSet = urgency ? urgency.toString().toLowerCase() : ''
    switch (stringSet) {
        case 'high':
            urgencyColor = 'text-high-urgency'
            break;

        case 'medium':
            urgencyColor = 'text-medium-urgency'
            break;

        case 'complete':
            urgencyColor = 'text-pending'
            break;

        case 'pending':
            urgencyColor = 'text-medium-urgency'
            break;

        case '':
            urgencyColor = 'text-low-urgency';
            break;

        default:
            urgencyColor = 'text-low-urgency'
            break
    }
    return urgencyColor
}

export function BackgroundColor(urgency) {
    let urgencyColor, stringSet

    stringSet = urgency ? urgency.toString().toLowerCase() : ''
    switch (stringSet) {
        case 'high':
            urgencyColor = 'bg-high-urgency'
            break;

        case 'medium':
            urgencyColor = 'bg-medium-urgency'
            break;

        case 'low':
            urgencyColor = 'bg-pending'
            break;

        case 'pending':
            urgencyColor = 'bg-medium-urgency'
            break;

        case '':
            urgencyColor = 'bg-low-urgency';
            break;

        default:
            urgencyColor = 'bg-low-urgency'
            break
    }
    return urgencyColor
}