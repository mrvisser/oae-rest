/*
 * Copyright 2012 Sakai Foundation (SF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var RestUtil = require('./util');

/**
 * Creates a group through the REST API.
 * Optional arguments will only be added if they are defined and will be sent as is.
 * @param {RestContext}            restCtx             Standard REST Context object that contains the current tenant URL and the current
 *                                                     user credentials
 * @param {String}                 alias               The alias for this group
 * @param {String}                 name                The name for this group
 * @param {String}                 description         The description for this group (Optional)
 * @param {String}                 visibility          The visibility for this group (Optional)
 * @param {String}                 joinable            Whether or not this group is joinable (Optional)
 * @param {Array<String>}          managers            An array of userIds that should be made managers (Optional)
 * @param {Array<String>}          members             An array of userIds that should be made members (Optional)
 * @param {Function(err, resp)}    callback            A callback method
 * @param {Object}                 callback.err        Error object containing error code and error message
 * @param {Object}                 callback.response   The parsed server response.
 */
var createGroup = module.exports.createGroup = function (restCtx, alias, name, description, visibility, joinable, managers, members, callback) {
    var postData = {
        'alias': alias
    }
    if (name) {
        postData.name = name;
    }
    if (description) {
        postData.description = description;
    }
    if (visibility) {
        postData.visibility = visibility;
    }
    if (joinable) {
        postData.joinable = joinable;
    }
    if (managers) {
        postData.managers = managers;
    }
    if (members) {
        postData.members = members;
    }
    RestUtil.RestRequest(restCtx, '/api/group/create', 'POST', postData, callback);
};


/*    RestUtil.switchUser(context, function(err, response, body) {
        request.post({
            'url': 'http://' + context.baseUrl + ,
            'method': 'POST',
            'form': postData
        }, function(err, response, body) {
            if (err) {
                return callback(new RestUtil.OaeError('Something went wrong trying to contact the server: ' + err, response));
            } else if (response.statusCode !== 201) {
                return callback(new RestUtil.RestError('Could not create group: ' + body, response));
            }
            RestUtil.parseResponse(body, response, callback);
        });
    }); */
   
/**
 * Get a group trough the REST API.
 *
 * @param {Context}                 context             A context object with a valid Tenant and User object
 * @param {String}                  groupId             The id of the group you wish to retrieve.
 * @param {Function(err, resp)}     callback            A callback method
 * @param {Object}                  callback.err        Error object containing error message
 * @param {Object}                  callback.response   The parsed server response.
 *
var getGroup = module.exports.getGroup = function(context, groupId, callback) {
     RestUtil.switchUser(context, function(err, response, body) {
        request.get('http://' + context.baseUrl + '/api/group/' + groupId, function(err, response, body) {
            if (err) {
                return callback(new RestUtil.OaeError('Something went wrong trying to contact the server: ' + err, response));
            } else if (response.statusCode !== 200) {
                return callback(new RestUtil.RestError('Could not get the group: ' + body, response));
            }
            RestUtil.parseResponse(body, response, callback);
        });
    });
};

/**
 * Updates a group through the REST API.
 * Optional arguments will only be added if they are defined and will be sent as is.
 *
 * @param {Context}                 context             A context object with a valid Tenant and User object
 * @param {String}                  groupId             The id of the group you wish to update
 * @param {Object}                  profileFields       Object where the keys represent the profile fields that need to be updated and the
 *                                                      values represent the new values for those profile fields/
 *                                                      e.g. {'name': 'New group name', 'description': 'New group description', 'visibility': 'private', 'joinable': 'no'}
 * @param {Function(err, resp)}     callback            A callback method
 * @param {Object}                  callback.err        Error object containing error message
 * @param {Object}                  callback.response   The parsed server response.
 *
var updateGroup = module.exports.updateGroup = function (context, groupId, profileFields, callback) {
    RestUtil.switchUser(context, function(err, response, body) {
        request.post({
            'url': 'http://' + context.baseUrl + '/api/group/' + groupId,
            'method': 'POST',
            'form': profileFields || {}
        }, function(err, response, body) {
            if (err) {
                return callback(new RestUtil.OaeError('Something went wrong trying to contact the server: ' + err, response));
            } else if (response.statusCode !== 200) {
                return callback(new RestUtil.RestError('Could not update the group: ' + body, response));
            }
            callback(null);
        });
    });
};

/**
 * Get the members of a group.
 *
 * @param {Context}                 context             A context object with a valid Tenant and User object
 * @param {String}                  groupId             The id of the group you wish to update
 * @param {String}                  start               The principal id to start from (this will not be included in the response)
 * @param {Number}                  limit               The amount of members to retrieve.
 * @param {Function(err, resp)}     callback            A callback method
 * @param {Object}                  callback.err        Error object containing error message
 * @param {Object}                  callback.response   The parsed server response.
 *
var getGroupMembers = module.exports.getGroupMembers = function(context, groupId, start, limit, callback) {
    var params = {};
    if (start) {
        params.start = start;
    }
    if (limit) {
        params.limit = limit;
    }
    var url = 'http://' + context.baseUrl + '/api/group/' + groupId + '/members?' + querystring.stringify(params);
    RestUtil.switchUser(context, function(err, response, body) {
        request.get(url, function(err, response, body) {
            if (err) {
                return callback(new RestUtil.OaeError('Something went wrong trying to contact the server: ' + err, response));
            } else if (response.statusCode !== 200) {
                return callback(new RestUtil.RestError('Could not get the group members: ' + body, response));
            }
            RestUtil.parseResponse(body, response, callback);
        });
    });
};


/**
 * Update the members of a group.
 *
 * @param {Context}                 context             A context object with a valid Tenant and User object
 * @param {String}                  groupId             The id of the group you wish to update
 * @param {Object}                  members             A hash object where each key is the id of a user or group and the value
 *                                                      is one of 'manager', 'member' or false. In case the value is false,
 *                                                      the member will be deleted.
 * @param {Function(err, resp)}     callback            A callback method
 * @param {Object}                  callback.err        Error object containing error message
 * @param {Object}                  callback.response   The parsed server response.
 *
var setGroupMembers = module.exports.setGroupMembers = function(context, groupId, members, callback) {
    RestUtil.switchUser(context, function(err, response, body) {
        request.post({
            'url': 'http://' + context.baseUrl + '/api/group/' + groupId + '/members',
            'method': 'POST',
            'form': members
        }, function(err, response, body) {
            if (err) {
                return callback(new RestUtil.OaeError('Something went wrong trying to contact the server: ' + err, response));
            } else if (response.statusCode !== 200) {
                return callback(new RestUtil.RestError('Could not update the group members: ' + body, response));
            }
            callback(null);
        });
    });
};

/**
 * Returns all of the groups that a user is a direct and indirect member of.
 *
 * @param {Context}                 context             A context object with a valid Tenant and User object
 * @param {String}                  userId              The id of the group you wish to update
 * @param {String}                  start               The principal id to start from (this will not be included in the response)
 *                                                      (NOT IMPLEMENTED YET)
 * @param {Number}                  limit               The amount of members to retrieve.
 *                                                      (NOT IMPLEMENTED YET)
 * @param {Function(err, resp)}     callback            A callback method
 * @param {Object}                  callback.err        Error object containing error message
 * @param {Object}                  callback.response   The parsed server response.
 *
var getMembershipForUser = module.exports.getMembershipForUser = function(context, userId, start, limit, callback) {
    RestUtil.switchUser(context, function(err, response, body) {
        request.get('http://' + context.baseUrl + '/api/group/memberships/' + userId, function(err, response, body) {
            if (err) {
                return callback(new RestUtil.OaeError('Something went wrong trying to contact the server: ' + err, response));
            } else if (response.statusCode !== 200) {
                return callback(new RestUtil.RestError('Could not get the user his memberships: ' + body, response));
            }
            RestUtil.parseResponse(body, response, callback);
        });
    });
};

/**
 * Checks whether a group alias exists.
 *
 * @param {Context}                 context             A context object with a valid Tenant and User object
 * @param {String}                  alias               The alias to check.
 * @param {Function(err, exists)}   callback            A callback method
 * @param {Object}                  callback.err        Error object containing error message
 * @param {Boolean}                 callback.exists     The parsed server response.
 *
var exists = module.exports.exists = function(context, alias, callback) {
    RestUtil.switchUser(context, function(err, response, body) {
        request.get('http://' + context.baseUrl + '/api/group/exists/' + alias, function(err, response, body) {
            if (err) {
                return callback(new RestUtil.OaeError('Something went wrong trying to contact the server: ' + err, response));
            } else if (response.statusCode !== 200 && response.statusCode !== 404) {
                return callback(new RestUtil.RestError('Could not verify this group: ' + body, response));
            }
            if (response.statusCode === 200) {
                callback(false, true);
            } else {
                callback(false, false);
            }
        });
    });
}; */