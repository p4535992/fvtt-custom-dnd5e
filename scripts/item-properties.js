import { CONSTANTS } from './constants.js'
import { checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from './utils.js'
import { ItemPropertiesForm } from './forms/item-properties-form.js'

/**
 * Register Settings
 */
export function registerSettings () {
    registerMenu(
        CONSTANTS.ITEM_PROPERTIES.MENU.KEY,
        {
            hint: game.i18n.localize(CONSTANTS.ITEM_PROPERTIES.MENU.HINT),
            label: game.i18n.localize(CONSTANTS.ITEM_PROPERTIES.MENU.LABEL),
            name: game.i18n.localize(CONSTANTS.ITEM_PROPERTIES.MENU.NAME),
            icon: CONSTANTS.ITEM_PROPERTIES.MENU.ICON,
            type: ItemPropertiesForm,
            restricted: true,
            scope: 'world'
        }
    )

    registerSetting(
        CONSTANTS.ITEM_PROPERTIES.SETTING.KEY,
        {
            scope: 'world',
            config: false,
            type: Object,
            default: CONFIG.CUSTOM_DND5E.itemProperties
        }
    )

    loadTemplates([
        CONSTANTS.ITEM_PROPERTIES.TEMPLATE.FORM,
        CONSTANTS.ITEM_PROPERTIES.TEMPLATE.LIST
    ])
}

export function getDnd5eConfig () {
    const itemProperties = foundry.utils.deepClone(CONFIG.CUSTOM_DND5E.itemProperties)

    Object.entries(CONFIG.CUSTOM_DND5E.validProperties).forEach(itemType => {
        [...itemType[1]].forEach(property => {
            const itemProperty = itemProperties[property]
            itemProperty && (itemProperty[itemType[0]] = true)
        })
    })

    return itemProperties
}

/**
 * Set CONFIG.DND5E.itemProperties
 * Set CONFIG.DND5E.validProperties
 * @param {object} data
 */
export function setConfig (data) {
    const buildConfig = (data) => Object.fromEntries(
        Object.entries(data)
            .filter(([_, value]) => value.visible || value.visible === undefined)
            .map(([key, value]) => [
                key,
                {
                    ...(value.abbreviation !== undefined && { abbreviation: value.abbreviation }),
                    ...(value.icon !== undefined && { icon: value.icon }),
                    ...(value.isPhysical !== undefined && { isPhysical: value.isPhysical }),
                    ...(value.isTag !== undefined && { isTag: value.isTag }),
                    label: game.i18n.localize(value.label),
                    ...(value.reference !== undefined && { reference: value.reference })
                }
            ])
    )

    CONFIG.DND5E.validProperties = {}

    Object.entries(CONFIG.CUSTOM_DND5E.validProperties).forEach(property => {
        CONFIG.DND5E.validProperties[property[0]] = new Set([...property[1]])
    })

    Object.entries(data).forEach(([key, value]) => {
        const itemTypes = ['consumable', 'container', 'equipment', 'feat', 'loot', 'spell', 'tool', 'weapon']

        itemTypes.forEach(itemType => {
            if (value[itemType] && (value.visible || typeof value.visible === 'undefined')) {
                CONFIG.DND5E.validProperties[itemType].add(key)
            } else {
                CONFIG.DND5E.validProperties[itemType].delete(key)
            }
        })
    })

    const itemProperties = buildConfig(data)

    if (checkEmpty(data)) {
        if (checkEmpty(CONFIG.DND5E.itemProperties)) {
            resetDnd5eConfig('itemProperties')
        }
        return
    }

    if (itemProperties) {
        CONFIG.DND5E.itemProperties = itemProperties
    }
}
