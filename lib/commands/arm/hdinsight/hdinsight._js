//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict';

var fs = require('fs');
var __ = require('underscore');
var util = require('util');
var utils = require('../../../util/utils');
var HdiClient = require('./hdiClient');

var $ = utils.getLocaleString;

var UserInteractor = function (cli) {
  var self = this;
  this.cli = cli;
  this.log = cli.output;
  this.progress = null;

  function logErrorAndData(err, data) {
    self.cli.interaction.formatOutput(data, function (outputData) {
      self.log.error(err);
      self.cli.interaction.logEachData('HDInsight Cluster', outputData);
    });
  }

  this.logErrorAndData = logErrorAndData;

  this.checkpoint = function () { };

  function verifyCompat(creationObject, version) {
    if (!creationObject || !creationObject.version || !__.isNumber(creationObject.version)) {
      return false;
    }
    // If the file has a newer version than this library we will not use it.
    if (creationObject.version > version) {
      return false;
    }
    // If the file has the same major version as this library we can use it.
    if (parseInt(creationObject.version, 10) === parseInt(version, 10)) {
      return true;
    }
    // Otherwise the major version of the file is less than this library.
    // That denotes a breaking change in the library and we can not use the file.
    return false;
  }

  this.verifyCompat = verifyCompat;

  function logError(err) {
    self.cli.interaction.formatOutput(err, function () {
      self.log.error(err);
    });
  }

  this.logError = logError;

  function logData(msg, data) {
    self.cli.interaction.formatOutput(data, function (outputData) {
      self.cli.interaction.logEachData(msg, outputData);
    });
  }

  this.logData = logData;

  function logList(list) {
    self.cli.interaction.formatOutput(list, function (outputData) {
      if (outputData.length === 0) {
        self.log.info('No HDInsight clusters exist');
      } else {
        self.log.table(list, function (row, item) {
          row.cell('Name', item.Name);
          row.cell('Location', item.Location);
          row.cell('State', item.State);
        });
      }
    });
  }

  this.logList = logList;

  function promptIfNotGiven(message, value, _) {
    return self.cli.interaction.promptIfNotGiven(message, value, _);
  }

  this.promptIfNotGiven = promptIfNotGiven;

  function startProgress(message) {
    self.progress = self.cli.interaction.progress(message);
  }

  this.startProgress = startProgress;

  function endProgress() {
    self.progress.end();
  }

  this.endProgress = endProgress;

  function writeConfig(filePath, config) {
    var data = JSON.stringify(config);
    fs.writeFileSync(filePath, data);
  }

  this.writeConfig = writeConfig;

  function readConfig(filePath) {
    var data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }

  this.readConfig = readConfig;
  
  function logClusterOperationInfo(result) {
 
	if(result == null || result == undefined){
		    self.log.info('Cluster not found.');
		}
		else {	
			if (self.log.format().json) {
				self.log.json(result);
			}
			else {
				self.log.data($('Operation Info '));
                self.log.data($('---------------'));
				self.log.data($('Operation status: '), result.status);
				self.log.data($('Operation ID: '), result.requestId);
			}
		}
  }
  
  this.logClusterOperationInfo = logClusterOperationInfo;
};

var ExecutionProcessor = function (cli) {
  var self = this;
  this.cli = cli;
  this.errorCount = 0;

  this.createHdiClient = function (cli, subscription) {
      return new HdiClient(cli, subscription);
  };

  this.createCluster = function (resourceGroupName, clusterName, createParams, options, _) {
      var hdInsight = this.createHdiClient(cli, options.subscription);
    var result = hdInsight.createCluster(resourceGroupName, clusterName, createParams, _);
    return result;
  };

  this.getCluster = function (resourceGroupName, clusterName, options, _) {
    var hdInsight = self.createHdiClient(cli, options.subscription);
    var result = hdInsight.getCluster(resourceGroupName, clusterName, _);
    return result;
  };

  this.deleteCluster = function (resourceGroupName, clusterName, options, _) {
    var hdInsight = self.createHdiClient(cli, options.subscription);
    var result = hdInsight.deleteCluster(resourceGroupName, clusterName, _);
    return result;
  };

  this.listClusters = function (resourceGroupName, options, _) {
    var hdInsight = self.createHdiClient(cli, options.subscription);
    var result = hdInsight.listClusters(resourceGroupName, _);
    return result;
  };

  this.resizeCluster = function (resourceGroupName, clusterName, targetInstanceCount, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.resizeCluster(resourceGroupName, clusterName, targetInstanceCount, _);
  	return result;
  };

  this.enableHttp = function (resourceGroupName, clusterName, userName, password, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.enableHttp(resourceGroupName, clusterName, userName, password, _);
  	return result;
  };

  this.disableHttp = function (resourceGroupName, clusterName, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.disableHttp(resourceGroupName, clusterName, _);
  	return result;
  };
  
  this.enableRdp = function (resourceGroupName, clusterName, rdpUserName, rdpPassword, rdpExpiryDate, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.enableRdp(resourceGroupName, clusterName, rdpUserName, rdpPassword, rdpExpiryDate, _);
  	return result;
  };

  this.disableRdp = function (resourceGroupName, clusterName, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.disableRdp(resourceGroupName, clusterName, _);
  	return result;
  };
  
  this.createConfigFile = function (configFilePath, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.createConfigFile(configFilePath, options, _);
  	return result;
  };
  
  this.addConfigValue = function (configFilePath, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.addConfigValue(configFilePath, options, _);
  	return result;
  };
  
  this.addScriptAction = function (configFilePath, options, _) {
  	var hdInsight = self.createHdiClient(cli, options.subscription);
  	var result = hdInsight.addScriptAction(configFilePath, options, _);
  	return result;
  };

  this.createHDInsightJobManagementClient = function (clusterDnsName, userName, password) {
    return utils.getHDInsightJobManagementClient(clusterDnsName, userName, password);
  };

  this.submitHDInsightHiveJob = function (clusterDnsName, userName, password, parameters, _) {
    var hdInsightJobClient = self.createHDInsightJobManagementClient(clusterDnsName, userName, password);

    var result = hdInsightJobClient.jobManagement.submitHiveJob(parameters, _);
    return result;
  };

  this.submitHDInsightPigJob = function (clusterDnsName, userName, password, parameters, _) {
    var hdInsightJobClient = self.createHDInsightJobManagementClient(clusterDnsName, userName, password);
    var result = hdInsightJobClient.jobManagement.submitPigJob(parameters, _);
    return result;
  };

  this.submitHDInsightMapReduceJob = function (clusterDnsName, userName, password, parameters, _) {
    var hdInsightJobClient = self.createHDInsightJobManagementClient(clusterDnsName, userName, password);
    var result = hdInsightJobClient.jobManagement.submitMapReduceJob(parameters, _);
    return result;
  };

  this.submitHDInsightStreamingMapReduceJob = function (clusterDnsName, userName, password, parameters, _) {
    var hdInsightJobClient = self.createHDInsightJobManagementClient(clusterDnsName, userName, password);
    var result = hdInsightJobClient.jobManagement.submitMapReduceStreamingJob(parameters, _);
    return result;
  };

  this.getHDInsightJob = function (clusterDnsName, userName, password, jobId, _) {
    var hdInsightJobClient = self.createHDInsightJobManagementClient(clusterDnsName, userName, password);
    var result = hdInsightJobClient.jobManagement.getJob(jobId, _);
    return result;
  };

  this.listHDInsightJobs = function (clusterDnsName, userName, password, _) {
    var hdInsightJobClient = self.createHDInsightJobManagementClient(clusterDnsName, userName, password);
    var result = hdInsightJobClient.jobManagement.listJobs(_);
    return result.jobList;
  };
};

var hdInsightCommandLine = function (cli, userInteractor, executionProcessor) {
  this.cli = cli;
  this.log = cli.output;
  var self = this;
  if (userInteractor) {
    this.user = userInteractor;
  }
  else {
    this.user = new UserInteractor(this.cli);
  }

  if (executionProcessor) {
    this.processor = executionProcessor;
  }
  else {
    this.processor = new ExecutionProcessor(this.cli);
  }

    this.createClusterCommand = function(clusterName, options, _) {

        options.resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), options.resourceGroupName, _);
        clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);
        options.osType = self.user.promptIfNotGiven($('OS type: '), options.osType, _);
        options.location = self.user.promptIfNotGiven($('Data center location: '), options.location, _);
        options.defaultStorageAccountName = self.user.promptIfNotGiven($('storage account url: '), options.defaultStorageAccountName, _);
        options.defaultStorageAccountKey = self.user.promptIfNotGiven($('storage account key: '), options.defaultStorageAccountKey, _);
        options.defaultStorageContainer = self.user.promptIfNotGiven($('storage container name: '), options.defaultStorageContainer, _);
        options.workerNodeCount = self.user.promptIfNotGiven($('Number of worker nodes: '), options.workerNodeCount, _);
        options.userName = self.user.promptIfNotGiven($('User name: '), options.userName, _);
        options.password = self.user.promptIfNotGiven($('Password: '), options.password, _);

        // Set defaults
        if (utils.stringIsNullOrEmpty(options.osType)) {
            options.osType = 'Windows';
        }

        if (utils.stringIsNullOrEmpty(options.version)) {
            options.version = 'default';
        }

        if (utils.ignoreCaseEquals(options.osType, 'windows')) {
            options.headNodeSize = self.user.promptIfNotGiven($('Head node size (string): '), options.headNodeSize, _);
            options.workerNodeSize = self.user.promptIfNotGiven($('Data node size (string): '), options.workerNodeSize, _);

        } else if (utils.ignoreCaseEquals(options.osType, 'linux')) {
        	options.sshUserName = self.user.promptIfNotGiven($('SSH user name: '), options.sshUserName, _);
        	options.sshPassword = self.user.promptIfNotGiven($('SSH password: '), options.sshPassword, _);
        }

		if(!utils.stringIsNullOrEmpty(options.additionalStorageAccounts))
		{
			var additionalStorageAccountsList = [];
			options.additionalStorageAccounts.split(';').forEach(function (account) {
				var kvp = account.split('::');
				var item = {
					key: kvp[0],
					value: kvp[1]
				};
				additionalStorageAccountsList.push(item);
			});
			options.additionalStorageAccounts = additionalStorageAccountsList;
		}
		
		if(!utils.stringIsNullOrEmpty(options.externalHiveMetastoreSqlServerName)
		|| !utils.stringIsNullOrEmpty(options.externalHiveMetastoreDatabaseName)
		|| !utils.stringIsNullOrEmpty(options.externalHiveMetastoreUserName)
		|| !utils.stringIsNullOrEmpty(options.externalHiveMetastorePassword))
		{
			options.externalHiveMetastoreSqlServerName = self.user.promptIfNotGiven($('Hive metastore SQL Server name: '), options.externalHiveMetastoreSqlServerName, _);
			options.externalHiveMetastoreDatabaseName = self.user.promptIfNotGiven($('Hive metastore database name: '), options.externalHiveMetastoreDatabaseName, _);
			options.externalHiveMetastoreUserName = self.user.promptIfNotGiven($('Hive metastore database username: '), options.externalHiveMetastoreUserName, _);
			options.externalHiveMetastorePassword = self.user.promptIfNotGiven($('Hive metastore database password: '), options.externalHiveMetastorePassword, _);
			
			options.hiveMetastore = {
				server: options.externalHiveMetastoreSqlServerName,
				database: options.externalHiveMetastoreDatabaseName,
				user: options.externalHiveMetastoreUserName,
				password: options.externalHiveMetastorePassword
			}        
		}
		
		if(!utils.stringIsNullOrEmpty(options.externalOozieMetastoreSqlServerName)
		|| !utils.stringIsNullOrEmpty(options.externalOozieMetastoreDatabaseName)
		|| !utils.stringIsNullOrEmpty(options.externalOozieMetastoreUserName)
		|| !utils.stringIsNullOrEmpty(options.externalOozieMetastorePassword))
		{
			options.externalOozieMetastoreSqlServerName = self.user.promptIfNotGiven($('Oozie metastore SQL Server name: '), options.externalOozieMetastoreSqlServerName, _);
			options.externalOozieMetastoreDatabaseName = self.user.promptIfNotGiven($('Oozie metastore database name: '), options.externalOozieMetastoreDatabaseName, _);
			options.externalOozieMetastoreUserName = self.user.promptIfNotGiven($('Oozie metastore database username: '), options.externalOozieMetastoreUserName, _);
			options.externalOozieMetastorePassword = self.user.promptIfNotGiven($('Oozie metastore database password: '), options.externalOozieMetastorePassword, _);
			
			options.oozieMetastore = {
				server: options.externalOozieMetastoreSqlServerName,
				database: options.externalOozieMetastoreDatabaseName,
				user: options.externalOozieMetastoreUserName,
				password: options.externalOozieMetastorePassword
			} 
        
		}
		
		if(!utils.stringIsNullOrEmpty(options.configurationPath))
		{
			var configurationsFileContent = self.user.readConfig(options.configurationPath);
			options.configurations = configurationsFileContent["configurations"];
			options.scriptActions = configurationsFileContent["scriptActions"];
		}
		
        self.user.startProgress($('Submitting the request to create cluster...'));

        var clusterCreateParameters = {
            location: options.location,
            defaultStorageAccountName: options.defaultStorageAccountName,
            defaultStorageAccountKey: options.defaultStorageAccountKey,
            defaultStorageContainer: options.defaultStorageContainer,
            userName: options.userName,
            password: options.password,
            rdpUserName: options.rdpUserName,
            rdpPassword: options.rdpPassword,
            rdpAccessExpiry: options.rdpAccessExpiry,
            clusterSizeInNodes: options.workerNodeCount,
            version: options.version,
            headNodeSize: options.headNodeSize,
            workerNodeSize: options.workerNodeSize,
            zookeeperNodeSize: options.zookeeperNodeSize,
            clusterType: options.clusterType,
            virtualNetworkId: options.virtualNetworkId,
            subnetName: options.subnetName,
            osType: options.osType,
            sshUserName: options.sshUserName,
            sshPassword: options.sshPassword,
            sshPublicKey: options.sshPublicKey,
            oozieMetastore: options.oozieMetastore,
            hiveMetastore: options.hiveMetastore,
            additionalStorageAccounts: options.additionalStorageAccounts,
            configurations: options.configurations,
            scriptActions: options.scriptActions
        };

        var result = self.processor.createCluster(options.resourceGroupName, clusterName, clusterCreateParameters, options, _);
        self.user.endProgress();

        if (self.log.format().json) {
            self.log.json(result);
        } else {
            self.log.data($('Cluster ID  :'), result.id);
            self.log.data($('Status      :'), result.status);
        }
    };

    this.showClusterCommand = function(resourceGroupName, clusterName, options, _) {
        resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), resourceGroupName, _);
        clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);

        self.user.startProgress($('Getting HDInsight cluster details'));

        var cluster = self.processor.getCluster(resourceGroupName, clusterName, options, _).cluster;
        self.user.endProgress();

        if (cluster === undefined || cluster === null) {
            self.log.data($('Could not find '));
        } else {
            var clusterInfo = cluster;
            if (self.log.format().json) {
                self.log.json(clusterInfo);
            } else {
                self.log.data($('HDInsight Cluster Info'));
                self.log.data($('----------------------'));
                self.log.data($('Name          :'), clusterInfo.id || clusterInfo.dnsName);
                self.log.data($('State         :'), clusterInfo.state);
                self.log.data($('Location      :'), clusterInfo.location);
                self.log.data($('Version       :'), clusterInfo.version || clusterInfo.hdiVersion);
            }
        }
    };

    this.listClustersCommand = function(resourceGroupName, options, _) {
        self.user.startProgress($('Getting HDInsight servers'));
        var result = self.processor.listClusters(resourceGroupName, options, _);
        self.user.endProgress();

        if (result.length === 0) {
            self.log.data($('No clusters found.'));
        } else if (self.log.format().json) {
            self.log.json(result);
        } else {
            //construct the object to display
            var clusters = [];
            result.clusters.forEach(function(c) {
                    var cluster = {};
                    cluster.eTag = c.eTag;
                    cluster.id = c.id;
                    cluster.location = c.location;
                    cluster.name = c.name;
                    cluster.clusterState = c.properties.clusterState;
                    cluster.clusterVersion = c.properties.clusterVersion;
                    cluster.createdDate = c.properties.createdDate;
                    cluster.osType = c.properties.operatingSystemType;
                    cluster.provisioningState = c.properties.provisioningState;
                    clusters.push(cluster);
                }
            );
            self.cli.interaction.formatOutput(clusters, function(outputData) {
                self.log.table(outputData, function(row, item) {
                    row.cell('Name', item.name);
                    row.cell('ETag', item.eTag);
                    row.cell('ID', item.id);
                    row.cell('State', item.clusterState);
                    row.cell('ProvisioningState', item.provisioningState);
                    row.cell('CreatedDate', item.createdDate);
                    row.cell('Location', item.location);
                    row.cell('Version', item.clusterVersion);
                    row.cell('OsType', item.osType || 'Windows Server 2012');
                });
            });
        }
    };

    this.deleteClusterCommand = function(resourceGroupName, clusterName, options, _) {
        resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), resourceGroupName, _);
        clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);
        self.user.startProgress($('Deleting HDInsight Cluster'));

        self.processor.deleteCluster(resourceGroupName, clusterName, options, _);

        self.user.endProgress();
    };

    this.resizeClusterCommand = function (resourceGroupName, clusterName, targetInstanceCount, options, _) {
    	resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), resourceGroupName, _);
    	clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);
    	options.targetInstanceCount = self.user.promptIfNotGiven($('TargetInstanceCount: '), clusterName, _);
    	self.user.startProgress($('Resizing HDInsight Cluster'));

    	var result = self.processor.resizeCluster(resourceGroupName, clusterName, targetInstanceCount, options, _);
		
		self.user.logClusterOperationInfo(result);

    	self.user.endProgress();
    };

    this.enableHttpAccessCommand = function (resourceGroupName, clusterName, userName, password, options, _) {
    	resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), resourceGroupName, _);
    	clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);
    	userName = self.user.promptIfNotGiven($('Http username: '), userName, _);
    	password = self.user.promptIfNotGiven($('Http password: '), password, _);

    	self.user.startProgress($('Enabling HTTP access for HDInsight cluster'));

        var result = self.processor.enableHttp(resourceGroupName, clusterName, userName, password, options, _);
		
    	self.user.endProgress();
		
		self.user.logClusterOperationInfo(result);

    };

    this.disableHttpAccessCommand = function (resourceGroupName, clusterName, options, _) {
    	resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), resourceGroupName, _);
    	clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);
    	
    	self.user.startProgress($('Disabling HTTP access for HDInsight cluster'));

    	var result = self.processor.disableHttp(resourceGroupName, clusterName, options, _);
				
    	self.user.endProgress();
		
		self.user.logClusterOperationInfo(result);

    };
	
	this.enableRdpAccessCommand = function (resourceGroupName, clusterName, rdpUserName, rdpPassword, rdpExpiryDate, options, _) {
    	resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), resourceGroupName, _);
    	clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);
    	rdpUserName = self.user.promptIfNotGiven($('RDP username: '), rdpUserName, _);
    	rdpPassword = self.user.promptIfNotGiven($('RDP password: '), rdpPassword, _);
		rdpExpiryDate = self.user.promptIfNotGiven($('RDP expiry date: '), rdpExpiryDate, _);
		
		var rdpAccessExpiryDate = new Date();
		if (__.isString(rdpExpiryDate)) {
			var parsedExpiryDate = Date.parse(rdpExpiryDate);
			if (__.isNaN(parsedExpiryDate)) {
				throw new Error(util.format($('%s parameter is not a valid Date \"%s\"'), 'rdpExpiryDate', rdpExpiryDate));
			}
		}

		rdpExpiryDate = new Date(parsedExpiryDate);

    	self.user.startProgress($('Enabling RDP access for HDInsight cluster'));

        var result = self.processor.enableRdp(resourceGroupName, clusterName, rdpUserName, rdpPassword, rdpExpiryDate, options, _);
				
    	self.user.endProgress();		
		
		self.user.logClusterOperationInfo(result);
    };

    this.disableRdpAccessCommand = function (resourceGroupName, clusterName, options, _) {
    	resourceGroupName = self.user.promptIfNotGiven($('Resource Group name: '), resourceGroupName, _);
    	clusterName = self.user.promptIfNotGiven($('Cluster name: '), clusterName, _);
    	
    	self.user.startProgress($('Disabling RDP access for HDInsight cluster'));

    	var result = self.processor.disableRdp(resourceGroupName, clusterName, options, _);
		
    	self.user.endProgress();
		
		self.user.logClusterOperationInfo(result);
    };
	
	this.createClusterConfigCommand = function (configFilePath, options, _) {
		configFilePath = self.user.promptIfNotGiven($('Config file path: '), configFilePath, _);
		
		if (fs.existsSync(configFilePath)) {
			if(!options.overwrite){
				self.user.logError($('File already exists. Choose overwrite option to overwrite the file.'));			
			}
			else {
				self.user.logData($('File already exists and overwrite option is specified. Overwriting file.'));
				var result = self.processor.createConfigFile(configFilePath, options, _);
			}
		}
		else {
			self.user.startProgress($('Creates a new HDInsight cluster config file.'));
			var result = self.processor.createConfigFile(configFilePath, options, _);
		}
    };
	
	this.addConfigValue = function (configFilePath, options, _) {
		configFilePath = self.user.promptIfNotGiven($('Config file path: '), configFilePath, _);
		
		if (!fs.existsSync(configFilePath)) {
			self.user.logError($('Config file does not exist'));
		}
		else {
			self.user.startProgress($('Adding config value to HDInsight cluster config file.'));
			var result = self.processor.addConfigValue(configFilePath, options, _);
		}		
    	self.user.endProgress();
    };
  
	this.addScriptAction = function (configFilePath, options, _) {
    	configFilePath = self.user.promptIfNotGiven($('Config file path: '), configFilePath, _);
		options.nodeType = self.user.promptIfNotGiven($('Node type (Example: HeadNode, WorkerNode, ZookeeperNode): '), options.nodeType, _);
		options.name = self.user.promptIfNotGiven($('Name: '), options.name, _);
		options.uri = self.user.promptIfNotGiven($('Uri: '), options.uri, _);
		options.parameters = self.user.promptIfNotGiven($('Parameters: '), options.parameters, _);
		
		if (!fs.existsSync(configFilePath)) {
			self.user.logError($('Config file does not exist'));
		}
		else {
			self.user.startProgress($('Adding script action to HDInsight cluster config file.'));
			var result = self.processor.addScriptAction(configFilePath, options, _);
		}
		
    	self.user.endProgress();
    };

  // START: HDInsight job submission commands
  this.submitHDInsightHiveJobCommand = function (clusterDnsName, userName, password, options, _) {
    clusterDnsName = self.user.promptIfNotGiven($('Cluster name: '), clusterDnsName, _);
    userName = self.user.promptIfNotGiven($('User name: '), userName, _);
    password = self.user.promptIfNotGiven($('Password: '), password, _);
    var parameters = {};
    parameters.userName = userName;
    parameters.enableLog = false;
    parameters.statusDir = '.';
    parameters.query = '';
    parameters.file = '';
    parameters.files = '';
    parameters.defines = '';
    parameters['arguments'] = '';

    if (options.query && options.queryFile) {
      throw new Error($('Either provide the query or queryFile parameter.'));
    }
    if (options.query) {
      parameters.query = options.query;
    }
    if (options.queryFile) {
      parameters.file = options.queryFile;
    }
    if (options.defines) {
      parameters.defines = options.defines;
    }
    if (options['arguments']) {
      parameters['arguments'] = options['arguments'];
    }
    if (options.files) {
      parameters.files = options.files;
    }

    var result = self.processor.submitHDInsightHiveJob(clusterDnsName, userName, password, parameters, _);
    var response = result.jobSubmissionJsonResponse;
    if (self.log.format().json) {
      self.log.json(response);
    }
    self.log.data($('Job Id      :'), response.id);
  };

  this.submitHDInsightPigJobCommand = function (clusterDnsName, userName, password, options, _) {
    clusterDnsName = self.user.promptIfNotGiven($('Cluster name: '), clusterDnsName, _);
    userName = self.user.promptIfNotGiven($('User name: '), userName, _);
    password = self.user.promptIfNotGiven($('Password: '), password, _);
    var parameters = {};
    parameters.userName = userName;
    parameters.query = '';
    parameters.file = '';
    parameters.files = '';
    parameters['arguments'] = '';

    if (options.query && options.queryFile) {
      throw new Error($('Either provide the query or queryFile parameter.'));
    }
    if (options.query) {
      parameters.query = options.query;
    }
    if (options.queryFile) {
      parameters.file = options.queryFile;
    }
    if (options['arguments']) {
      parameters['arguments'] = options['arguments'];
    }
    if (options.files) {
      parameters.files = options.files;
    }
    var result = self.processor.submitHDInsightPigJob(clusterDnsName, userName, parameters, _);

    var response = result.jobSubmissionJsonResponse;
    if (self.log.format().json) {
      self.log.json(response);
    }
    self.log.data($('Job Id      :'), response.id);
  };

  this.submitHDInsightMapReduceJobCommand = function (clusterDnsName, userName, password, options, _) {
    clusterDnsName = self.user.promptIfNotGiven($('Cluster name: '), clusterDnsName, _);
    userName = self.user.promptIfNotGiven($('User name: '), userName, _);
    password = self.user.promptIfNotGiven($('Password: '), password, _);
    var parameters = {};
    parameters.userName = userName;
    parameters['className'] = '';
    parameters.jarFile = '';
    parameters.libJars = '';
    parameters.files = '';
    parameters.defines = '';
    parameters['arguments'] = '';

    if (options.jarFile) {
      parameters.jarFile = options.jarFile;
    }
    if (options.libJars) {
      parameters.libJars = options.libJars;
    }
    if (options.defines) {
      parameters.defines = options.defines;
    }
    if (options['arguments']) {
      parameters['arguments'] = options['arguments'];
    }
    if (options['className']) {
      parameters['className'] = options['className'];
    }
    if (options.files) {
      parameters.files = options.files;
    }
    var result = self.processor.submitHDInsightMapReduceJob(clusterDnsName, userName, password, parameters, _);
    var response = result.jobSubmissionJsonResponse;
    if (self.log.format().json) {
      self.log.json(response);
    }
    self.log.data($('Job Id      :'), response.id);
  };

  this.submitHDInsightStreamingMapReduceJobCommand = function (clusterDnsName, userName, password, options, _) {
    clusterDnsName = self.user.promptIfNotGiven($('Cluster name: '), clusterDnsName, _);
    userName = self.user.promptIfNotGiven($('User name: '), userName, _);
    password = self.user.promptIfNotGiven($('Password: '), password, _);
    var parameters = {};
    parameters.userName = userName;
    parameters['arguments'] = '';
    parameters.mapper = '';
    parameters.reducer = '';
    parameters.combiner = '';
    parameters.cmdenv = '';
    parameters.outputPath = '';
    parameters.files = '';
    parameters.defines = '';
    parameters.inputPath = '';

    if (options.mapper) {
      parameters.mapper = options.mapper;
    }
    if (options.combiner) {
      parameters.combiner = options.combiner;
    }
    if (options.reducer) {
      parameters.reducer = options.reducer;
    }
    if (options.cmdenv) {
      parameters.cmdenv = options.cmdenv;
    }
    if (options.outputPath) {
      parameters.outputPath = options.outputPath;
    }
    if (options.inputPath) {
      parameters.inputPath = options.inputPath;
    }
    if (options.defines) {
      parameters.defines = options.defines;
    }
    if (options['arguments']) {
      parameters['arguments'] = options['arguments'];
    }
    if (options.files) {
      parameters.files = options.files;
    }
    var result = self.processor.submitHDInsightStreamingMapReduceJob(clusterDnsName, userName, password, parameters, _);
    var response = result.jobSubmissionJsonResponse;
    if (self.log.format().json) {
      self.log.json(response);
    }
    self.log.data($('Job Id      :'), response.id);
  };

  this.getHDInsightJobCommand = function (clusterDnsName, userName, password, jobId, _) {
    clusterDnsName = self.user.promptIfNotGiven($('Cluster name: '), clusterDnsName, _);
    userName = self.user.promptIfNotGiven($('User name: '), userName, _);
    password = self.user.promptIfNotGiven($('Password: '), password, _);
    jobId = self.user.promptIfNotGiven($('JobId: '), jobId, _);
    self.user.startProgress($('Listing HDInsight Job details for ' + jobId + ' on ' + clusterDnsName));
    var result = self.processor.getHDInsightJob(clusterDnsName, userName, password, jobId, _);
    self.user.endProgress();

    if (!result.jobDetail) {
      self.log.data($('Job not found.'));
    }
    else {
      var jobInfo = result.jobDetail;
      if (self.log.format().json) {
        self.log.json(jobInfo);
      }
      else {
        self.log.data($('HDInsight Job Info'));
        self.log.data($('------------------'));
        self.log.data($('Job Id      :'), jobInfo.id);
        self.log.data($('Job State   :'), jobInfo.status.state);
      }
    }
  };

  this.listHDInsightJobsCommand = function (clusterDnsName, userName, password, _) {
    clusterDnsName = self.user.promptIfNotGiven($('Cluster name: '), clusterDnsName, _);
    userName = self.user.promptIfNotGiven($('User name: '), userName, _);
    password = self.user.promptIfNotGiven($('Password: '), password, _);
    self.user.startProgress($('Listing HDInsight Jobs for cluster ' + clusterDnsName));
    var jobList = self.processor.listHDInsightJobs(clusterDnsName, userName, password, _);
    self.user.endProgress();
    self.cli.interaction.formatOutput(jobList, function (outputData) {
      if (outputData.length === 0) {
        self.log.data($('No jobs found.'));
      }
      else {
        if (self.log.format().json) {
          self.log.json(outputData);
        }
        else {
          self.log.table(outputData, function (row, item) {
            row.cell('Job Id', item.id);
          });
        }
      }
    });
  };
};

module.exports = hdInsightCommandLine;

hdInsightCommandLine.init = function(cli) {
    var self = new hdInsightCommandLine(cli);

    var hdInsight = cli.category('hdinsight')
        .description($('Commands to manage HDInsight clusters and jobs'));

    var cluster = hdInsight.category('cluster')
        .description($('Commands to manage HDInsight clusters'));

    cluster.command('create [clusterName]')
        .description($('Create a cluster in a resource group'))
        .usage('[options] <clusterName>')
        .option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
        .option('-c, --clusterName <clusterName>', $('HDInsight cluster name'))
        .option('-l, --location <location>', $('Data center location for the cluster'))
        .option('-y, --osType <osType>', $('HDInsight cluster operating system - \'windows\' or \'linux\''))
        .option('--defaultStorageAccountName <storageAccountName>', $('Storage account url to use for default HDInsight storage'))
        .option('--defaultStorageAccountKey <storageAccountKey>', $('Key to the storage account to use for default HDInsight storage'))
        .option('--defaultStorageContainer <storageContainer>', $('Container in the storage account to use for HDInsight default storage'))
		.option('--workerNodeCount <workerNodeCount>', $('Number of worker nodes to use for the cluster'))
        .option('--headNodeSize <headNodeSize>', $('NOTE: Head node size for the cluster (only allowed for \'windows\' ostype)'))
        .option('--workerNodeSize <workerNodeSize>', $('NOTE: Data node size for the cluster (only allowed for \'windows\' ostype)'))
        .option('--zookeeperNodeSize <zookeeperNodeSize>', $('NOTE: Zookeeper node size for the cluster (only allowed for \'windows\' ostype)'))
        .option('--userName <userName>', $('Cluster username'))
        .option('--password <password>', $('Cluster password'))
        .option('--sshUserName <sshUserName>', $('SSH username'))
        .option('--sshPassword <sshPassword>', $('SSH password'))
		.option('--sshPublicKey <sshPublicKey>', $('SSH public key'))
        .option('--rdpUserName <rdpUserName>', $('RDP username'))
        .option('--rdpPassword <rdpPassword>', $('RDP password'))
        .option('--rdpAccessExpiry <rdpAccessExpiry>', $('RDP access expiry'))
        .option('--version <version>', $('HDInsight cluster version'))
        .option('--clusterType <clusterType>', $('HDInsight cluster type. Hadoop | HBase | Spark | Storm'))
        .option('--virtualNetworkId <virtualNetworkId>', $('NOTE: Virtual network ID for the cluster (only allowed for \'Linux\' ostype)'))
        .option('--subnetName <subnetName>', $('NOTE: Subnet for the cluster (only allowed for \'Linux\' ostype)'))
		.option('--additionalStorageAccounts <additionalStorageAccounts>', $('Optional additional storage accounts. Can be multiple. ' +
			'In the format of \'accountName=accountKey\'. For example, --additionalStorageAccounts "acc1"="key1";"acc2"="key2"'))
       	.option('--externalHiveMetastoreSqlServerName <externalHiveMetastoreSqlServerName>', $('SQL Server name for the external metastore for Hive'))
		.option('--externalHiveMetastoreDatabaseName <externalHiveMetastoreDatabaseName>', $('Database name for the external metastore for Hive'))
		.option('--externalHiveMetastoreUserName <externalHiveMetastoreUserName>', $('Database username for the external metastore for Hive'))
		.option('--externalHiveMetastorePassword <externalHiveMetastorePassword>', $('Database password for the external metastore for Hive'))
		.option('--externalOozieMetastoreSqlServerName <externalOozieMetastoreSqlServerName>', $('SQL Server name for the external metastore for Oozie'))
		.option('--externalOozieMetastoreDatabaseName <externalOozieMetastoreDatabaseName>', $('Database name for the external metastore for Oozie'))
		.option('--externalOozieMetastoreUserName <externalOozieMetastoreUserName>', $('Database username for the external metastore for Oozie'))
		.option('--externalOozieMetastorePassword <externalOozieMetastorePassword>', $('Database password for the external metastore for Oozie'))
		.option('--configurationPath <configurationPath>', $('HDInsight cluster configuration file path'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(function(clusterName, options, _) {
            self.createClusterCommand(clusterName, options, _);
        });

    cluster.command('delete [resourceGroupName] [clusterName]')
        .description($('Delete a cluster'))
        .usage('[options] <clusterName> <location> <osType>')
        .option('--clusterName <clusterName>', $('Cluster name'))
        .option('--location <location>', $('Cluster location'))
        .option('--osType <osType>', $('Cluster OS type'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(function(resourceGroupName, clusterName, options, _) {
        	self.deleteClusterCommand(resourceGroupName, clusterName, options, _);
        });

    cluster.command('show [resourceGroupName] [clusterName]')
        .description($('Show cluster details'))
        .usage('[options] <resourceGrupName> <clusterName>')
        .option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
        .option('-c, --clusterName <clusterName>', $('HDInsight cluster name'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(function(resourceGroupName, clusterName, options, _) {
            self.showClusterCommand(resourceGroupName, clusterName, options, _);
        });

    cluster.command('list')
        .description($('List all the clusters (in a specific resource group if provided) .'))
		.usage('[options] <resourceGroupName>')
        .option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(function(resourceGroupName, options, _) {
            self.listClustersCommand(resourceGroupName, options, _);
        });

    cluster.command('resize [resourceGroupName] [clusterName] [targetInstanceCount]')
        .description($('Resizes the cluster'))
        .usage('[options] <resourceGroupName> <clusterName> <targetInstanceCount>')
        .option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
        .option('-c, --clusterName <clusterName>', $('HDInsight cluster name'))
        .option('--targetInstanceCount <targetInstanceCount>', $('Target instance count.'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(function(resourceGroupName, clusterName, targetInstanceCount, options, _) {
            self.resizeClusterCommand(resourceGroupName, clusterName, targetInstanceCount, options, _);
        });

    cluster.command('enable-http-access [resourceGroupName] [clusterName] [userName] [password]')
			.description($('Enable HTTP access for cluster'))
			.usage('[options] <resourceGroupName> <clusterName> <userName> <password>')
			.option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
			.option('-c, --clusterName <clusterName>', $('HDInsight cluster name'))
			.option('--userName <userName>', $('Cluster username'))
			.option('--password <password>', $('Cluster password'))
			.option('-s, --subscription <id>', $('The subscription id'))
			.execute(function (resourceGroupName, clusterName, userName, password, options, _) {
				self.enableHttpAccessCommand(resourceGroupName, clusterName, userName, password, options, _);
			});

    cluster.command('disable-http-access [resourceGroupName] [clusterName]')
				.description($('Disable HTTP access for cluster'))
				.usage('[options] <resourceGroupName> <clusterName>')
				.option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
				.option('-c, --clusterName <clusterName>', $('HDInsight cluster name'))
				.option('-s, --subscription <id>', $('The subscription id'))
				.execute(function (resourceGroupName, clusterName, options, _) {
					self.disableHttpAccessCommand(resourceGroupName, clusterName, options, _);
				});
	
	cluster.command('enable-rdp-access [resourceGroupName] [clusterName] [rdpUserName] [rdpPassword] [rdpExpiryDate]')
			.description($('Enable RDP access for cluster'))
			.usage('[options] <resourceGroupName> <clusterName> <rdpUserName> <rdpPassword> <rdpExpiryDate>')
			.option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
			.option('-c, --clusterName <clusterName>', $('HDInsight cluster name'))
			.option('--rdpUserName <rdpUserName>', $('RDP username'))
			.option('--rdpPassword <rdpPassword>', $('RDP password'))
			.option('--rdpExpiryDate <rdpExpiryDate>', $('RDP access expiry date'))
			.option('-s, --subscription <id>', $('The subscription id'))
			.execute(function (resourceGroupName, clusterName, rdpUserName, rdpPassword, rdpExpiryDate, options, _) {
				self.enableRdpAccessCommand(resourceGroupName, clusterName, rdpUserName, rdpPassword, rdpExpiryDate, options, _);
			});

    cluster.command('disable-rdp-access [resourceGroupName] [clusterName]')
				.description($('Disable HTTP access for cluster'))
				.usage('[options] <resourceGroupName> <clusterName>')
				.option('-g, --resourceGroupName <resourceGroupName>', $('Azure resource group name for the cluster'))
				.option('-c, --clusterName <clusterName>', $('HDInsight cluster name'))
				.option('-s, --subscription <id>', $('The subscription id'))
				.execute(function (resourceGroupName, clusterName, options, _) {
					self.disableRdpAccessCommand(resourceGroupName, clusterName, options, _);
				});				
		
	cluster.command('create-config [configFilePath]')
				.description($('Creates a persisted Azure HDInsight cluster configuration file.'))
				.usage('[options] <configFilePath> <overwrite>')
				.option('--configFilePath <configFilePath>', $('HdInsight configuration file path'))
				.option('--overwrite <overwrite>', $('Overwrites existing configuration file'))
				.execute(function (configFilePath, options, _) {
					self.createClusterConfigCommand(configFilePath, options, _);
				});
				
	cluster.command('add-config [configFilePath]')
				.description($('Adds a Hadoop configuration value customization or a Hive shared library customization to an HDInsight cluster configuration.'))
				.usage('[options] <configFilePath>')
				.option('--configFilePath <configFilePath>', $('Configuration file path'))
				.option('--core-site <core-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--hive-site <hive-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--hive-env <hive-env>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--hdfs-site <hdfs-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--hbase-env <hbase-env>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--hbase-site <hbase-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--mapred-site <mapred-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--oozie-env <oozie-env>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--oozie-site <oozie-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--storm-site <storm-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--tez-site <tez-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--webhcat-site <webhcat-site>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--gateway <gateway>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))
				.option('--yarn <yarn>', $('In the format of \'name=value\'. For example, parameter1=value1;parameter2=value2'))				
				.option('-s, --subscription <id>', $('The subscription id'))
				.execute(function (configFilePath, options, _) {
					self.addConfigValue(configFilePath, options, _);
				});
	
	cluster.command('add-script-action [configFilePath]')
				.description($('Adds a HDInsight script action.'))
				.usage('[options] <configFilePath>')
				.option('--configFilePath <configFilePath>', $('Configuration file path'))
				.option('--nodeType <nodeType>', $('Specifies the node on which this cmdlet applies the action. Example: HeadNode | WorkerNode | ZookeeperNode'))				
				.option('--uri <uri>', $('Specifies the URI for the action.'))				
				.option('--name <name>', $('Specifies the name of the action.'))				
				.option('--parameters <parameters>', $('Specifies the parameters for the action.'))		
				.option('-s, --subscription <id>', $('The subscription id'))
				.execute(function (configFilePath, options, _) {
					self.addScriptAction(configFilePath, options, _);
				});
				
    // START: HDInsight job management commands
    var job = hdInsight.category('job')
        .description($('Commands to manage HDInsight jobs'));

    job.command('hive_create [clusterDnsName] [userName] [password]')
        .description($('Submits a Hive job to an HdInsight cluster'))
        .usage('[options] <clusterDnsName> <userName> <password>')
        .option('--clusterDnsName <clusterDnsName>', $('Fully qualified cluster DNS name. Example: mycluster.azurehdinsight.net'))
        .option('--userName <userName>', $('User name for the cluster'))
        .option('--password <password>', $('Password for the cluster'))
        .option('--query <query>', $('The Hive query string to be executed'))
        .option('--queryFile <queryFile>', $('The path to a file that contains the Hive query to be executed; this parameter and the [query] parameter are mutually exclusive'))
        .option('--arguments <arguments>', $('A comma separated string of arguments to be passed to the Hive job. For example: "a1,a2,a3"'))
        .option('--defines <defines>', $('A key/value pair of Hadoop configuration values to be set during the Hive job execution. For example: "k1=v1,k2=v2"'))
        .option('--files <files>', $('A comma separated string of file paths required for the Hive job to execute. For example: "f1/f2/f3,f4/f5,f6"'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(self.submitHDInsightHiveJobCommand);

    /*job.command('pig_create [clusterDnsName] [userName] [password] [query]')
    .description($('Submits a Pig job to an HdInsight cluster'))
    .usage('[options] <clusterDnsName> <userName> <password> <query>')
    .option('--clusterDnsName <clusterDnsName>', $('Fully qualified cluster DNS name. Example: mycluster.azurehdinsight.net'))
    .option('--userName <userName>', $('User name for the cluster'))
    .option('--password <password>', $('Password for the cluster'))
    .option('--query <query>', $('The Pig query string to be executed'))
    .option('--queryFile <queryFile>', $('The path to a file that contains the Pig query to be executed; this and the [query] parameter are mutually exclusive'))
    .option('--arguments <arguments>', $('A comma separated string of arguments to be passed to the Pig job. For example: "a1,a2,a3"'))
    .option('--files <files>', $('A comma separated string of file paths required for the Pig job to execute. For example: "f1/f2/f3,f4/f5,f6"'))
    .option('-s, --subscription <id>', $('The subscription id'))
    .execute(self.submitHDInsightPigJobCommand);*/

    job.command('mr_create [clusterDnsName] [userName] [password] [className] [jarFile]')
        .description($('Submits a MapReduce job to an HdInsight cluster'))
        .usage('[options] <clusterDnsName> <userName> <password> <className> <jarFile>')
        .option('--clusterDnsName <clusterDnsName>', $('Fully qualified cluster DNS name. Example: mycluster.azurehdinsight.net'))
        .option('--userName <userName>', $('User name for the cluster'))
        .option('--password <password>', $('Password for the cluster'))
        .option('--className <className>', $('Name of the job class in the job JAR file'))
        .option('--jarFile <jarFile>', $('The fully qualified name of the JAR file that contains the code and dependencies of the MapReduce job'))
        .option('--arguments <arguments>', $('A comma separated string of arguments to be passed to the MapReduce job. For example: "a1,a2,a3"'))
        .option('--defines <defines>', $('A key/value pair of Hadoop configuration values to be set during the MapReduce job execution. For example: "k1=v1,k2=v2"'))
        .option('--files <files>', $('A comma separated string of file paths required for the MapReduce job to execute. For example: "f1/f2/f3,f4/f5,f6"'))
        .option('--libJars <libJars>', $('The Jar library references for the MapReduce job'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(self.submitHDInsightMapReduceJobCommand);

    job.command('mr_streaming_create [clusterDnsName] [userName] [password] [mapper] [reducer]')
        .description($('Submits a Streaming MapReduce job to an HdInsight cluster'))
        .usage('[options] <clusterDnsName> <userName> <password> <mapper> <reducer>')
        .option('--clusterDnsName <clusterDnsName>', $('Fully qualified cluster DNS name. Example: mycluster.azurehdinsight.net'))
        .option('--userName <userName>', $('User name for the cluster'))
        .option('--password <password>', $('Password for the cluster'))
        .option('--arguments <arguments>', $('A comma separated string of arguments to be passed to the Streaming MapReduce job. For example: "a1,a2,a3"'))
        .option('--cmdenv <cmdEnv>', $('Comma separated key/value pairs of environment variables that should be set during the Streaming MapReduce job execution on worker nodes'))
        .option('--mapper <combiner>', $('Mapper executable name for the Streaming MapReduce job'))
        .option('--reducer <reducer>', $('Reducer executable name for the Streaming MapReduce job'))
        .option('--combiner <combiner>', $('Combiner executable name for the Streaming MapReduce job'))
        .option('--defines <defines>', $('A comma separated key/value pair of Hadoop configuration values to be set during the Streaming MapReduce job execution. For example: "k1=v1,k2=v2"'))
        .option('--files <files>', $('A comma separated string of file paths required for the Streaming MapReduce job to execute. For example: "f1/f2/f3,f4/f5,f6"'))
        .option('--inputPath <inputPath>', $('Location of the input files for the Streaming MapReduce job'))
        .option('--outputPath <outputPath>', $('Location of the output files for the Streaming MapReduce job'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(self.submitHDInsightStreamingMapReduceJobCommand);

    job.command('show [clusterDnsName] [userName] [password] [jobId]')
        .description($('Retrieves the details of the specified job from an HDInsight cluster'))
        .usage('[options] <clusterDnsName> <userName> <password> <jobId>')
        .option('--clusterDnsName <clusterDnsName>', $('Fully qualified cluster DNS name. Example: mycluster.azurehdinsight.net'))
        .option('--userName <userName>', $('User name for the cluster'))
        .option('--password <password>', $('Password for the cluster'))
        .option('--jobId <jobId>', $('The Id of the job for which the details need to be retrieved'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(self.getHDInsightJobCommand);

    job.command('list [clusterDnsName] [userName] [password]')
        .description($('Retrieves the list of jobs from the specified HDInsight cluster'))
        .usage('[options] <clusterDnsName> <userName> <password>')
        .option('--clusterDnsName <clusterDnsName>', $('Fully qualified cluster DNS name. Example: mycluster.azurehdinsight.net'))
        .option('--userName <userName>', $('User name for the cluster'))
        .option('--password <password>', $('Password for the cluster'))
        .option('-s, --subscription <id>', $('The subscription id'))
        .execute(self.listHDInsightJobsCommand);
    // END: HDInsight job management commands
};