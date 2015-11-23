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


var fs = require('fs');
var __ = require('underscore');
var util = require('util');
var utilsCore = require('../../../util/utilsCore');
var profile = require('../../../util/profile');
var utils = require('../../../util/utils');
var HDIConstants = require('./hdiConstants');
var HdiUtils = require('./hdiUtils');

var $ = utils.getLocaleString;

var components = Object.keys(HDIConstants.ConfigurationKey);

var extractComponentConfigs = function(options, componentName, existingParameters) {
        var componentConfig = existingParameters;
                
        Object.keys(options).forEach( function(optionName) {
            if(utils.ignoreCaseEquals(optionName, componentName)){
                if (componentConfig === null || componentConfig === undefined) {
                    componentConfig = {};
                }
                options[optionName].split(';').forEach(function(configValue) {
                    var cv = configValue.split('=');
                    if (cv.length === 2) {
                        componentConfig[cv[0]] = cv[1];
                    } else {
                        componentConfig[cv[0]] = '';
                    }
                });
            }
        });

        return componentConfig;
    };
    
function HdiConfigClient(cli) {
    this.cli = cli;
}

__.extend(HdiConfigClient.prototype, {
    writeConfig: function(filePath, config, _) {
        var data = JSON.stringify(config);
        fs.writeFileSync(filePath, data);
    },

    readConfig: function(filePath, _) {
        var data = fs.readFileSync(filePath);
        return JSON.parse(data);
    },
	
    createConfigFile: function(configFilePath, options, _) {

        if (configFilePath) {

            var config = {
                configurations: {},
                scriptActions: {}
            };

            this.writeConfig(configFilePath, config, _);
        }
    },

    addConfigValue: function(configFilePath, options, _) {
        var content = this.readConfig(configFilePath, _);

        var config = content['configurations'];

        components.forEach(function(componentName) {
            var name = HDIConstants.ConfigurationKey[componentName];
            config[name] = extractComponentConfigs(options, componentName, config[name]);
        });

        content['configurations'] = config;
        this.writeConfig(configFilePath, content, _);
    },

    addScriptAction: function(configFilePath, options, _) {
        var content = this.readConfig(configFilePath, _);

        var scriptActions = content['scriptActions'];
        var nodeType = options.nodeType.toLowerCase();

        if (!utils.ignoreCaseEquals('headnode', nodeType)
            && !utils.ignoreCaseEquals('workernode', nodeType)
            && !utils.ignoreCaseEquals('zookeepernode', nodeType)) {
            throw new Error($('Script action not supported on specified node type'));
        }

        var newAction = {
            uri: options.uri,
            name: options.name,
            parameters: options.parameters
        };

        if (scriptActions[nodeType] === null || scriptActions[nodeType] === undefined) {
            scriptActions[nodeType] = [];
        }
        scriptActions[nodeType].push(newAction);
        content['scriptActions'] = scriptActions;
        this.writeConfig(configFilePath, content, _);
    }
});

module.exports = HdiConfigClient;