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

var fs = require('fs');
var readableStream = require('readable-stream');
var stream = require('stream');
var __ = require('underscore');
var url = require('url');
var util = require('util');
var profile = require('../../../util/profile');
var utils = require('../../../util/utils');
var HDIConstants = require('./hdiConstants');
var HdiUtils = require('./hdiUtils');

var $ = utils.getLocaleString;
var writable = stream.Writable || readableStream.Writable;

function WriteStream(options) {
    writable.call(this, options);
}

function HdiCustomization(cli, subscription) {
    this.cli = cli;
    this.subscription = subscription;
}

__.extend(HdiCustomization.prototype, {
    getHeadNodeSize: function(clusterCreateParameters) {
        var headNodeSize;
        if (clusterCreateParameters.headNodeSize != null) {
            headNodeSize = clusterCreateParameters.headNodeSize;
        } else {
            headNodeSize = (utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Hadoop') ||
                    utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Spark'))
                ? 'Standard_D12'
                : 'Large';
        }
        return headNodeSize;
    },
    getWorkerNodeSize: function(clusterCreateParameters) {
        var workerNodeSize;
        if (clusterCreateParameters.workerNodeSize != null) {
            workerNodeSize = clusterCreateParameters.workerNodeSize;
        } else {
            workerNodeSize = utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Hadoop') ||
                utils.ignoreCaseEquals(clusterCreateParameters.clusterType, 'Spark')
                ? 'Standard_D12'
                : 'Standard_D3';
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
            };

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
        var vnetProfile = {
            id : "",
            subnetName: ""
        };
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
            hardwareProfile:
            {
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
            configurations.push({
                key: HDIConstants.ConfigurationKey.HiveSite,
                value: [
                    { key: "javax.jdo.option.ConnectionURL", value: connectionUrl },
                    { key: "javax.jdo.option.ConnectionUserName", value: metastore.user },
                    { key: "javax.jdo.option.ConnectionPassword", value: metastore.Password },
                    { key: "javax.jdo.option.ConnectionDriverName", value: "com.microsoft.sqlserver.jdbc.SQLServerDriver" }
                ]
            });

            configurations.push({
                key:
                    HDIConstants.ConfigurationKey.HiveEnv,
                value:
                [
                    { key: "hive_database", value: "Existing MSSQL Server database with SQL authentication" },
                    { key: "hive_database_name", value: metastore.database },
                    { key: "hive_database_type", value: "mssql" },
                    { key: "hive_existing_mssql_server_database", value: metastore.database },
                    { key: "hive_existing_mssql_server_host", value: util.format($('%s.database.windows.net)'), metastore.Server) },
                    { key: "hive_hostname", value: util.format($('%s.database.windows.net)'), metastore.server) }
                ]
            });
            return configurations;
        } else {
            configurations.push({
                key: HDIConstants.ConfigurationKey.OozieSite,
                value: [
                    { key: "oozie.service.JPAService.jdbc.url", value: connectionUrl },
                    { key: "oozie.service.JPAService.jdbc.username", value: metastore.user },
                    { key: "oozie.service.JPAService.jdbc.password", value: metastore.password },
                    { key: "oozie.service.JPAService.jdbc.driver", value: "com.microsoft.sqlserver.jdbc.SQLServerDriver" },
                    { key: "oozie.db.schema.name", value: "oozie" }
                ]
            });

            configurations.push({
                key: HDIConstants.ConfigurationKey.OozieEnv,
                value: [
                    { key: "oozie_database", value: "Existing MSSQL Server database with SQL authentication" },
                    { key: "oozie_database_type", value: "mssql" },
                    { key: "oozie_existing_mssql_server_database", value: metastore.Database },
                    { key: "oozie_existing_mssql_server_host", value: util.format($('%s.database.windows.net)', metastore.Server)) },
                    { key: "oozie_hostname", value: util.format($('%s.database.windows.net)', metastore.Server)) }
                ]
            });
            return configurations;
        }
    },

    getMetastoreConfigPaas: function(metastore, metastoreType) {
        var connectionUrl =
            util.format($('jdbc:sqlserver://%s.database.windows.net;database=%s;encrypt=true;trustServerCertificate=trsee;create=false;loginTimeout=300'),
                metastore.Server, metastore.Database);
        var username = util.format($('%s@%s'), metastore.user, metastore.server);
        var config = [
            { key: "javax.jdo.option.ConnectionURL", value: connectionUrl },
            { key: "javax.jdo.option.ConnectionUserName", value: username },
            { key: "javax.jdo.option.ConnectionPassword", value: metastore.password }
        ];

        var configKey = "";
        if (utils.ignoreCaseEquals(metastoreType, 'hive')) {
            configKey = HDIConstants.ConfigurationKey.HiveSite;
        } else if (utils.ignoreCaseEquals(metastoreType, 'oozie')) {
            configKey = HDIConstants.ConfigurationKey.OozieSite;
        }

        var configs = [{ key: configKey, value: config }];
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

        //Core Config
        var coreConfigExists = true;
        var coreConfig = HdiUtils.getValue(configurations, HDIConstants.ConfigurationKey.CoreSite);

        if (coreConfig == null) {
            coreConfigExists = false;
            coreConfig = [];
        }

        if (HdiUtils.getValue(coreConfig, "fs.defaultFS") == null) {
            var storageAccountNameKey = "fs.defaultFS";
            if (clusterCreateParameters.version != null && clusterCreateParameters.version, '2.1') {
                storageAccountNameKey = "fs.default.name";
            }

            var container = utils.stringIsNullOrEmpty(clusterCreateParameters.defaultStorageContainer)
                ? clusterCreateParameters.defaultStorageContainer
                : clusterName;
            coreConfig.push({
                key: storageAccountNameKey,
                value: util.format($('wasb://%s@%s'), container, clusterCreateParameters.defaultStorageAccountName)
            });
        }

        var defaultStorageConfigKey = util.format($('fs.azure.account.key.%s'), clusterCreateParameters.defaultStorageAccountName);
        if (HdiUtils.getValue(coreConfig, defaultStorageConfigKey) == null) {
            coreConfig.push({ key: defaultStorageConfigKey, value: clusterCreateParameters.defaultStorageAccountKey });
        }
        if (clusterCreateParameters.additionalStorageAccounts instanceof Array) {
            for (var i = 0; i < clusterCreateParameters.additionalStorageAccounts.length; i++) {
                var storageAccount = clusterCreateParameters.additionalStorageAccounts[i];
                var configKey = util.format($('fs.azure.account.key.%s'), storageAccount.key);
                if (HdiUtils.getValue(coreConfig, configKey) == null) {
                    coreConfig.push({ key: configKey, value: storageAccount.value });
                }
            }
        }
        if (!coreConfigExists) {
            configurations.push({ key: HDIConstants.ConfigurationKey.CoreSite, value: coreConfig });
        } else {
            configurations.push({ key: HDIConstants.ConfigurationKey.CoreSite, value: coreConfig });
        }

        //Gateway Config

        var gatewayConfig = HdiUtils.getValue(configurations, HDIConstants.ConfigurationKey.Gateway);

        if (gatewayConfig != null) {
            return configurations;
        }
        gatewayConfig = [];

        if (!utils.stringIsNullOrEmpty(clusterCreateParameters.userName)) {
            gatewayConfig.push({ key: "restAuthCredential.isEnabled", value: "true" });
            gatewayConfig.push({ key: "restAuthCredential.username", value: clusterCreateParameters.userName });
            gatewayConfig.push({ key: "restAuthCredential.password", value: clusterCreateParameters.password });
        } else {
            gatewayConfig.push({ key: "restAuthCredential.isEnabled", value: "false" });
        }

        configurations.push({ key: HDIConstants.ConfigurationKey.Gateway, value: gatewayConfig });

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
        }

        var configurations = this.getConfigurations(clusterName, clusterCreateParameters);

        if (clusterCreateParameters.hiveMetastore != null) {
            var hiveMetastoreConfig = this.getMetastoreConfig(clusterCreateParameters.hiveMetastore, clusterCreateParameters.osType, 'Hive');
            if (hiveMetastoreConfig instanceof Array) {
                for (var i = 0; i < hiveMetastoreConfig.length; i++) {
                    var hiveConfigSet = hiveMetastoreConfig[i];
                    if (HdiUtils.getValue(configurations, hiveConfigSet.key) != null) {
                        for (var j = 0; j < hiveConfigSet.value.length; j++) {
                            configurations.push({ key: hiveConfigSet.value[i].key, value: [{ key: config.key, value: config.value }] });
                        }
                    } else {
                        configurations.push({
                                key: hiveConfigSet.key,
                                value: hiveConfigSet.value
                            }
                        );
                    }
                }
            }
        }
        if (clusterCreateParameters.oozieMetastore != null) {
            var oozieMetastoreConfig = this.getMetastoreConfig(clusterCreateParameters.hiveMetastore, clusterCreateParameters.osType, 'Oozie');
            if (oozieMetastoreConfig instanceof Array) {
                for (var i = 0; i < oozieMetastoreConfig.length; i++) {
                    var oozieConfigSet = oozieMetastoreConfig[i];
                    if (HdiUtils.getValue(configurations, oozieConfigSet.key) != null) {
                        for (var j = 0; j < oozieConfigSet.value.length; j++) {
                            configurations.push({ key: oozieConfigSet.value[i].key, value: [{ key: config.key, value: config.value }] });
                        }
                    } else {
                        configurations.push({
                                key: oozieConfigSet.key,
                                value: oozieConfigSet.value
                            }
                        );
                    }
                }
            }
        }

        var serializedConfig = JSON.stringify(configurations);
        createParamsExtended.properties.clusterDefinition.configurations = serializedConfig;

        createParamsExtended.properties.clusterDefinition.computeProfile = [];
        //createParamsExtended.properties.clusterDefinition.computeProfile.roles = [];
        createParamsExtended.properties.clusterDefinition.computeProfile.roles = this.getRoleCollection(clusterCreateParameters);
        //if (roles instanceof Array) {
        //    for (var i = 0; i < roles.length; i++) {
        //        createParamsExtended.properties.computeProfile.roles.push(roles[i]);
        //    }
        //}
        return createParamsExtended;
    },

    createCluster: function(resourceGroupName, clusterName, clusterCreateParameters, _) {
        try {
            var clusterCreateParametersExtended = this.getExtendedClusterCreateParameters(clusterName, clusterCreateParameters);
            var subscription = profile.current.getSubscription(this.subscription);
            var client = utils.createHDInsightManagementClient(subscription);
            return client.clusters.create(resourceGroupName, clusterName, clusterCreateParametersExtended, _);

        } catch (e) {
            console.log("Error submitting create command: " + e);
            throw new Error(e);
        }
    }
});

module.exports = HdiCustomization;