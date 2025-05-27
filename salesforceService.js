const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const jsforce = require('jsforce');
const { buildPackageXml } = require('./packageBuilder');

async function deployTriggerState({ username, password, clientId, clientSecret, loginUrl, triggerName, activate }) {
    const conn = new jsforce.Connection({ loginUrl, oauth2: { clientId, clientSecret } });
    await conn.login(username, password);

    const triggerMeta = await conn.metadata.read('ApexTrigger', triggerName);

    triggerMeta.status = activate ? 'Active' : 'Inactive';

    const packageXml = buildPackageXml(triggerName);

    const zipBuffer = await conn.metadata.zip({
        [`unpackaged/package.xml`]: packageXml,
        [`unpackaged/triggers/${triggerName}.trigger-meta.xml`]: Buffer.from(JSON.stringify(triggerMeta), 'utf8')
    });

    const result = await conn.metadata.deploy(zipBuffer, { singlePackage: true }).complete(true);
    if (!result.success) throw new Error(result.details.componentFailures);

    return result;
}

module.exports = { deployTriggerState };
