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

var __ = require('underscore');
var util = require('util');
var utils = require('../../../util/utils');
var network = require('../network');
var VNetUtil = require('./../../../util/vnet.util');
var $ = utils.getLocaleString;

function LocalNetwork(cli, networkManagementClient) {
  this.cli = cli;
  this.networkManagementClient = networkManagementClient;
}

__.extend(LocalNetwork.prototype, {
  create: function (localNetworkName, addressPrefixes, options, _) {
    var networkConfig = network.getNetworkConfig(options, _);
    var lNetList = networkConfig.VirtualNetworkConfiguration.LocalNetworkSites;
    if (!lNetList) {
      networkConfig.VirtualNetworkConfiguration.LocalNetworkSites = [];
    }

    var lNet = utils.findFirstCaseIgnore(lNetList, {Name: localNetworkName});
    if (lNet) {
      throw new Error(util.format($('A local network with name "%s" already exists'), localNetworkName));
    }

    var localNetwork = {Name: localNetworkName, AddressSpace: []};
    var self = this;
    addressPrefixes.split(',').forEach(function (addressPrefix) {
      try {
        self._validateAddressPrefix(addressPrefix);
        localNetwork.AddressSpace.push(addressPrefix);
      } catch (ex) {
        self.cli.output.warn(util.format($('Address prefix "%s" would not be added: %s'), addressPrefix, ex));
      }
    });

    if (localNetwork.AddressSpace.length === 0){
      throw new Error('All provided address prefixes are invalid.');
    }

    if (options.vpnGatewayAddress) {
      var vnetUtil = new VNetUtil();
      var ipValidated = vnetUtil.parseIPv4(options.vpnGatewayAddress, '--vpn-gateway-address');
      if (ipValidated.error) {
        throw new Error(ipValidated.error);
      }
      localNetwork.VPNGatewayAddress = options.vpnGatewayAddress;
    }

    networkConfig.VirtualNetworkConfiguration.LocalNetworkSites.push(localNetwork);
    var progress = this.cli.interaction.progress(util.format($('Creating local network "%s"'), localNetworkName));
    try {
      network.setNetworkConfig(options, networkConfig, _);
    } finally {
      progress.end();
    }

    this.show(localNetworkName, options, _);
  },

  set: function (localNetworkName, options, _) {
    var networkConfig = network.getNetworkConfig(options, _);
    var lNetList = networkConfig.VirtualNetworkConfiguration.LocalNetworkSites;
    if (!lNetList) {
      throw new Error($('No local network found'), localNetworkName);
    }

    var lNet = utils.findFirstCaseIgnore(lNetList, {Name: localNetworkName});
    if (!lNet) {
      throw new Error(util.format($('A local network with name "%s" not found'), localNetworkName));
    }

    var self = this;
    if (options.addressPrefixes) {
      lNet.AddressSpace = [];
      options.addressPrefixes.split(',').forEach(function (addressPrefix) {
        try {
          self._validateAddressPrefix(addressPrefix);
          lNet.AddressSpace.push(addressPrefix);
        } catch (ex) {
          self.cli.output.warn(util.format($('Address prefix "%s" would not be added: %s'), addressPrefix, ex));
        }
      });
      if (lNet.AddressSpace.length === 0){
        throw new Error('All provided address prefixes are invalid.');
      }
    }

    if (options.vpnGatewayAddress) {
      var vnetUtil = new VNetUtil();
      var ipValidated = vnetUtil.parseIPv4(options.vpnGatewayAddress, '--vpn-gateway-address');
      if (ipValidated.error) {
        throw new Error(ipValidated.error);
      }
      lNet.VPNGatewayAddress = options.vpnGatewayAddress;
    }

    var progress = this.cli.interaction.progress(util.format($('Updating local network "%s"'), localNetworkName));
    try {
      network.setNetworkConfig(options, networkConfig, _);
    } finally {
      progress.end();
    }

    this.show(localNetworkName, options, _);
  },

  list: function (options, _) {
    var networkConfig = network.getNetworkConfig(options, _);
    networkConfig = networkConfig.VirtualNetworkConfiguration;
    var output = this.cli.output;

    if (!networkConfig.LocalNetworkSites) networkConfig.LocalNetworkSites = [];
    this.cli.interaction.formatOutput(networkConfig.LocalNetworkSites, function (outputData) {
      if (outputData.length === 0) {
        output.warn($('No local network sites found'));
      } else {
        output.table(outputData, function (row, item) {
          row.cell($('Name'), item.Name);
          row.cell($('Gateway address'), item.VPNGatewayAddress);
          var address = item.AddressSpace[0];
          if (item.AddressSpace.length > 1) address += ', ...';
          row.cell($('Address space'), address);
        });
      }
    });
  },

  show: function (localNetworkName, options, _) {
    var networkConfig = network.getNetworkConfig(options, _);
    networkConfig = networkConfig.VirtualNetworkConfiguration;
    var output = this.cli.output;
    var interaction = this.cli.interaction;

    if (!networkConfig.LocalNetworkSites) networkConfig.LocalNetworkSites = [];
    var localNetwork = utils.findFirstCaseIgnore(networkConfig.LocalNetworkSites, {Name: localNetworkName});
    if (localNetwork) {
      interaction.formatOutput(localNetwork, function (network) {
        output.nameValue($('Name'), network.Name);
        output.nameValue($('Gateway address'), network.VPNGatewayAddress);
        output.header('Address space');
        network.AddressSpace.forEach(function (address) {
          output.listItem(address, 2);
        });
      });
    } else {
      if (output.format().json) {
        output.json({});
      } else {
        output.warn(util.format($('A local network with name "%s" not found'), localNetworkName));
      }
    }
  },

  delete: function (localNetworkName, options, _) {
    var networkConfig = network.getNetworkConfig(options, _);
    if (!networkConfig.VirtualNetworkConfiguration.LocalNetworkSites) {
      throw new Error($('Network configuration does not have any local network sites'));
    }

    var localNetworkIndex = utils.indexOfCaseIgnore(networkConfig.VirtualNetworkConfiguration.LocalNetworkSites, {Name: localNetworkName});
    if (localNetworkIndex === null) {
      throw new Error(util.format($('Local network "%s" does not exist'), localNetworkName));
    }

    networkConfig.VirtualNetworkConfiguration.LocalNetworkSites.splice(localNetworkIndex, 1);

    if (!options.quiet && !this.cli.interaction.confirm(util.format($('Delete local network site "%s"? [y/n] '), localNetworkName), _)) {
      return;
    }

    var progress = this.cli.interaction.progress(util.format($('Deleting local network site "%s"'), localNetworkName));
    try {
      network.setNetworkConfig(options, networkConfig, _);
    } finally {
      progress.end();
    }
  },

  addAssociation: function (virtualNetworkName, localNetworkName, options, _) {
    var networkConfig = network.getNetworkConfig(options, _);

    if (!networkConfig.VirtualNetworkConfiguration.LocalNetworkSites) {
      throw new Error($('Network configuration does not have any local network sites'));
    }

    if (!networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites) {
      throw new Error($('Network configuration does not have any local network sites'));
    }

    var localNetworkIndex = utils.indexOfCaseIgnore(networkConfig.VirtualNetworkConfiguration.LocalNetworkSites, {Name: localNetworkName});
    if (localNetworkIndex === null) {
      throw new Error(util.format($('Local network "%s" does not exist'), localNetworkName));
    }

    var virtualNetworkIndex = utils.indexOfCaseIgnore(networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites, {Name: virtualNetworkName});
    if (virtualNetworkIndex === null) {
      throw new Error(util.format($('Virtual network "%s" does not exist'), virtualNetworkName));
    }

    if (!networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway) {
      networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway = {};
    }

    if (!networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway.ConnectionsToLocalNetwork) {
      networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway.ConnectionsToLocalNetwork = [];
    }

    networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway.ConnectionsToLocalNetwork.push({
      Name: localNetworkName,
      Connection: {Type: 'IPsec'}
    });

    this.cli.output.warn($('A subnet with name "GatewaySubnet" must exist in the virtual network in-order to associate a local network with the virtual network'));

    var progress = this.cli.interaction.progress(util.format($('Associating local network "%s" with a virtual network "%s"'), localNetworkName, virtualNetworkName));
    try {
      network.setNetworkConfig(options, networkConfig, _);
    } finally {
      progress.end();
    }
  },

  removeAssociation: function (virtualNetworkName, localNetworkName, options, _) {
    var networkConfig = network.getNetworkConfig(options, _);

    if (!networkConfig.VirtualNetworkConfiguration.LocalNetworkSites) {
      throw new Error($('Network configuration does not have any local network sites'));
    }

    if (!networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites) {
      throw new Error($('Network configuration does not have any virtual network sites'));
    }

    var localNetworkIndex = utils.findFirstCaseIgnore(networkConfig.VirtualNetworkConfiguration.LocalNetworkSites, {name: localNetworkName});
    if (!localNetworkIndex) {
      throw new Error(util.format($('Local network "%s" does not exist'), localNetworkName));
    }

    var virtualNetworkIndex = utils.findFirstCaseIgnore(networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites, {name: virtualNetworkName});
    if (!virtualNetworkIndex) {
      throw new Error(util.format($('Virtual network "%s" does not exist'), virtualNetworkName));
    }

    if (!networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway) {
      throw new Error(util.format($('Virtual network "%s" does not have any gateways'), virtualNetworkName));
    }

    if (!networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway.ConnectionsToLocalNetwork) {
      throw new Error(util.format($('Virtual network "%s" does not have any local network connections'), virtualNetworkName));
    }

    var connectionIndex = utils.indexOfCaseIgnore(networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway.ConnectionsToLocalNetwork, {name: localNetworkName});
    if (connectionIndex === null) {
      throw new Error(util.format($('Virtual network "%s" does not have connection to local network'), virtualNetworkName));
    }

    networkConfig.VirtualNetworkConfiguration.VirtualNetworkSites[virtualNetworkIndex].Gateway.ConnectionsToLocalNetwork.splice(connectionIndex, 1);
    var progress = this.cli.interaction.progress(util.format($('Removing association between a local network "%s" and a virtual network "%s"'), localNetworkName, virtualNetworkName));
    try {
      network.setNetworkConfig(options, networkConfig, _);
    } finally {
      progress.end();
    }
  },

  _validateAddressPrefix: function (addressPrefix) {
    if (addressPrefix.split('/').length !== 2){
      throw new Error(util.format($('The address space "%s" is invalid.'), addressPrefix));
    }

    var vnetUtil = new VNetUtil();
    var ipValidated = vnetUtil.parseIPv4(addressPrefix.split('/')[0], '--address-prefix');
    if (ipValidated.error) {
      throw new Error(ipValidated.error);
    }

    var cidrValidated = vnetUtil.parseIPv4Cidr(addressPrefix);
    if (cidrValidated.error) {
      throw new Error(cidrValidated.error);
    }
  }
});

module.exports = LocalNetwork;