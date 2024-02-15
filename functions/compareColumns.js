function compareColumns(columns1, columns2) {
  let differences = [];

  columns1.forEach(col1 => {
    const col2 = columns2.find(c => c.name === col1.name);
    if (!col2) {
      differences.push({ column: col1.name, reason: 'Missing column in destination database' });
    } else if (col1.type !== col2.type) {
      differences.push({ column: col1.name, reason: `Divergent type (DB1: ${col1.type}, DB2: ${col2.type})` });
    }
  });
  console.log({ point: 'columns', differences })

  return differences
}
export default compareColumns