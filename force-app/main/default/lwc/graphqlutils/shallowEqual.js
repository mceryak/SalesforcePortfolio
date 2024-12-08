
export default function shallowEqual(obj1, obj2) {
    // Check if the objects are the same reference
    if (obj1 === obj2) return true;
  
    // Check if the objects have the same number of keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
  
    // Check if all keys and values match
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) return false;
    }
  
    return true;
}