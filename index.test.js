import Locator              from '@superhero/locator'
import config               from '@superhero/eventflow-db/config'
import Certificates         from '@superhero/eventflow-certificates'
import assert               from 'node:assert/strict'
import { X509Certificate }  from 'node:crypto'
import { suite, test, before, after } from 'node:test'

suite('@superhero/eventflow-certificates', async () =>
{
  const locator = new Locator()

  await locator.config.assign(config, '@superhero/eventflow-db')

  const db = await locator.lazyload('@superhero/eventflow-db')

  await db.createTableCertificate()

  let conf, manager, icaUID = 'INTERMEDIATE-CERT-ID', leafUID = 'LEAF-CERT-ID'

  before(() =>
  {
    conf =
    {
      CERT_PASS_ENCRYPTION_KEY  : 'encryptionKey123',
      CERT_ROOT_DAYS            : 365,
      CERT_INTERMEDIATE_DAYS    : 30,
      CERT_LEAF_DAYS            : 7,
      CERT_ALGORITHM            : 'rsa',
      CERT_HASH                 : 'sha256'
    }

    manager = new Certificates(icaUID, leafUID, conf, db)
    manager.log.config.mute = true
  })

  after(() => db.close())

  test('Throw error if CERT_PASS_ENCRYPTION_KEY is missing in config', () =>
  {
    delete conf.CERT_PASS_ENCRYPTION_KEY
    assert.throws(
      () => new Certificates(icaUID, leafUID, conf, db), 
      { code: 'E_EVENTFLOW_CERTIFICATES_MISSING_CONFIGURATION' })
  })

  test('Get root certificate', async (sub) =>
  {
    const { root } = await manager.getChain()

    assert.ok(root.validity > Date.now())
    assert.ok(root.cert)
    assert.ok(root.key)
    assert.ok(root.pass)

    const rootX509 = new X509Certificate(root.cert)
    assert.ok(rootX509.checkIssued(rootX509))

    await sub.test('Get same root certificate each time lazyloading it', async () =>
    {
      const { root: root2 } = await manager.getChain()
      assert.deepEqual(root, root2)
    })

    await sub.test('Get intermediate certificate', async (sub) =>
    {
      const { intermediate: ica } = await manager.getChain()
  
      assert.ok(ica.validity > Date.now())
      assert.ok(ica.cert)
      assert.ok(ica.key)
      assert.ok(ica.pass)
  
      const icaX509 = new X509Certificate(ica.cert)
      assert.ok(icaX509.checkIssued(rootX509))

      await sub.test('Get leaf certificate', async (sub) =>
      {
        const { leaf } = await manager.getChain()
    
        assert.ok(leaf.validity > Date.now())
        assert.ok(leaf.cert)
        assert.ok(leaf.key)
        assert.ok(leaf.pass)
    
        const leafX509 = new X509Certificate(leaf.cert)
        assert.ok(leafX509.checkIssued(icaX509))

        await sub.test('Clear cache and still get the same certificates', async (sub) =>
        {
          manager.clearCache()

          const{ root: root2, intermediate: ica2, leaf: leaf2 } = await manager.getChain()

          assert.deepEqual(root, root2)
          assert.deepEqual(ica, ica2)
          assert.deepEqual(leaf, leaf2)
        })

        await sub.test('Revoke certificate and regenerate when expired', async () =>
        {
          await assert.doesNotReject(manager.revoke(leafUID))

          const
            { leaf }  = await manager.getChain(),
            leafX509  = new X509Certificate(leaf.cert)

          assert.ok(leafX509.checkIssued(icaX509))
        })
      })
    })
  })
})
