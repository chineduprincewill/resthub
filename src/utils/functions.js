export const getYears = (start, end) => {
    let years = [];

    for (let i = start; i <= end; i++){
        years.push(i)
    }

    return years;
}

export const formatErrors = (str) => {
    let chars = ['-', '_', '!', '*', '{', '}', ':', '"', '[', ']', '\\'];
    let escapedChars = chars.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    let regex = new RegExp(escapedChars.join('|'), 'g');
    return str.replace(regex, '');
}

export const getConditionLabel = (code) => {
    const conditions = [
        { code: '1', label: 'Excellent' },
        { code: '4', label: 'Usable' },
        { code: '7', label: 'Repairable' },
        { code: 'X', label: 'Salvage' },
        { code: 'S', label: 'Scrap' }
    ];

    const condition = conditions.find(cnd => cnd.code === String(code));
    return condition ? condition.label : code; // Return original code if not found
}

export const statusColor = (stat) => {
    switch(stat) {
        case 'Active':
            return 'text-green-500';
        case 'Disabled':
            return 'text-red-500';
        case 'pending...':
            return 'text-orange-600';
        case 'resolved...':
            return 'text-green-600';
        case 'declined...':
            return 'text-red-600';
        default:
            return 'text-muted-foreground';
    }
}

export const compareJsonAndGetDifferences = (obj1, obj2) => {
    const differences = {};
    obj1 = JSON.parse(obj1);
    obj2 = JSON.parse(obj2);
    
    // Get all keys from both objects
    const allKeys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];
    
    // Find common keys
    const commonKeys = allKeys.filter(key => 
        obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)
    );
    
    // Compare common keys
    commonKeys.forEach(key => {
        // Handle nested objects recursively
        if (typeof obj1[key] === 'object' && obj1[key] !== null && 
            typeof obj2[key] === 'object' && obj2[key] !== null) {
            
            const nestedDiff = compareJsonAndGetDifferences(obj1[key], obj2[key]);
            if (Object.keys(nestedDiff).length > 0) {
                differences[key] = {
                    old: obj1[key],
                    new: obj2[key]
                };
            }
        } 
        // Compare primitive values
        else if (obj1[key] !== obj2[key]) {
            differences[key] = {
                old: obj1[key],
                new: obj2[key]
            };
        }
    });
    
    return differences;
}


export const formatDateAndTime = (dt) => {

    const date = new Date(dt);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${monthNames[month]} ${day}, ${year} ${hour}:${minutes}:${seconds}`;
}

export const shouldRenderField = (field, formData) => {
    // If no dependency, always render
    if (field.depends_on === 'none') return true;
  
    const dependentKey = field.depends_on;
  
    // If the dependent field hasn't been filled yet
    if (!(dependentKey in formData)) return false;
  
    // Check if value matches the logic condition
    return formData[dependentKey] === field.logic;
}

export const isDate = (value) => {
    return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value);
}

export const generateYears = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => ({
        title: String(start + i),
    }));
}

export const isDateLike = (v) => {
    if (typeof v !== 'string') return false;
    // Strict YYYY-MM-DD only
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    return !isNaN(new Date(v + 'T00:00:00').getTime());
};


export const formatRequestsReason = (action_on) => {
    switch(action_on) {
        case 'Shipment Date':
            return 'Please revert shipping on ';
        case 'Receive Sample':
            return 'Please revert sample receipt on ';
        default:
            return `Please revert ${action_on} on `;
    }
};


export const getUniqueKeys = (arr) => {
    const keys = new Set();
  
    arr.forEach(obj => {
      const objKeys = Object.keys(obj);
      // Skip the first key (index 0)
      objKeys.slice(1).forEach(key => keys.add(key));
    });
  
    return [...keys];
};


export const generateHexColors = (count) => {
    const colors = [];
  
    for (let i = 0; i < count; i++) {
      // Generate a random number, convert to hex, pad to 6 digits
      const hex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0');
  
      colors.push(`#${hex}`);
    }
  
    return colors;
}