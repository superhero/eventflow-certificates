/**
 * @memberof Eventflow.Hub
 */
export default
{
  eventflow:
  {
    certificates:
    {
      CERT_PASS_ENCRYPTION_KEY    : process.env.EVENTFLOW_CERT_PASS_ENCRYPTION_KEY,
      CERT_ALGORITHM              : process.env.EVENTFLOW_CERT_ALGORITHM              ?? 'EdDSA:Ed448',
      CERT_HASH                   : process.env.EVENTFLOW_CERT_HASH                   ?? 'SHA512',
      CERT_PASS_CIPHER            : process.env.EVENTFLOW_CERT_PASS_CIPHER            ?? 'aes-256-gcm',
      CERT_ROOT_DAYS              : process.env.EVENTFLOW_CERT_ROOT_DAYS              ?? '365',
      CERT_INTERMEDIATE_DAYS      : process.env.EVENTFLOW_CERT_INTERMEDIATE_DAYS      ?? '30',
      CERT_LEAF_DAYS              : process.env.EVENTFLOW_CERT_LEAF_DAYS              ?? '7',
      CERT_PASS_PBKDF2_HASH       : process.env.EVENTFLOW_CERT_PASS_PBKDF2_HASH       ?? 'sha512',
      CERT_PASS_PBKDF2_BYTES      : process.env.EVENTFLOW_CERT_PASS_PBKDF2_BYTES      ?? '32',
      CERT_PASS_PBKDF2_ITERATIONS : process.env.EVENTFLOW_CERT_PASS_PBKDF2_ITERATIONS ?? '1000000'
    }
  }
}