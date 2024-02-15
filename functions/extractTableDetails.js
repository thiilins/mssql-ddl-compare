import sql from 'mssql';

const extractTableDetails = async (config, schema) => {
  let tablesDetails = [];

  await sql.connect(config);
  try {
    const tables = await sql.query`SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = ${schema}`;

    for (let table of tables.recordset) {
      const tableName = `[${table.TABLE_SCHEMA}].[${table.TABLE_NAME}]`;
      const columnsQuery = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${table.TABLE_SCHEMA}' AND TABLE_NAME = '${table.TABLE_NAME}'`;

      const columns = await sql.query(columnsQuery);
      const indexesQuery = `
        SELECT i.name AS IndexName, COL_NAME(ic.object_id, ic.column_id) AS ColumnName
        FROM sys.indexes AS i
        INNER JOIN sys.index_columns AS ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        WHERE i.object_id = OBJECT_ID('${tableName}') AND i.is_primary_key = 0 AND i.is_unique_constraint = 0`;

      const indexes = await sql.query(indexesQuery);

      const keysQuery = `
        SELECT 
          CONSTRAINT_NAME, CONSTRAINT_TYPE 
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = '${table.TABLE_SCHEMA}' AND TABLE_NAME = '${table.TABLE_NAME}'`;

      const keys = await sql.query(keysQuery);

      tablesDetails.push({
        schema: table.TABLE_SCHEMA,
        tableName: table.TABLE_NAME,
        columns: columns.recordset.map(col => ({ name: col.COLUMN_NAME, type: col.DATA_TYPE })),
        indexes: indexes.recordset.map(index => ({ name: index.IndexName, columnName: index.ColumnName })),
        keys: keys.recordset.map(key => ({ name: key.CONSTRAINT_NAME, type: key.CONSTRAINT_TYPE }))
      });
    }
  } catch (err) {
    console.error('Error extracting table details:', err);
  } finally {
    await sql.close();
  }

  return tablesDetails;
}
export default extractTableDetails;