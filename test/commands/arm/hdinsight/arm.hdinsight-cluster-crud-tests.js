/**
 * Copyright (c) Microsoft.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var should = require('should');
var path = require('path');
var fs = require('fs');
var util = require('util');
var utils = require('../../../../lib/util/utils');
var testUtils = require('../../../util/util');
var CLITest = require('../../../framework/arm-cli-test');
var testprefix = 'arm-cli-HDInsight-cluster-create-tests';
var groupPrefix = 'xplatTestRgHDInsightClusterCreate';
var clusterNamePrefix = 'xplatTestHDInsightClusterCreate';
var HdinsightTestUtil = require('../../../util/hdinsightTestUtil');
var requiredEnvironment = [{
  name: 'AZURE_ARM_TEST_LOCATION',
  defaultValue: 'southeastasia'
}, {
  name: 'SSHCERT',
  defaultValue: 'test/myCert.pem'
}];

var liveOnly = process.env.NOCK_OFF ? it : it.skip;
var timeBeforeClusterAvailable;

var groupName = "xplattesthdinsightRG",
  clusterNameWindows = 'xplattesthdinsightWindows',
  clusterNameLinux = 'xplattesthdinsightLinux',
  location = "East US",
  username = 'azureuser',
  password = 'Brillio@2015',
  defaultStorageAccount = 'xplatteststorage1',
  defaultStorageAccountKey = 'dnsfnsdfmsdlsk09809kjsdff====',
  defaultStorageContainer = 'xplatteststoragecnt1',
  workerNodeCount = 3,
  headNodeSize = "Standard_D3",
  workerNodeSize = "Standard_D3",
  zookeeperNodeSize = "Standard_D3",
  vNetPrefix = 'xplattestvnet',
  subnetName = 'xplattestsubnet',
  sshUsername = 'xplattestsshuser',
  sshPassword = 'Brillio@2015',
  sshPublicKey,
  rdpUsername = 'xplattestrdpuser',
  rdpPassword = 'Brillio@2015',
  rdpExpiryDate,
  tags = 'a=b;b=c;d=',
  configFile = 'test/data/hdinsight-test-config-data.json';

describe('arm', function() { 
  describe('hdinsight', function() {
    var suite, retry = 5;
    var hdinsightTest = new HdinsightTestUtil();
    before(function(done) {
      suite = new CLITest(this, testprefix, requiredEnvironment);
      suite.setupSuite(function() {
        location = process.env.AZURE_ARM_TEST_LOCATION;
        defaultStorageAccount = process.env.AZURE_ARM_TEST_STORAGEACCOUNT;
        defaultStorageAccountKey = process.env.AZURE_STORAGE_ACCESS_KEY;
        defaultStorageContainer = process.env.AZURE_STORAGE_CONTAINER;
        groupName = suite.isMocked ? groupName : suite.generateId(groupPrefix, null);
        clusterNameWindows = suite.isMocked ? clusterNameWindows : suite.generateId(clusterNamePrefix, null);
        clusterNameLinux = suite.isMocked ? clusterNameLinux : suite.generateId(clusterNamePrefix, null);
        tags = 'a=b;b=c;d=';
        rdpExpiryDate = '12/12/2025';
        //sshPublicKey = hdinsightTest.parseSSHPublicKeyPemFile(process.env.SSHCERT);
        timeBeforeClusterAvailable = (!suite.isMocked || suite.isRecording) ? 30000 : 10;
        if (suite.isMocked) {
          utils.POLL_REQUEST_INTERVAL = 0;
        }
        
        suite.setupSuite(done);
      });
    });

    after(function (done) {
      var clusters = [clusterNameWindows, clusterNameLinux];
      hdinsightTest.deleteUsedCluster(groupName, clusters, suite, function(result) {
        suite.teardownSuite(done);
      });
    });

    beforeEach(function(done) {
      suite.setupTest(done);
    });
    afterEach(function(done) {
      suite.teardownTest(done);
    });

    describe('cluster', function() {

      it('create windows cluster should pass', function(done) {
        this.timeout(hdinsightTest.timeoutLarge);
        hdinsightTest.createGroup(groupName, location, suite, function(result) {
          var cmd = util.format('hdinsight cluster create ' +
            '--resource-group %s ' +
            '--clusterName %s ' +
            '--location %s ' +
            '--osType %s ' +
            '--defaultStorageAccountName %s.blob.core.windows.net ' +
            '--defaultStorageAccountKey %s ' +
            '--defaultStorageContainer %s ' +
            '--headNodeSize %s ' +
            '--workerNodeCount %s ' +
            '--workerNodeSize %s ' +
            '--zookeeperNodeSize %s ' +
            '--userName %s --password %s ' +
            '--rdpUserName %s --rdpPassword %s --rdpAccessExpiry %s ' +
            '--clusterType %s ' +
            '--version %s ' +
            //'--virtualNetworkId %s ' +
            //'--subnetName %s ' +
            //'--configurationPath %s ' +
            '--tags %s ' +
            '--json ' +
            '-vv ',
            groupName, clusterNameWindows, location, 'Windows',
            defaultStorageAccount, defaultStorageAccountKey, defaultStorageContainer,
            headNodeSize, workerNodeCount, workerNodeSize, zookeeperNodeSize,
            username, password, rdpUsername, rdpPassword, rdpExpiryDate, 'Hadoop', 'default',
            //'10.0.0.0/16', '10.0.0.0/24', 
            //configFile, 
            tags).split(' ');
          
          testUtils.executeCommand(suite, retry, cmd, function(result) {
            result.exitStatus.should.equal(0);
            var clusterDetailsJson = JSON.parse(result.text);
            clusterDetailsJson.name.should.be.equal(clusterName);
            done();
          });
        });
      });
      
      it('create linux cluster should pass', function (done) {
        this.timeout(hdinsightTest.timeoutLarge);
        hdinsightTest.createGroup(groupName, location, suite, function (result) {
          var cmd = util.format('hdinsight cluster create ' +
            '--resource-group %s ' +
            '--clusterName %s ' +
            '--location %s ' +
            '--osType %s ' +
            '--defaultStorageAccountName %s.blob.core.windows.net ' +
            '--defaultStorageAccountKey %s ' +
            '--defaultStorageContainer %s ' +
            '--headNodeSize %s ' +
            '--workerNodeCount %s ' +
            '--workerNodeSize %s ' +
            '--zookeeperNodeSize %s ' +
            '--userName %s --password %s ' +
            '--sshUserName %s --sshPassword %s ' +
            //'--sshPublicKey %s ' +
            '--clusterType %s ' +
            '--version %s ' +
            '--json ' +
            '-vv ',
            groupName, clusterNameLinux, location, 'Linux',
            defaultStorageAccount, defaultStorageAccountKey, defaultStorageContainer,
            headNodeSize, workerNodeCount, workerNodeSize, zookeeperNodeSize,
            username, password, sshUserName, sshPassword, 
            //sshPublicKey, 
            'Hadoop', 'default',
            //'10.0.0.0/16', '10.0.0.0/24', 
            //configFile, 
            tags).split(' ');
          
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.equal(0);
            var clusterDetailsJson = JSON.parse(result.text);
            clusterDetailsJson.name.should.be.equal(clusterName);
            done();
          });
        });
      });

      it('show should display details about hdinsight cluster', function(done) {
        setTimeout(function() {
          var cmd = util.format('hdinsight cluster show --resource-group %s --clusterName %s --json', groupName, clusterNameWindows).split(' ');

          testUtils.executeCommand(suite, retry, cmd, function(result) {
            result.exitStatus.should.equal(0);
            var allResources = JSON.parse(result.text);
            allResources.name.should.equal(clusterNameWindows);
            allResources.provisioningState.should.equal('Running');
            
            var cmd = util.format('hdinsight cluster show --resource-group %s --clusterName %s --json', groupName, clusterNameLinux).split(' ');

            testUtils.executeCommand(suite, retry, cmd, function(result) {
              result.exitStatus.should.equal(0);
              var allResources = JSON.parse(result.text);
              allResources.name.should.equal(clusterNameLinux);
              allResources.provisioningState.should.equal('Running');
              done();
            });
          }, timeBeforeClusterAvailable);
        });
      });

      it('list should display all hdinsight clusters in resource group', function(done) {
        var cmd = util.format('hdinsight cluster list --resource-group %s --json', groupName).split(' ');
        this.timeout(hdinsightTest.timeoutLarge);
        
        testUtils.executeCommand(suite, retry, cmd, function(result) {
          result.exitStatus.should.equal(0);
          var allResources = JSON.parse(result.text);
          allResources.some(function(res) {
            return res.name === clusterNameWindows || res.Name === clusterNameLinux;
          }).should.be.true;
          allResources.some(function(res) {
            return res.resourceGroupName === groupName;
          }).should.be.true;
          done();
        });
      });

      it('list all should display all hdinsight clusters in subscription', function(done) {
        var cmd = util.format('hdinsight cluster list --json', '').split(' ');
        this.timeout(hdinsightTest.timeoutLarge);
        
        testUtils.executeCommand(suite, retry, cmd, function(result) {
          result.exitStatus.should.equal(0);
          var allResources = JSON.parse(result.text);
          allResources.some(function(res) {
            return (res.name === clusterNameWindows || res.name === clusterNameLinux);
          }).should.be.true;
          done();
        });
      });

      it('enable-http-access should enable HTTP access to the cluster', function(done) {
        setTimeout(function() {
          var cmd = util.format('hdinsight cluster enable-http-access --resource-group %s --clusterName %s --userName %s --password %s --json',
            groupName, clusterName, username, password).split(' ');
          testUtils.executeCommand(suite, retry, cmd, function(result) {
            result.exitStatus.should.equal(0);
            done();
          });
        }, timeBeforeClusterAvailable);
      });

      it('disable-http-access should disable HTTP access to the cluster', function(done) {
        this.timeout(hdinsightTest.timeoutLarge);
        
        var cmd = util.format('hdinsight cluster disable-http-access --resource-group %s --clusterName %s --json',
          groupName, clusterName).split(' ');
        testUtils.executeCommand(suite, retry, cmd, function(result) {
          result.exitStatus.should.equal(0);
          done();
        });
      });

      it('enable-rdp-access should enable HTTP access to the cluster', function(done) {
        setTimeout(function () {
        var cmd = util.format('hdinsight cluster enable-rdp-access --resource-group %s --clusterName %s --rdpUserName %s --rdpPassword %s --json',
          groupName, clusterName, username, password, '12/12/2016').split(' ');
        testUtils.executeCommand(suite, retry, cmd, function(result) {
          result.exitStatus.should.equal(0);
          done();
          });
        }, timeBeforeClusterAvailable);
      });

      it('disable-rdp-access should disable HTTP access to the cluster', function(done) {
        this.timeout(hdinsightTest.timeoutLarge);
        
        var cmd = util.format('hdinsight cluster disable-rdp-access --resource-group %s --clusterName %s --json',
          groupName, clusterName).split(' ');
        testUtils.executeCommand(suite, retry, cmd, function(result) {
          result.exitStatus.should.equal(0);
          done();
        });
      });

      it('delete should delete hdinsight cluster', function(done) {
        this.timeout(hdinsightTest.timeoutLarge);
        var cmd = util.format('hdinsight cluster delete --resource-group %s --clusterName %s --quiet --json', groupName, clusterName).split(' ');
        testUtils.executeCommand(suite, retry, cmd, function(result) {
          result.exitStatus.should.equal(0);
          done();
        });
      });

      it('resize should resize the cluster to target size', function (done) {
        var cmd = util.format('hdinsight cluster resize --resource-group %s --clusterName %s --targetInstanceCount 10 --json', groupName, clusterName).split(' ');
        testUtils.executeCommand(suite, retry, cmd, function (result) {
          result.exitStatus.should.equal(0);
          var allResources = JSON.parse(result.text);
          allResources.name.should.equal(clusterName);
          done();
        });
      });

    });
  });
});