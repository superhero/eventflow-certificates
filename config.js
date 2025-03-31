/**
 * @memberof Eventflow.Hub
 */
export default
{
  certificates:
  {
    CERT_ALGORITHM              : process.env.EVENTFLOW_CERT_ALGORITHM,
    CERT_HASH                   : process.env.EVENTFLOW_CERT_HASH,
    CERT_PASS_CIPHER            : process.env.EVENTFLOW_CERT_PASS_CIPHER,
    CERT_PASS_ENCRYPTION_KEY    : process.env.EVENTFLOW_CERT_PASS_ENCRYPTION_KEY,
    CERT_PASS_PBKDF2_HASH       : process.env.EVENTFLOW_CERT_PASS_PBKDF2_HASH,
    CERT_PASS_PBKDF2_BYTES      : process.env.EVENTFLOW_CERT_PASS_PBKDF2_BYTES,
    CERT_PASS_PBKDF2_ITERATIONS : process.env.EVENTFLOW_CERT_PASS_PBKDF2_ITERATIONS,
  }
}