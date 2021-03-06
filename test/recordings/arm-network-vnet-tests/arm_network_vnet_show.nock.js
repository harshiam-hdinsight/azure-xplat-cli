// This file has been autogenerated.

var profile = require('../../../lib/util/profile');

exports.getMockedProfile = function () {
  var newProfile = new profile.Profile();

  newProfile.addSubscription(new profile.Subscription({
    id: 'bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948',
    name: 'CollaberaInteropTest',
    user: {
      name: 'user@domain.example',
      type: 'user'
    },
    tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
    registeredProviders: [],
    isDefault: true
  }, newProfile.environments['AzureCloud']));

  return newProfile;
};

exports.setEnvironment = function() {
  process.env['AZURE_VM_TEST_LOCATION'] = 'westus';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/resourceGroups/xplatTestGCreatevnet3558/providers/Microsoft.Network/virtualnetworks/xplatTestVnet8173?api-version=2015-05-01-preview')
  .reply(200, "{\r\n  \"name\": \"xplatTestVnet8173\",\r\n  \"id\": \"/subscriptions/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/resourceGroups/xplatTestGCreatevnet3558/providers/Microsoft.Network/virtualNetworks/xplatTestVnet8173\",\r\n  \"etag\": \"W/\\\"fb62a848-433a-41f0-9e20-ae0a73c70502\\\"\",\r\n  \"properties\": {\r\n    \"provisioningState\": \"Succeeded\",\r\n    \"addressSpace\": {\r\n      \"addressPrefixes\": [\r\n        \"10.0.0.0/12\"\r\n      ]\r\n    },\r\n    \"dhcpOptions\": {\r\n      \"dnsServers\": [\r\n        \"8.8.8.8\",\r\n        \"8.8.4.4\"\r\n      ]\r\n    }\r\n  },\r\n  \"location\": \"westus\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '538',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  etag: 'W/"fb62a848-433a-41f0-9e20-ae0a73c70502"',
  'x-ms-request-id': '6f0d21d6-1b8e-42c0-a8ee-40c7a695337b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '31955',
  'x-ms-correlation-request-id': '45c006f3-e3d4-460c-81b3-d2a406f1d663',
  'x-ms-routing-request-id': 'EASTASIA:20150427T090934Z:45c006f3-e3d4-460c-81b3-d2a406f1d663',
  date: 'Mon, 27 Apr 2015 09:09:33 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/resourceGroups/xplatTestGCreatevnet3558/providers/Microsoft.Network/virtualnetworks/xplatTestVnet8173?api-version=2015-05-01-preview')
  .reply(200, "{\r\n  \"name\": \"xplatTestVnet8173\",\r\n  \"id\": \"/subscriptions/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/resourceGroups/xplatTestGCreatevnet3558/providers/Microsoft.Network/virtualNetworks/xplatTestVnet8173\",\r\n  \"etag\": \"W/\\\"fb62a848-433a-41f0-9e20-ae0a73c70502\\\"\",\r\n  \"properties\": {\r\n    \"provisioningState\": \"Succeeded\",\r\n    \"addressSpace\": {\r\n      \"addressPrefixes\": [\r\n        \"10.0.0.0/12\"\r\n      ]\r\n    },\r\n    \"dhcpOptions\": {\r\n      \"dnsServers\": [\r\n        \"8.8.8.8\",\r\n        \"8.8.4.4\"\r\n      ]\r\n    }\r\n  },\r\n  \"location\": \"westus\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '538',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  etag: 'W/"fb62a848-433a-41f0-9e20-ae0a73c70502"',
  'x-ms-request-id': '6f0d21d6-1b8e-42c0-a8ee-40c7a695337b',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '31955',
  'x-ms-correlation-request-id': '45c006f3-e3d4-460c-81b3-d2a406f1d663',
  'x-ms-routing-request-id': 'EASTASIA:20150427T090934Z:45c006f3-e3d4-460c-81b3-d2a406f1d663',
  date: 'Mon, 27 Apr 2015 09:09:33 GMT',
  connection: 'close' });
 return result; }]];