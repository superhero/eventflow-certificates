# @superhero/eventflow-certificates

**Version:** 4.0.0

Eventflow Certificates is a TLS certificates management library designed for use within the Eventflow ecosystem. It handles the creation, management, and lifecycle of root, intermediate, and leaf certificates with encryption and secure storage capabilities.

---

## Installation

```bash
npm install @superhero/eventflow-certificates
```

---

## Features

- Root, intermediate, and leaf certificate generation
- Secure encryption and storage of private keys and passwords
- Automatic certificate renewal upon expiration
- Configurable encryption algorithms and certificate parameters
- Lazy-loading with caching to minimize resource usage
- Easy integration with Eventflow's database layer

---

## Dependencies

- [@superhero/eventflow-db](https://npmjs.com/package/@superhero/eventflow-db)
- [@superhero/log](https://npmjs.com/package/@superhero/log)
- [@superhero/openssl](https://npmjs.com/package/@superhero/openssl)
- [@superhero/deep](https://npmjs.com/package/@superhero/deep)

---

## Usage

### Example

```javascript
import Certificates from '@superhero/eventflow-certificates';
import Locator      from '@superhero/locator';
import Config       from '@superhero/config';

const locator = new Locator();
const config  = new Config();
await config.add('@superhero/eventflow-db');
locator.set('@superhero/config', config);

const db = await locator.lazyload('@superhero/eventflow-db');

const configData = 
{
  CERT_PASS_ENCRYPTION_KEY : 'encryptionKey123',
  CERT_ROOT_DAYS           : 365,
  CERT_INTERMEDIATE_DAYS   : 30,
  CERT_LEAF_DAYS           : 7,
  CERT_ALGORITHM           : 'EdDSA:Ed25519',
  CERT_HASH                : 'sha256',
};

const intermediateUID   = 'INTERMEDIATE-CERT-ID';
const leafUID           = 'LEAF-CERT-ID';
const certificates      = new Certificates(intermediateUID, leafUID, configData, db);
const rootCert          = await certificates.root;
const intermediateCert  = await certificates.intermediate;
const leafCert          = await certificates.leaf;
```

---

## Configuration

The `Certificates` class accepts a configuration object with the following properties:

| Property                  | Type     | Description                                                                 |
|---------------------------|----------|-----------------------------------------------------------------------------|
| `CERT_PASS_ENCRYPTION_KEY`| `string` | Encryption key used to secure certificate passwords and private keys.       |
| `CERT_ROOT_DAYS`          | `number` | Validity period of the root certificate in days.                            |
| `CERT_INTERMEDIATE_DAYS`  | `number` | Validity period of the intermediate certificate in days.                    |
| `CERT_LEAF_DAYS`          | `number` | Validity period of the leaf certificate in days.                            |
| `CERT_ALGORITHM`          | `string` | Algorithm used for certificate generation (e.g., `rsa`, `ecdsa`).           |
| `CERT_HASH`               | `string` | Hash function for certificate signing (e.g., `sha256`, `sha512`).           |

---

## Methods

### Constructor

```javascript
constructor(intermediateUID, leafUID, config, db)
```

- **Parameters:**
  - `intermediateUID`: A unique identifier for the intermediate certificate.
  - `leafUID`: A unique identifier for the leaf certificate.
  - `config`: Configuration object.
  - `db`: Database instance from Eventflow's database layer.

### clearCache

Clears the cached certificates.

```javascript
clearCache();
```

### persist

Stores a certificate in the database.

```javascript
persist(id, validity, cert, key, pass);
```

- **Parameters:**
  - `id`: Certificate identifier.
  - `validity`: Expiration date of the certificate.
  - `cert`: Certificate content.
  - `key`: Private key of the certificate.
  - `pass`: Password for the private key.

### revoke

Revokes a certificate by its ID.

```javascript
revoke(id);
```

- **Parameters:**
  - `id`: Certificate identifier.

### root

Retrieves the root certificate.

```javascript
const rootCertificate = await certificates.root;
```

### intermediate

Retrieves the intermediate certificate.

```javascript
const intermediateCertificate = await certificates.intermediate;
```

### leaf

Retrieves the leaf certificate.

```javascript
const leafCertificate = await certificates.leaf;
```

---

## Testing

Run the test suite with the following command:

```bash
npm run test-build
npm test
```

The test suite includes comprehensive cases to validate functionality, such as:

- Certificate creation and retrieval
- Cache clearing and lazy loading
- Certificate expiration handling
- Error handling for missing configuration

### Test Coverage

```
▶ @superhero/eventflow-certificates
  ✔ Throw error if CERT_PASS_ENCRYPTION_KEY is missing in config (2.592666ms)

  ▶ Get root certificate
    ✔ Get same root certificate each time lazyloading it (0.443311ms)

    ▶ Get intermediate certificate
      ▶ Get leaf certificate
        ✔ Clear cache and still get the same certificates (5666.373892ms)
        ✔ Revoke certificate and regenerate when expired (11.303099ms)
      ✔ Get leaf certificate (7800.137773ms)
    ✔ Get intermediate certificate (9664.033522ms)
  ✔ Get root certificate (11692.320218ms)
✔ @superhero/eventflow-certificates (11699.129313ms)

tests 7
suites 1
pass 7

----------------------------------------------------------------------------------------
file            | line % | branch % | funcs % | uncovered lines
----------------------------------------------------------------------------------------
index.js        |  85.91 |    87.50 |   88.24 | 137-140 154-158 198-204 208-217 220-235
index.test.js   | 100.00 |   100.00 |  100.00 | 
----------------------------------------------------------------------------------------
all files       |  89.83 |    91.67 |   92.86 | 
----------------------------------------------------------------------------------------
```

---

## License

This project is licensed under the MIT License.

## Contributing

Feel free to submit issues or pull requests for improvements or additional features.
