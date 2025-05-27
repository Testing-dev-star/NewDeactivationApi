function buildPackageXml(triggerName) {
    return `
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
  <types>
    <members>${triggerName}</members>
    <name>ApexTrigger</name>
  </types>
  <version>60.0</version>
</Package>
`.trim();
}

module.exports = { buildPackageXml };
