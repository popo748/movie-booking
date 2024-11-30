export function useDateFormatter(){
    function formatToReadable(isoDate){
        const date = new Date(isoDate)
        const options = {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'}
        return date.toLocaleDateString('en-MY', options)
    }

    function get24HourTime(isoDate){
        const date = new Date(isoDate)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`

        // const date = new Date(isoDate)
        // return date.toLocaleTimeString('en-US', {
        //     hour: 'numeric',
        //     minute: '2-digit',
        //     hour12: true
        // });
    }

    function formatToIsoDate(date){
        const isoDate = date.toISOString().split('T')[0];
        return isoDate
    }

    function isISODate(str){
        if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    
        const date = new Date(str);
        return date instanceof Date && 
            !isNaN(date) && 
            date.toISOString().slice(0,10) === str;
    }

    return {formatToReadable, get24HourTime, formatToIsoDate, isISODate}
}

export function useTypeValidator(){
    function isNumeric(str){
        // Handle empty or whitespace-only strings
    if (typeof str === 'string' && str.trim() === '') return false;
    
    // Handle non-string inputs
    if (typeof str !== 'string' && typeof str !== 'number') return false;
    
    // Convert to string and try parsing
    return !isNaN(str) && !isNaN(parseFloat(str))
    }

    function removeNulls(params){
        return Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value != null)
        )
    }

    return {isNumeric, removeNulls}
}