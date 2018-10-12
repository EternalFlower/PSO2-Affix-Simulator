/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
function copy_inner(id) {
    var $temp = $("<input>");
    $("body").append($temp);
    var d = document.getElementById(id).innerHTML
    $temp.val(d).select();
    document.execCommand("copy");
    $temp.remove();
}
Ext.ns("PSO2");
Ext.define("PSO2.CookieModel", {
    extend: "Ext.data.Model",
    idProperty: "key",
    fields: [{
        name: "key"
    }, {
        name: "value"
    }]
});
PSO2.Cookie = {
    expiresDay: 60,
    version: "1.1",
    vText: "__version",
    init: function() {
        PSO2.Cookie.cookieProvider = Ext.create("Ext.state.CookieProvider", {
            path: location.pathname,
            domain: location.hostname,
            expires: new Date(new Date().getTime() + (86400000 * PSO2.Cookie.expiresDay))
        });
        Ext.state.Manager.setProvider(PSO2.Cookie.cookieProvider)
    },
	// Returns all affix plans saved to the cookie
    get: function(cookieName) {
        if (!Ext.isDefined(PSO2.Cookie.cookieProvider)) {
            PSO2.Cookie.init()
        }
        var tmpPlanList = PSO2.Cookie.cookieProvider.get(cookieName),
            version = PSO2.Cookie.cookieProvider.get(cookieName + PSO2.Cookie.vText),
            savedPlanList = null;
		// Determine how to save the plans
		// If version number is the same, can pass it
		// If not, parse it and pass it
        if (Ext.isDefined(version)) {
            if (version == PSO2.Cookie.version) {
                savedPlanList = tmpPlanList
            }
        } else {
            try {
                savedPlanList = JSON.parse(tmpPlanList)
            } catch (d) {}
        }
        return savedPlanList
    },
    set: function(cookieName, savedPlanList) {
        if (!Ext.isDefined(PSO2.Cookie.cookieProvider)) {
            PSO2.Cookie.init()
        }
        if (Ext.isObject(savedPlanList)) {
            PSO2.Cookie.cookieProvider.set(cookieName, savedPlanList);
            PSO2.Cookie.cookieProvider.set(cookieName + PSO2.Cookie.vText, PSO2.Cookie.version)
        }
    }
};
PSO2.utils = {
    overflow: function(a, c, b) {
        if (a < c) {
            return a - 1
        }
        return Math.max(0, c - b)
    }
};