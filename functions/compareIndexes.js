function compareIndexes(indexes1, indexes2) {
  let differences = []
  // Destino = Origem
  // Comparação de índices de origem para destino
  indexes1.forEach(index1 => {
    const index2 = indexes2.find(i => i.name === index1.name);
    if (!index2) {
      differences.push({ index: index1.name, reason: 'Missing index in destination database' });
    } else {
      // Comparar as colunas do índice
      const index1Columns = index1.columns.sort().join(',');
      const index2Columns = index2.columns.sort().join(',');
      if (index1Columns !== index2Columns) {
        differences.push({ index: index1.name, reason: `Divergent index columns (DB1: ${index1Columns}, DB2: ${index2Columns})` });
      }
    }
  });
  console.log({ point: 'Indexes', differences })
  return differences
}
export default compareIndexes;