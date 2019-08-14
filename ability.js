/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.ns("PSO2");
Ext.define("PSO2.Ability", {
    extend: "Ext.data.Model",
    fields: ["code", "gid", "name", "lvup", "extend", "generate", "require", "extup", "status", "effect"]
});
Ext.define("PSO2.Slot", {
    extend: "Ext.data.Model",
    fields: ["id", "name", "slot"]
});
Ext.define("PSO2.AbilitySet", {
    extend: "Ext.Base",
    mutationICd: "OA01",
    mutationIICd: "OA02",
    photonCd: "WA01",
	// Constucts the ability set for the panel
    constructor: function(inAbilitySet) {
        var abilitySet = this,
            abilityEntry;
        Ext.apply(abilitySet, inAbilitySet);
		// Find id of Mutation I, Mutation II, and Photon Collect for boost upgrade calculations
        if (abilitySet.abilityStore) {
            abilityEntry = abilitySet.abilityStore.findRecord("name", "Mutation I");
            if (abilityEntry) {
                abilitySet.mutationICd = abilityEntry.get("code")
            }
            abilityEntry = abilitySet.abilityStore.findRecord("name", "Mutation II");
            if (abilityEntry) {
                abilitySet.mutationIICd = abilityEntry.get("code")
            }
            abilityEntry = abilitySet.abilityStore.findRecord("name", "Photon Collect");
            if (abilityEntry) {
                abilitySet.photonCd = abilityEntry.get("code")
            }
        }
        abilitySet.stores = [];
        abilitySet.clear()
    },
	// Returns list of affixes on the fodder
    getEnableData: function(fodderIndex) {
        return this.stores[fodderIndex].getEnableData()
    },
	// Returns count of SAF on the fodder
    getFactorCount: function(fodderIndex) {
        return this.stores[fodderIndex].getFactorCount()
    },
	// Returns list of id on the fodder
    getLocationHash: function(fodId) {
        var abilitySet = this,
            fodder = abilitySet.stores[fodId],
            codeList = "";
        if (fodder) {
            codeList = fodder.getEnableDataCd()
        }
        return codeList
    },
	// Push a fodder into the fodder list. True if has not existed
    putStore: function(store) {
        var a = (Ext.Array.indexOf(this.stores, store) < 0);
        if (a) {
            this.stores.push(store)
        }
        return a
    },
	// Push affix onto processing stack?
    put: function(ability) {
        var abilitySet = this,
            c, b = ability;
        if (!abilitySet.hashStack[ability.code]) {
            abilitySet.hashStack[ability.code] = 0
        }
        c = ++abilitySet.hashStack[ability.code];
        if (Ext.isArray(ability.extend)) {
            if (0 < ability.extend[abilitySet.overflow(ability.extend.length, c, 1)] && Ext.Array.indexOf(abilitySet.stack, ability) < 0) {
                abilitySet.stack.push(ability)
            }
        }
    },
	// Returns true if exists in the panel
    isMutationI: function() {
        var abilitySet = this;
        return 0 < abilitySet.hashStack[abilitySet.mutationICd]
    },
    isMutationII: function() {
        var abilitySet = this;
        return 0 < abilitySet.hashStack[abilitySet.mutationIICd]
    },
    isPhotonCollect: function() {
        var abilitySet = this;
        return 0 < abilitySet.hashStack[abilitySet.photonCd]
    },
    isGuidanceTrainer: function() {
        var abilitySet = this;
        var baseItem = abilitySet.stores[0].data.items;
        for(var i = 0; i < 9; i++){
            var slot = baseItem[i].data.slot;
            if(slot == null) break;
            if(slot.code == "VO01") return true;
        }
        return false;
    },
	// Number of material being used
    enableMaterial: function() {
        var abilitySet = this,
            len = abilitySet.stores.length,
            c = 0;
        for (var b = 1; b < len; b++) {
            if (abilitySet.stores[b].exist()) {
                c++
            }
        }
        return c
    },
	// Returns the max amount of slots can be used
    enableMaterialMaxCount: function() {
        return Math.min(this.enableCheckMax, this.stores[0].count() - 1)
    },
    forEach: function(func, resultPanel) { // Called by ln 1746
        var abilitySet = this,
            resultPanel = [],
            e;
        for (e in abilitySet.hashStack) {
            resultPanel.push(e)
        }
        for (e in abilitySet.levelupHashStack) {
            resultPanel.push(e)
        }
        for (e in abilitySet.refHashStack) {
            resultPanel.push(e)
        }
        resultPanel = resultPanel.filter(function(f, h, g) {
            return g.indexOf(f) === h
        }).sort();
        for (i = 0; i < resultPanel.length; i++) {
            if (resultPanel[i]) {
                if (resultPanel[i].substr(0, 1) == "*") {
                    func.call(resultPanel, abilitySet.abilityStore.findRecord("code", resultPanel[i].substr(1))["data"], true)
                } else {
                    func.call(resultPanel, abilitySet.abilityStore.findRecord("code", resultPanel[i])["data"], false)
                }
            }
        }
    },
    // Resets the panel and calculates if the setup is valid
    // and produces the list of possible affixes
    resetAbility: function() {
        var abilitySet = this,
            numFodder = abilitySet.stores.length,
            minAbilityCountRequire = abilitySet.getEnableData(0).length - abilitySet.getFactorCount(0),
            b;
        if (minAbilityCountRequire == 0) {
            b = false;
            for (i = 1; i < numFodder; i++) {
                if (0 < abilitySet.getEnableData(i).length) {
                    b = true;
                    break
                }
            }
        } else {
            b = true;
            for (i = 1; i < numFodder; i++) {
                var affixCount = abilitySet.getEnableData(i).length - abilitySet.getFactorCount(i);
                if (0 < affixCount && affixCount < minAbilityCountRequire) {
                    b = false;
                    break
                }
            }
        }
        abilitySet.clear();
        if (b == true) {
            for (i = 0; i < numFodder; i++) {
                Ext.Array.forEach(abilitySet.getEnableData(i), abilitySet.put, abilitySet)
            }
            abilitySet.enableCheckMax = minAbilityCountRequire + 1;
            abilitySet.resetLevelupAbility();
            abilitySet.resetExtendAbility()
        }
    },
    clear: function() {
        var abilitySet = this;
        abilitySet.enableCheckMax = 0;
        abilitySet.stack = [];
        abilitySet.hashStack = {};
        abilitySet.levelupStack = [];
        abilitySet.levelupHashStack = {};
        abilitySet.exStack = {};
        abilitySet.refStack = [];
        abilitySet.refHashStack = {};
        abilitySet.refBonusStack = {}
    },
    // Returns index of the code in the list
    indexOf: function(abiValidSelList, key, code) {
        var a = abiValidSelList.length;
        for (var index = 0; index < a; index++) {
            if (abiValidSelList[index][key] == code) {
                return index
            }
        }
        return -1
    },
    // Returns list of code of the affixes in the hash stack
    getKeyList: function(hashStack) {
        var arrayCode = [];
        for (var abilityCode in hashStack) {
            arrayCode.push(abilityCode)
        }
        return arrayCode
    },
    // Finds all valid lvl up affix and push onto levelupStack
    resetLevelupAbility: function() {
        var abilitySet = this,
            arrayCode = abilitySet.getKeyList(abilitySet.hashStack),
            codeLen = arrayCode.length,
            entryIndex, lvlupCode, numCopies, lvlupAffix, baseAffix;
        for (var index = 0; index < codeLen; index++) {
            numCopies = abilitySet.hashStack[arrayCode[index]];
            // If there is more than 1 copy, then it may lvl up
            if (1 < numCopies) {
                entryIndex = abilitySet.indexOf(abilitySet.stack, "code", arrayCode[index]);
                if (0 <= entryIndex) {
                    // Find associate code for lvl up
                    lvlupCode = abilitySet.stack[entryIndex]["lvup"];
                    if (lvlupCode && !abilitySet.levelupHashStack[lvlupCode]) {
                        lvlupAffix = abilitySet.abilityStore.findRecord("code", lvlupCode)["data"];
                        // Determine if it is possible to lvl up with number of copies atm
                        if (lvlupAffix.generate && lvlupAffix.generate[Math.min(lvlupAffix.generate.length - 1, numCopies - 2)]) {
                            // Determine if the base affix has a requirement for lvl up (Gift)
                            // to determine if push onto lvlup stack
                            baseAffix = abilitySet.abilityStore.findRecord("code", arrayCode[index]);
                            if (baseAffix.get("require")) {
                                if (abilitySet.hashStack[baseAffix.get("require")]) {
                                    abilitySet.levelupStack.push(lvlupAffix);
                                    abilitySet.levelupHashStack[lvlupCode] = abilitySet.hashStack[arrayCode[index]]
                                }
                            } else {
                                // Push lvlup Affix and stores the number of copies are being used
                                abilitySet.levelupStack.push(lvlupAffix);
                                abilitySet.levelupHashStack[lvlupCode] = abilitySet.hashStack[arrayCode[index]]
                            }
                        }
                    }
                }
            }
        }
    },
    // Searches for all extendAbility rules and adds affixes to the list according to the rule
    resetExtendAbility: function() {
        var abilitySet = this, 
        affixEntry;
        // For all affix in the hashstack, check if it has extup rule
        for (var affixCode in abilitySet.hashStack) {
            affixEntry = abilitySet.abilityStore.findRecord("code", affixCode);
            if (affixEntry && affixEntry.get("extup")) {
                // Enters all possible relation boost recipe to the list
                Ext.Array.forEach(affixEntry.get("extup"), function(extTarget) {
                    if (!abilitySet.exStack[extTarget]) { // new entry
                        abilitySet.exStack[extTarget] = [affixEntry.get("rel")]
                    } else { // existing
                        abilitySet.exStack[extTarget].push(affixEntry.get("rel"))
                    }
                })
            }
        }
        Ext.Array.forEach(abilitySet.abilityComponent.constExtendAbility, function(relRule) {
            var localAbilitySet = this,
                rulTarget = localAbilitySet.getAbilityRefferer(relRule),
                targetIndex;
            // If there are valid targets for the rule
            if (rulTarget) {
                for (var index = 0; index < rulTarget.length; index++) {
                    if (relRule.success) {
                        targetIndex = localAbilitySet.indexOf(localAbilitySet.stack, "code", rulTarget[index]);
                        if (targetIndex < 0) {
                            // Target is added to the list due to the rule
                            if (localAbilitySet.indexOf(localAbilitySet.levelupStack, "code", rulTarget[index]) < 0) {
                                localAbilitySet.refStack.push(localAbilitySet.abilityStore.findRecord("code", rulTarget[index])["data"])
                            }
                        }
                        localAbilitySet.refHashStack[rulTarget[index]] = relRule.success
                    } else { // ???
                        if (relRule.bonus) {
                            localAbilitySet.refBonusStack[rulTarget[index]] = relRule.bonus
                        }
                    }
                }
            }
        }, abilitySet)
    },
    // Take extendAbility and searches for all valid targets
    getAbilityRefferer: function(extendAbility) {
        var abilitySet = this,
            base = extendAbility.base,
            baseLength = base.length,
            f = true,
            g = null,
            hashStack = Ext.apply({}, abilitySet.hashStack);
        for (var index = 0; index < baseLength; index++) {
            if (base[index].indexOf("*") < 0) {
                if (!hashStack[base[index]]) {
                    return null
                } else {
                    hashStack[base[index]]--
                }
            } else {
                // Capture the letter code of the rule
                var codeHeadCapture = new RegExp("([^*]+)", "g")
                var codeHead = base[index].match(codeHeadCapture)
                // If the head only has 1 letter, add [A-Z] capture to prevent capture of 2nd letter
                // since all codes have at least 2 letters
                if(codeHead[0].length == 1){ 
                    codeHead[0] += "[A-Z]"
                }
                var codeCapture = new RegExp("(" + codeHead[0] + "[^,]+" + ")", "g")
                
                var relTarget = abilitySet.getKeyList(hashStack).join(",").match(codeCapture);
                if (relTarget) {
                    g = relTarget
                } else {
                    return null
                }
            }
        }
        return (extendAbility.ref == "$$" && g) ? relTarget : Ext.isArray(extendAbility.ref) ? extendAbility.ref : [extendAbility.ref]
    },
    overflow: function(a, c, b) {
        if (a < c) {
            return a - 1
        }
        return Math.max(0, c - b)
    }
});
Ext.define("PSO2.AbilityStore", {
    extend: "Ext.data.Store",
    model: "PSO2.Ability",
    groupField: "gid",
    findRecord: function() {
        var entry = this.callParent(arguments);
        if (entry || !this.snapshot) {
            return entry
        }
        return this.findRecord2.apply(this, arguments)
    },
    find2: function(key, value, g, f, a, c) {
        var filter = this.createFilterFn(key, value, f, a, c);
        return filter ? this.snapshot.findIndexBy(filter, null, g) : -1
    },
    findRecord2: function() {
        var abStore = this,
            a = abStore.find2.apply(abStore, arguments);
        return a !== -1 ? abStore.getAt2(a) : null
    },
    getAt2: function(index) {
        return this.snapshot.getAt(index)
    }
});
Ext.define("PSO2.AbilityComponent", {
    extend: "Ext.Base",
    constAbility: [],
    constExtra: [],
    constBoostPoint: {},
    constExtendAbility: [],
    constBaseSlot: [{
        id: "slot01",
        name: "Slot 1",
        slot: null
    }, {
        id: "slot02",
        name: "Slot 2",
        slot: null
    }, {
        id: "slot03",
        name: "Slot 3",
        slot: null
    }, {
        id: "slot04",
        name: "Slot 4",
        slot: null
    }, {
        id: "slot05",
        name: "Slot 5",
        slot: null
    }, {
        id: "slot06",
        name: "Slot 6",
        slot: null
    }, {
        id: "slot07",
        name: "Slot 7",
        slot: null
    }, {
        id: "slot08",
        name: "Slot 8",
        slot: null
    }, {
        id: "slot09",
        name: "Slot 9",
        slot: null
    }],
    excludePattern: [],
    constructor: function(abiltiyStore) {
        Ext.apply(this, abiltiyStore);
        this.callParent(abiltiyStore)
    },
    getAbilityStore: function(a) {
        var abilityComponent = this;
        if (a === true) {
            return Ext.create("PSO2.AbilityStore", {
                data: abilityComponent.constAbility
            })
        } else {
            if (!abilityComponent.abilityStore) {
                // If abilityStore is not defined in abilityComponent, initialize
                abilityComponent.abilityStore = abilityComponent.getAbilityStore(true)
            }
        }
        return abilityComponent.abilityStore
    },
    // Checks the fodder contains all valid affixes
    isExistAbilities: function(fodderCodes) {
        var abilityComponent = this,
            abilityStore = abilityComponent.getAbilityStore(),
            len;
        if (!Ext.isArray(fodderCodes)) {
            fodderCodes = [fodderCodes]
        }
        len = fodderCodes.length;
        for (var index = 0; index < len; index++) {
            var code = fodderCodes[index];
            if (code.substr(0, 1) == "*") {
                code = code.substr(1)
            }
            if (0 > abilityStore.findBy(function(gridbox) {
                    if (gridbox.data.code == code) {
                        return true
                    }
                })) {
                return false
            }
        }
        return true
    },
    createSlotStore: function() {
        var abilityComponent = this,
            fodderSlot = Ext.create("Ext.data.Store", {
                model: "PSO2.Slot",
                data: this.constBaseSlot,
                // Checks if the two affixes should be excluded due to the rules
                chkFn: function(affix1, affix2) {
                    var excludePatterns = abilityComponent.excludePattern, 
                    match1, match2;
                    for (var i = 0; i < excludePatterns.length; i++) {
                        excludePattern = Ext.isArray(excludePatterns[i]) ? excludePatterns[i] : [excludePatterns[i]];
                        match1 = match2 = false;
                        for (var j = 0; j < excludePattern.length; j++) {
                            if (excludePattern[j] == affix2.substr(0, excludePattern[j].length)) {
                                match1 = true
                            }
                            if (excludePattern[j] == affix1.substr(0, excludePattern[j].length)) {
                                match2 = true
                            }
                        }
                        if (match1 && match2) {
                            return true
                        }
                    }
                    return false
                },
                addAbility: function(affix) {
                    var isSAF = affix.code.substr(0, 1) == "*",
                        code = isSAF ? affix.code.substr(1) : affix.code,
                        subID = code.substr(0, 2),
                        slot, slotCount = this.getCount(),
                        index;
                    for (index = 0; index < slotCount; index++) {
                        slot = this.getAt(index).get("slot");
                        if (slot == null) {
                            break
                        }
                        // If same, ignore
                        if ((slot.source && slot.source.code == code) || (slot.code == code)) {
                            return true
                        }
                        // If slot is SAF, check with original code. Else compare code directly
                        if ((slot.source && slot.source.code.substr(0, 2) == subID) || (slot.code.substr(0, 2) == subID)) {
                            // If slot is not SAF, matched found
                            if ((slot.code.substr(0, 1) != "*")) {
                                break
                            }
                        }
                        if (this.chkFn(affix.code, slot.code)) {
                            break
                        }
                    }

                    // Fodder is full
                    if (slotCount <= index) {
                        return false
                    }
                    return this.getAt(index).set("slot", affix)
                },
                exist: function() {
                    return this.getEnableData().length != 0
                },
                swapAbility: function(indDrag, indTarget) {
                    var slotCount = this.getCount(),
                        slot, g = 0;
                    if (indDrag == indTarget) {
                        return false
                    }
                    // Finds the last slot
                    while (g < slotCount && (slot = this.getAt(g).get("slot")) != null) {
                        g++
                    }
                    // If target is empty, swap with the last one
                    if (g <= indTarget) {
                        indTarget = g - 1
                    }
                    slot = this.getAt(indDrag).get("slot");
                    this.getAt(indDrag).data.slot = this.getAt(indTarget).get("slot");
                    this.getAt(indTarget).data.slot = slot;
                    return true
                },
                removeAbility: function(gridbox, index) {
                    var slotCount = this.getCount();
                    if ((slotCount - 1) == index) {
                        this.getAt(index).data.slot = null
                    } else {
                        // Shuffle down
                        for (var e = index; e < slotCount - 1; e++) {
                            this.getAt(e).data.slot = this.getAt(e + 1).get("slot");
                            this.getAt(e + 1).data.slot = null
                        }
                    }
                    this.fireEvent("update", this, gridbox, "delete", undefined)
                },
                getEnableData: function() {
                    var slotCount = this.getCount(),
                        result = [],
                        affixEntry;
                    for (var index = 0; index < slotCount; index++) {
                        affixEntry = this.getAt(index).get("slot");
                        if (affixEntry == null) {
                            break
                        }
                        result.push(affixEntry)
                    }
                    return result
                },
                getEnableDataCd: function() {
                    var affixList = this.getEnableData(),
                        result = [];
                    Ext.Array.forEach(affixList, function(entry) {
                        result.push(entry.code)
                    });
                    return result
                },
                getFactorCount: function() {
                    var affixList = this.getEnableData(),
                        count = 0;
                    Ext.Array.forEach(affixList, function(entry) {
                        if (entry.factor) {
                            count++
                        }
                    });
                    return count
                }
            });
        return fodderSlot
    },
    calcSuccess: function(abSet, affix) {
        var abComp = this,
            extend = affix.get("extend"),
            generate = affix.get("generate"),
            status = affix.get("status"),
            boost = affix.get("boost"),
            exBoost = affix.get("exboost"),
            code = affix.get("code"),
            haveMut1 = abSet.isMutationI(),
            haveMut2 = abSet.isMutationII(),            
            havePhotCol = abSet.isPhotonCollect(),
            level = abComp.getLevel(affix.get("name")),
            refRate = 0,
            extendRate = 0,
            lvlupRate = 0,
            boostRate = 0,
            finalRate = 0,
            // Calculte bonus should be received from rule
            func = function(successRule, rate) {
                var mut1Bonus = 0,
                    mut2Bonus = 0,
                    resultBoost = 0,
                    extUpCode;
                if (abComp.constBoostPoint.mutation1[successRule] && abComp.constBoostPoint.mutation1[successRule][status]) {
                    mut1Bonus = haveMut1 ? abComp.constBoostPoint.mutation1[successRule][status][level] : 0
                }
                if (abComp.constBoostPoint.mutation2[successRule] && abComp.constBoostPoint.mutation2[successRule][status]) {
                    mut2Bonus = haveMut2 ? abComp.constBoostPoint.mutation2[successRule][status][level] : 0
                }
                extUpCode = abComp.indexOf(abSet.exStack, code);
                if (extUpCode) {
                    var boost = 0;
                    for (var y = 0; y < abSet.exStack[extUpCode].length; y++) {
                        if (abComp.constBoostPoint[abSet.exStack[extUpCode][y]][successRule] && abComp.constBoostPoint[abSet.exStack[extUpCode][y]][successRule][status]) {
                            if (Ext.isObject(abComp.constBoostPoint[abSet.exStack[extUpCode][y]][successRule][status][level])) {
                                // Gives boost to a max rate
                                var exBoost = abComp.constBoostPoint[abSet.exStack[extUpCode][y]][successRule][status][level]["boost"],
                                    exMax = abComp.constBoostPoint[abSet.exStack[extUpCode][y]][successRule][status][level]["max"];
                                boost = (rate + exBoost) <= exMax ? exBoost : Math.abs(exMax - rate)
                            } else {
                                // unconditional boost
                                boost = abComp.constBoostPoint[abSet.exStack[extUpCode][y]][successRule][status][level]
                            }
                        }
                        resultBoost = Math.max(resultBoost, boost)
                    }
                }
                return Math.max(mut1Bonus, mut2Bonus, resultBoost)
            };
        // Rate from extendAbility section of json
        if (abSet.refHashStack[code]) {
            refRate = abSet.refHashStack[code]
        }
        // Rate from extend section
        if (extend && abSet.hashStack[code]) {
            if (affix.get("require")) {
                if (abSet.hashStack[affix.get("require")]) {
                    extendRate = extend[abComp.overflow(extend.length, abSet.hashStack[code], 1)]
                }
            } else {
                extendRate = extend[abComp.overflow(extend.length, abSet.hashStack[code], 1)]
            }
        }
        // Rate from generate
        if (generate && abSet.levelupHashStack[code]) {
            var photonRate = 0;
            lvlupRate = generate[abComp.overflow(generate.length, abSet.levelupHashStack[code], 2)] + func("create", 0);
            if (abComp.constBoostPoint.photon["create"] && abComp.constBoostPoint.photon["create"][status]) {
                photonRate = havePhotCol ? abComp.constBoostPoint.photon["create"][status][level] : 0
            }
            lvlupRate = Math.max(lvlupRate, photonRate)
        }
        if (status) {
            if (refRate || extendRate) {
                boostRate = Math.max(refRate + func("extend", refRate), extendRate + func("extend", extendRate))
            }
        }
        finalRate = Math.max(Math.max(Math.max(refRate, extendRate), lvlupRate), boostRate);
        if (finalRate && abSet.refBonusStack[code]) { // never trigger
            finalRate += abSet.refBonusStack[code]
        }
        return Math.min(100, finalRate)
    },
    // Determines if the code is in the extup list and returns key
    indexOf: function(extup, code) {
        if (code && extup) {
            if (Ext.isArray(extup)) {
                for (i = 0; i < extup.length; i++) {
                    if (extup[i] && extup[i] == code.substr(0, extup[i].length)) {
                        return i
                    }
                }
            } else {
                if (Ext.isObject(extup)) {
                    for (var subcode in extup) {
                        if (subcode == code.substr(0, subcode.length)) {
                            return subcode
                        }
                    }
                    return null
                }
            }
        }
        return -1
    },
    overflow: function(a, c, b) {
        if (a < c) {
            return a - 1
        }
        return Math.max(0, c - b)
    },
    // Return affix entry from code
    findAbilityName: function(code) {
        var abComp = this,
            a = abComp.getAbilityStore();
        return a.findRecord("code", code)
    },
    // Return affix lvl
    getLevel: function(b) {
        var a = 0;
        if (0 < b.indexOf("IV")) {
            a = 4
        } else if (0 < b.indexOf("VI")) {
            a = 6
        } else if (0 < b.indexOf("V")) {
            a = 5
        } else if (0 < b.indexOf("III")) {
            a = 3
        } else if (0 < b.indexOf("II")) {
            a = 2
        } else if (0 < b.indexOf("I")) {
            a = 1
        }
        return a
    },
    // Final result list
    getSuccessList: function(b, selAffix, optItem) {
        var abComp = this,
            totalSel = (selAffix.length + optItem.length),
            isUpslot = b.enableCheckMax == totalSel,
            upslotBonus = (2 <= b.enableMaterial()),
            abilityStore = abComp.getAbilityStore(),
            len = selAffix.length,
            affixEntry, rate, result = [];
        for (var index = 0; index < len; index++) {
            var isSAF = (selAffix[index].inputValue.substr(0, 1) == "*");
            affixEntry = abilityStore.findRecord("code", isSAF ? selAffix[index].inputValue.substr(1) : selAffix[index].inputValue);
            var isExemptUpslot = affixEntry.get("noEx");
            if (affixEntry) {
                rate = isSAF ? 100 : abComp.calcSuccess(b, affixEntry);
                if (isUpslot && !isExemptUpslot) {
                    rate = parseInt((rate * abComp.constExtra[totalSel - 1][upslotBonus]) / 100)
                }
                result.push({
                    name: affixEntry.get("name"),
                    code: affixEntry.get("code"),
                    success: rate
                })
            }
        }
        len = optItem.length;
        for (var index = 0; index < len; index++) {
            rate = optItem[index].get("extend");
            if (isUpslot) {
                rate = parseInt((rate * abComp.constExtra[totalSel - 1][upslotBonus]) / 100)
            }
            result.push({
                name: optItem[index].get("name"),
                success: rate
            })
        }
        return result
    },
    // Check box selection list
    getSuccessList2: function(abSet, affixList) {
        var abComp = this,
            upslotBonus = (2 <= abSet.enableMaterial()),
            abilityStore = abComp.getAbilityStore(),
            d = affixList.length,
            affixEntry, successRate, rateList = {};
        for (var c = 0; c < d; c++) {
            var isSAF = (affixList[c]["code"].substr(0, 1) == "*");
            affixEntry = abilityStore.findRecord("code", isSAF ? affixList[c]["code"].substr(1) : affixList[c]["code"]);
            if (affixEntry) {
                successRate = isSAF ? 100 : abComp.calcSuccess(abSet, affixEntry);
                rateList[affixEntry.get("code")] = successRate
            }
        }
        return rateList
    }
});