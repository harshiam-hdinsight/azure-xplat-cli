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

var __ = require('underscore');
var util = require('util');
var profile = require('../../../util/profile');
var utils = require('../../../util/utils');
var HDIConstants = require('./hdiConstants');
var HdiUtils = require('./hdiUtils');

var $ = utils.getLocaleString;

function HdiCustomization(cli, subscription) {
    this.cli = cli;
    this.subscription = subscription;
}

__.extend(HdiCustomization.prototype, {
    getHeadNodeSize: function(clusterCreateParameters) {
        var headNodeSize;
        if (clusterCreateParameters.headNodeSize !== null) {
            headNodeSize = clusterCreateParameters.headNodeSize;
        } else {
            headNodeSize = (utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Hadoop') || utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Spark')) ? 'Standard_D12' : 'Large';
        }
        return headNodeSize;
    },
    getWorkerNodeSize: function(clusterCreateParameters) {
        var workerNodeSize;
        if (clusterCreateParameters.workerNodeSize !== null) {
            workerNodeSize = clusterCreateParameters.workerNodeSize;
        } else {
            workerNodeSize = utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Hadoop') || utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Spark') ? 'Standard_D12' : 'Standard_D3';
        }
        return workerNodeSize;
    },
    getRoleCollection: function(clusterCreateParameters) {
        //OS Profile
        var osProfile = {};
        if (utils.ignoreCaseEquals(clusterCreateParameters.osType, 'Windows')) {
            var rdpSettingsParams = {};
            if (!utils.stringIsNullOrEmpty(clusterCreateParameters.rdpUsername)) {
                rdpSettingsParams = {
                    userName: clusterCreateParameters.rdpUsername,
                    password: clusterCreateParameters.rdpPassword,
                    expiryDate: clusterCreateParameters.rdpAccessExpiry
                };
            }

            osProfile = {
                WindowsOperatingSystemProfile:
                {
                    rdpSettings: rdpSettingsParams
                }
            };
        } else if (utils.ignoreCaseEquals(clusterCreateParameters.OSType, 'Linux')) {
            var sshPublicKeys = [];
            if (!utils.stringIsNullOrEmpty(clusterCreateParameters.sshPublicKey)) {
                var sshPublicKey = {
                    certificateData: clusterCreateParameters.sshPublicKey
                };
                sshPublicKeys.push(sshPublicKey);
            }

            var sshProfile = {};
            if (sshPublicKeys.length > 0) {
                sshProfile =
                {
                    sshPublicKeys: sshPublicKeys
                };
            } else {
                sshProfile = null;
            }

            osProfile = {
                linuxOperatingSystemProfile:
                {
                    userName: clusterCreateParameters.sshUserName,
                    password: clusterCreateParameters.sshPassword,
                    sshProfile: sshProfile
                }
            };
        }

        //VNet Profile
        var vnetProfile = {};
        if (!utils.stringIsNullOrEmpty(clusterCreateParameters.virtualNetworkId)) {
            vnetProfile.id = clusterCreateParameters.virtualNetworkId;
        }
        if (!utils.stringIsNullOrEmpty(clusterCreateParameters.subnetName)) {
            vnetProfile.subnetName = clusterCreateParameters.subnetName;
        }
        if (utils.stringIsNullOrEmpty(vnetProfile.Id) && utils.stringIsNullOrEmpty(vnetProfile.subnetName)) {
            vnetProfile = null;
        }

        var workernodeactions = [];
        var headnodeactions = [];
        var zookeepernodeactions = [];

        //Script Actions
        if (clusterCreateParameters.scriptActions instanceof Array) {
            for (var i = 0; i < clusterCreateParameters.scriptActions.length; i++) {
                var scriptAction = clusterCreateParameters.scriptActions[i];
                if (utils.ignoreCaseEquals(scriptAction.key, 'workernode')) {
                    workernodeactions = scriptAction.value;
                } else if (utils.ignoreCaseEquals(scriptAction.key, 'headnode')) {
                    headnodeactions = scriptAction.value;
                } else if (utils.ignoreCaseEquals(scriptAction.key, 'zookeepernode')) {
                    zookeepernodeactions = scriptAction.value;
                }
            }
        }

        //Roles
        var roles = [];
        var headNodeSize = this.getHeadNodeSize(clusterCreateParameters);
        var headNode =
        {
            name: 'headnode',
            targetInstanceCount: 2,
            hardwareProfile: {
                vmSize: headNodeSize
            },
            osProfile: osProfile,
            virtualNetworkProfile: vnetProfile,
            scriptActions: headnodeactions
        };
        roles.push(headNode);

        var workerNodeSize = this.getWorkerNodeSize(clusterCreateParameters);
        var workerNode = {
            name: 'workernode',
            targetInstanceCount: clusterCreateParameters.clusterSizeInNodes,
            hardwareProfile: {
                vmSize: workerNodeSize
            },
            osProfile: osProfile,
            scriptActions: workernodeactions
        };
        roles.push(workerNode);

        if (utils.ignoreCaseEquals(clusterCreateParameters.osType, 'Windows')) {
            if (utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Hadoop') ||
                utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Spark')) {
                return roles;
            }
        }

        if (utils.ignoreCaseEquals(clusterCreateParameters.osType, 'Linux')) {
            if (utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Hadoop') ||
                utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Spark')) {
                clusterCreateParameters.zookeeperNodeSize = 'Small';
            }
        }

        var zookeeperNodeSize;
        if (utils.stringIsNullOrEmpty(clusterCreateParameters.zookeeperNodeSize)) {
            zookeeperNodeSize = 'Medium';
        } else {
            zookeeperNodeSize = clusterCreateParameters.zookeeperNodeSize;
        }

        var zookeepernode = {
            name: 'zookeepernode',
            scriptActions: zookeepernodeactions,
            targetInstanceCount: 3,
            osProfile: osProfile,
            hardwareProfile: {
                vmSize: zookeeperNodeSize
            }
        };

        roles.push(zookeepernode);
        return roles;
    },
    getMetastoreConfigIaas: function(metastore, metastoreType) {
        var connectionUrl =
            util.format($('jdbc:sqlserver://%s.database.windows.net;database=%s;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300;sendStringParametersAsUnicode=true;prepareSQL=0'),
                metastore.Server, metastore.Database);
        var configurations = [];
        if (utils.ignoreCaseEquals(metastoreType, HDIConstants.ConfigurationKey.HiveSite)) {
            var hiveSiteKey = HDIConstants.ConfigurationKey.HiveSite;
            var hiveConfigValue = [
                { 'javax.jdo.option.ConnectionURL': connectionUrl },
                { 'javax.jdo.option.ConnectionUserName': metastore.user },
                { 'javax.jdo.option.ConnectionPassword': metastore.Password },
                { 'javax.jdo.option.ConnectionDriverName': 'com.microsoft.sqlserver.jdbc.SQLServerDriver' }
            ];
            HdiUtils.pushToConfig(hiveSiteKey, hiveConfigValue, configurations);

            var hiveEnvKey = HDIConstants.ConfigurationKey.HiveEnv;
            var hiveEnvValue = [
                { 'hive_database': 'Existing MSSQL Server database with SQL authentication' },
                { 'hive_database_name': metastore.database },
                { 'hive_database_type': 'mssql' },
                { 'hive_existing_mssql_server_database': metastore.database },
                { 'hive_existing_mssql_server_host': util.format($('%s.database.windows.net)'), metastore.Server) },
                { 'hive_hostname': util.format($('%s.database.windows.net)'), metastore.server) }
            ];
            HdiUtils.pushToConfig(hiveEnvKey, hiveEnvValue, configurations);

            return configurations;
        } else {
            var oozieSiteKey = HDIConstants.ConfigurationKey.OozieSite;
            var oozieSiteValue = [
                { 'oozie.service.JPAService.jdbc.url': connectionUrl },
                { 'oozie.service.JPAService.jdbc.username': metastore.user },
                { 'oozie.service.JPAService.jdbc.password': metastore.password },
                { 'oozie.service.JPAService.jdbc.driver': 'com.microsoft.sqlserver.jdbc.SQLServerDriver' },
                { 'oozie.db.schema.name': 'oozie' }
            ];
            HdiUtils.pushToConfig(oozieSiteKey, oozieSiteValue, configurations);

            var oozieEnvKey = HDIConstants.ConfigurationKey.OozieEnv;
            var oozieEnvValue = [
                { 'oozie_database': 'Existing MSSQL Server database with SQL authentication' },
                { 'oozie_database_type': 'mssql' },
                { 'oozie_existing_mssql_server_database': metastore.Database },
                { 'oozie_existing_mssql_server_host': util.format($('%s.database.windows.net)', metastore.Server)) },
                { 'oozie_hostname': util.format($('%s.database.windows.net)', metastore.Server)) }
            ];
            HdiUtils.pushToConfig(oozieEnvKey, oozieEnvValue, configurations);
            return configurations;
        }
    },

    getMetastoreConfigPaas: function(metastore, metastoreType) {
        var connectionUrl =
            util.format($('jdbc:sqlserver://%s.database.windows.net;database=%s;encrypt=true;trustServerCertificate=trsee;create=false;loginTimeout=300'),
                metastore.Server, metastore.Database);
        var username = util.format($('%s@%s'), metastore.user, metastore.server);
        var config = [
            { 'javax.jdo.option.ConnectionURL': connectionUrl },
            { 'javax.jdo.option.ConnectionUserName': username },
            { 'javax.jdo.option.ConnectionPassword': metastore.password }
        ];

        var configKey = '';
        if (utils.ignoreCaseEquals(metastoreType, 'hive')) {
            configKey = HDIConstants.ConfigurationKey.HiveSite;
        } else if (utils.ignoreCaseEquals(metastoreType, 'oozie')) {
            configKey = HDIConstants.ConfigurationKey.OozieSite;
        }
        var configs = {};
        configs[configKey] = config;
        return configs;
    },

    getMetastoreConfig: function(metastore, osType, metastoreType) {
        if (utils.ignoreCaseEquals(osType, 'Windows')) {
            return this.getMetastoreConfigPaas(metastore, metastoreType);
        } else {
            return this.getMetastoreConfigIaas(metastore, metastoreType);
        }
    },

    getConfigurations: function(clusterName, clusterCreateParameters) {
        var configurations = clusterCreateParameters.configurations;
        if (configurations === undefined || configurations === null) {
            configurations = {};
        }

        //Core Config
        var coreConfig = HdiUtils.getValue(configurations, HDIConstants.ConfigurationKey.CoreSite);

        if (HdiUtils.getValue(coreConfig, 'fs.defaultFS') === null) {
            var storageAccountNameKey = 'fs.defaultFS';
            if (clusterCreateParameters.version !== null && clusterCreateParameters.version === '2.1') {
                storageAccountNameKey = 'fs.default.name';
            }

            var container = utils.stringIsNullOrEmpty(clusterCreateParameters.defaultStorageContainer) ? clusterCreateParameters.defaultStorageContainer : clusterName;
            coreConfig[storageAccountNameKey] = util.format($('wasb://%s@%s'), container, clusterCreateParameters.defaultStorageAccountName);
        }

        var defaultStorageConfigKey = util.format($('fs.azure.account.key.%s'), clusterCreateParameters.defaultStorageAccountName);
        if (HdiUtils.getValue(coreConfig, defaultStorageConfigKey) === null) {
            coreConfig[defaultStorageConfigKey] = clusterCreateParameters.defaultStorageAccountKey;
        }
        if (clusterCreateParameters.additionalStorageAccounts instanceof Array) {
            for (var i = 0; i < clusterCreateParameters.additionalStorageAccounts.length; i++) {
                var storageAccount = clusterCreateParameters.additionalStorageAccounts[i];
                var configKey = util.format($('fs.azure.account.key.%s'), storageAccount.key);
                if (HdiUtils.getValue(coreConfig, configKey) === null) {
                    coreConfig[configKey] = storageAccount.value;
                }
            }
        }

        configurations[HDIConstants.ConfigurationKey.CoreSite] = coreConfig;
        
        //Gateway Config

        var gatewayConfig = HdiUtils.getValue(configurations, HDIConstants.ConfigurationKey.Gateway);

        if (gatewayConfig !== null) {
            return configurations;
        }
        gatewayConfig = {};

        if (!utils.stringIsNullOrEmpty(clusterCreateParameters.userName)) {
            gatewayConfig['restAuthCredential.isEnabled'] = 'true';
            gatewayConfig['restAuthCredential.username'] = clusterCreateParameters.userName;
            gatewayConfig['restAuthCredential.password'] = clusterCreateParameters.password;
        } else {
            gatewayConfig['restAuthCredential.isEnabled'] = 'false' ;
        }

        configurations[HDIConstants.ConfigurationKey.Gateway] = gatewayConfig;
        
        return configurations;
    },

    getExtendedClusterCreateParameters: function(clusterName, clusterCreateParameters) {
        var createParamsExtended = {
            location: clusterCreateParameters.location,
            properties: {
                clusterDefinition: {
                    clusterType: clusterCreateParameters.clusterType
                },
                clusterVersion: clusterCreateParameters.version,
                operatingSystemType: clusterCreateParameters.osType
            }
        };

        var configurations = this.getConfigurations(clusterName, clusterCreateParameters);
        
        if (clusterCreateParameters.hiveMetastore !== null) {
            var hiveMetastoreConfig = this.getMetastoreConfig(clusterCreateParameters.hiveMetastore, clusterCreateParameters.osType, 'Hive');
            if (hiveMetastoreConfig instanceof Array) {
                for (var i = 0; i < hiveMetastoreConfig.length; i++) {
                    var hiveConfigSet = hiveMetastoreConfig[i];
                    if (HdiUtils.getValue(configurations, hiveConfigSet.key) !== null) {
                        for (var j = 0; j < hiveConfigSet.value.length; j++) {
                            var configs = {};
                            configs[config.key] = config.value;
                            configurations[hiveConfigSet.value[j].key] = configs;
                        }
                    } else {
                        configurations[hiveConfigSet.key] = hiveConfigSet.value;
                    }
                }
            }
        }
        if (clusterCreateParameters.oozieMetastore !== null) {
            var oozieMetastoreConfig = this.getMetastoreConfig(clusterCreateParameters.hiveMetastore, clusterCreateParameters.osType, 'Oozie');
            if (oozieMetastoreConfig instanceof Array) {
                for (var k = 0; k < oozieMetastoreConfig.length; k++) {
                    var oozieConfigSet = oozieMetastoreConfig[k];
                    if (HdiUtils.getValue(configurations, oozieConfigSet.key) !== null) {
                        for (var m = 0; m < oozieConfigSet.value.length; m++) {
                            var configs2 = {};
                            configs2[config.key] = config.value;
                            configurations[oozieConfigSet.value[m].key] = configs2;
                        }
                    } else {
                        configurations[oozieConfigSet.key] = oozieConfigSet.value;
                    }
                }
            }
        }

        var serializedConfiguration = JSON.stringify(configurations);
        createParamsExtended.properties.clusterDefinition.configurations = serializedConfiguration;

        createParamsExtended.properties.computeProfile = [];
        createParamsExtended.properties.computeProfile.roles = this.getRoleCollection(clusterCreateParameters);
        
        return createParamsExtended;
    },

    createCluster: function(resourceGroupName, clusterName, clusterCreateParameters, _) {
        try {
            var clusterCreateParametersExtended = this.getExtendedClusterCreateParameters(clusterName, clusterCreateParameters);
            var subscription = profile.current.getSubscription(this.subscription);
            var client = utils.createHDInsightManagementClient(subscription);
            return client.clusters.create(resourceGroupName, clusterName, clusterCreateParametersExtended, _);

        } catch (e) {
            console.log('Error submitting create command: ' + e);
            throw new Error(e);
        }
    }
});

module.exports = HdiCustomization;