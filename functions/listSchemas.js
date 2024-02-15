import sql from 'mssql';
const listSchemas = async (config) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT DISTINCT schema_name FROM information_schema.schemata`;
    sql.close();
    return result?.recordset.map(row => row?.schema_name);
  } catch (err) {
    console.error('Error listing schemas:', err);
    sql.close();
    throw err;
  }
}
export default listSchemas;