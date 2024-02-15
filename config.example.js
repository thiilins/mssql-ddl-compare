const defaultConfigValues = {
  options: {
    trustServerCertificate: true,
  }
}
const config = {
  origin: {
    user: "user",
    password: "password",
    server: "host",
    port: 1443,
    database: "database",
    ...defaultConfigValues
  },
  destiny: {
    user: "user",
    password: "password",
    server: "host",
    port: 1443,
    database: "database",
    ...defaultConfigValues
  },
};
export default config;