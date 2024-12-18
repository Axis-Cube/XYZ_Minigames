export interface rawtextMessage{
    translate: string,
    with: string[]
}

export enum pluginsExec{
    INIT = 'Init',
    LOADED_NAMES = "LoadedNames"
}

export interface pluginConfig{
    version: number[],
    engineVersion: number[],
    file: string,
    name: string,
    description: string,
    authors: string[],
    license: string,
    dependencies: string[],
    icon?: string
}

export interface storeItem{
    [key: number]: {
        type: string,
        namespace?: string,
        localData?: string | number,
        author?: string,
        include?: number[],
        price: number,
        uid?: string,
        linked?: number,
        linkeds?: number[],
        chalId?: number
    }
}
