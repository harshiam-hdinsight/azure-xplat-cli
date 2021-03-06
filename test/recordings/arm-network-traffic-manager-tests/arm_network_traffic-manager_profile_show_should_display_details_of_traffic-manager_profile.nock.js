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
    state: 'Enabled',
    registeredProviders: [],
    isDefault: true
  }, newProfile.environments['AzureCloud']));

  return newProfile;
};

exports.setEnvironment = function() {
  process.env['AZURE_VM_TEST_LOCATION'] = 'eastus';
};

exports.scopes = [[function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/resourceGroups/xplatTestGTMPCreate/providers/Microsoft.Network/trafficmanagerprofiles/xplatTestTrafficMP?api-version=2015-04-28-preview')
  .reply(200, "{\"id\":\"\\/subscriptions\\/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948\\/resourceGroups\\/xplattestgtmpcreate\\/providers\\/Microsoft.Network\\/trafficManagerProfiles\\/xplatTestTrafficMP\",\"name\":\"xplatTestTrafficMP\",\"type\":\"Microsoft.Network\\/trafficManagerProfiles\",\"location\":\"global\",\"properties\":{\"profileStatus\":\"Disabled\",\"trafficRoutingMethod\":\"Weighted\",\"dnsConfig\":{\"relativeName\":\"xplattmpdns9220\",\"fqdn\":\"xplattmpdns9220.trafficmanager.net\",\"ttl\":200},\"monitorConfig\":{\"profileMonitorStatus\":null,\"protocol\":\"HTTP\",\"port\":80,\"path\":\"\\/indextest.html\"},\"endpoints\":[]}}", { 'cache-control': 'private',
  'content-length': '564',
  'content-type': 'application/json; charset=utf-8',
  'x-content-type-options': 'nosniff',
  'x-ms-request-id': 'defd7110-ace6-4aa3-a3eb-3ca27ebd8054',
  server: 'Microsoft-IIS/7.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-resource-requests': '10785',
  'x-ms-correlation-request-id': 'cb370528-9213-481f-9b19-7b5a1578cae2',
  'x-ms-routing-request-id': 'CENTRALINDIA:20151113T100552Z:cb370528-9213-481f-9b19-7b5a1578cae2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Fri, 13 Nov 2015 10:05:51 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/resourceGroups/xplatTestGTMPCreate/providers/Microsoft.Network/trafficmanagerprofiles/xplatTestTrafficMP?api-version=2015-04-28-preview')
  .reply(200, "{\"id\":\"\\/subscriptions\\/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948\\/resourceGroups\\/xplattestgtmpcreate\\/providers\\/Microsoft.Network\\/trafficManagerProfiles\\/xplatTestTrafficMP\",\"name\":\"xplatTestTrafficMP\",\"type\":\"Microsoft.Network\\/trafficManagerProfiles\",\"location\":\"global\",\"properties\":{\"profileStatus\":\"Disabled\",\"trafficRoutingMethod\":\"Weighted\",\"dnsConfig\":{\"relativeName\":\"xplattmpdns9220\",\"fqdn\":\"xplattmpdns9220.trafficmanager.net\",\"ttl\":200},\"monitorConfig\":{\"profileMonitorStatus\":null,\"protocol\":\"HTTP\",\"port\":80,\"path\":\"\\/indextest.html\"},\"endpoints\":[]}}", { 'cache-control': 'private',
  'content-length': '564',
  'content-type': 'application/json; charset=utf-8',
  'x-content-type-options': 'nosniff',
  'x-ms-request-id': 'defd7110-ace6-4aa3-a3eb-3ca27ebd8054',
  server: 'Microsoft-IIS/7.5',
  'x-aspnet-version': '4.0.30319',
  'x-powered-by': 'ASP.NET',
  'x-ms-ratelimit-remaining-subscription-resource-requests': '10785',
  'x-ms-correlation-request-id': 'cb370528-9213-481f-9b19-7b5a1578cae2',
  'x-ms-routing-request-id': 'CENTRALINDIA:20151113T100552Z:cb370528-9213-481f-9b19-7b5a1578cae2',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  date: 'Fri, 13 Nov 2015 10:05:51 GMT',
  connection: 'close' });
 return result; }]];