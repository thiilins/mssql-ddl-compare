function compareKeys(keys1, keys2) {
  let differences = [];

  keys1.forEach(key1 => {
    const key2 = keys2.find(k => k.name === key1.name);
    if (!key2) {
      differences.push({ key: key1.name, reason: 'Missing key in second database' });
    } else if (key1.type !== key2.type) {
      differences.push({ key: key1.name, reason: `Divergent key type (DB1: ${key1.type}, DB2: ${key2.type})` });
    }
  });



  return differences;
}
export default compareKeys