// sku size applies for gateway only
// tier and size apply to app service plan & gateway ( which cannot have Premium)
const azure_mappings = {
  s: {
    tier: "Standard",
    size: "S1", 
    sku: "Standard_Small" 
  },
  m: {
    tier: "Standard",
    size: "S2",
    sku: "Standard_Medium"
  },
  l: {
    tier: "Standard",
    size: "S3",
    sku: "Standard_Large"
  },
  xl: {
    tier: "Standard",
    size: "S3",
    sku: "Standard_Large"
  },
}

module.exports = azure_mappings