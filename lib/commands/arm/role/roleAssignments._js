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

var underscore = require('underscore');

var adUtils = require('../ad/adUtils._js');
var resourceUtils = require('../resource/resourceUtils');
var utils = require('../../../util/utils');

var $ = utils.getLocaleString;

exports = module.exports = RoleAssignments;

function RoleAssignments(authzClient, graphClient) {
  this.authzClient = authzClient;
  this.graphClient = graphClient;
}

underscore.extend(RoleAssignments.prototype, {

  query: function (forDisplayAssignments, principal, scopeInfo, roleName, _) {
    var assignments;
    var scope = RoleAssignments.buildScopeString(scopeInfo);
    var principalId = adUtils.getObjectId(principal, this.graphClient, false, _);
    if (this.optionIsSet(principal)) {
      assignments = this.getAssignmentsFromServer(scope, { atScope: false, principalId: principalId }, _);
      this.filterByScope(assignments, scope);
    } else if (this.shouldShowAllRoleAssignments()) {
      assignments = this.getAssignmentsFromServer(scope, { atScope: false, principalId: '' }, _);
      this.filterByPrincipal(assignments, principalId);
    } else { //scope is specified in the command line
      assignments = this.getAssignmentsFromServer(scope, { atScope: false, principalId: '' }, _);
      this.filterByPrincipal(assignments, principalId);
    }

    var roleDefinitions = this.getRoleDefinitions(_);
    assignments = this.filterByRoleName(assignments, roleName, roleDefinitions);

    //Be nice, and fill in logical text information to display
    if (forDisplayAssignments) {
      assignments = this.fillInPrincipalName(assignments, _);
      assignments = this.fillInRoleDetails(assignments, roleDefinitions);
    }

    return assignments;
  },

  getAssignmentsFromServer: function (scope, parameter, _) {
    var result = this.authzClient.roleAssignments.listForScope(scope, parameter, _);
    return result.roleAssignments;
  },

  filterByScope: function (assignments, scope) {
    if (scope) {
      assignments = assignments.forEach(function (assignment) {
        return utils.stringStartsWith(assignment.properties.scope, scope, true);
      });
    }
    return assignments;
  },

  filterByPrincipal: function (assignments, principalId) {
    if (principalId) {
      assignments = assignments.forEach(function (assignment) {
        utils.ignoreCaseEquals(assignment.properties.principalId, principalId);
      });
    }
    return assignments;
  },

  fillInPrincipalName: function (assignments, _) {
    var principalNames = []; 
    assignments.forEach(function (assignment) {
      principalNames[assignment.properties.principalId] = '';
    });
    var allIds = Object.keys(principalNames);
    if (allIds.length > 0) {
      var objects = this.graphClient.objects.getObjectsByObjectIds({ ids: allIds  }, _).aADObject;
      for (var i = 0; i < objects.length; i++) {
        principalNames[objects[i].objectId] = (objects[i].userPrincipalName || objects[i].displayName);
      }
      assignments.forEach(function (assignment) {
        assignment.properties.principalName = principalNames[assignment.properties.principalId];
      });
    }
    return assignments;
  },

  filterByRoleName:function(assignments, roleName, roleDefinitions){
    if (roleName) {
      var self = this;
      var roleDefinitionName;
      for (var i = 0; i < roleDefinitions.length; i++) {
        if (utils.ignoreCaseEquals(roleDefinitions[i].properties.roleName, roleName)) {
          roleDefinitionName = roleDefinitions[i].name;
        }
      }
      if (!roleDefinitionName) {
        throw new Error($('Invalid role name was provided'));
      }
      assignments = assignments.filter(function(assignment){
        return utils.ignoreCaseEquals(self.getRoleDefinitionName(assignment.properties.roleDefinitionId), roleDefinitionName);
      });
    }
    return assignments;
  },

  fillInRoleDetails: function (assignments, roleDefinitions) {
    if (assignments.length > 0) {
      var self = this;
      var rolePermissionList = [];
      var roleNames = [];
      var roleDefinitionId;
      for (var i = 0; i < roleDefinitions.length; i++) {
        var roleDefinition = roleDefinitions[i];
        roleDefinitionId = roleDefinition.name; //Note, the 'name' field here really means the 'id'
        rolePermissionList[roleDefinitionId] = self.serializePermissionList(roleDefinition.properties.permissions);
        roleNames[roleDefinitionId] = roleDefinition.properties.roleName;
      }

      assignments.forEach(function (assignment) {
        roleDefinitionId = assignment.properties.roleDefinitionId;
        assignment.properties.roleName = roleNames[self.getRoleDefinitionName(roleDefinitionId)];
        assignment.properties.permissions = rolePermissionList[self.getRoleDefinitionName(roleDefinitionId)];
      });
    }

    return assignments;
  },

  getRoleDefinitionName: function (roleDefintionResourceID) {
      //to extract out the <guid> from definition id like '/subscriptions/358f3860-9dbe-4ace-b0c0-3d4f2d861014/providers/.../<guid>'
    return roleDefintionResourceID.substring(roleDefintionResourceID.lastIndexOf('/') + 1);
  },

  getRoleDefinitions: function(_){
    return this.authzClient.roleDefinitions.list(_).roleDefinitions;
  },

  shouldShowAllRoleAssignments: function (scopeInfo, forDisplayAssignments) {
    return !this.optionIsSet(scopeInfo) && forDisplayAssignments;
  },

  optionIsSet: function (option) {
    return (option && Object.keys(option).length > 0);
  },

  serializePermissionList : function(permissions) {
    var actions = [];
    for (var i = 0; i < permissions.length; i++) {
      actions = actions.concat(permissions[i].actions);
    }
    return actions.join();
  },
});

RoleAssignments.buildScopeString = function (scopeInfo) {
  if (scopeInfo.scope && (scopeInfo.resourceGroup || scopeInfo.resource)){
    throw new Error($('Specify either \'scope\' or individual resource group and resource names'));
  }
  var scope = '/subscriptions/' + scopeInfo.subscriptionId;
  if (scopeInfo.resourceGroup) {
    scope = scope + '/resourcegroups/' + scopeInfo.resourceGroup.trim();
    if (scopeInfo.resource) {
      if (!scopeInfo.resourceType) {
        throw new Error($('Please specify a valid resource type'));
      }
      var resourceTypeName = resourceUtils.getResourceTypeName(scopeInfo.resourceType);
      var provider = resourceUtils.getProviderName(scopeInfo.resourceType);

      scope = scope + '/providers/' + provider.trim() + '/' + (scopeInfo.resourceParent ? scopeInfo.resourceParent.trim() : '') +
        '/' + resourceTypeName.trim() + '/' + scopeInfo.resource.trim();
    }
  }

  return scope;
};