/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.ns("PSO2");

Ext.chart.theme.Browser = Ext.extend(Ext.chart.theme.Base, {
    constructor: function(a) {
        Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
            colors: ["rgb(0, 0, 255)", "rgb(127, 255, 0)", "rgb(255, 215, 0)", "rgb(255, 165, 0)", "rgb(255, 69, 0)", "rgb(128, 10, 128)", "rgb(128, 0, 0)", "rgb(64, 64, 64)", "rgb(0, 0, 0)", "rgb(32, 0, 0)"]
        }, a))
    }
});

Ext.define("PSO2.ResultPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.resultpanel",
    layout: "anchor",
    baseCls: Ext.baseCSSPrefix + "panel-body-default-framed " + Ext.baseCSSPrefix + "resultpanel",
    xtype: "resultpanel",
    padding: "0",
    autoHeight: true,
    suspendCheckChange: 0,
    constViewPanel: "-viewpanel",
    constSelOption1: "-selopt-1",
    constSelOption2: "-selopt-2",
    constSelOption3: "-selopt-3",
    constChkOption1: "-chkopt-1",
    constSuccessPanel: "-successpanel",
    emptyText: "&nbsp;",
    dodoButtonText: "Dudu It",
    redodoButtonText: "Dudu It Again",
    moreButtonText: "Success or +10,000",
    moreDodoLimit: 10000,
    monimoniButtonText: "Details",
    abText: ["S-ATK", "R-ATK", "T-ATK", "S-DEF", "R-DEF", "T-DEF", "DEX", "HP", "PP", "Strike Resist", "Range Resist", "Tech Resist", "Fire Resist", "Ice Resist", "Lightning Resist", "Wind Resist", "Light Resist", "Dark Resist"],
    allUp: ["S-ATK", "R-ATK", "T-ATK", "S-DEF", "R-DEF", "T-DEF", "DEX"],
    resistAll: ["Strike Resist", "Range Resist", "Tech Resist", "Fire Resist", "Ice Resist", "Lightning Resist", "Wind Resist", "Light Resist", "Dark Resist"],
    optionStore1: Ext.create("Ext.data.Store", {
        fields: ["id", "name", "value", "fn"],
        data: {}
    }),
    initOption1Value: "A01",
    optionStore2: Ext.create("Ext.data.Store", {
        fields: ["id", "name", "value", "extend", "effect"],
        data: {}
    }),
    excludePattern: [],
    initOption2Value: "B01",
    optionStore3: Ext.create("Ext.data.Store", {
        fields: ["id", "name", "value", "fn"],
        data: {}
    }),
    initOption3Value: "C01",
    totalValue: 0,
    sameBonusText: "Same Item Boost",
    sameBonusBoost: [1, 1.1, 1.15],
    calcSameBonus: function(rateMap, sameCount) {
        var resultPanel = this;
        return Math.min(parseInt(rateMap.success * resultPanel.sameBonusBoost[PSO2.utils.overflow(resultPanel.sameBonusBoost.length, sameCount + 1, 1)]), 100)
    },
    initComponent: function() {
        var resultPanel = this;
        resultPanel.abilitySet = Ext.create("PSO2.AbilitySet", {
            abilityComponent: resultPanel.abilityComponent,
            abilityStore: resultPanel.abilityComponent.getAbilityStore()
        });
        if (resultPanel.supportData) {
            resultPanel.optionStore1.loadData(resultPanel.supportData)
        }
        if (resultPanel.additionalData) {
            resultPanel.optionStore2.loadData(resultPanel.additionalData)
        }
        if (resultPanel.potentialData) {
            resultPanel.optionStore3.loadData(resultPanel.potentialData)
        }
        this.addEvents("opt1change", "opt2change", "opt3change", "dodochange", "successchange");
        resultPanel.callParent(arguments)
    },
    initItems: function() {
        var resultPanel = this;
        resultPanel.resultItems = [];
        resultPanel.optionItems = [];
        resultPanel.successStore = Ext.create("Ext.data.ArrayStore", {
            autoDestroy: true,
            storeId: resultPanel.id + "-store",
            idIndex: 0,
            fields: [{
                name: "name",
                type: "string"
            }, {
                name: "success",
                type: "numeric"
            }]
        });
        resultPanel.viewPanel = Ext.create("Ext.view.View", {
            autoWidth: true,
            autoHeight: true,
            store: resultPanel.successStore,
            tpl: ['<table style="width:100%">', '<tpl for=".">', '<tr id="success">', '<td style="width:50%;padding-bottom:5px">{name}</td>', '<td style="width:50%;padding-bottom:5px">{success}%</td>', "</tr>", "</tpl>", "</table>", '<div style="clear:both"></div>'],
            itemSelector: "tr#success"
        });
        resultPanel.selOpt1 = resultPanel.createComboBox(resultPanel.constSelOption1, resultPanel.optionStore1, resultPanel.initOption1Value, "opt1change");
        resultPanel.selOpt2 = resultPanel.createComboBox(resultPanel.constSelOption2, resultPanel.optionStore2, resultPanel.initOption2Value, "opt2change", function(comboBox) {
            if (comboBox.value == null || comboBox.originalValue == comboBox.value) {
                this.optionItems = []
            } else {
                this.optionItems = [this.getSelectOptionRecord(comboBox)]
            }
        });
        resultPanel.selOpt3 = resultPanel.createComboBox(resultPanel.constSelOption3, resultPanel.optionStore3, resultPanel.initOption3Value, "opt3change");
        var checkboxID = resultPanel.id + resultPanel.constChkOption1;
        resultPanel.chkOpt1 = Ext.create("Ext.form.Checkbox", {
            id: checkboxID,
            labelWidth: 98,
            fieldLabel: resultPanel.sameBonusText,
            autoEl:{
                'data-qtip': 'Bonus Multiplier if all items are the same.<br>1.1x for 2 items, 1.15x for 3 or more'
            },
            getSameCount: function() {
                if (!this.checked) {
                    return 0
                }
                var abSet = resultPanel.abilitySet,
                    numStore = abSet.stores.length,
                    index, count = 0;
                for (index = 0; index < numStore; index++) {
                    count += abSet.stores[index].exist() ? 1 : 0
                }
                return Math.max(0, count - 1)
            },
            listeners: {
                scope: resultPanel,
                change: function(e, f, c, d) {
                    this.refresh()
                }
            }
        });
        resultPanel.successPanel = Ext.create("Ext.panel.Panel", {
            id: resultPanel.id + resultPanel.constSuccessPanel,
            xtype: "panel",
            html: resultPanel.emptyText,
            style: {
                textAlign: "right"
            },
            padding: "0 0 5 0",
            anchor: "100%"
        });
        resultPanel.dodoButton = Ext.create("Ext.button.Button", {
            xtype: "button",
            text: resultPanel.dodoButtonText,
            anchor: "70%",
            disabled: true,
            scope: resultPanel,
            handler: resultPanel.onClickDoDo
        });
        resultPanel.patternButton = Ext.create("Ext.button.Button", {
            xtype: "button",
            text: resultPanel.monimoniButtonText,
            anchor: "30%",
            disabled: true,
            scope: resultPanel,
            handler: resultPanel.onClickPattern
        });
        resultPanel.items = [resultPanel.viewPanel, resultPanel.selOpt1, resultPanel.selOpt2, resultPanel.selOpt3, resultPanel.chkOpt1, resultPanel.successPanel, resultPanel.dodoButton, resultPanel.patternButton];
        resultPanel.prefixOptions = resultPanel.prefixOptions || {};
        resultPanel.prefixOptions[resultPanel.initOption1Value.charAt(0)] = resultPanel.selOpt1;
        resultPanel.prefixOptions[resultPanel.initOption2Value.charAt(0)] = resultPanel.selOpt2;
        resultPanel.prefixOptions[resultPanel.initOption3Value.charAt(0)] = resultPanel.selOpt3;
        resultPanel.callParent(arguments)
    },
    createComboBox: function(comboBoxID, optStore, initValue, event, func) {
        var resultPanel = this;
        return Ext.create("Ext.form.field.ComboBox", {
            id: resultPanel.id + comboBoxID,
            store: optStore,
            displayField: "id",
            forceSelection: true,
            editable: false,
            queryMode: "local",
            valueField: "value",
            value: initValue,
            typeAhead: true,
            anchor: "100%",
            disabled: true,
            listeners: {
                scope: resultPanel,
                change: function(comboBox, menuItem) {
                    if (Ext.isFunction(func)) {
                        func.call(this, comboBox)
                    }
                    if (menuItem !== true) {
                        this.refresh();
                        this.fireEvent(event, this, comboBox, comboBox.originalValue == comboBox.value)
                    }
                }
            }
        })
    },
    bindStore: function(store) {
        var resultPanel = this;
        return resultPanel.abilitySet.putStore(store)
    },
    // Get the object of the current option selected in the drop down menu
    getSelectOptionRecord: function(comboBox) {
        return comboBox.findRecord("value", comboBox.getValue())
    },
    // Set drop down menu to item
    selectOption: function(ddItem) {
        var resultPanel = this,
            comboBox = resultPanel.prefixOptions[ddItem.charAt(0)];
        if (comboBox) {
            comboBox.select(ddItem)
        }
    },
    boostRate: function(successItem){
        var resultPanel = this,
        sameItemCount = resultPanel.chkOpt1.getSameCount(),        
        haveGuid = resultPanel.abilitySet.isGuidanceTrainer();

        var itemBoostFn = function(rate){
            var boost = resultPanel.getSelectOptionRecord(resultPanel.selOpt1).get("boost");
            return Math.min(rate + boost, 100);
        }

        var potBoostFn = function(rate){
            var boost = resultPanel.getSelectOptionRecord(resultPanel.selOpt3).get("boost");
            return Math.min(rate + boost, 100);
        }

        successRate = resultPanel.calcSameBonus(successItem, sameItemCount);
        successRate = itemBoostFn(successRate);
        successRate = potBoostFn(successRate);
        if (resultPanel.boostFunction) {
            successRate = resultPanel.boostFunction(successRate)
        }
        if (resultPanel.boostDayFunction) {
            successRate = resultPanel.boostDayFunction(successRate, successItem.name)
        }
        if(haveGuid) successRate = Math.min(successRate + 5, 100);
        return successRate;
    },
    refresh: function() {
        var resultPanel = this,
            dataView = resultPanel.viewPanel,
            successPanel = resultPanel.successPanel,
            // Functions of the options selected in the menu (refer to json)
            itemCount, overallRate = 100,
            m = [],
            successRate;
        resultPanel.successStore.loadData(m);
        resultPanel.successItems = resultPanel.abilityComponent.getSuccessList(resultPanel.abilitySet, resultPanel.resultItems, resultPanel.optionItems);
        for (itemCount = 0; itemCount < resultPanel.successItems.length; itemCount++) {
            successRate = resultPanel.boostRate(resultPanel.successItems[itemCount]);
            m.push([resultPanel.successItems[itemCount]["name"], successRate]);
            overallRate *= successRate
        }
        if (0 < m.length) {
            resultPanel.successStore.loadData(m)
        }
        var prevTotalRate = resultPanel.totalValue;
        if (resultPanel.successItems.length == 0) {
            resultPanel.totalValue = 0;
            successPanel.update(resultPanel.emptyText)
        } else {
            resultPanel.totalValue = overallRate / Math.pow(100, itemCount);
            successPanel.update(resultPanel.totalValue + "%")
        }
        resultPanel.enableDoDoButton();
        resultPanel.enableOptionsSelect();
        if (prevTotalRate != resultPanel.totalValue) {
            resultPanel.fireEvent("successchange", resultPanel, resultPanel.totalValue, prevTotalRate)
        }
    },
    // Returns true if there is at least 1 material and at least 1 affix is selected
    isDodo: function() {
        var resultPanel = this;
        return (0 < resultPanel.abilitySet.enableMaterialMaxCount() && 1 <= resultPanel.abilityCount())
    },
    enableDoDoButton: function() {
        var resultPanel = this,
            duduButton = resultPanel.dodoButton,
            detailButton = resultPanel.patternButton,
            isDuduDisable = duduButton.isDisabled();
        if (resultPanel.isDodo()) {
            duduButton.enable();
            detailButton.enable();
            if (isDuduDisable) {
                resultPanel.fireEvent("dodochange", resultPanel, true, false)
            }
        } else {
            duduButton.disable();
            detailButton.disable();
            if (!isDuduDisable) {
                resultPanel.fireEvent("dodochange", resultPanel, false, true)
            }
        }
    },
    // Return the number of affixes selected (selected + added via items)
    abilityCount: function() {
        var resultPanel = this;
        return resultPanel.resultItems.length + resultPanel.optionItems.length
    },
    enableOptionsSelect: function() {
        var resultPanel = this;
        // Enable success boosters and zenesis if at least 1 affix, else resset and disable
        if (0 < resultPanel.abilityCount()) {
            resultPanel.selOpt1.enable();
            resultPanel.selOpt3.enable();
        } else {
            resultPanel.selOpt1.select(resultPanel.optionStore1.getAt(0));
            resultPanel.selOpt1.disable();
            resultPanel.selOpt3.select(resultPanel.optionStore3.getAt(0));
            resultPanel.selOpt3.disable();
        }
        // If there is less affix than max, allow add item
        if (resultPanel.resultItems.length < resultPanel.abilitySet.enableMaterialMaxCount()) {
            resultPanel.selOpt2.enable()
        } else {
            resultPanel.selOpt2.disable()
        }
    },
    // Removes all affixes from result panel and reset add item option
    removeAll: function() {
        var resultPanel = this;
        resultPanel.resultItems = [];
        resultPanel.abilitySet.resetAbility();
        resultPanel.selOpt2.select(resultPanel.optionStore2.getAt(0))
    },
    updateResults: function(selectionPanel) {
        var resultPanel = this,
            affixList = [],
            rateMap;
        if (!selectionPanel.rendered) {
            return false
        }
        selectionPanel.removeAll(true);
        resultPanel.removeAll();
        resultPanel.abilitySet.forEach(function(affixEntry, isSAF) {
            if (isSAF !== true) {
                affixList.push(affixEntry)
            }
        }, resultPanel);
        rateMap = resultPanel.abilityComponent.getSuccessList2(resultPanel.abilitySet, affixList);
        resultPanel.abilitySet.forEach(function(affixEntry, isSAF) {
            if (isSAF) {
                selectionPanel.add({
                    fieldStyle: "float:left",
                    boxLabel: '<p class="x-factor-icon" style="float:left;margin-left:2px;padding-left:16px">' + affixEntry.name + '</p><p style="float:right;padding-right:3px">100%</p>',
                    inputValue: "*" + affixEntry.code,
                    abilityData: affixEntry,
                    resultPanel: resultPanel,
                    fieldSet: selectionPanel
                })
            } else {
                // If rate is not 0, add to selection list
                if (rateMap[affixEntry.code]) {
                    selectionPanel.add({
                        fieldStyle: "float:left",
                        boxLabel: '<p style="float:left;padding-left:3px">' + affixEntry.name + '</p><p style="float:right;padding-right:3px">' + rateMap[affixEntry.code] + "%</p>",
                        inputValue: affixEntry.code,
                        abilityData: affixEntry,
                        resultPanel: resultPanel,
                        fieldSet: selectionPanel
                    })
                }
            }
        }, resultPanel);
        resultPanel.refresh()
    },
    // Get max amount of affix can be selected
    getEnableMaxCount: function() {
        return this.abilitySet.enableMaterialMaxCount()
    },
    // Get all affixes selected from the selection panel
    getValues: function() {
        var resultPanel = this,
            a = [];
        Ext.Array.forEach(resultPanel.resultItems, function(c) {
            a.push(c.inputValue)
        });
        return a
    },
    // Returns true if two affix codes are excluded from each other, false otherwise
    isExcludePattern: function(code1, code2) {
        var resultPanel = this,
            allExclude = Ext.isArray(resultPanel.excludePattern) ? resultPanel.excludePattern : [resultPanel.excludePattern];
        var exPatternLen = allExclude.length,
            codeHeader1 = code1.substr(0, 1) == "*" ? code1.substr(1, 2) : code1.substr(0, 2),
            codeHeader2 = code2.substr(0, 1) == "*" ? code2.substr(1, 2) : code2.substr(0, 2),
            regex = /([^\*]+)\*$/,
            resRegex, headMatch = function(excludePattern, codeHeader) {
                if (resRegex = excludePattern.match(regex)) {
                    return excludePattern.substr(0, resRegex[1].length) == codeHeader.substr(0, resRegex[1].length)
                }
                return excludePattern == codeHeader
            };
        // Trigger by SAF
        if (codeHeader1 == codeHeader2) {
            return true
        }
        for (var e = 0; e < exPatternLen; e++) {
            var excludePattern = allExclude[e],
                firstMatch = false;
            excludePattern = Ext.isArray(excludePattern) ? excludePattern : [excludePattern];
            for (var index = 0; index < excludePattern.length; index++) {
                firstMatch = headMatch(excludePattern[index], codeHeader1);
                if (firstMatch) {
                    break
                }
            }
            if (firstMatch) {
                for (var index = 0; index < excludePattern.length; index++) {
                    if (headMatch(excludePattern[index], codeHeader2)) {
                        return true
                    }
                }
            }
        }
        return false
    },
    // Adds affix the result page, returns count
    addAbility: function(selAffix, needRefresh) {
        var resultPanel = this,
            removeList = [],
            resItemLen = resultPanel.resultItems.length;
        for (var index = 0; index < resItemLen; index++) {
            if (resultPanel.isExcludePattern(selAffix.inputValue, resultPanel.resultItems[index].inputValue)) {
                removeList.push(resultPanel.resultItems[index])
            }
        }
        for (var index = 0; index < removeList.length; index++) {
            removeList[index].setValue(false)
        }
        resultPanel.resultItems.push(selAffix);
        if (needRefresh !== true) {
            resultPanel.refresh()
        }
        return resultPanel.abilityCount()
    },
    removeAbility: function(deselAffix, needRefresh) {
        var resultPanel = this,
            b = Ext.Array.indexOf(resultPanel.resultItems, deselAffix);
        if (0 <= b) {
            resultPanel.resultItems.splice(b, 1);
            if (needRefresh !== true) {
                resultPanel.refresh()
            }
        }
        return resultPanel.abilityCount()
    },
    // The Dudu button. Return true is all affix pass, else false. Array pass in are modified
    doDo: function(success, fail) {
        var resultPanel = this,
            selAffixList = resultPanel.successItems,
            selAffixLen = selAffixList.length,
            affixRate;
        if (0 < selAffixLen) {
            for (var index = 0; index < selAffixLen; index++) {
                affixRate = resultPanel.boostRate(selAffixList[index]);
                if (100 <= affixRate || Math.floor(Math.random() * 100) < affixRate) {
                    success.push({
                        fieldLabel: selAffixList[index].name,
                        name: (resultPanel.id + "-" + index),
                        value: affixRate + "%"
                    })
                } else {
                    fail.push({
                        fieldLabel: selAffixList[index].name,
                        name: (resultPanel.id + "-" + index),
                        value: affixRate + "%"
                    })
                }
            }
        }
        return (0 < success.length) && (fail.length == 0)
    },
    // Calculate how many complete success over total attempt
    getTotalSuccess: function(totalSuccess, noTotalSuccess) {
        var a = "Total: " + totalSuccess + " / " + (totalSuccess + noTotalSuccess) + " = ";
        if (totalSuccess == 0) {
            a += "0%"
        } else {
            a += Ext.util.Format.number((totalSuccess / (totalSuccess + noTotalSuccess)) * 100, "0.000") + "%"
        }
        return a
    },
    // Use for calculate cost feature, returns what items are being used
    selectedOptions: function() {
        var resultPanel = this;
        return [resultPanel.selOpt1.value, resultPanel.selOpt2.value, resultPanel.selOpt3.value]
    },
    onClickDoDo: function() {
        var resultPanel = this;
        if (0 < resultPanel.items.length) {
            var fail = [],
                success = [],
                isCompleteSuccess = resultPanel.doDo(fail, success);
            resultPanel.win = Ext.create("widget.window", {
                title: "Synthesis Results",
                autoDestroy: true,
                closable: true,
                closeAction: "destroy",
                width: resultPanel.noDD === true ? Ext.getBody().getWidth() : Math.min(Ext.getBody().getWidth(), 600),
                height: 148 + (fail.length + success.length) * 26,
                modal: true,
                successNum: isCompleteSuccess ? 1 : 0,
                failNum: isCompleteSuccess ? 0 : 1,
                layout: "anchor",
                bodyStyle: "padding: 5px;",
                defaults: {
                    anchor: "100%"
                },
                items: [{
                    xtype: "fieldset",
                    frame: true,
                    title: "Addition Successful",
                    margins: "0 5 0 5",
                    layout: "anchor",
                    autoHeight: true,
                    defaultType: "textfield",
                    defaults: {
                        readOnly: true,
                        labelWidth: resultPanel.noDD === true ? (Ext.getBody().getWidth() / 2) : 140,
                        anchor: "100%"
                    },
                    items: fail
                }, {
                    xtype: "fieldset",
                    frame: true,
                    title: "Addition Failed",
                    margins: "0 5 0 5",
                    layout: "anchor",
                    autoHeight: true,
                    defaultType: "textfield",
                    defaults: {
                        readOnly: true,
                        labelWidth: resultPanel.noDD === true ? (Ext.getBody().getWidth() / 2) : 140,
                        anchor: "100%"
                    },
                    items: success
                }],
                dockedItems: [{
                    xtype: "toolbar",
                    ui: "footer",
                    dock: "bottom",
                    items: [{
                        xtype: "label",
                        readOnly: true,
                        textAlign: "right",
                        html: resultPanel.getTotalSuccess(isCompleteSuccess ? 1 : 0, isCompleteSuccess ? 0 : 1),
                        bodyStyle: {
                            "float": "hidden"
                        }
                    }, "->", Ext.create("Ext.button.Button", {
                        text: resultPanel.redodoButtonText,
                        scope: resultPanel,
                        handler: function() {
                            var success = [],
                                fail = [],
                                fieldset = this.win.query("fieldset"),
                                totalLabel = this.win.query("toolbar")[0].query("label");
                            if (this.doDo(success, fail)) {
                                this.win.successNum++
                            } else {
                                this.win.failNum++
                            }
                            fieldset[0].removeAll();
                            fieldset[0].add(success);
                            fieldset[1].removeAll();
                            fieldset[1].add(fail);
                            totalLabel[0].update(this.getTotalSuccess(this.win.successNum, this.win.failNum))
                        },
                        minWidth: 64
                    }), Ext.create("Ext.button.Button", {
                        text: resultPanel.moreButtonText,
                        scope: resultPanel,
                        handler: function() {
                            var success = [],
                                fail = [],
                                fieldset = this.win.query("fieldset"),
                                totalLabel = this.win.query("toolbar")[0].query("label"),
                                count = this.moreDodoLimit;
                            while (!this.doDo(success, fail) && count--) {
                                this.win.failNum++;
                                success = [];
                                fail = []
                            }
                            if (fail.length == 0) {
                                this.win.successNum++
                            }
                            fieldset[0].removeAll();
                            fieldset[0].add(success);
                            fieldset[1].removeAll();
                            fieldset[1].add(fail);
                            totalLabel[0].update(this.getTotalSuccess(this.win.successNum, this.win.failNum))
                        },
                        minWidth: 64
                    }), Ext.create("Ext.button.Button", {
                        text: "Close",
                        scope: resultPanel,
                        handler: function() {
                            if (this.win) {
                                this.win.close()
                            }
                            delete this.win;
                            this.win = null
                        },
                        minWidth: 64
                    })]
                }]
            }).show()
        }
    },
    // Count the number of bits - 1
    popCnt: function(numFail) {
        numFail >>>= 0;
        for (var a = 0; numFail; numFail &= numFail - 1) {
            a++
        }
        return a
    },
    // Calculate the probability of complete success (in decimal)
    probability: function(rateArray) {
        var len = rateArray.length,
            totalRate = 1;
        for (var c = 0; c < len; c++) {
            totalRate *= rateArray[c]
        }
        return totalRate / Math.pow(100, len)
    },
    // Calculate the total chance of a scenario
    addition: function(chance) {
        var len = chance.length,
            c = 0;
        for (var b = 0; b < len; b++) {
            c += chance[b]
        }
        return c
    },
    // Returns the overall success rate when numFail affixes failed
    getSuccessPattern: function(numFail, rateList, itemBoostFn) {
        var resultPanel = this,
            rateLen = rateList.length,
            possibleSet = 1 << rateLen,
            allScenario = [];
        for (var set = 0; set < possibleSet; set++) {
            if (numFail == resultPanel.popCnt(set)) {
                var scenario = [];
                for (var index = 0; index < rateLen; index++) {
                    if (set & (1 << index)) {
                        // Fail
                        scenario.push(100 - itemBoostFn(rateList[index]))
                    } else {
                        // Success
                        scenario.push(itemBoostFn(rateList[index]))
                    }
                }
                allScenario.push(resultPanel.probability(scenario))
            }
        }
        return resultPanel.addition(allScenario)
    },
    // Calculate the total stats boost from all the affixes and store in the array
    addAbilityParameter: function(overallStat, stat, value) {
        var resultPanel = this;
        if (stat == "ALL") {
            for (var b = 0; b < resultPanel.allUp.length; b++) {
                resultPanel.addAbilityParameter(overallStat, resultPanel.allUp[b], value)
            }
        } else {
            if (stat == "All Resist") {
                for (var b = 0; b < resultPanel.resistAll.length; b++) {
                    resultPanel.addAbilityParameter(overallStat, resultPanel.resistAll[b], value)
                }
            } else {
                if (!overallStat[stat]) {
                    overallStat[stat] = 0
                }
                overallStat[stat] += value
            }
        }
    },
    // onClick 'Details" button
    onClickPattern: function() {
        var resultPanel = this;
        if (0 < resultPanel.items.length) {
            var affixList = resultPanel.successItems, // Contains name & success rate
                tabs = [],
                col = [],
                colHead = [];
            tabs.push(resultPanel.getSpecInfo(affixList));
            tabs.push(resultPanel.getSuccessTable(affixList, col, colHead));
            tabs.push(resultPanel.getSuccessGraph(affixList, col, colHead));
            tabs.push(resultPanel.getOrderView(affixList));
            resultPanel.win = Ext.create("widget.window", {
                title: "Data Monitor",
                autoDestroy: true,
                closable: true,
                closeAction: "destroy",
                width: resultPanel.noDD === true ? Ext.getBody().getWidth() : 600,
                autoHeight: true,
                modal: true,
                layout: "fit",
                bodyStyle: "padding: 5px;",
                items: Ext.createWidget("tabpanel", {
                    activeTab: 0,
                    defaults: {
                        bodyPadding: 5
                    },
                    items: tabs
                }),
                dockedItems: [{
                    xtype: "toolbar",
                    ui: "footer",
                    dock: "bottom",
                    items: ["->", Ext.create("Ext.button.Button", {
                        text: "Close",
                        scope: resultPanel,
                        handler: function() {
                            if (this.win) {
                                this.win.close()
                            }
                            delete this.win;
                            this.win = null
                        },
                        minWidth: 105
                    })]
                }]
            }).show()
        }
    },
    // Produce stats table
    getSpecInfo: function(abilityList) {
        var resultPanel = this,
            abStore = resultPanel.abilitySet.abilityStore,
            abilityEntry, abilityEffect, affixBreakdown, overallStat = {},
            text = [],
            regex = new RegExp("([^\\(]+)\\(([\\+\\-]\\d+)\\)"),
            abilityListLen = abilityList.length,
            outputText = "";
        for (var index = 0; index < abilityListLen; index++) {
            abilityEntry = abStore.findRecord("name", abilityList[index].name) || resultPanel.optionStore2.findRecord("name", abilityList[index].name);
            abilityEffect = abilityEntry.get("effect").replace(/<br>/g, ",").split(",");
            for (j = 0; j < abilityEffect.length; j++) {
                affixBreakdown = abilityEffect[j].match(regex);
                if (affixBreakdown && affixBreakdown.length == 3) {
                    resultPanel.addAbilityParameter(overallStat, affixBreakdown[1], parseInt(affixBreakdown[2]))
                } else {
                    if (affixBreakdown === null) {
                        text.push(abilityEffect[j])
                    }
                }
            }
        }
        // Output stat info
        for (var index = 0; index < resultPanel.abText.length; index++) {
            if (overallStat[resultPanel.abText[index]]) {
                if (0 < overallStat[resultPanel.abText[index]]) {
                    outputText += "<div>" + resultPanel.abText[index] + '<span style="color:red;font-weight:bold">&nbsp;&nbsp;(+' + Math.abs(overallStat[resultPanel.abText[index]]) + ")</span></div>"
                } else {
                    outputText += "<div>" + resultPanel.abText[index] + '<span style="color:blue;font-weight:bold">&nbsp;&nbsp;(-' + Math.abs(overallStat[resultPanel.abText[index]]) + ")</span></div>"
                }
            }
        }
        // Output text info
        for (var index = 0; index < text.length; index++) {
            outputText += "<div>" + text[index] + "</div>"
        }
        return {
            title: "Abilities",
            html: outputText
        }
    },
    // Produce table of the success rate in the details tab
    getSuccessTable: function(abilityListLen, col, colHead) {
        var resultPanel = this,
            rateList = [],
            potBoostFn = function(rate){
                var boost = resultPanel.getSelectOptionRecord(resultPanel.selOpt3).get("boost");
                return Math.min(rate + boost, 100);
            },
            len = abilityListLen.length,
            optItem1List = resultPanel.selOpt1.store,
            opt1Len = optItem1List.count(),
            rate;
        for (var index = 0; index < len; index++) {
            rate = resultPanel.calcSameBonus(abilityListLen[index], resultPanel.chkOpt1.getSameCount());
            rate = potBoostFn(rate);
            if (resultPanel.boostFunction) {
                rate = resultPanel.boostFunction(rate)
            }
            if (resultPanel.boostDayFunction) {
                rate = resultPanel.boostDayFunction(rate, abilityListLen[index].name)
            }
            rateList.push(rate)
        }
        var tableHtml = '<table id="ps"><tr><td id="psh"></td>';
        for (var index = 0; index < opt1Len; index++) {
            rec = optItem1List.getAt(index);
            tableHtml += '<td id="psh" style="width:' + parseInt(88 / opt1Len) + '%">' + rec.get("name") + "</td>"
        }
        tableHtml += "</tr>";
        var rowHeader;
        for (var index = 0; index <= len; index++) {
            if (index == 0) {
                rowHeader = "Success"
            } else {
                if (index == len) {
                    rowHeader = "Complete Failure"
                } else {
                    rowHeader = index + "Failure(s)"
                }
            }
            tableHtml += '<tr><td id="ps">' + rowHeader + "</td>";
            colHead.push(rowHeader);
            for (j = 0; j < opt1Len; j++) {
                var itemBoostFn = function(rate){
                    var boost = optItem1List.getAt(j).get("boost");
                    return Math.min(rate + boost, 100);
                }
                var scenarioRate = resultPanel.getSuccessPattern(index, rateList, itemBoostFn);
                tableHtml += "<td";
                if (scenarioRate == 1) {
                    tableHtml += ' id="bold"'
                } else {
                    if (0.8 < scenarioRate) {
                        tableHtml += ' id="high"'
                    } else {
                        if (scenarioRate < 0.1) {
                            tableHtml += ' id="low"'
                        }
                    }
                }
                tableHtml += ">" + Ext.util.Format.number(scenarioRate * 100, "0.000") + "%</td>";
                col[j] = col[j] || {};
                if (index == 0) {
                    col[j]["name"] = optItem1List.getAt(j).get("name")
                }
                col[j][rowHeader] = scenarioRate * 100
            }
            tableHtml += "</tr>"
        }
        tableHtml += "</table>";
        return {
            title: "Success Rate Pattern",
            html: tableHtml
        }
    },
    // Produce success graph in the detail tab
    getSuccessGraph: function(abilityList, col, colHead) {
        var len = abilityList.length;
        return {
            xtype: "chart",
            title: "Success Rate Graph",
            height: 160 + 24 * len,
            style: "background:#fff",
            animate: true,
            theme: "Browser:gradients",
            defaultInsets: 30,
            store: Ext.create("Ext.data.JsonStore", {
                fields: colHead,
                data: col
            }),
            legend: {
                position: "right"
            },
            axes: [{
                type: "Numeric",
                position: "left",
                fields: colHead,
                title: "Lost %",
                grid: true,
                decimals: 0,
                minimum: 0,
                maximum: 100
            }, {
                type: "Category",
                position: "bottom",
                fields: ["name"],
                title: "Usage"
            }],
            series: [{
                type: "area",
                axis: "left",
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 170,
                    height: 28,
                    renderer: function(colData, point) {
                        this.setTitle(point.storeField + " - " + Ext.util.Format.number(colData.get(point.storeField), "0.000") + "%")
                    }
                },
                xField: "name",
                yField: colHead,
                style: {
                    lineWidth: 1,
                    stroke: "#666",
                    opacity: 0.86
                }
            }]
        }
    },
    // Produce the order view tab. 
    // Display how the affix would look like base on selection order
    getOrderView: function(abilityList) {
        var resultPanel = this,
            len = abilityList.length,
            htmlAffixList = [],
            fieldset;
        for (var index = 0; index < len; index++) {
            htmlAffixList.push({
                html: abilityList[index]["name"]
            })
        }
        fieldset = Ext.create("Ext.form.FieldSet", {
            frame: true,
            title: "Special Abilities",
            margins: "0",
            width: "100%",
            layout: "column",
            autoHeight: true,
            defaults: {
                columnWidth: 0.5,
                border: 0,
                margin: "5 0 10 0",
                cls: "x-order-ability"
            },
            viewLimit: -1,
            viewAbility: false,
            stackAbility: [],
            capacityOver: false,
            items: htmlAffixList,
            getCount: function() {
                return this.items.length + this.stackAbility.length
            }
        });
        return {
            xtype: "panel",
            title: "Order",
            layout: "column",
            items: [{
                xtype: "checkbox",
                boxLabel: "Potential/Timed Ability",
                fs: fieldset,
                listeners: {
                    scope: resultPanel,
                    change: function(comboBox, curOpt, prevOpt, resultPanel) {
                        fieldset.viewAbility = curOpt;
                        resultPanel.updateOrderView(fieldset, curOpt != prevOpt)
                    }
                }
            }, Ext.create("Ext.form.field.ComboBox", {
                fs: fieldset,
                style: "marginLeft: 15px",
                store: Ext.create("Ext.data.ArrayStore", {
                    autoDestroy: true,
                    fields: [{
                        name: "id",
                        type: "numeric"
                    }, {
                        name: "name",
                        type: "string"
                    }],
                    data: [
                        [-1, "Default"],
                        [6, "6 Slots"],
                        [8, "8 Slots"]
                    ]
                }),
                displayField: "name",
                forceSelection: true,
                editable: false,
                queryMode: "local",
                valueField: "id",
                value: fieldset.viewLimit,
                typeAhead: true,
                anchor: "100%",
                listeners: {
                    scope: resultPanel,
                    change: function(checkBox, curIsCheck, g, resultPanel) {
                        fieldset.viewLimit = curIsCheck;
                        resultPanel.updateOrderView(fieldset, false)
                    }
                }
            }), fieldset]
        }
    },
    // Update order display when comboBox change and/or timed ability is select
    updateOrderView: function(fieldset, showTimed) {
        var b = fieldset.getCount();
        if (showTimed) {
            if (fieldset.viewAbility) {
                fieldset.insert(0, {
                    html: "Potential/Timed Ability",
                    cls: "x-order-with-ability"
                })
            } else {
                fieldset.remove(fieldset.items.getAt(0))
            }
        }
        if (fieldset.capacityOver) {
            fieldset.remove(fieldset.items.getAt(fieldset.items.length - 1));
            for (; 0 < fieldset.stackAbility.length;) {
                fieldset.add(fieldset.stackAbility.pop())
            }
        }
        if (fieldset.viewLimit != -1) {
            if (fieldset.viewLimit < fieldset.getCount()) {
                for (; fieldset.viewLimit <= fieldset.items.length;) {
                    var fieldsetItem = fieldset.items.getAt(fieldset.items.length - 1);
                    fieldset.stackAbility.push({
                        html: fieldsetItem.el.dom.textContent
                    });
                    fieldset.remove(fieldsetItem)
                }
            } else {
                for (; fieldset.items.length <= fieldset.viewLimit && 0 < fieldset.stackAbility.length;) {
                    fieldset.add(fieldset.stackAbility.pop())
                }
            }
        }
        if (0 < fieldset.stackAbility.length) {
            fieldset.add({
                html: "…and " + fieldset.stackAbility.length + " others"
            });
            fieldset.capacityOver = true
        } else {
            fieldset.capacityOver = false
        }
    }
});