// This file has been autogenerated.

var profile = require('../../../lib/util/profile');

exports.getMockedProfile = function () {
  var newProfile = new profile.Profile();

  newProfile.addSubscription(new profile.Subscription({
    id: 'e33f361b-53c2-4cc7-b829-78906708387b',
    name: 'Microsoft Azure Internal Consumption',
    user: {
      name: 'user@domain.example',
      type: 'servicePrincipal'
    },
    tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
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
nock('http://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3599\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455456\",\"not_before\":\"1442451556\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTU2LCJuYmYiOjE0NDI0NTE1NTYsImV4cCI6MTQ0MjQ1NTQ1NiwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.HGRHsPnAPRiOmOmgCwqW9dkLiBZCwoWAgujyztsWGhKIR5T5BwPP1Gd6Ci8eA2HFzSAN8MGGtN7-V0Ig6eyvQllsQaizwYlR2vg2cS0hwxIboGHPRUYU4Y1uiF_cYvO9UOUlpv00LYih_SdcQsIxlunvs5g9gkhzB9AUqB7_2wGUbR2tFS9Ehi7yfuAsfa2PSuYa9yCmn2HVNo4hLEGhkM-KKfNR86nJWO3ycARDI7V6Ki8qXAZS_AQyOz74BZOptqVpl2o5q8Zw5gH5NjeR_0-y4uhj0B-9Wlq8cuqdLi1CEx1kqdxG3_eTX1agBGBBzZVjXBI2NhRN0JVUBPcNSg\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': '99216bdd-2d2b-4540-aff2-80e8509599b7',
  'client-request-id': '13ec45b5-5317-41f0-9f53-60da0a9d26f8',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_96',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:16 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('https://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3599\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455456\",\"not_before\":\"1442451556\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTU2LCJuYmYiOjE0NDI0NTE1NTYsImV4cCI6MTQ0MjQ1NTQ1NiwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.HGRHsPnAPRiOmOmgCwqW9dkLiBZCwoWAgujyztsWGhKIR5T5BwPP1Gd6Ci8eA2HFzSAN8MGGtN7-V0Ig6eyvQllsQaizwYlR2vg2cS0hwxIboGHPRUYU4Y1uiF_cYvO9UOUlpv00LYih_SdcQsIxlunvs5g9gkhzB9AUqB7_2wGUbR2tFS9Ehi7yfuAsfa2PSuYa9yCmn2HVNo4hLEGhkM-KKfNR86nJWO3ycARDI7V6Ki8qXAZS_AQyOz74BZOptqVpl2o5q8Zw5gH5NjeR_0-y4uhj0B-9Wlq8cuqdLi1CEx1kqdxG3_eTX1agBGBBzZVjXBI2NhRN0JVUBPcNSg\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': '99216bdd-2d2b-4540-aff2-80e8509599b7',
  'client-request-id': '13ec45b5-5317-41f0-9f53-60da0a9d26f8',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_96',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:16 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions?api-version=2015-06-15')
  .reply(200, "[\r\n  {\r\n    \"location\": \"eastus\",\r\n    \"name\": \"10.50.4021\",\r\n    \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4021\"\r\n  },\r\n  {\r\n    \"location\": \"eastus\",\r\n    \"name\": \"10.50.4319\",\r\n    \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4319\"\r\n  },\r\n  {\r\n    \"location\": \"eastus\",\r\n    \"name\": \"10.50.6000\",\r\n    \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.6000\"\r\n  }\r\n]", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '888',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '86ed5199-a4ed-420c-8cc7-1c7b7f9d6c2e',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14716',
  'x-ms-correlation-request-id': 'd080f5ce-95e3-49b4-a517-10d9cb2ca0d8',
  'x-ms-routing-request-id': 'WESTUS:20150917T010431Z:d080f5ce-95e3-49b4-a517-10d9cb2ca0d8',
  date: 'Thu, 17 Sep 2015 01:04:31 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions?api-version=2015-06-15')
  .reply(200, "[\r\n  {\r\n    \"location\": \"eastus\",\r\n    \"name\": \"10.50.4021\",\r\n    \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4021\"\r\n  },\r\n  {\r\n    \"location\": \"eastus\",\r\n    \"name\": \"10.50.4319\",\r\n    \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4319\"\r\n  },\r\n  {\r\n    \"location\": \"eastus\",\r\n    \"name\": \"10.50.6000\",\r\n    \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.6000\"\r\n  }\r\n]", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '888',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '86ed5199-a4ed-420c-8cc7-1c7b7f9d6c2e',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14716',
  'x-ms-correlation-request-id': 'd080f5ce-95e3-49b4-a517-10d9cb2ca0d8',
  'x-ms-routing-request-id': 'WESTUS:20150917T010431Z:d080f5ce-95e3-49b4-a517-10d9cb2ca0d8',
  date: 'Thu, 17 Sep 2015 01:04:31 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3599\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455471\",\"not_before\":\"1442451571\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTcxLCJuYmYiOjE0NDI0NTE1NzEsImV4cCI6MTQ0MjQ1NTQ3MSwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.aRQUZcu0P8UF3NQRsMpGVjbYAoWSIbQbXnBpmZpE6LA2JqnaTVXVbI4QCSx7ELZ_nWxsepFJfEAU_XYXX9ktcNw4qqFGovHt47Y6PKDE7EP-ozj97k1jlaDX1cpZbUID672rDud_g0FmrSwkmFD2jU0z8XPVzdHU4jPDLFN4g-BJjHNYK246WzSa1IjLu_t8DewY-ifqWfmdxtv7wMjZpdnpN2eKdSqUrtHXT-mXVutPeJpsgQWmIAgmyHBj7DecDXuYZbvYtJCLD3hVf2MlaUR2nePoVh8zHS2nkKcuE_gEUGE1dWOtE-xSCuGRShRstqpRu_mvl-inc5MjpfUQHA\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': 'd36bd553-4dff-4a14-ab4d-e0edeb6e343f',
  'client-request-id': 'c8f2307f-6bb7-441b-8fe6-f7c3a3fc2fd7',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_105',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:31 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('https://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3599\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455471\",\"not_before\":\"1442451571\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTcxLCJuYmYiOjE0NDI0NTE1NzEsImV4cCI6MTQ0MjQ1NTQ3MSwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.aRQUZcu0P8UF3NQRsMpGVjbYAoWSIbQbXnBpmZpE6LA2JqnaTVXVbI4QCSx7ELZ_nWxsepFJfEAU_XYXX9ktcNw4qqFGovHt47Y6PKDE7EP-ozj97k1jlaDX1cpZbUID672rDud_g0FmrSwkmFD2jU0z8XPVzdHU4jPDLFN4g-BJjHNYK246WzSa1IjLu_t8DewY-ifqWfmdxtv7wMjZpdnpN2eKdSqUrtHXT-mXVutPeJpsgQWmIAgmyHBj7DecDXuYZbvYtJCLD3hVf2MlaUR2nePoVh8zHS2nkKcuE_gEUGE1dWOtE-xSCuGRShRstqpRu_mvl-inc5MjpfUQHA\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': 'd36bd553-4dff-4a14-ab4d-e0edeb6e343f',
  'client-request-id': 'c8f2307f-6bb7-441b-8fe6-f7c3a3fc2fd7',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_105',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:31 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('http://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3599\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455472\",\"not_before\":\"1442451572\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTcyLCJuYmYiOjE0NDI0NTE1NzIsImV4cCI6MTQ0MjQ1NTQ3MiwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.G3vJYA7P-lh6MJUo-JAjQuR2KTnoD0Keb8h3dj22C1hDTw5USe5cDIZHtdv1gnefVSlyx8YCxZZ1hFDM-QEddgF7xNDq_DOG5onG5IA0dPuM_E6UBoT-AvtKzNvCL4rpqqdbuAJzTwqvq9G_9dlGnPQVZuqqcm7TE58h9JZowOW36qBHOtPXmf_4gdm7xYbqel3vZkcknVk6aTAFheFdp-Ezv0Etu7COVUQKnUW0fQ1Sv73u8IbsysjDFEJox1-f7hClA6cPQ1Mxijnel6n1OkTWLM-d9daKaBl4B0wVg834wSN8E25ZkFm6ZqflOQBXEVmVy82ZL1xtIrNYIk08lQ\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': '8cd3fd0e-6fe0-4cc4-b994-4dc100215137',
  'client-request-id': 'abe1ba82-2637-4934-ba43-e37b603a0711',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_117',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:32 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('https://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3599\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455472\",\"not_before\":\"1442451572\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTcyLCJuYmYiOjE0NDI0NTE1NzIsImV4cCI6MTQ0MjQ1NTQ3MiwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.G3vJYA7P-lh6MJUo-JAjQuR2KTnoD0Keb8h3dj22C1hDTw5USe5cDIZHtdv1gnefVSlyx8YCxZZ1hFDM-QEddgF7xNDq_DOG5onG5IA0dPuM_E6UBoT-AvtKzNvCL4rpqqdbuAJzTwqvq9G_9dlGnPQVZuqqcm7TE58h9JZowOW36qBHOtPXmf_4gdm7xYbqel3vZkcknVk6aTAFheFdp-Ezv0Etu7COVUQKnUW0fQ1Sv73u8IbsysjDFEJox1-f7hClA6cPQ1Mxijnel6n1OkTWLM-d9daKaBl4B0wVg834wSN8E25ZkFm6ZqflOQBXEVmVy82ZL1xtIrNYIk08lQ\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': '8cd3fd0e-6fe0-4cc4-b994-4dc100215137',
  'client-request-id': 'abe1ba82-2637-4934-ba43-e37b603a0711',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_117',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:32 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('http://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3600\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455472\",\"not_before\":\"1442451572\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTcyLCJuYmYiOjE0NDI0NTE1NzIsImV4cCI6MTQ0MjQ1NTQ3MiwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.G3vJYA7P-lh6MJUo-JAjQuR2KTnoD0Keb8h3dj22C1hDTw5USe5cDIZHtdv1gnefVSlyx8YCxZZ1hFDM-QEddgF7xNDq_DOG5onG5IA0dPuM_E6UBoT-AvtKzNvCL4rpqqdbuAJzTwqvq9G_9dlGnPQVZuqqcm7TE58h9JZowOW36qBHOtPXmf_4gdm7xYbqel3vZkcknVk6aTAFheFdp-Ezv0Etu7COVUQKnUW0fQ1Sv73u8IbsysjDFEJox1-f7hClA6cPQ1Mxijnel6n1OkTWLM-d9daKaBl4B0wVg834wSN8E25ZkFm6ZqflOQBXEVmVy82ZL1xtIrNYIk08lQ\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': 'da0ef7b3-292b-4448-b868-00c227ae293e',
  'client-request-id': 'f0c89f8b-c3d0-4044-b7d6-4a4759886e00',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_8',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:31 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('https://login.microsoftonline.com:443')
  .filteringRequestBody(function (path) { return '*';})
.post('/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token', '*')
  .reply(200, "{\"expires_in\":\"3600\",\"token_type\":\"Bearer\",\"expires_on\":\"1442455472\",\"not_before\":\"1442451572\",\"resource\":\"https://management.core.windows.net/\",\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDQyNDUxNTcyLCJuYmYiOjE0NDI0NTE1NzIsImV4cCI6MTQ0MjQ1NTQ3MiwidmVyIjoiMS4wIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3Iiwib2lkIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4Iiwic3ViIjoiMmY5YTc0MGYtNzllMi00MjVlLThmN2MtZTRmYWVkNzBiNWE4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImFwcGlkIjoiMzRiM2I4MWMtYThhZC00OGMxLTg2NzAtOGI5NmY1M2JlZjg5IiwiYXBwaWRhY3IiOiIxIn0.G3vJYA7P-lh6MJUo-JAjQuR2KTnoD0Keb8h3dj22C1hDTw5USe5cDIZHtdv1gnefVSlyx8YCxZZ1hFDM-QEddgF7xNDq_DOG5onG5IA0dPuM_E6UBoT-AvtKzNvCL4rpqqdbuAJzTwqvq9G_9dlGnPQVZuqqcm7TE58h9JZowOW36qBHOtPXmf_4gdm7xYbqel3vZkcknVk6aTAFheFdp-Ezv0Etu7COVUQKnUW0fQ1Sv73u8IbsysjDFEJox1-f7hClA6cPQ1Mxijnel6n1OkTWLM-d9daKaBl4B0wVg834wSN8E25ZkFm6ZqflOQBXEVmVy82ZL1xtIrNYIk08lQ\"}", { 'cache-control': 'no-cache, no-store',
  pragma: 'no-cache',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  server: 'Microsoft-IIS/8.5',
  'x-ms-request-id': 'da0ef7b3-292b-4448-b868-00c227ae293e',
  'client-request-id': 'f0c89f8b-c3d0-4044-b7d6-4a4759886e00',
  'x-ms-gateway-service-instanceid': 'ESTSFE_IN_8',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  p3p: 'CP="DSP CUR OTPi IND OTRi ONL FIN"',
  'set-cookie': 
   [ 'flight-uxoptin=true; path=/; secure; HttpOnly',
     'x-ms-gateway-slice=productiona; path=/; secure; HttpOnly',
     'stsservicecookie=ests; path=/; secure; HttpOnly' ],
  'x-powered-by': 'ASP.NET',
  date: 'Thu, 17 Sep 2015 01:04:31 GMT',
  connection: 'close',
  'content-length': '1234' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions/10.50.6000?api-version=2015-06-15')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"osDiskImage\": {\r\n      \"operatingSystem\": \"Windows\"\r\n    },\r\n    \"dataDiskImages\": []\r\n  },\r\n  \"location\": \"eastus\",\r\n  \"name\": \"10.50.6000\",\r\n  \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.6000\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '5046c26f-5539-4d1f-8050-5212ef8b523e',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14878',
  'x-ms-correlation-request-id': '8557e622-0a01-4da5-8f75-b46d24b67189',
  'x-ms-routing-request-id': 'WESTUS:20150917T010454Z:8557e622-0a01-4da5-8f75-b46d24b67189',
  date: 'Thu, 17 Sep 2015 01:04:53 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions/10.50.6000?api-version=2015-06-15')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"osDiskImage\": {\r\n      \"operatingSystem\": \"Windows\"\r\n    },\r\n    \"dataDiskImages\": []\r\n  },\r\n  \"location\": \"eastus\",\r\n  \"name\": \"10.50.6000\",\r\n  \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.6000\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '5046c26f-5539-4d1f-8050-5212ef8b523e',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14878',
  'x-ms-correlation-request-id': '8557e622-0a01-4da5-8f75-b46d24b67189',
  'x-ms-routing-request-id': 'WESTUS:20150917T010454Z:8557e622-0a01-4da5-8f75-b46d24b67189',
  date: 'Thu, 17 Sep 2015 01:04:53 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions/10.50.4021?api-version=2015-06-15')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"osDiskImage\": {\r\n      \"operatingSystem\": \"Windows\"\r\n    },\r\n    \"dataDiskImages\": []\r\n  },\r\n  \"location\": \"eastus\",\r\n  \"name\": \"10.50.4021\",\r\n  \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4021\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '415fd155-7fe2-490b-bd02-432dc47db1af',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14876',
  'x-ms-correlation-request-id': '43ef8957-f8d6-4e33-9633-5258e4828628',
  'x-ms-routing-request-id': 'WESTUS:20150917T010500Z:43ef8957-f8d6-4e33-9633-5258e4828628',
  date: 'Thu, 17 Sep 2015 01:05:00 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions/10.50.4021?api-version=2015-06-15')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"osDiskImage\": {\r\n      \"operatingSystem\": \"Windows\"\r\n    },\r\n    \"dataDiskImages\": []\r\n  },\r\n  \"location\": \"eastus\",\r\n  \"name\": \"10.50.4021\",\r\n  \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4021\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': '415fd155-7fe2-490b-bd02-432dc47db1af',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14876',
  'x-ms-correlation-request-id': '43ef8957-f8d6-4e33-9633-5258e4828628',
  'x-ms-routing-request-id': 'WESTUS:20150917T010500Z:43ef8957-f8d6-4e33-9633-5258e4828628',
  date: 'Thu, 17 Sep 2015 01:05:00 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('http://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions/10.50.4319?api-version=2015-06-15')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"osDiskImage\": {\r\n      \"operatingSystem\": \"Windows\"\r\n    },\r\n    \"dataDiskImages\": []\r\n  },\r\n  \"location\": \"eastus\",\r\n  \"name\": \"10.50.4319\",\r\n  \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4319\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': 'e36dd501-dfa1-4c05-a6eb-e39ab3b30290',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14740',
  'x-ms-correlation-request-id': 'd525f545-f478-47e1-a805-0aef19d9b177',
  'x-ms-routing-request-id': 'WESTUS:20150917T010500Z:d525f545-f478-47e1-a805-0aef19d9b177',
  date: 'Thu, 17 Sep 2015 01:05:00 GMT',
  connection: 'close' });
 return result; },
function (nock) { 
var result = 
nock('https://management.azure.com:443')
  .get('/subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/providers/Microsoft.Compute/locations/eastus/publishers/MicrosoftSQLServer/artifacttypes/vmimage/offers/SQL2008R2SP3-WS2008R2SP1/skus/Enterprise/versions/10.50.4319?api-version=2015-06-15')
  .reply(200, "{\r\n  \"properties\": {\r\n    \"osDiskImage\": {\r\n      \"operatingSystem\": \"Windows\"\r\n    },\r\n    \"dataDiskImages\": []\r\n  },\r\n  \"location\": \"eastus\",\r\n  \"name\": \"10.50.4319\",\r\n  \"id\": \"/Subscriptions/e33f361b-53c2-4cc7-b829-78906708387b/Providers/Microsoft.Compute/Locations/eastus/Publishers/MicrosoftSQLServer/ArtifactTypes/VMImage/Offers/SQL2008R2SP3-WS2008R2SP1/Skus/Enterprise/Versions/10.50.4319\"\r\n}", { 'cache-control': 'no-cache',
  pragma: 'no-cache',
  'content-length': '399',
  'content-type': 'application/json; charset=utf-8',
  expires: '-1',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-ms-request-id': 'e36dd501-dfa1-4c05-a6eb-e39ab3b30290',
  server: 'Microsoft-HTTPAPI/2.0, Microsoft-HTTPAPI/2.0',
  'x-ms-ratelimit-remaining-subscription-reads': '14740',
  'x-ms-correlation-request-id': 'd525f545-f478-47e1-a805-0aef19d9b177',
  'x-ms-routing-request-id': 'WESTUS:20150917T010500Z:d525f545-f478-47e1-a805-0aef19d9b177',
  date: 'Thu, 17 Sep 2015 01:05:00 GMT',
  connection: 'close' });
 return result; }]];