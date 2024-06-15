export interface rawtextMessage{
    translate: string,
    with: string[]
}

export interface pluginConfig{
    version: number[],
    engine_version: number[],
    file: string,
    name: string,
    description: string,
    authors: string[],
    license: string,
    dependencies: string[],
    protection_code: string | undefined,
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
