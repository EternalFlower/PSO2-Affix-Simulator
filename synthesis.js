/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.ns("PSO2");
Ext.override(Ext.data.Record, {
    isModified: function(fieldname) {
        return false
    }
});
Ext.override(Ext.grid.header.Container, {
    sortAscText: "Ascending",
    sortDescText: "Descending",
    sortClearText: "Clear",
    columnsText: "Columns"
});
Ext.override(Ext.tab.Tab, {
    closeText: "Close Tab"
});
Ext.define("PSO2.TabCloseMenu", {
    extend: "Ext.tab.TabCloseMenu",
    closeTabText: "Close this tab",
    closeText: "Close this tab",
    closeOthersTabsText: "Close other tabs",
    closeAllTabsText: "Close all tabs",
    onAfterLayout: function() {
        var contextMenuDetails = {
            scope: this,
            delegate: "div.x-tab"
        }; // Only seems to trigger when on mobile device
        contextMenuDetails[this.menuTrigger] = function(event, tab) {
            var b = this;
            if (b.tabBar.getChildByElement(tab)) {
                b.onContextMenu(event, tab)
            }
        };
        this.mon(this.tabBar.el, contextMenuDetails)
    }
});
Ext.define("PSO2.GridGrouping", {
    extend: "Ext.grid.feature.Grouping",
    enableGroupingMenu: false,
    startCollapsed: true,
    groupHeaderTpl: "{[this.getHeaderName(values)]}",
    getFragmentTpl: function() {
        return Ext.apply(this.callParent(arguments) || {}, {
            getHeaderName: this.getHeaderName
        })
    },
    getHeaderName: function(affixGroup) {
        if (affixGroup.name == "AA") {
            return Locale.group1
        } else if (affixGroup.name == "AB") {
            return Locale.group2
        } else if (affixGroup.name == "AC") {
            return Locale.group3
        } else if (affixGroup.name == "AD") {
            return Locale.group4
        } else if (affixGroup.name == "CB") {
            return Locale.group5
        } else if (affixGroup.name == "DA") {
            return Locale.group6
        } else if (affixGroup.name == "DB") {
            return Locale.group7
        } else if (affixGroup.name == "EA") {
            return Locale.group8
        } else if (affixGroup.name == "EB") {
            return Locale.group9
        } else if (affixGroup.name == "EC") {
            return Locale.group10
        } else if (affixGroup.name == "GB") {
            return Locale.group11
        } else if (affixGroup.name == "YA") {
            return Locale.group12
        } else if (affixGroup.name == "L1") {
            return Locale.group13
        } else if (affixGroup.name == "L2") {
            return Locale.group14
        } else if (affixGroup.name == "L3") {
            return Locale.group15
        } else if (affixGroup.name == "L4") {
            return Locale.group16
        } else if (affixGroup.name == "L5") {
            return Locale.group17
        } else if (affixGroup.name == "L6") {
            return Locale.group18
        } else if (affixGroup.name == "L7") {
            return Locale.group19
        } else if (affixGroup.name == "L8") {
            return Locale.group20
        } else if (affixGroup.name == "LSAF") {
            return Locale.group21
        }
        return Locale.group0
    }
});
Ext.define("PSO2.SynthesisComponent", {
    extend: "Ext.container.Container",
    version: "1.93",
    date: document.lastModified,
    title: "PSO2 Affix Simulator",
    constCookieName: "pso2dodo",
    limitUrlSize: 10,
    maxMaterial: 5,
    currentTabItem: null,
    selectedGridCell: null,
    factorMenuText: {
        on: "Add Factor",
        off: "Cancel Factor"
    },
    constructor: function(params) {
        var synComp = this,
            viewportData, abCompData = {};
        Ext.apply(synComp, params);
        synComp.items = params.items;
        synComp.noDD = params.noDD;
        abCompData.constAbility = synComp.abilityList
        abCompData.constExtra = synComp.extraSlot
        abCompData.constBoostPoint = synComp.boostPoint
        abCompData.constExtendAbility = synComp.extendAbility
        abCompData.excludePattern = synComp.excludePattern.addition
        synComp.ability = Ext.create("PSO2.AbilityComponent", abCompData);
        if (synComp.items) {
            if (!Ext.isArray(synComp.items)) {
                viewportData = [synComp.items]
            } else {
                viewportData = synComp.items
            }
            delete synComp.items
        } else {
            viewportData = []
        }
		var appLocale = this.getLocale();
		if(appLocale == "jp")
		{
            viewportData.push({
                cls: "app-header",
                region: "north",
                height: 35,
                layout: "fit",
                hidden: synComp.noDD,
                html: ['<div class="x-top-title">', synComp.title + " ver " + synComp.version +
                    " (PSO2 JP)&nbsp;", '<span class="x-top-author">', '<a href="http://rxio.blog.fc2.com/"' +
                    ' style="text-decoration:none">Created by Pulsar@å€‰åº«çµ†</a>&nbsp;&amp;&nbsp;',
                    '<a target="_blank" href="http://pso2numao.web.fc2.com/dodo/" style="text-decoration:none">åŠ©å³è¡›é–€@ship8</a>',
                    ' | <a href="http://arks-layer.com/" style="text-decoration:none">English version maintained by Aida and Skylark_Tree</a>' +
                    ' (Updated ' + synComp.date + ')<br>Message Aida Enna#0001 or Skylark_Tree#1658 on Discord' +
                    ' or <a href="http://discord.gg/PSO2" style="text-decoration:none">join our Discord server</a>' +
                    ' or <a href=https://github.com/JimmyS24/PSO2-Affix-Simulator/issues>github </a>to report bugs/issues/suggestions.', "</span>", "</div>"
                ].join("")
            });
		}
		else
		{
			        viewportData.push({
            cls: "app-header",
            region: "north",
            height: 35,
            layout: "fit",
            hidden: synComp.noDD,
            html: ['<div class="x-top-title">', synComp.title + " ver " + synComp.version +
                " (PSO2 NA)&nbsp;", '<span class="x-top-author">', '<a href="http://rxio.blog.fc2.com/"' +
                ' style="text-decoration:none">Created by Pulsar@å€‰åº«çµ†</a>&nbsp;&amp;&nbsp;',
                '<a target="_blank" href="http://pso2numao.web.fc2.com/dodo/" style="text-decoration:none">åŠ©å³è¡›é–€@ship8</a>',
                ' | <a href="http://arks-layer.com/" style="text-decoration:none">English version maintained by Aida and Skylark_Tree</a>' +
                ' (Updated ' + synComp.date + ')<br>Message Aida Enna#0001 or Skylark_Tree#1658 on Discord' +
                ' or <a href="http://discord.gg/PSO2" style="text-decoration:none">join our Discord server</a>' +
                ' or <a href=https://github.com/JimmyS24/PSO2-Affix-Simulator/issues>github </a>to report bugs/issues/suggestions.', "</span>", "</div>"
            ].join("")
        });
		}
        synComp.panelNames = ["Base"];
        for (var d = 1; d <= synComp.maxMaterial; d++) {
            synComp.panelNames.push("Fodder " + d)
        }
        // If not on iphone, android, ipod or ipad
        if (synComp.noDD !== true) {
            synComp.abilityGrid = Ext.create("Ext.grid.Panel", {
                title: Locale.specialAbility,
                region: "west",
                collapsible: true,
                floatable: true,
                split: true,
                forceFit: true,
                sortableColumns: false,
                scroll: false,
                filterSetting: 'name',
                filterValue: '',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    height: 25,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        Ext.create("Ext.form.field.ComboBox", {
                            store: Ext.create("Ext.data.JsonStore", {
                                autoLoad: false,
                                fields: ["T", "V"],
                                data: [{
                                    T: "Name",
                                    V: 'name'
                                }, {
                                    T: "Effect",
                                    V: "effect"
                                }]

                            }),
                            displayField: "T",
                            forceSelection: true,
                            editable: false,
                            queryMode: "local",
                            valueField: "V",
                            value: 'name',
                            typeAhead: true,
                            width: 74,
                            listeners: {
                                scope: synComp,
                                change: function(combobox, newValue, prevValue) {
                                    this.abilityGrid.filterSetting = newValue;
                                    var store = this.abilityGrid.store;
                                    store.clearFilter();
                                    var filterValue = this.abilityGrid.filterValue;
                                    if (filterValue.length != 0) {
                                        var re = new RegExp(filterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                                        store.filter(this.abilityGrid.filterSetting, re);
                                    }
                                }
                            }
                        }),
                        {
                            xtype: 'textfield',
                            name: 'filter',
                            listeners: {
                                scope: synComp,
                                change: function(fld, newValue, oldValue, opts) {
                                    var store = this.abilityGrid.store;
                                    store.clearFilter();
                                    this.abilityGrid.filterValue = newValue;
                                    if (newValue.length != 0) {
                                        var re = new RegExp(newValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                                        store.filter(this.abilityGrid.filterSetting, re);
                                    }
                                }
                            },
                            flex: 1
                        }
                    ],
                }],
                columns: [{
                    dataIndex: "name",
                    header: Locale.ability,
                    width: 108,
                    filterable: true,
                    filter: {
                        type: "string"
                    }
                }, {
                    dataIndex: "effect",
                    header: "Effect",
                    width: 144,
                    filter: {
                        type: "string"
                    },
                    // Tooltip for affix entry, giving details on affix boost
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        if (record.get("extup")) {
                            var l = [];
                            Ext.Array.forEach(record.get("extup"), function(m) {
                                var n;
                                if (m.length == 2) {
                                    n = this.ability.findAbilityName(m + "01");
                                    l.push(n.get("name").replace(/[IV]+$/, "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""))
                                } else if (m.length == 3) {
                                    var i = 1;
                                    while (true) {
                                        n = this.ability.findAbilityName(m + i);
                                        if (n == null) break;
                                        l.push(n.get("name"));
                                        i++;
                                    }
                                } else {
                                    n = this.ability.findAbilityName(m);
                                    l.push(n.get("name"));
                                }

                            }, synComp);
                            metaData.tdAttr = 'data-qtip="' + l.join(", ") + ' Affix Bonus'
                        }
                        if (record.get("tooltip") && !metaData.tdAttr)
                            metaData.tdAttr = 'data-qtip="' + record.get("tooltip")
                        else if (record.get("tooltip"))
                            metaData.tdAttr += "<br>" + record.get("tooltip") + '"'

                        if (metaData.tdAttr)
                            metaData.tdAttr += '"'
                        return value
                    }
                }],
                features: [{
                        ftype: "filters",
                        encode: false,
                        local: true,
                        menuFilterText: "Search",
                        filters: [{
                            type: "string",
                            dataIndex: "name"
                        }, {
                            type: "string",
                            dataIndex: "effect"
                        }]
                    },
                    Ext.create("PSO2.GridGrouping")
                ],
                viewConfig: {
                    altRowCls: "x-grid-row-group",
                    style: {
                        overflow: "auto",
                        overflowX: "hidden"
                    },
                    listeners: {
                        render: synComp.initializeAbilityDragZone
                    },
                    // Color the row entries
                    doStripeRows: function(k, h) {
                        if (this.stripeRows) {
                            var listEntries = this.getNodes(k, h),
                                len = listEntries.length,
                                index = 0,
                                row, affixEntry, codeHead = "";
                            for (; index < len; index++) {
                                row = listEntries[index];
                                affixEntry = this.getRecord(row);
                                row.className = row.className.replace(this.rowClsRe, " ");
                                // Alternate between one color and other base on group
                                if (affixEntry.get("code").substring(0, 2) !== codeHead) {
                                    k++;
                                    codeHead = affixEntry.get("code").substring(0, 2)
                                }
                                if (k % 2 === 0) {
                                    row.className += (" " + this.altRowCls)
                                }
                                // If soul qualified for __ the Soul affix
                                if (affixEntry.get("cls")) {
                                    row.className += (" " + affixEntry.get("cls"))
                                }
                            }
                        }
                    }
                },
                store: synComp.ability.getAbilityStore()
            });
            viewportData.push(synComp.abilityGrid)
        } else { // on iphone, ipod, ipad, android
            synComp.abilityWindow = Ext.create("widget.window", {
                title: Locale.specialAbility,
                autoDestroy: false,
                closable: true,
                closeAction: "hide",
                modal: true,
                bodyStyle: "padding:5px;",
                autoScroll: true,
                items: Ext.create("Ext.grid.Panel", {
                    store: synComp.ability.getAbilityStore(),
                    forceFit: true,
                    scroll: false,
                    columns: [{
                        dataIndex: "name",
                        header: Locale.ability,
                        filter: {
                            type: "string"
                        }
                    }, {
                        dataIndex: "effect",
                        header: "Effect",
                        filter: {
                            type: "string"
                        }
                    }],
                    viewConfig: {
                        style: {
                            overflow: "auto",
                            overflowX: "hidden"
                        },
                        listeners: {
                            scope: synComp,
                            cellclick: function(view, cell, colIdx, store, iRow, rowIdx, event) {
                                if (this.selectedGridCell) {
                                    this.selectedGridCell.view.getStore().addAbility(store.data)
                                }
                                this.selectedGridCell = null;
                                this.abilityWindow.hide()
                            }
                        }
                    }
                })
            })
        }
        synComp.tabPanel = Ext.createWidget("tabpanel", {
            resizeTabs: true,
            enableTabScroll: true,
            defaults: {
                autoScroll: true,
                bodyPadding: 1
            },
            plugins: Ext.create("PSO2.TabCloseMenu", {
                menuTrigger: (synComp.noDD ? "click" : "contextmenu"),
                extraItemsTail: ["-", {
                    text: "Fill with trash",
                    scope: synComp,
                    handler: function() {
                        var plugin = this.tabPanel.plugins[0],
                            tabIndex = this.findLocationHashBy(plugin.item);
                        if (0 <= tabIndex) {
                            this.tabPanel.items.getAt(tabIndex).fillDuster()
                        }
                    }
                }, {
                    text: "Copy",
                    scope: synComp,
                    handler: function() {
                        var plugin = this.tabPanel.plugins[0],
                            tabIndex = this.findLocationHashBy(plugin.item);
                        if (0 <= tabIndex) {
                            this.selectLoadData(null, this.locationHash[tabIndex])
                        }
                    }
                }],
                listeners: {
                    scope: synComp,
                    aftermenu: function() {
                        this.currentTabItem = null
                    }
                }
            }),
            listeners: {
                scope: synComp,
                beforeremove: function(h, g) {
                    this.removeLocationHash(g)
                }
            }
        });
        synComp.mainPanel = Ext.create("Ext.panel.Panel", {
            region: "center",
            layout: "fit",
            items: synComp.tabPanel,
            dockedItems: {
                xtype: "toolbar",
                items: synComp.initToolbarButtons()
            },
            listeners: {
                scope: synComp,
                afterrender: synComp.onChangeLocationHash
            }
        });
        viewportData.push(synComp.mainPanel);
        Ext.create("Ext.Viewport", {
            renderTo: Ext.getBody(),
            layout: "border",
            items: viewportData
        });
        synComp.initGridMenuButton();
        window.onhashchange = function() {
            synComp.onChangeLocationHash()
        }
    },
    initToolbarButtons: function() {
        // Add, Save, Load buttons
        var synComp = this;
        var buttons = [Ext.create("Ext.Action", {
            iconCls: "x-add-icon",
            text: "Add Panel",
            scope: synComp,
            handler: function() {
                this.tabPanel.setActiveTab(this.addTab())
            }
        }), Ext.create("Ext.Action", {
            iconCls: "x-rename-icon",
            text: "Rename",
            scope: synComp,
            handler: synComp.renamePanel
        }), Ext.create("Ext.Action", {
            iconCls: "x-save-icon",
            text: "Save",
            scope: synComp,
            handler: synComp.saveData
        }), Ext.create("Ext.Action", {
            iconCls: "x-load-icon",
            text: "Load",
            scope: synComp,
            handler: synComp.loadData
        })];
        buttons.push("-");
        // General Campaign Boost
        buttons.push(Ext.create("Ext.form.field.Number", {
            fieldLabel: "Campaign Boost",
            forceSelection: true,
            queryMode: "local",
            value: 0,
            maxValue: 100,
            minValue: 0,
            hideTrigger: true,
            width: 130,
            labelWidth: 90,
            listeners: {
                scope: synComp,
                change: function(field, newValue, oldValue, opts) {
                    var resultPanels = this.tabPanel.query("resultpanel");
                    var boost = Math.max(Math.min(parseInt(newValue) || 0, 100), 0);
                    field.setValue(boost);
                    this.boostFunction = function(baseRate) {
                        return Math.min(baseRate + boost, 100)
                    }
                    if (0 < boost) {
                        field.addCls("x-campaign-up")
                    } else {
                        field.removeCls("x-campaign-up")
                    }

                    if (Ext.isArray(resultPanels)) {
                        for (var k = 0; k < resultPanels.length; k++) {
                            resultPanels[k].boostFunction = this.boostFunction;
                            if (resultPanels[k].rendered) {
                                resultPanels[k].refresh()
                            }
                        }
                    }
                }
            }
        }))
        buttons.push("-");
        buttons.push(Ext.create("Ext.form.field.ComboBox", {
                store: Ext.create("Ext.data.JsonStore", {
                    autoLoad: false,
                    fields: ["T", "V", "F"],
                    data: [{
                        T: "No Boost",
                        V: 0,
                        F: null
                    }, {
                        T: Locale.campaign_satk5,
                        V: "5S",
                        F: function(baseRate, name) {
                            if (synComp.boostdaySystem["blow"].includes(name))
                                return Math.min(baseRate + 5, 100)
                            else
                                return baseRate
                        }
                    }, {
                        T: Locale.campaign_ratk5,
                        V: "5R",
                        F: function(baseRate, name) {
                            if (synComp.boostdaySystem["shot"].includes(name))
                                return Math.min(baseRate + 5, 100)
                            else
                                return baseRate
                        }
                    }, {
                        T: Locale.campaign_tatk5,
                        V: "5T",
                        F: function(baseRate, name) {
                            if (synComp.boostdaySystem["mind"].includes(name))
                                return Math.min(baseRate + 5, 100)
                            else
                                return baseRate
                        }
                    }, {
                        T: Locale.campaign_hppp5,
                        V: "5H",
                        F: function(baseRate, name) {
                            if (synComp.boostdaySystem["hppp"].includes(name))
                                return Math.min(baseRate + 5, 100)
                            else
                                return baseRate
                        }
                    }, {
                        T: Locale.campaign_special5,
                        V: "5Sp",
                        F: function(baseRate, name) {
                            if (synComp.boostdaySystem["sp"].includes(name))
                                return Math.min(baseRate + 5, 100)
                            else
                                return baseRate
                        }
                    }]
                }),
                displayField: "T",
                forceSelection: true,
                editable: false,
                queryMode: "local",
                valueField: "V",
                value: 0,
                typeAhead: true,
                width: 115,
                listeners: {
                    scope: synComp,
                    change: function(combobox, newValue, prevValue) {
                        var resultPanels = this.tabPanel.query("resultpanel");
                        this.boostDayFunction = combobox.store.findRecord("V", newValue).get("F");
                        if (0 != newValue) {
                            combobox.addCls("x-campaign-up")
                        } else {
                            combobox.removeCls("x-campaign-up")
                        }
                        if (Ext.isArray(resultPanels)) {
                            for (var k = 0; k < resultPanels.length; k++) {
                                resultPanels[k].boostDayFunction = this.boostDayFunction;
                                if (resultPanels[k].rendered) {
                                    resultPanels[k].refresh()
                                }
                            }
                        }
                    }
                }
            }))
            // Share button
        if (synComp.noDD !== true) {
            buttons.push("-");
            var access_token = null,
                api_url = null;
            Ext.Ajax.request({
                url: './api_key_include.js',
                method: "GET",
                success: function(req, opt) {
                    if (req.status == 200) {
                        var json = Ext.JSON.decode(req.responseText)
                        access_token = json.access_token
                        api_url = json.api_url
                    }
                }
            });
            buttons.push({
                text: " Share",
                iconCls: "x-share-icon",
                handler: function() {
                    var site = location,
                        link = site.protocol + "//" + site.host + site.pathname + "#!" + lzbase62.compress(site.hash.substring(3));

                    Ext.create("widget.window", {
                        title: "Share",
                        modal: true,
                        width: synComp.noDD === true ? Ext.getBody().getWidth() : 700,
                        height: 200,
                        layout: "fit",
                        autoDestroy: true,
                        closable: true,
                        items: [{
                            xtype: "panel",
                            anchor: "100%",
                            style: {
                                padding: "5px"
                            },
                            height: 32,
                            html: '<br>Your long link is: <a href="' + link + '" id=long_link>' + link +
                                '</a> <button onclick=copy_inner("long_link")>Copy</button>' +
                                '<br><br>Your short link is:<a href="" id=short_link></a>' +
                                ' <button onclick=copy_inner("short_link")>Copy</button>' +
                                '<br><br>  You can share via Twitter here:' +
                                ' <a href="https://twitter.com/share" class="twitter-share-button" data-url="' +
                                link + '" data-text="PSO2 Affix Simulation"></a><br><center>',
                            listeners: {
                                single: true,
                                afterrender: function() {
                                    if (Ext.query("#twitter-wjs").length) {
                                        Ext.query("#twitter-wjs")[0].remove()
                                    }! function(doc, tag, id) {
                                        var n, l = doc.getElementsByTagName(tag)[0],
                                            http = /^http:/.test(doc.location) ? "http" : "https";
                                        if (!doc.getElementById(id)) {
                                            n = doc.createElement(tag);
                                            n.id = id;
                                            n.src = http + "://platform.twitter.com/widgets.js";
                                            l.parentNode.insertBefore(n, l)
                                        }
                                    }(document, "script", "twitter-wjs")
                                    $.getJSON(
                                        api_url + '/v3/shorten?access_token=' + access_token + '&longUrl=' + encodeURIComponent(link), {},
                                        function(response) {
                                            if (response.status_code == 200) {
                                                document.getElementById("short_link").innerHTML = response.data.url;
                                                document.getElementById("short_link").href = response.data.url;
                                            } else {
                                                document.getElementById("short_link").innerHTML = "Error: " + response.status_code
                                            }
                                        }
                                    );
                                }
                            }
                        }, ],
                        dockedItems: [{
                            xtype: "toolbar",
                            ui: "footer",
                            dock: "bottom",
                            layout: {
                                pack: "center"
                            },
                            items: Ext.create("Ext.button.Button", {
                                text: "Close",
                                scope: synComp,
                                handler: function() {
                                    Ext.WindowMgr.getActive().close()
                                },
                                minWidth: 105
                            })
                        }]
                    }).show()
                }
            })
            buttons.push({
                text: "Changelog",
                iconCls: "x-changelog-icon",
                handler: function() {
                    
                    Ext.create("widget.window", {
                        title: "Changelog",
                        modal: true,
                        width: synComp.noDD === true ? Ext.getBody().getWidth() : 700,
                        height: 400,
                        layout: "fit",
                        autoDestroy: true,
                        closable: true,
                        items: [{
                            xtype: "panel",
                            anchor: "100%",
                            style: {
                                padding: "5px"
                            },
                            height: 32,
                            autoScroll: true,
                            html: patch_notes,
                            listeners: {
                                single: true,
                                afterrender: function() {
                                    if (Ext.query("#twitter-wjs").length) {
                                        Ext.query("#twitter-wjs")[0].remove()
                                    }! function(doc, tag, id) {
                                        var n, l = doc.getElementsByTagName(tag)[0],
                                            http = /^http:/.test(doc.location) ? "http" : "https";
                                        if (!doc.getElementById(id)) {
                                            n = doc.createElement(tag);
                                            n.id = id;
                                            n.src = http + "://platform.twitter.com/widgets.js";
                                            l.parentNode.insertBefore(n, l)
                                        }
                                    }(document, "script", "twitter-wjs")
                                }
                            }
                        }, ],
                        dockedItems: [{
                            xtype: "toolbar",
                            ui: "footer",
                            dock: "bottom",
                            layout: {
                                pack: "center"
                            },
                            items: Ext.create("Ext.button.Button", {
                                text: "Close",
                                scope: synComp,
                                handler: function() {
                                    Ext.WindowMgr.getActive().close()
                                },
                                minWidth: 105
                            })
                        }]
                    }).show()
                }
            })
            buttons.push("->")
            var appLocale = this.getLocale();
            if(appLocale == "na"){
                appLocale = "jp";
            } else if (appLocale == "jp"){
                appLocale = "na";
            }
			buttons.push({
				text: "Click a flag to switch between PSO2JP and PSO2NA (This setting will be saved) ->",
            })
            buttons.push({
                cls: "x-jp-flag",
                width: 25,
                enableToggle: true,
                handler: function() {
                    var site = location
                    var pathname = site.pathname.split('/');
                    for(var i = 0; i < pathname.length; i++){
                        if(pathname[i] == "na"){
                            pathname[i] = "jp";
                        } else if(pathname[i] == "jp"){
                            pathname[i] = "na";
                        }
                    }
                    
                    site.pathname = pathname.join("/");
                }
            })
            buttons.push({
                cls: "x-na-flag",
                width: 32,
                enableToggle: true,
                handler: function() {
                    var site = location
                    var pathname = site.pathname.split('/');
                    for(var i = 0; i < pathname.length; i++){
                        if(pathname[i] == "na"){
                            pathname[i] = "jp";
                        } else if(pathname[i] == "jp"){
                            pathname[i] = "na";
                        }
                    }
                    
                    site.pathname = pathname.join("/");
                }
            })
        }
        return buttons
    },
    getLocale: function(){
        var pathname = location.pathname.split('/');
        pathname.pop();
        return pathname.pop();
    },
    // Initialize the menu in the fodder panel section
    initGridMenuButton: function() {
        var synComp = this,
            buttons = [];
        buttons.push({
            iconCls: "x-factor-icon",
            text: synComp.factorMenuText.on,
            scope: synComp,
            handler: function(menuItem, event) {
                var cell = this.selectedGridCell;
                if (cell) {
                    var affixEntry = cell.record.get("slot");
                    if (menuItem.text === this.factorMenuText.on) {
                        cell.view.store.each(function(slot, index) {
                            var affixEntry = slot.get("slot");
                            if (affixEntry != null && affixEntry.factor === true) {
                                slot.set("slot", this.makeFactor(affixEntry, false));
                                return false
                            }
                            return true
                        }, this);
                        cell.record.set("slot", this.makeFactor(affixEntry, true))
                    } else {
                        cell.record.set("slot", this.makeFactor(affixEntry, false))
                    }
                }
                this.selectedGridCell = null
            }
        });
        for (var index = 0; index < synComp.maxMaterial; index++) {
            buttons.push({
                iconCls: "x-copy-icon",
                text: "",
                scope: synComp,
                btnIndex: index,
                handler: synComp.onCopyAbility
            })
        }
        buttons.push({
            iconCls: "x-del-icon",
            text: "Delete",
            scope: synComp,
            handler: function() {
                var cell = this.selectedGridCell;
                if (cell) {
                    cell.view.getStore().removeAbility(cell.record, cell.rowIndex);
                    cell.view.refresh()
                }
                this.selectedGridCell = null
            }
        });
        synComp.gridMenu = Ext.create("Ext.menu.Menu", {
            items: buttons
        })
    },
    urlHashValidate: function(panelCode) {
        var synComp = this,
            codeArray = synComp.hasharray(panelCode),
            len = codeArray.length;
        if (!panelCode.s && panelCode.s !== "") {
            return false
        }
        for (var index = 1; index < synComp.maxMaterial; index++) {
            if (!panelCode[index] && panelCode[index] !== "") {
                return false
            }
        }
        for (var index = 0; index < len; index++) {
            if (codeArray[index]) {
                if (!synComp.ability.isExistAbilities(codeArray[index].split("."))) {
                    return false
                }
            }
        }
        return true
    },
    addTab: function(panelData) {
        var synComp = this,
            panels = [{
                xtype: "panel",
                frame: true,
                items: {
                    xtype: "fieldset",
                    layout: "anchor",
                    title: Locale.selectAbility,
                    autoHeight: true,
                    padding: "0 0 0 4",
                    margin: "0 0 0 0",
                    defaults: {
                        xtype: "checkbox",
                        anchor: "100%",
                        hideEmptyLabel: true,
                        scope: synComp,
                        handler: synComp.onCheckAbility
                    }
                }
            }],
            a = {};
        if (synComp.optionList && synComp.optionList.support) {
            a.supportData = synComp.optionList.support
        }
        if (synComp.optionList && synComp.optionList.additional) {
            a.additionalData = synComp.optionList.additional
        }
        if (synComp.optionList && synComp.optionList.additional) {
            a.potentialData = synComp.optionList.potential
        }
        if (synComp.sameBonusBoost) {
            a.sameBonusBoost = synComp.sameBonusBoost
        }
        if (synComp.excludePattern && synComp.excludePattern.select) {
            a.excludePattern = synComp.excludePattern.select
        }
        panels.push(Ext.create("PSO2.ResultPanel", Ext.apply({
            frame: true,
            noDD: synComp.noDD,
            abilityComponent: synComp.ability,
            boostFunction: synComp.boostFunction,
            boostDayFunction: synComp.boostDayFunction,
            listeners: {
                scope: synComp,
                opt1change: function(resultPanel, comboBox, isDefault) {
                    if (!resultPanel.suspendCheckChange) {
                        this.onAbilityOptionChange(resultPanel, comboBox, isDefault)
                    }
                },
                opt2change: function(resultPanel, comboBox, isDefault) {
                    if (!resultPanel.suspendCheckChange) {
                        this.onAbilityOptionChange(resultPanel, comboBox, isDefault);
                        this.updateCheckbox(resultPanel, this.tabPanel.activeTab.query("fieldset")[0])
                    }
                },
                opt3change: function(resultPanel, comboBox, isDefault) {
                    if (!resultPanel.suspendCheckChange) {
                        this.onAbilityOptionChange(resultPanel, comboBox, isDefault)
                    }
                }
            }
        }, a)));
        var bottomPanel = Ext.create("Ext.panel.Panel", {
            flex: 1,
            frame: true,
            border: false,
            autoScroll: true,
            margin: "0 0 0 0",
            padding: "0 0 0 0",
            layout: "column",
            defaults: {
                columnWidth: 1 / 2,
                layout: "anchor",
                autoHeight: true,
                defaults: {
                    anchor: "100%"
                }
            },
            items: panels,
            getFieldSet: function() {
                var panel = this;
                if (!panel.fieldSet) {
                    panel.fieldSet = panel.query("fieldset")[0]
                }
                return panel.fieldSet
            },
            getResultPanel: function() {
                var panel = this;
                if (!panel.resultPanel) {
                    panel.resultPanel = panel.query("resultpanel")[0]
                }
                return panel.resultPanel
            },
            updateResults: function() {
                if (synComp.initializedRestoreData !== true) {
                    var fieldSet = this.getFieldSet(),
                        resultPanel = this.getResultPanel();
                    resultPanel.updateResults(fieldSet)
                }
            }
        });
        // Load up the checkboxes from save
        if (synComp.initializedRestoreData === true) {
            var fieldSet = bottomPanel.getFieldSet(),
                resultPanel = bottomPanel.getResultPanel();
            fieldSet.on("afterrender", function(p, delayEventData) {
                var t = this,
                    selectedCode = panelData.r;
                bottomPanel.updateResults();
                if (selectedCode) {
                    var codeArray = selectedCode.split("."),
                        checkBoxes = t.query("checkbox"),
                        len;
                    delayEventData.myComponent.initializedCheckbox = false;
                    if (Ext.isArray(checkBoxes) && (len = checkBoxes.length) > 0) {
                        for (var index = 0; index < len; index++) {
                            if (0 <= Ext.Array.indexOf(codeArray, checkBoxes[index].inputValue)) {
                                checkBoxes[index].setValue(true)
                            }
                        }
                    }
                    delayEventData.myComponent.initializedCheckbox = true
                }
            }, fieldSet, {
                delay: 1000,
                myComponent: synComp
            });
            // Load all the item selected in the comboboxes
            resultPanel.on("afterrender", function(q, delayEventData) {
                var s = this,
                    comboBoxSelectedCode = panelData.o;
                if (comboBoxSelectedCode) {
                    var codeArray = comboBoxSelectedCode.split("."),
                        len = codeArray.length;
                    delayEventData.myComponent.initializedSelectOption = false;
                    for (var index = 0; index < len; index++) {
                        s.selectOption(codeArray[index])
                    }
                    delayEventData.myComponent.initializedSelectOption = true
                }
            }, resultPanel, {
                delay: 1000,
                myComponent: synComp
            })
        }
        var foddersGrid = [synComp.createGridPanel(0, synComp.ability.createSlotStore(), bottomPanel, panelData ? panelData.s : null)];
        for (var e = 1; e <= synComp.maxMaterial; e++) {
            foddersGrid.push(synComp.createGridPanel(e, synComp.ability.createSlotStore(), bottomPanel, panelData ? panelData[e] : null))
        }

        var synPanelItems = [
            {
                layout: "column",
                defaults: {
                    columnWidth: 1 / (synComp.maxMaterial + 1),
                    layout: "anchor",
                    autoHeight: true,
                    defaults: {
                        anchor: "100%"
                    }
                },
                items: foddersGrid
            }, 
            bottomPanel
        ];

        /*if(this.getLocale() == "na"){
            synPanelItems.push(
                Ext.create("Ext.panel.Panel", {
                    title: "<p style=font-size:15px>!!! Important information for PSO2NA users !!!</p>",
                    height: 200,
                    html: "<p style=font-size:26px>Please note that not all affixes in this simulator will have their official NA terms, as we are still trying to complete a list of them. The most updated list of term differences is available at <A HREF=https://github.com/SynthSy/PSO2-Dictionary/wiki/Affix-Names target=_blank>The PSO2 Dictionary</a>. If you find any errors, mismatched names/terms, or bugs/issues, please send a DM to Aida Enna#0001 on Discord.</p>"
        
                })
            )
        }*/
        
        var synPanel = synComp.tabPanel.add({
            title: "Synthesis Panel",
            autoScroll: true,
            closable: true,
            fillDuster: function() {
                var gridPanels = this.query("gridpanel"),
                    maxSlots = 0;
                for (var index = 0; index < gridPanels.length; index++) {
                    maxSlots = Math.max(maxSlots, gridPanels[index].getAbilityCount())
                }
                synComp.initializedRestoreData = true;
                try {
                    for (var index = 0; index < gridPanels.length; index++) {
                        if (index == 0) {
                            gridPanels[index].fillDuster(maxSlots)
                        } else {
                            if (0 < gridPanels[index].getAbilityCount()) {
                                gridPanels[index].fillDuster(maxSlots)
                            }
                        }
                    }
                } finally {
                    synComp.initializedRestoreData = false
                }
                bottomPanel.updateResults();
                synComp.onChangeAbility()
            },
            layout: {
                type: "vbox",
                align: "stretch",
                padding: "0 0 5 0"
            },
            items: synPanelItems,
            getResultPanel: bottomPanel.getResultPanel
        });
        synComp.addLocationHash(synPanel);
        if (synComp.initializedRestoreData !== true) {
            synComp.updateLocationHash()
        }
        return synPanel
    },
    renamePanel: function() {
        var synComp = this,
            active = synComp.tabPanel.activeTab;
        if (active) {
            var tabIndex = synComp.findLocationHashBy(synComp.tabPanel.activeTab);
            if (0 <= tabIndex) {
                var tabData = synComp.locationHash[tabIndex];
                if (synComp.urlHashValidate(tabData)) {
                    return Ext.Msg.prompt("Rename Panel", "Rename current panel.<br/>Input a name?", function(okButton, textfield) {
                        if (okButton == "ok") {
                            active.setTitle(textfield);
                        }
                    }, synComp)
                }
            }
        }
        x = 1;
    },
    // Save data onto a cookie
    saveData: function() {
        var synComp = this;
        if (synComp.tabPanel.activeTab) {
            var tabIndex = synComp.findLocationHashBy(synComp.tabPanel.activeTab);
            if (0 <= tabIndex) {
                var tabData = synComp.locationHash[tabIndex];
                if (synComp.urlHashValidate(tabData)) {
                    return Ext.Msg.prompt("Save Panel", "Panel state was saved to a cookie.<br/>Input a name?", function(okButton, textfield) {
                        if (okButton == "ok") {
                            var savedCookie = PSO2.Cookie.get(synComp.constCookieName) || {},
                                tabHash = {};
                            if (textfield == "") {
                                textfield = Ext.Date.format(new Date(), "Y-m-d H:i:s")
                            }
                            synComp.hashcopy(synComp.locationHash[tabIndex], tabHash);
                            if (savedCookie[textfield]) {
                                Ext.Msg.confirm("Confirm", "Data of the same name exists. Overwrite?", function(yesButton) {
                                    if (yesButton == "yes") {
                                        savedCookie[textfield] = tabHash;
                                        PSO2.Cookie.set(synComp.constCookieName, savedCookie);
                                        Ext.Msg.alert("Information", "Save complete.")
                                    }
                                }, synComp)
                            } else {
                                savedCookie[textfield] = tabHash;
                                PSO2.Cookie.set(synComp.constCookieName, savedCookie);
                                Ext.Msg.alert("Information", "Save complete.")
                            }
                        }
                    }, synComp)
                }
            }
        }
        return Ext.Msg.alert("Save Panel", "There is nothing to save.")
    },
    // Load data from a cookie
    loadData: function() {
        var synComp = this,
            savedCookies = PSO2.Cookie.get(synComp.constCookieName);
        if (savedCookies && Ext.isObject(savedCookies)) {
            var cookieMap = [],
                a;
            for (var e in savedCookies) {
                cookieMap.unshift({
                    key: e,
                    value: savedCookies[e]
                })
            }
            if (synComp.noDD === true) {
                a = {
                    scope: synComp,
                    itemclick: function(dataView, cookie) {
                        this.selectLoadData(dataView, cookie);
                        Ext.WindowMgr.getActive().close()
                    }
                }
            } else {
                a = {
                    scope: synComp,
                    itemdblclick: function(dataView, cookie) {
                        this.selectLoadData(dataView, cookie);
                        Ext.WindowMgr.getActive().close()
                    }
                }
            }
            Ext.create("widget.window", {
                title: "Load Panel",
                modal: true,
                width: synComp.noDD === true ? Ext.getBody().getWidth() : 600,
                height: 320,
                layout: "fit",
                autoDestroy: true,
                closable: true,
                items: Ext.create("Ext.view.View", {
                    anchor: "100%",
                    autoScroll: true,
                    allowBlank: false,
                    store: Ext.create("Ext.data.Store", {
                        model: "PSO2.CookieModel",
                        data: cookieMap
                    }),
                    tpl: ['<tpl for=".">', '<div class="cookie-wrap">', '<div class="cookie">{key}</div>', "</div>", "</tpl>", '<div class="x-clear"></div>'],
                    listeners: a,
                    trackOver: true,
                    overItemCls: "x-item-over",
                    itemSelector: "div.cookie-wrap"
                }),
                dockedItems: [{
                    xtype: "toolbar",
                    ui: "footer",
                    dock: "bottom",
                    layout: {
                        pack: "center"
                    },
                    items: Ext.create("Ext.button.Button", {
                        text: "Close",
                        scope: synComp,
                        handler: function() {
                            Ext.WindowMgr.getActive().close()
                        },
                        minWidth: 105
                    })
                }]
            }).show()
        } else {
            Ext.Msg.alert("Load Panel", "Panel was not restored.");
        }
    },
    // Load data onto a tab
    selectLoadData: function(b, cookie) {
        var synComp = this;
        if (cookie) {
            var value, synPanel, c;
            if (Ext.isFunction(cookie.get)) {
                value = cookie.get("value")
            } else {
                value = cookie
            }
            synComp.initializedRestoreData = true;
            try {
                synPanel = synComp.addTab(value)
            } finally {
                synComp.initializedRestoreData = false
            }
            synComp.hashcopy(value, synComp.addLocationHash(synPanel));
            synComp.updateLocationHash();
            synComp.tabPanel.setActiveTab(synPanel)
        }
    },
    // Store value of all options selected in the comboboxes (except default)
    onAbilityOptionChange: function(resultPanel, combobox, isDefault) {
        var synComp = this,
            tabIndex = synComp.findLocationHashBy(synComp.tabPanel.activeTab),
            codeHead = combobox.value.charAt(0);
        if (synComp.locationHash[tabIndex]) {
            var codeList = synComp.locationHash[tabIndex]["o"].split("."),
                selectOptions = [];
            Ext.Array.forEach(codeList, function(code) {
                if (0 < code.length && code.charAt(0) != codeHead) {
                    selectOptions.push(code)
                }
            });
            // Do not save the default option
            if (!isDefault) {
                selectOptions.push(combobox.value)
            }
            synComp.locationHash[tabIndex]["o"] = selectOptions.join(".");
            synComp.updateLocationHash()
        }
    },
    makeFactor: function(affixData, isFactor) {
        var slotData;
        if (isFactor == true) {
            slotData = Ext.applyIf({
                source: affixData,
                factor: true,
                extend: null,
                generate: null
            }, affixData);
            slotData.code = "*" + affixData.code
        } else {
            slotData = affixData.source;
            delete affixData
        }
        return slotData
    },
    createGridPanel: function(index, store, panel, codeString) {
        var synComp = this,
            fodderPanel, resultPanel = panel.getResultPanel(), indexList = [];
        for (i = 0; i <= synComp.maxMaterial; i++) {
            if (i != index) {
                indexList.push(i)
            }
        }
        resultPanel.bindStore(store);
        store.on({
            scope: panel,
            update: panel.updateResults
        });
        store.on({
            scope: synComp,
            update: synComp.onChangeAbility
        });
        fodderPanel = Ext.create("Ext.grid.Panel", {
            title: synComp.panelNames[index],
            titleIndex: indexList,
            sortableColumns: false,
            dustAbilities: synComp.ability.abilityStore.getRange(synComp.ability.abilityStore.find("gid", "ZZ")),
            getAbilityCount: function() {
                var m = this.store;
                return m.getEnableData().length - m.getFactorCount();
            },
            locked: false,
            collapsed: false,
            collapsible: true,
            collapseCls: "-collapse-",
            lockedCls: "slot-grid-locked",
            listeners: {
                scope: synComp,
                beforecollapse: function(fodderTitleBar, q, m, o) {
                    if (fodderTitleBar.tools[0] && fodderTitleBar.tools[0].rendered) {
                        var n = fodderTitleBar.tools[0];
                        if (fodderTitleBar.locked === true) {
                            n.toolEl.removeCls(n.componentCls + fodderTitleBar.collapseCls + n.expandType);
                            n.toolEl.addCls(n.componentCls + fodderTitleBar.collapseCls + fodderTitleBar.collapseDirection);
                            fodderTitleBar.el.removeCls(fodderTitleBar.lockedCls)
                        } else {
                            n.toolEl.removeCls(n.componentCls + fodderTitleBar.collapseCls + fodderTitleBar.collapseDirection);
                            n.toolEl.addCls(n.componentCls + fodderTitleBar.collapseCls + n.expandType);
                            fodderTitleBar.el.addCls(fodderTitleBar.lockedCls)
                        }
                        fodderTitleBar.locked = !fodderTitleBar.locked
                    }
                    return false
                }
            },
            fillDuster: function(minAffix) {
                var count, slot;
                minAffix = Math.min(minAffix + this.store.getFactorCount(), this.store.getCount());
                if (this.getAbilityCount() <= minAffix) {
                    count = 0;
                    while (count < minAffix && (slot = this.store.getAt(count).get("slot")) != null) {
                        if (slot.gid == "ZZ") {
                            this.store.removeAbility(slot, count)
                        } else {
                            count++
                        }
                    }
                    for (var index = count = 0; count < minAffix; count++) {
                        slot = this.store.getAt(count).get("slot");
                        if (slot == null) {
                            this.store.addAbility(this.dustAbilities[index++].data)
                        }
                    }
                    this.view.refresh()
                }
            },
            columns: [{
                dataIndex: "name",
                header: "Slot",
                width: 52,
                hidden: synComp.noDD || 2 < synComp.maxMaterial
            }, {
                dataIndex: "slot",
                header: Locale.ability,

                renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (value != null) {
                        if (value.factor) {
                            metaData.tdCls = "x-factor-icon"
                        }
                        return value.name
                    }
                    return ""
                }
            }],
            forceFit: true,
            store: store,
            viewConfig: {
                listeners: synComp.initDDListener(synComp.noDD)
            }
        });
        if (codeString) {
            var abStore = synComp.ability.getAbilityStore();
            Ext.Array.forEach(codeString.split("."), function(n) {
                var isSAF = (n.substr(0, 1) == "*"),
                    affixEntry = abStore.findRecord("code", isSAF ? n.substr(1) : n);
                if (affixEntry) {
                    fodderPanel.store.addAbility(isSAF ? synComp.makeFactor(affixEntry.data, true) : affixEntry.data)
                }
            })
        }
        return fodderPanel
    },
    // Creates the dropdown menu
    initDDListener: function(noDD) {
        var synComp = this,
            dropDown = {
                scope: synComp
            };
        if (noDD !== true) {
            dropDown.render = synComp.initializeSlotDropZone;
            dropDown.cellcontextmenu = function(gridView, n, k, slot, o, rowIndex, event) {
                event.stopEvent();
                if (slot.get("slot") != null) {
                    synComp.selectedGridCell = {
                        view: gridView,
                        record: slot,
                        rowIndex: rowIndex
                    };
                    if (slot.get("slot").factor !== true) {
                        synComp.gridMenu.items.getAt(0).setText(synComp.factorMenuText.on)
                    } else {
                        synComp.gridMenu.items.getAt(0).setText(synComp.factorMenuText.off)
                    }
                    var fodderArray = [];
                    Ext.Array.forEach(this.tabPanel.getActiveTab().query("grid"), function(gridPanel) {
                        if (gridPanel.getView() !== gridView) {
                            fodderArray.push(gridPanel)
                        }
                    });
                    for (var index = 0; index < synComp.maxMaterial; index++) {
                        synComp.copyButtonUpdate(gridView, synComp.gridMenu.items.getAt(index + 1), index, fodderArray[index])
                    }
                    synComp.gridMenu.showAt(event.getXY())
                }
            }
        } else {
            dropDown.cellclick = function(gridView, d, h, slot, m, rowIndex, event) {
                event.stopEvent();
                if (gridView.panel && gridView.panel.locked === true) {
                    return false
                }
                synComp.selectedGridCell = {
                    view: gridView,
                    record: slot,
                    rowIndex: rowIndex
                };
                if (slot.get("slot") != null) {
                    if (slot.get("slot").factor !== true) {
                        synComp.gridMenu.items.getAt(0).setText(synComp.factorMenuText.on)
                    } else {
                        synComp.gridMenu.items.getAt(0).setText(synComp.factorMenuText.off)
                    }
                    var fodderArray = [];
                    Ext.Array.forEach(this.tabPanel.getActiveTab().query("grid"), function(gridPanel) {
                        if (gridPanel.getView() !== gridView) {
                            fodderArray.push(gridPanel)
                        }
                    });
                    for (i = 0; i < synComp.maxMaterial; i++) {
                        synComp.copyButtonUpdate(gridView, synComp.gridMenu.items.getAt(i + 1), i, fodderArray[i])
                    }
                    synComp.gridMenu.showAt(event.getXY())
                } else {
                    synComp.abilityWindow.setWidth(synComp.mainPanel.getWidth());
                    synComp.abilityWindow.setHeight(Ext.getBody().getHeight());
                    synComp.abilityWindow.showAt(0, 0)
                }
            }
        }
        return dropDown
    },
    copyButtonUpdate: function(gridView, menuItem, titleIndex, gridPanel) {
        var synComp = this,
            panelOwner = gridView.ownerCt;
        menuItem.setText("Copy to " + synComp.panelNames[panelOwner.titleIndex[titleIndex]]);
        menuItem.targetView = gridPanel;
        return menuItem
    },
    // Excute copy to fodder action
    onCopyAbility: function(action) {
        var synComp = this,
            selCell = synComp.selectedGridCell;
        if (selCell && action.targetView) {
            action.targetView.getStore().addAbility(selCell.record.get("slot"))
        }
        this.selectedGridCell = null
    },

    initializeAbilityDragZone: function(gridView) {
        gridView.dragZone = Ext.create("Ext.dd.DragZone", gridView.getEl(), {
            getDragData: function(event) {
                var targetItem = event.getTarget(gridView.itemSelector, 10),
                    clone;
                if (targetItem) {
                    clone = targetItem.cloneNode(true);
                    clone.id = Ext.id();
                    return gridView.dragData = {
                        gridId: this.id,
                        sourceEl: targetItem,
                        repairXY: Ext.fly(targetItem).getXY(),
                        ddel: clone,
                        patientData: gridView.getRecord(targetItem).data
                    }
                }
            },
            getRepairXY: function() {
                return this.dragData.repairXY
            }
        })
    },
    initializeSlotDropZone: function(inGridView) {
        var synComp = this,
            gridView = inGridView,
            gridPanel = gridView.up("gridpanel");
        inGridView.dragZone = Ext.create("Ext.dd.DragZone", inGridView.getEl(), {
            getDragData: function(g) {
                var targetItem = g.getTarget(inGridView.itemSelector, 10),
                    clone;
                if (targetItem) {
                    if (!inGridView.getRecord(targetItem).data.slot) {
                        return null
                    }
                    clone = targetItem.cloneNode(true);
                    clone.id = Ext.id();
                    return inGridView.dragData = {
                        gridId: this.id,
                        sourceEl: targetItem,
                        repairXY: Ext.fly(targetItem).getXY(),
                        ddel: clone,
                        patientData: inGridView.getRecord(targetItem).data.slot
                    }
                }
            },
            beforeInvalidDrop: function(event, g, l) {
                var source = this.dragData.sourceEl,
                    sourceRecord = inGridView.getRecord(source);
                if (sourceRecord && !Ext.get(event) && !gridView.panel.locked) {
                    sourceRecord.store.removeAbility(sourceRecord, source.viewIndex);
                    inGridView.refresh();
                    this.proxy.hide()
                }
            },
            getRepairXY: function() {
                return this.dragData.repairXY
            }
        });
        gridPanel.dropZone = Ext.create("Ext.dd.DropZone", inGridView.el, {
            getTargetFromEvent: function(event) {
                return event.getTarget(".x-grid-cell-last")
            },
            onNodeDrop: function(htmlCellEle, dragZone, event, gridView) {
                if (inGridView.panel && inGridView.panel.locked) {
                    return true
                }
                if (this.id == gridView.gridId) {
                    inGridView.getStore().swapAbility(gridView.sourceEl.viewIndex, event.getTarget(inGridView.itemSelector).viewIndex);
                    inGridView.refresh();
                    synComp.onChangeAbility()
                } else {
                    inGridView.getStore().addAbility(gridView.patientData)
                }
                return true
            }
        })
    },
    onChangeAbility: function() {
        var synComp = this,
            synPanel, resultPanel, abSet, panelIndex;
        if (synComp.initializedRestoreData !== true) {
            synPanel = this.tabPanel.activeTab;
            resultPanel = synPanel && synPanel.query("resultpanel")[0];
            abSet = resultPanel && resultPanel.abilitySet;
            panelIndex = synComp.findLocationHashBy(synPanel);
            if (abSet && synComp.locationHash[panelIndex]) {
                synComp.locationHash[panelIndex]["s"] = abSet.getLocationHash(0).join(".");
                for (var c = 0; c <= synComp.maxMaterial; c++) {
                    synComp.locationHash[panelIndex][c] = abSet.getLocationHash(c).join(".")
                }
                synComp.locationHash[panelIndex]["r"] = resultPanel.getValues().join(".");
                synComp.updateLocationHash()
            }
        }
    },
    // Add/Removes ability from result panel when checkbox is checked
    onCheckAbility: function(checkBox, isCheck) {
        var synComp = this,
            resultPanel = checkBox.resultPanel;
        if (resultPanel) {
            if (isCheck) {
                resultPanel.addAbility(checkBox)
            } else {
                resultPanel.removeAbility(checkBox)
            }
            synComp.updateCheckbox(resultPanel, checkBox.fieldSet);
            if (synComp.tabPanel.activeTab) {
                var panelIndex = synComp.findLocationHashBy(synComp.tabPanel.activeTab);
                if (0 <= panelIndex) {
                    synComp.locationHash[panelIndex]["r"] = resultPanel.getValues().join(".");
                    synComp.updateLocationHash()
                }
            }
        }
    },
    // Enable/disable checkbox if max is reach
    updateCheckbox: function(resultPanel, fieldSet) {
        var checkboxArray = fieldSet.query("checkbox");
        if (resultPanel.abilityCount() < resultPanel.getEnableMaxCount()) {
            Ext.Array.forEach(checkboxArray, function(checkbox) {
                if (checkbox.disabled) {
                    checkbox.enable()
                }
            })
        } else {
            Ext.Array.forEach(checkboxArray, function(checkbox) {
                if (!checkbox.checked) {
                    checkbox.disable()
                }
            })
        }
    },
    // returns index of the panel in the hash
    findLocationHashBy: function(synPanel) {
        var synComp = this,
            hashLen = synComp.locationHash.length,
            index;
        for (index = 0; index < hashLen; index++) {
            if (synComp.locationHash[index]["id"] == synPanel.id) {
                return index
            }
        }
        return -1
    },
    // Add hash for a new panel
    addLocationHash: function(synPanel, urlLimit) {
        var synComp = this,
            locHash, index;
        if (synComp.initializedRestoreData === true && urlLimit !== true) {
            return location.hash
        }
        synComp.locationHash = synComp.locationHash || [];
        locHash = {
            id: synPanel.id,
            s: "",
            r: "",
            o: ""
        };
        for (index = 1; index <= synComp.maxMaterial; index++) {
            locHash[index] = ""
        }
        synComp.locationHash.push(locHash);
        return locHash
    },
    // Removes hash when panel is deleted
    removeLocationHash: function(synPanel) {
        var synComp = this,
            panelIndex = synComp.findLocationHashBy(synPanel),
            panelHash;
        if (synComp.initializedRestoreData === true) {
            return location.hash
        }
        if (0 <= panelIndex) {
            panelHash = synComp.locationHash.splice(panelIndex, 1)
        }
        synComp.updateLocationHash();
        return panelHash
    },
    updateLocationHash: function() {
        var synComp = this,
            instanceHash = "",
            hashLen = synComp.locationHash.length,
            index;
        if (synComp.initializedRestoreData !== true && synComp.initializedCheckbox !== false && synComp.initializedSelectOption !== false) {
            if (0 < hashLen) {
                instanceHash = "#!";
                for (index = 0; index < hashLen && index < synComp.limitUrlSize; index++) {
                    instanceHash += "/";
                    instanceHash += synComp.hashmake(synComp.locationHash[index])
                }
            }
            if (location.hash != instanceHash) {
                location.hash = instanceHash
            }
        }
    },
    // Updates url when changes happen
    onChangeLocationHash: function() {
        var synComp = this,
            structHashList = synComp.locationHash || [],
            abStore = synComp.ability.abilityStore;
        if (location && location.hash) {
            if (location.hash.match(/^#!([a-zA-Z0-9]+)$/)) {
                return location.hash = "!/" + lzbase62.decompress(RegExp.$1)
            } else {
                if (location.hash.match(/^#!\/([a-zA-Z0-9\.\=&\/\*]+)/)) {
                    var stringHashList = RegExp.$1.split("/"),
                        m = stringHashList.length,
                        index;
                    for (index = 0; index < m && index < synComp.limitUrlSize; index++) {
                        if (index < structHashList.length) {
                            // Enters an invalid url
                            if (stringHashList[index] != synComp.hashmake(structHashList[index])) {
                                var hashStruct = Ext.urlDecode(stringHashList[index]);
                                if (synComp.urlHashValidate(hashStruct)) {
                                    var symPanel = Ext.getCmp(structHashList[index].id),
                                        resultPanel = symPanel.getResultPanel(),
                                        fieldSet = resultPanel.ownerCt.getFieldSet(),
                                        codes = hashStruct.r.split("."),
                                        fodderArray = symPanel.query("grid"),
                                        recoveryFn = function(panel, codeString) {
                                            var storeCount = panel.store.count(),
                                                codeArray = codeString.split("."),
                                                code, isSAF, affixEntry;
                                            for (var t = 0; t < storeCount; t++) {
                                                code = codeArray.shift();
                                                if (code) {
                                                    isSAF = (code.substr(0, 1) == "*");
                                                    affixEntry = abStore.findRecord("code", isSAF ? code.substr(1) : code);
                                                    if (affixEntry) {
                                                        panel.store.getAt(t).data.slot = (isSAF ? synComp.makeFactor(affixEntry.data, true) : affixEntry.data)
                                                    }
                                                } else {
                                                    panel.store.getAt(t).data.slot = null
                                                }
                                            }
                                            panel.getView().refresh()
                                        };
                                    recoveryFn(fodderArray[0], hashStruct.s);
                                    for (var f = 1; f <= synComp.maxMaterial; f++) {
                                        recoveryFn(fodderArray[f], hashStruct[f])
                                    }
                                    resultPanel.suspendCheckChange = 1;
                                    resultPanel.ownerCt.updateResults();
                                    fieldSet.items.each(function(checkbox) {
                                        checkbox.suspendCheckChange = 1;
                                        if (0 <= codes.indexOf(checkbox.inputValue)) {
                                            checkbox.setValue(true);
                                            resultPanel.addAbility(checkbox, true)
                                        } else {
                                            checkbox.setValue(false);
                                            resultPanel.removeAbility(checkbox, true)
                                        }
                                        checkbox.suspendCheckChange = 0
                                    });
                                    resultPanel.refresh();
                                    synComp.updateCheckbox(resultPanel, fieldSet);
                                    Ext.Array.forEach(hashStruct.o.split("."), function(p) {
                                        resultPanel.selectOption(p)
                                    });
                                    resultPanel.refresh();
                                    synComp.updateCheckbox(resultPanel, fieldSet);
                                    resultPanel.suspendCheckChange = 0;
                                    synComp.hashcopy(hashStruct, structHashList[index])
                                }
                            }
                        } else {
                            var hashStruct = Ext.urlDecode(stringHashList[index]);
                            synComp.initializedRestoreData = true;
                            try {
                                synComp.hashcopy(hashStruct, synComp.addLocationHash(synComp.addTab(hashStruct), true))
                            } finally {
                                synComp.initializedRestoreData = false
                            }
                        }
                    }
                    if (index < structHashList.length) {
                        var a = [];
                        while (index != structHashList.length) {
                            a.push((structHashList.pop())["id"])
                        }
                        Ext.Array.forEach(a, function(s) {
                            var p = Ext.getCmp(s);
                            if (p) {
                                p.close()
                            }
                        })
                    }
                }
            }
        }
    },
    hasharray: function(panelCode) {
        var synComp = this,
            hashStruct = [panelCode.s, panelCode.r];
        for (var index = 1; index <= synComp.maxMaterial; index++) {
            hashStruct.push(panelCode[index])
        }
        return hashStruct
    },
    hashmake: function(d) {
        var synComp = this,
            hashString = "";
        hashString += synComp.makeHashParameter(d, "s");
        for (var index = 1; index <= synComp.maxMaterial; index++) {
            hashString += "&" + synComp.makeHashParameter(d, index)
        }
        hashString += "&" + synComp.makeHashParameter(d, "r");
        hashString += "&" + synComp.makeHashParameter(d, "o");
        return hashString
    },
    hashcopy: function(d, basicPanel) {
        var synComp = this,
            index;
        basicPanel.s = d.s;
        basicPanel.r = d.r;
        basicPanel.o = d.o;
        for (index = 1; index <= synComp.maxMaterial; index++) {
            basicPanel[index] = d[index]
        }
    },
    makeHashParameter: function(hashStruct, field) {
        return field + "=" + (hashStruct[field] ? hashStruct[field] : "")
    }
});