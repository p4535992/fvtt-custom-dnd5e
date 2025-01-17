import { CONSTANTS } from './constants.js'
import { checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from './utils.js'
import { ItemActivationCostTypesForm } from './forms/config-form.js'

/**
 * Register Settings
 */
export function registerSettings () {
    registerMenu(
        CONSTANTS.ITEM_ACTIVATION_COST_TYPES.MENU.KEY,
        {
            hint: game.i18n.localize(CONSTANTS.ITEM_ACTIVATION_COST_TYPES.MENU.HINT),
            label: game.i18n.localize(CONSTANTS.ITEM_ACTIVATION_COST_TYPES.MENU.LABEL),
            name: game.i18n.localize(CONSTANTS.ITEM_ACTIVATION_COST_TYPES.MENU.NAME),
            icon: CONSTANTS.ITEM_ACTIVATION_COST_TYPES.MENU.ICON,
            type: ItemActivationCostTypesForm,
            restricted: true,
            scope: 'world'
        }
    )

    registerSetting(
        CONSTANTS.ITEM_ACTIVATION_COST_TYPES.SETTING.KEY,
        {
            scope: 'world',
            config: false,
            type: Object,
            default: CONFIG.CUSTOM_DND5E.abilityActivationTypes
        }
    )
}

/**
 * Set CONFIG.DND5E.abilityActivationTypes
 * @param {object} data
 */
export function setConfig (data) {
    const buildConfig = (data) => Object.fromEntries(
        Object.entries(data)
            .filter(([_, value]) => value.visible || value.visible === undefined)
            .map(([key, value]) => [
                key,
                game.i18n.localize(value.label)
            ])
    )

    if (checkEmpty(data)) {
        if (checkEmpty(CONFIG.DND5E.abilityActivationTypes)) {
            resetDnd5eConfig('abilityActivationTypes')
        }
        return
    }

    const abilityActivationTypes = buildConfig(data)
    if (abilityActivationTypes) {
        CONFIG.DND5E.abilityActivationTypes = abilityActivationTypes
    }
}