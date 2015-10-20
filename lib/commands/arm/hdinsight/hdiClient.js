HdiClient/**
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
var HdiCustomization = require('./hdiCustomization');

var $ = utils.getLocaleString;
var writable = stream.Writable || readableStream.Writable;

function WriteStream(options) {
    writable.call(this, options);
}

function HdiClient(cli, subscription) {
    this.cli = cli;
    this.subscription = subscription;
}

__.extend(HdiClient.prototype, {
    createCluster: function(resourceGroupName, clusterName, clusterCreateParameters, _) {
        var customization = new HdiCustomization(this.cli);
        var result = customization.createCluster(resourceGroupName, clusterName, clusterCreateParameters, _);
        return result;
    }
});

module.exports = HdiClient;