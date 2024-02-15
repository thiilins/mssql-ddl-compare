import compareColumns from './compareColumns.js'
import compareIndexes from './compareIndexes.js'
import compareKeys from './compareKeys.js'
const compareTableDetails = (details1, details2) => {
  let differences = []
  // Comparação de detalhes1 contra detalhes2 (Origem contra Destino)
  details1.forEach(detail1 => {
    const detail2 = details2.find(d => d.tableName === detail1.tableName);
    if (!detail2) {
      differences.push({ table: detail1.tableName, reason: 'Missing table in second database' });
    } else {
      // Comparar colunas
      let columnDifferences = compareColumns(detail1.columns, detail2.columns);
      // Comparar Índices
      let indexDifferences = compareIndexes(detail1.indexes, detail2.indexes);
      // Comparar Chaves
      let keyDifferences = compareKeys(detail1.keys, detail2.keys);

      if (columnDifferences.length > 0 || indexDifferences.length > 0 || keyDifferences.length > 0) {
        differences.push({
          table: detail1.tableName,
          schema: detail1.schema,
          columnDifferences,
          indexDifferences,
          keyDifferences
        });
      }
    }
  });

  return differences
}


export default compareTableDetails