export namespace abis {
	
	export class AbisPage {
	    facet: types.DataFacet;
	    abis: types.Abi[];
	    functions: types.Function[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new AbisPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.abis = this.convertValues(source["abis"], types.Abi);
	        this.functions = this.convertValues(source["functions"], types.Function);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace app {
	
	export class UserInfoStatus {
	    missingNameEmail: boolean;
	    rpcUnavailable: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UserInfoStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.missingNameEmail = source["missingNameEmail"];
	        this.rpcUnavailable = source["rpcUnavailable"];
	    }
	}

}

export namespace base {
	
	export class Address {
	    address: number[];
	
	    static createFrom(source: any = {}) {
	        return new Address(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = source["address"];
	    }
	}
	export class Hash {
	    hash: number[];
	
	    static createFrom(source: any = {}) {
	        return new Hash(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hash = source["hash"];
	    }
	}

}

export namespace chunks {
	
	export class ChunksPage {
	    facet: types.DataFacet;
	    blooms: types.ChunkBloom[];
	    index: types.ChunkIndex[];
	    manifest: types.Manifest[];
	    stats: types.ChunkStats[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new ChunksPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.blooms = this.convertValues(source["blooms"], types.ChunkBloom);
	        this.index = this.convertValues(source["index"], types.ChunkIndex);
	        this.manifest = this.convertValues(source["manifest"], types.Manifest);
	        this.stats = this.convertValues(source["stats"], types.ChunkStats);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace comparitoor {
	
	export class ComparitoorPage {
	    facet: types.DataFacet;
	    transaction: types.Transaction[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	    chifra: types.Transaction[];
	    chifraCount: number;
	    etherscan: types.Transaction[];
	    etherscanCount: number;
	    covalent: types.Transaction[];
	    covalentCount: number;
	    alchemy: types.Transaction[];
	    alchemyCount: number;
	    overlapCount: number;
	    unionCount: number;
	    intersectionCount: number;
	    overlapDetails?: Record<string, number>;
	
	    static createFrom(source: any = {}) {
	        return new ComparitoorPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.transaction = this.convertValues(source["transaction"], types.Transaction);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	        this.chifra = this.convertValues(source["chifra"], types.Transaction);
	        this.chifraCount = source["chifraCount"];
	        this.etherscan = this.convertValues(source["etherscan"], types.Transaction);
	        this.etherscanCount = source["etherscanCount"];
	        this.covalent = this.convertValues(source["covalent"], types.Transaction);
	        this.covalentCount = source["covalentCount"];
	        this.alchemy = this.convertValues(source["alchemy"], types.Transaction);
	        this.alchemyCount = source["alchemyCount"];
	        this.overlapCount = source["overlapCount"];
	        this.unionCount = source["unionCount"];
	        this.intersectionCount = source["intersectionCount"];
	        this.overlapDetails = source["overlapDetails"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace contracts {
	
	export class ContractsPage {
	    facet: types.DataFacet;
	    contracts: types.Contract[];
	    logs: types.Log[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new ContractsPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.contracts = this.convertValues(source["contracts"], types.Contract);
	        this.logs = this.convertValues(source["logs"], types.Log);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace crud {
	
	export enum Operation {
	    CREATE = "create",
	    UPDATE = "update",
	    DELETE = "delete",
	    UNDELETE = "undelete",
	    REMOVE = "remove",
	    AUTONAME = "autoname",
	}

}

export namespace dalle {
	
	export class Series {
	    last?: number;
	    suffix: string;
	    purpose?: string;
	    deleted?: boolean;
	    adverbs: string[];
	    adjectives: string[];
	    nouns: string[];
	    emotions: string[];
	    occupations: string[];
	    actions: string[];
	    artstyles: string[];
	    litstyles: string[];
	    colors: string[];
	    viewpoints: string[];
	    gazes: string[];
	    backstyles: string[];
	    compositions: string[];
	    modifiedAt?: string;
	
	    static createFrom(source: any = {}) {
	        return new Series(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.last = source["last"];
	        this.suffix = source["suffix"];
	        this.purpose = source["purpose"];
	        this.deleted = source["deleted"];
	        this.adverbs = source["adverbs"];
	        this.adjectives = source["adjectives"];
	        this.nouns = source["nouns"];
	        this.emotions = source["emotions"];
	        this.occupations = source["occupations"];
	        this.actions = source["actions"];
	        this.artstyles = source["artstyles"];
	        this.litstyles = source["litstyles"];
	        this.colors = source["colors"];
	        this.viewpoints = source["viewpoints"];
	        this.gazes = source["gazes"];
	        this.backstyles = source["backstyles"];
	        this.compositions = source["compositions"];
	        this.modifiedAt = source["modifiedAt"];
	    }
	}

}

export namespace dresses {
	
	export class DressesPage {
	    facet: types.DataFacet;
	    dalledress: model.DalleDress[];
	    databases: model.Database[];
	    logs: types.Log[];
	    series: dalle.Series[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new DressesPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.dalledress = this.convertValues(source["dalledress"], model.DalleDress);
	        this.databases = this.convertValues(source["databases"], model.Database);
	        this.logs = this.convertValues(source["logs"], types.Log);
	        this.series = this.convertValues(source["series"], dalle.Series);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace exports {
	
	export class ExportsPage {
	    facet: types.DataFacet;
	    approvallogs: types.Log[];
	    approvaltxs: types.Transaction[];
	    assets: types.Statement[];
	    balances: types.Token[];
	    logs: types.Log[];
	    openapprovals: types.Approval[];
	    receipts: types.Receipt[];
	    statements: types.Statement[];
	    traces: types.Trace[];
	    transactions: types.Transaction[];
	    transfers: types.Transfer[];
	    withdrawals: types.Withdrawal[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new ExportsPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.approvallogs = this.convertValues(source["approvallogs"], types.Log);
	        this.approvaltxs = this.convertValues(source["approvaltxs"], types.Transaction);
	        this.assets = this.convertValues(source["assets"], types.Statement);
	        this.balances = this.convertValues(source["balances"], types.Token);
	        this.logs = this.convertValues(source["logs"], types.Log);
	        this.openapprovals = this.convertValues(source["openapprovals"], types.Approval);
	        this.receipts = this.convertValues(source["receipts"], types.Receipt);
	        this.statements = this.convertValues(source["statements"], types.Statement);
	        this.traces = this.convertValues(source["traces"], types.Trace);
	        this.transactions = this.convertValues(source["transactions"], types.Transaction);
	        this.transfers = this.convertValues(source["transfers"], types.Transfer);
	        this.withdrawals = this.convertValues(source["withdrawals"], types.Withdrawal);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace keys {
	
	export class Accelerator {
	    Key: string;
	    Modifiers: string[];
	
	    static createFrom(source: any = {}) {
	        return new Accelerator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Key = source["Key"];
	        this.Modifiers = source["Modifiers"];
	    }
	}

}

export namespace menu {
	
	export class Menu {
	    Items: MenuItem[];
	
	    static createFrom(source: any = {}) {
	        return new Menu(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Items = this.convertValues(source["Items"], MenuItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MenuItem {
	    Label: string;
	    Role: number;
	    Accelerator?: keys.Accelerator;
	    Type: string;
	    Disabled: boolean;
	    Hidden: boolean;
	    Checked: boolean;
	    SubMenu?: Menu;
	
	    static createFrom(source: any = {}) {
	        return new MenuItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Label = source["Label"];
	        this.Role = source["Role"];
	        this.Accelerator = this.convertValues(source["Accelerator"], keys.Accelerator);
	        this.Type = source["Type"];
	        this.Disabled = source["Disabled"];
	        this.Hidden = source["Hidden"];
	        this.Checked = source["Checked"];
	        this.SubMenu = this.convertValues(source["SubMenu"], Menu);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CallbackData {
	    MenuItem?: MenuItem;
	
	    static createFrom(source: any = {}) {
	        return new CallbackData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.MenuItem = this.convertValues(source["MenuItem"], MenuItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace model {
	
	export class DalleDress {
	    original: string;
	    originalName: string;
	    fileName: string;
	    fileSize: number;
	    modifiedAt: number;
	    seed: string;
	    prompt: string;
	    dataPrompt: string;
	    titlePrompt: string;
	    tersePrompt: string;
	    enhancedPrompt: string;
	    attributes: prompt.Attribute[];
	    seedChunks: string[];
	    selectedTokens: string[];
	    selectedRecords: string[];
	    imageUrl: string;
	    generatedPath: string;
	    annotatedPath: string;
	    downloadMode: string;
	    ipfsHash: string;
	    cacheHit: boolean;
	    completed: boolean;
	    series: string;
	
	    static createFrom(source: any = {}) {
	        return new DalleDress(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.original = source["original"];
	        this.originalName = source["originalName"];
	        this.fileName = source["fileName"];
	        this.fileSize = source["fileSize"];
	        this.modifiedAt = source["modifiedAt"];
	        this.seed = source["seed"];
	        this.prompt = source["prompt"];
	        this.dataPrompt = source["dataPrompt"];
	        this.titlePrompt = source["titlePrompt"];
	        this.tersePrompt = source["tersePrompt"];
	        this.enhancedPrompt = source["enhancedPrompt"];
	        this.attributes = this.convertValues(source["attributes"], prompt.Attribute);
	        this.seedChunks = source["seedChunks"];
	        this.selectedTokens = source["selectedTokens"];
	        this.selectedRecords = source["selectedRecords"];
	        this.imageUrl = source["imageUrl"];
	        this.generatedPath = source["generatedPath"];
	        this.annotatedPath = source["annotatedPath"];
	        this.downloadMode = source["downloadMode"];
	        this.ipfsHash = source["ipfsHash"];
	        this.cacheHit = source["cacheHit"];
	        this.completed = source["completed"];
	        this.series = source["series"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Database {
	    id: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Database(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	    }
	}

}

export namespace monitors {
	
	export class MonitorsPage {
	    facet: types.DataFacet;
	    monitors: types.Monitor[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new MonitorsPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.monitors = this.convertValues(source["monitors"], types.Monitor);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace msgs {
	
	export enum EventType {
	    STATUS = "statusbar:status",
	    ERROR = "statusbar:error",
	    MANAGER = "manager:change",
	    PROJECT_MODAL = "project:modal",
	    ADDRESS_CHANGED = "address:changed",
	    CHAIN_CHANGED = "chain:changed",
	    PERIOD_CHANGED = "period:changed",
	    DATA_LOADED = "data:loaded",
	    DATA_RELOADED = "data:reloaded",
	    TAB_CYCLE = "hotkey:tab-cycle",
	    IMAGES_CHANGED = "images:changed",
	    PROJECT_OPENED = "project:opened",
	    ROW_ACTION = "action:row",
	    FACET_CHANGED = "facet:changed",
	    PROJECT_CLOSED = "project:closed",
	    PROJECT_SWITCHED = "project:switched",
	}

}

export namespace names {
	
	export class NamesPage {
	    facet: types.DataFacet;
	    names: types.Name[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new NamesPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.names = this.convertValues(source["names"], types.Name);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace preferences {
	
	export class Bounds {
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	
	    static createFrom(source: any = {}) {
	        return new Bounds(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	        this.width = source["width"];
	        this.height = source["height"];
	    }
	}
	export class OpenProject {
	    path: string;
	    isActive?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new OpenProject(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.isActive = source["isActive"];
	    }
	}
	export class AppPreferences {
	    version: string;
	    name: string;
	    lastTheme: string;
	    lastSkin: string;
	    lastFormat: string;
	    lastLanguage: string;
	    lastProjects: OpenProject[];
	    helpCollapsed: boolean;
	    menuCollapsed: boolean;
	    chromeCollapsed: boolean;
	    detailCollapsed: boolean;
	    debugCollapsed: boolean;
	    recentProjects: string[];
	    silencedDialogs: Record<string, boolean>;
	    chunksMetrics?: Record<string, string>;
	    exportsMetrics?: Record<string, string>;
	    bounds?: Bounds;
	    fontScale: number;
	    showFieldTypes: boolean;
	
	    static createFrom(source: any = {}) {
	        return new AppPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.lastTheme = source["lastTheme"];
	        this.lastSkin = source["lastSkin"];
	        this.lastFormat = source["lastFormat"];
	        this.lastLanguage = source["lastLanguage"];
	        this.lastProjects = this.convertValues(source["lastProjects"], OpenProject);
	        this.helpCollapsed = source["helpCollapsed"];
	        this.menuCollapsed = source["menuCollapsed"];
	        this.chromeCollapsed = source["chromeCollapsed"];
	        this.detailCollapsed = source["detailCollapsed"];
	        this.debugCollapsed = source["debugCollapsed"];
	        this.recentProjects = source["recentProjects"];
	        this.silencedDialogs = source["silencedDialogs"];
	        this.chunksMetrics = source["chunksMetrics"];
	        this.exportsMetrics = source["exportsMetrics"];
	        this.bounds = this.convertValues(source["bounds"], Bounds);
	        this.fontScale = source["fontScale"];
	        this.showFieldTypes = source["showFieldTypes"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Chain {
	    chain: string;
	    chainId: number;
	    remoteExplorer: string;
	    rpcProviders: string[];
	    symbol: string;
	
	    static createFrom(source: any = {}) {
	        return new Chain(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chain = source["chain"];
	        this.chainId = source["chainId"];
	        this.remoteExplorer = source["remoteExplorer"];
	        this.rpcProviders = source["rpcProviders"];
	        this.symbol = source["symbol"];
	    }
	}
	export class Id {
	    appName: string;
	    baseName: string;
	    orgName: string;
	    github: string;
	    domain: string;
	    twitter: string;
	
	    static createFrom(source: any = {}) {
	        return new Id(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.appName = source["appName"];
	        this.baseName = source["baseName"];
	        this.orgName = source["orgName"];
	        this.github = source["github"];
	        this.domain = source["domain"];
	        this.twitter = source["twitter"];
	    }
	}
	
	export class OrgPreferences {
	    version?: string;
	    telemetry?: boolean;
	    theme?: string;
	    language?: string;
	    developerName?: string;
	    logLevel?: string;
	    experimental?: boolean;
	    supportUrl?: string;
	
	    static createFrom(source: any = {}) {
	        return new OrgPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.telemetry = source["telemetry"];
	        this.theme = source["theme"];
	        this.language = source["language"];
	        this.developerName = source["developerName"];
	        this.logLevel = source["logLevel"];
	        this.experimental = source["experimental"];
	        this.supportUrl = source["supportUrl"];
	    }
	}
	export class UserPreferences {
	    version?: string;
	    name?: string;
	    email?: string;
	    chains?: Chain[];
	
	    static createFrom(source: any = {}) {
	        return new UserPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.email = source["email"];
	        this.chains = this.convertValues(source["chains"], Chain);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace project {
	
	export class FilterState {
	    sorting?: Record<string, any>;
	    filtering?: Record<string, any>;
	    other?: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new FilterState(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.sorting = source["sorting"];
	        this.filtering = source["filtering"];
	        this.other = source["other"];
	    }
	}
	export class ViewStateKey {
	    viewName: string;
	    facetName: types.DataFacet;
	
	    static createFrom(source: any = {}) {
	        return new ViewStateKey(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.viewName = source["viewName"];
	        this.facetName = source["facetName"];
	    }
	}
	export class Project {
	    version: string;
	    name: string;
	    last_opened: string;
	    lastView: string;
	    lastFacetMap: Record<string, string>;
	    addresses: base.Address[];
	    activeAddress: base.Address;
	    chains: string[];
	    activeChain: string;
	    contracts: string[];
	    activeContract: string;
	    activePeriod: types.Period;
	    filterStates: Record<string, FilterState>;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.last_opened = source["last_opened"];
	        this.lastView = source["lastView"];
	        this.lastFacetMap = source["lastFacetMap"];
	        this.addresses = this.convertValues(source["addresses"], base.Address);
	        this.activeAddress = this.convertValues(source["activeAddress"], base.Address);
	        this.chains = source["chains"];
	        this.activeChain = source["activeChain"];
	        this.contracts = source["contracts"];
	        this.activeContract = source["activeContract"];
	        this.activePeriod = source["activePeriod"];
	        this.filterStates = this.convertValues(source["filterStates"], FilterState, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace projects {
	
	export class AddressList {
	    address: string;
	    addressName: string;
	    name: string;
	    appearances: number;
	    lastUpdated: string;
	
	    static createFrom(source: any = {}) {
	        return new AddressList(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = source["address"];
	        this.addressName = source["addressName"];
	        this.name = source["name"];
	        this.appearances = source["appearances"];
	        this.lastUpdated = source["lastUpdated"];
	    }
	}
	export class ProjectsPage {
	    facet: types.DataFacet;
	    addresslist: AddressList[];
	    projects: project.Project[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new ProjectsPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.addresslist = this.convertValues(source["addresslist"], AddressList);
	        this.projects = this.convertValues(source["projects"], project.Project);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace prompt {
	
	export class Attribute {
	    database: string;
	    name: string;
	    bytes: string;
	    number: number;
	    factor: number;
	    count: number;
	    selector: number;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new Attribute(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.database = source["database"];
	        this.name = source["name"];
	        this.bytes = source["bytes"];
	        this.number = source["number"];
	        this.factor = source["factor"];
	        this.count = source["count"];
	        this.selector = source["selector"];
	        this.value = source["value"];
	    }
	}

}

export namespace sdk {
	
	export class SortSpec {
	    fields: string[];
	    orders: boolean[];
	
	    static createFrom(source: any = {}) {
	        return new SortSpec(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fields = source["fields"];
	        this.orders = source["orders"];
	    }
	}

}

export namespace skin {
	
	export class Skin {
	    name: string;
	    displayName: string;
	    description: string;
	    author?: string;
	    version?: string;
	    isBuiltIn: boolean;
	    primary: string[];
	    success: string[];
	    warning: string[];
	    error: string[];
	    fontFamily: string;
	    fontFamilyMono: string;
	    defaultRadius: string;
	    radius: Record<string, string>;
	    shadows: Record<string, string>;
	    defaultGradient: Record<string, any>;
	    autoContrast: boolean;
	    tinySize?: string;
	    smallSize?: string;
	    mediumSize?: string;
	    largeSize?: string;
	    hugeSize?: string;
	
	    static createFrom(source: any = {}) {
	        return new Skin(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.displayName = source["displayName"];
	        this.description = source["description"];
	        this.author = source["author"];
	        this.version = source["version"];
	        this.isBuiltIn = source["isBuiltIn"];
	        this.primary = source["primary"];
	        this.success = source["success"];
	        this.warning = source["warning"];
	        this.error = source["error"];
	        this.fontFamily = source["fontFamily"];
	        this.fontFamilyMono = source["fontFamilyMono"];
	        this.defaultRadius = source["defaultRadius"];
	        this.radius = source["radius"];
	        this.shadows = source["shadows"];
	        this.defaultGradient = source["defaultGradient"];
	        this.autoContrast = source["autoContrast"];
	        this.tinySize = source["tinySize"];
	        this.smallSize = source["smallSize"];
	        this.mediumSize = source["mediumSize"];
	        this.largeSize = source["largeSize"];
	        this.hugeSize = source["hugeSize"];
	    }
	}
	export class SkinMetadata {
	    name: string;
	    displayName: string;
	    description: string;
	    author?: string;
	    version?: string;
	    isBuiltIn: boolean;
	
	    static createFrom(source: any = {}) {
	        return new SkinMetadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.displayName = source["displayName"];
	        this.description = source["description"];
	        this.author = source["author"];
	        this.version = source["version"];
	        this.isBuiltIn = source["isBuiltIn"];
	    }
	}

}

export namespace status {
	
	export class StatusPage {
	    facet: types.DataFacet;
	    caches: types.CacheItem[];
	    chains: types.Chain[];
	    status: types.Status[];
	    totalItems: number;
	    expectedTotal: number;
	    state: types.StoreState;
	
	    static createFrom(source: any = {}) {
	        return new StatusPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.caches = this.convertValues(source["caches"], types.CacheItem);
	        this.chains = this.convertValues(source["chains"], types.Chain);
	        this.status = this.convertValues(source["status"], types.Status);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace types {
	
	export enum StoreState {
	    STALE = "stale",
	    FETCHING = "fetching",
	    LOADED = "loaded",
	}
	export enum Period {
	    BLOCKLY = "blockly",
	    HOURLY = "hourly",
	    DAILY = "daily",
	    WEEKLY = "weekly",
	    MONTHLY = "monthly",
	    QUARTERLY = "quarterly",
	    ANNUAL = "annual",
	}
	export enum DataFacet {
	    STATS = "stats",
	    INDEX = "index",
	    BLOOMS = "blooms",
	    MANIFEST = "manifest",
	    ALL = "all",
	    CUSTOM = "custom",
	    PREFUND = "prefund",
	    REGULAR = "regular",
	    BADDRESS = "baddress",
	    DOWNLOADED = "downloaded",
	    KNOWN = "known",
	    FUNCTIONS = "functions",
	    EVENTS = "events",
	    COMPARITOOR = "comparitoor",
	    CHIFRA = "chifra",
	    ETHERSCAN = "etherscan",
	    COVALENT = "covalent",
	    ALCHEMY = "alchemy",
	    DASHBOARD = "dashboard",
	    EXECUTE = "execute",
	    GENERATOR = "generator",
	    SERIES = "series",
	    DATABASES = "databases",
	    GALLERY = "gallery",
	    STATEMENTS = "statements",
	    BALANCES = "balances",
	    TRANSFERS = "transfers",
	    TRANSACTIONS = "transactions",
	    OPENAPPROVALS = "openapprovals",
	    APPROVALLOGS = "approvallogs",
	    APPROVALTXS = "approvaltxs",
	    WITHDRAWALS = "withdrawals",
	    ASSETS = "assets",
	    ASSETCHARTS = "assetcharts",
	    LOGS = "logs",
	    TRACES = "traces",
	    RECEIPTS = "receipts",
	    MONITORS = "monitors",
	    MANAGE = "manage",
	    STATUS = "status",
	    CACHES = "caches",
	    CHAINS = "chains",
	}
	export class AbiCalcs {
	    name?: string;
	
	    static createFrom(source: any = {}) {
	        return new AbiCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	    }
	}
	export class FunctionCalcs {
	    inputs?: any[];
	    outputs?: any[];
	
	    static createFrom(source: any = {}) {
	        return new FunctionCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.inputs = source["inputs"];
	        this.outputs = source["outputs"];
	    }
	}
	export class ParameterCalcs {
	    indexed?: boolean;
	    internalType?: string;
	
	    static createFrom(source: any = {}) {
	        return new ParameterCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.indexed = source["indexed"];
	        this.internalType = source["internalType"];
	    }
	}
	export class Parameter {
	    components?: Parameter[];
	    indexed?: boolean;
	    internalType?: string;
	    name: string;
	    strDefault?: string;
	    type: string;
	    value?: any;
	    calcs?: ParameterCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Parameter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.components = this.convertValues(source["components"], Parameter);
	        this.indexed = source["indexed"];
	        this.internalType = source["internalType"];
	        this.name = source["name"];
	        this.strDefault = source["strDefault"];
	        this.type = source["type"];
	        this.value = source["value"];
	        this.calcs = this.convertValues(source["calcs"], ParameterCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Function {
	    anonymous?: boolean;
	    constant?: boolean;
	    encoding: string;
	    inputs: Parameter[];
	    message?: string;
	    name: string;
	    outputs: Parameter[];
	    signature?: string;
	    stateMutability?: string;
	    type: string;
	    calcs?: FunctionCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Function(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.anonymous = source["anonymous"];
	        this.constant = source["constant"];
	        this.encoding = source["encoding"];
	        this.inputs = this.convertValues(source["inputs"], Parameter);
	        this.message = source["message"];
	        this.name = source["name"];
	        this.outputs = this.convertValues(source["outputs"], Parameter);
	        this.signature = source["signature"];
	        this.stateMutability = source["stateMutability"];
	        this.type = source["type"];
	        this.calcs = this.convertValues(source["calcs"], FunctionCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Abi {
	    address: base.Address;
	    addressName?: string;
	    fileSize: number;
	    functions: Function[];
	    hasConstructor: boolean;
	    hasFallback: boolean;
	    isEmpty: boolean;
	    isKnown: boolean;
	    lastModDate: string;
	    nEvents: number;
	    nFunctions: number;
	    name: string;
	    path: string;
	    calcs?: AbiCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Abi(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.fileSize = source["fileSize"];
	        this.functions = this.convertValues(source["functions"], Function);
	        this.hasConstructor = source["hasConstructor"];
	        this.hasFallback = source["hasFallback"];
	        this.isEmpty = source["isEmpty"];
	        this.isKnown = source["isKnown"];
	        this.lastModDate = source["lastModDate"];
	        this.nEvents = source["nEvents"];
	        this.nFunctions = source["nFunctions"];
	        this.name = source["name"];
	        this.path = source["path"];
	        this.calcs = this.convertValues(source["calcs"], AbiCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ActionConfig {
	    name: string;
	    label: string;
	    icon: string;
	    confirmation: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ActionConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.label = source["label"];
	        this.icon = source["icon"];
	        this.confirmation = source["confirmation"];
	    }
	}
	export class ApprovalCalcs {
	    date: string;
	    lastAppDate: string;
	
	    static createFrom(source: any = {}) {
	        return new ApprovalCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.lastAppDate = source["lastAppDate"];
	    }
	}
	export class Approval {
	    // Go type: base
	    allowance: any;
	    blockNumber: number;
	    lastAppBlock: number;
	    lastAppLogID: number;
	    lastAppTs: number;
	    lastAppTxID: number;
	    owner: base.Address;
	    ownerName?: string;
	    spender: base.Address;
	    spenderName?: string;
	    timestamp: number;
	    token: base.Address;
	    tokenName?: string;
	    calcs?: ApprovalCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Approval(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.allowance = this.convertValues(source["allowance"], null);
	        this.blockNumber = source["blockNumber"];
	        this.lastAppBlock = source["lastAppBlock"];
	        this.lastAppLogID = source["lastAppLogID"];
	        this.lastAppTs = source["lastAppTs"];
	        this.lastAppTxID = source["lastAppTxID"];
	        this.owner = this.convertValues(source["owner"], base.Address);
	        this.ownerName = source["ownerName"];
	        this.spender = this.convertValues(source["spender"], base.Address);
	        this.spenderName = source["spenderName"];
	        this.timestamp = source["timestamp"];
	        this.token = this.convertValues(source["token"], base.Address);
	        this.tokenName = source["tokenName"];
	        this.calcs = this.convertValues(source["calcs"], ApprovalCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Bucket {
	    bucketIndex: string;
	    startBlock: number;
	    endBlock: number;
	    total: number;
	    colorValue: number;
	
	    static createFrom(source: any = {}) {
	        return new Bucket(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.bucketIndex = source["bucketIndex"];
	        this.startBlock = source["startBlock"];
	        this.endBlock = source["endBlock"];
	        this.total = source["total"];
	        this.colorValue = source["colorValue"];
	    }
	}
	export class GridInfo {
	    rows: number;
	    columns: number;
	    maxBlock: number;
	    size: number;
	    bucketCount: number;
	
	    static createFrom(source: any = {}) {
	        return new GridInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.rows = source["rows"];
	        this.columns = source["columns"];
	        this.maxBlock = source["maxBlock"];
	        this.size = source["size"];
	        this.bucketCount = source["bucketCount"];
	    }
	}
	export class NameCalcs {
	
	
	    static createFrom(source: any = {}) {
	        return new NameCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class Name {
	    address: base.Address;
	    addressName?: string;
	    decimals: number;
	    deleted?: boolean;
	    isContract?: boolean;
	    isCustom?: boolean;
	    isErc20?: boolean;
	    isErc721?: boolean;
	    isPrefund?: boolean;
	    name: string;
	    source: string;
	    symbol: string;
	    tags: string;
	    // Go type: NameCalcs
	    calcs?: any;
	    // Go type: base
	    prefund?: any;
	    parts?: number;
	
	    static createFrom(source: any = {}) {
	        return new Name(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.decimals = source["decimals"];
	        this.deleted = source["deleted"];
	        this.isContract = source["isContract"];
	        this.isCustom = source["isCustom"];
	        this.isErc20 = source["isErc20"];
	        this.isErc721 = source["isErc721"];
	        this.isPrefund = source["isPrefund"];
	        this.name = source["name"];
	        this.source = source["source"];
	        this.symbol = source["symbol"];
	        this.tags = source["tags"];
	        this.calcs = this.convertValues(source["calcs"], null);
	        this.prefund = this.convertValues(source["prefund"], null);
	        this.parts = source["parts"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Buckets {
	    series: Record<string, Array<Bucket>>;
	    assetNames?: Record<string, Name>;
	    gridInfo: GridInfo;
	
	    static createFrom(source: any = {}) {
	        return new Buckets(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.series = this.convertValues(source["series"], Array<Bucket>, true);
	        this.assetNames = this.convertValues(source["assetNames"], Name, true);
	        this.gridInfo = this.convertValues(source["gridInfo"], GridInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CacheItemCalcs {
	
	
	    static createFrom(source: any = {}) {
	        return new CacheItemCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class CacheItem {
	    items: any[];
	    lastCached?: string;
	    nFiles: number;
	    nFolders: number;
	    path: string;
	    sizeInBytes: number;
	    type: string;
	    // Go type: CacheItemCalcs
	    calcs?: any;
	
	    static createFrom(source: any = {}) {
	        return new CacheItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = source["items"];
	        this.lastCached = source["lastCached"];
	        this.nFiles = source["nFiles"];
	        this.nFolders = source["nFolders"];
	        this.path = source["path"];
	        this.sizeInBytes = source["sizeInBytes"];
	        this.type = source["type"];
	        this.calcs = this.convertValues(source["calcs"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChainCalcs {
	
	
	    static createFrom(source: any = {}) {
	        return new ChainCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class Chain {
	    chain: string;
	    chainId: number;
	    ipfsGateway: string;
	    localExplorer: string;
	    remoteExplorer: string;
	    rpcProvider: string;
	    symbol: string;
	    // Go type: ChainCalcs
	    calcs?: any;
	
	    static createFrom(source: any = {}) {
	        return new Chain(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chain = source["chain"];
	        this.chainId = source["chainId"];
	        this.ipfsGateway = source["ipfsGateway"];
	        this.localExplorer = source["localExplorer"];
	        this.remoteExplorer = source["remoteExplorer"];
	        this.rpcProvider = source["rpcProvider"];
	        this.symbol = source["symbol"];
	        this.calcs = this.convertValues(source["calcs"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChunkBloomCalcs {
	    hash: string;
	    hashValue?: string;
	    rangeDates?: any;
	    firstTs?: number;
	    firstDate?: string;
	    lastTs?: number;
	    lastDate?: string;
	
	    static createFrom(source: any = {}) {
	        return new ChunkBloomCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hash = source["hash"];
	        this.hashValue = source["hashValue"];
	        this.rangeDates = source["rangeDates"];
	        this.firstTs = source["firstTs"];
	        this.firstDate = source["firstDate"];
	        this.lastTs = source["lastTs"];
	        this.lastDate = source["lastDate"];
	    }
	}
	export class RangeDatesCalcs {
	
	
	    static createFrom(source: any = {}) {
	        return new RangeDatesCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class RangeDates {
	    firstDate?: string;
	    firstTs?: number;
	    lastDate?: string;
	    lastTs?: number;
	    // Go type: RangeDatesCalcs
	    calcs?: any;
	
	    static createFrom(source: any = {}) {
	        return new RangeDates(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.firstDate = source["firstDate"];
	        this.firstTs = source["firstTs"];
	        this.lastDate = source["lastDate"];
	        this.lastTs = source["lastTs"];
	        this.calcs = this.convertValues(source["calcs"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChunkBloom {
	    byteWidth: number;
	    fileSize: number;
	    hash: base.Hash;
	    magic: string;
	    nBlooms: number;
	    nInserted: number;
	    range: string;
	    rangeDates?: RangeDates;
	    calcs?: ChunkBloomCalcs;
	
	    static createFrom(source: any = {}) {
	        return new ChunkBloom(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.byteWidth = source["byteWidth"];
	        this.fileSize = source["fileSize"];
	        this.hash = this.convertValues(source["hash"], base.Hash);
	        this.magic = source["magic"];
	        this.nBlooms = source["nBlooms"];
	        this.nInserted = source["nInserted"];
	        this.range = source["range"];
	        this.rangeDates = this.convertValues(source["rangeDates"], RangeDates);
	        this.calcs = this.convertValues(source["calcs"], ChunkBloomCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ChunkIndexCalcs {
	    hash: string;
	    hashValue?: string;
	    rangeDates?: any;
	    firstTs?: number;
	    firstDate?: string;
	    lastTs?: number;
	    lastDate?: string;
	
	    static createFrom(source: any = {}) {
	        return new ChunkIndexCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hash = source["hash"];
	        this.hashValue = source["hashValue"];
	        this.rangeDates = source["rangeDates"];
	        this.firstTs = source["firstTs"];
	        this.firstDate = source["firstDate"];
	        this.lastTs = source["lastTs"];
	        this.lastDate = source["lastDate"];
	    }
	}
	export class ChunkIndex {
	    fileSize: number;
	    hash: base.Hash;
	    magic: string;
	    nAddresses: number;
	    nAppearances: number;
	    range: string;
	    rangeDates?: RangeDates;
	    calcs?: ChunkIndexCalcs;
	
	    static createFrom(source: any = {}) {
	        return new ChunkIndex(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fileSize = source["fileSize"];
	        this.hash = this.convertValues(source["hash"], base.Hash);
	        this.magic = source["magic"];
	        this.nAddresses = source["nAddresses"];
	        this.nAppearances = source["nAppearances"];
	        this.range = source["range"];
	        this.rangeDates = this.convertValues(source["rangeDates"], RangeDates);
	        this.calcs = this.convertValues(source["calcs"], ChunkIndexCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ChunkRecordCalcs {
	    rangeDates?: any;
	    firstTs?: number;
	    firstDate?: string;
	    lastTs?: number;
	    lastDate?: string;
	
	    static createFrom(source: any = {}) {
	        return new ChunkRecordCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.rangeDates = source["rangeDates"];
	        this.firstTs = source["firstTs"];
	        this.firstDate = source["firstDate"];
	        this.lastTs = source["lastTs"];
	        this.lastDate = source["lastDate"];
	    }
	}
	export class ChunkRecord {
	    bloomHash: string;
	    bloomSize: number;
	    indexHash: string;
	    indexSize: number;
	    range: string;
	    rangeDates?: RangeDates;
	    calcs?: ChunkRecordCalcs;
	
	    static createFrom(source: any = {}) {
	        return new ChunkRecord(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.bloomHash = source["bloomHash"];
	        this.bloomSize = source["bloomSize"];
	        this.indexHash = source["indexHash"];
	        this.indexSize = source["indexSize"];
	        this.range = source["range"];
	        this.rangeDates = this.convertValues(source["rangeDates"], RangeDates);
	        this.calcs = this.convertValues(source["calcs"], ChunkRecordCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ChunkStatsCalcs {
	    rangeDates?: any;
	    firstTs?: number;
	    firstDate?: string;
	    lastTs?: number;
	    lastDate?: string;
	
	    static createFrom(source: any = {}) {
	        return new ChunkStatsCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.rangeDates = source["rangeDates"];
	        this.firstTs = source["firstTs"];
	        this.firstDate = source["firstDate"];
	        this.lastTs = source["lastTs"];
	        this.lastDate = source["lastDate"];
	    }
	}
	export class ChunkStats {
	    addrsPerBlock: number;
	    appsPerAddr: number;
	    appsPerBlock: number;
	    bloomSz: number;
	    chunkSz: number;
	    nAddrs: number;
	    nApps: number;
	    nBlocks: number;
	    nBlooms: number;
	    range: string;
	    rangeDates?: RangeDates;
	    ratio: number;
	    recWid: number;
	    calcs?: ChunkStatsCalcs;
	
	    static createFrom(source: any = {}) {
	        return new ChunkStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.addrsPerBlock = source["addrsPerBlock"];
	        this.appsPerAddr = source["appsPerAddr"];
	        this.appsPerBlock = source["appsPerBlock"];
	        this.bloomSz = source["bloomSz"];
	        this.chunkSz = source["chunkSz"];
	        this.nAddrs = source["nAddrs"];
	        this.nApps = source["nApps"];
	        this.nBlocks = source["nBlocks"];
	        this.nBlooms = source["nBlooms"];
	        this.range = source["range"];
	        this.rangeDates = this.convertValues(source["rangeDates"], RangeDates);
	        this.ratio = source["ratio"];
	        this.recWid = source["recWid"];
	        this.calcs = this.convertValues(source["calcs"], ChunkStatsCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ColumnConfig {
	    key: string;
	    header: string;
	    width: number;
	    sortable: boolean;
	    type: string;
	    order: number;
	
	    static createFrom(source: any = {}) {
	        return new ColumnConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.header = source["header"];
	        this.width = source["width"];
	        this.sortable = source["sortable"];
	        this.type = source["type"];
	        this.order = source["order"];
	    }
	}
	export class ContractCalcs {
	    date?: string;
	
	    static createFrom(source: any = {}) {
	        return new ContractCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	    }
	}
	export class Contract {
	    abi?: Abi;
	    address: base.Address;
	    addressName?: string;
	    errorCount: number;
	    lastError: string;
	    lastUpdated: number;
	    name: string;
	    calcs?: ContractCalcs;
	    readResults: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new Contract(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.abi = this.convertValues(source["abi"], Abi);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.errorCount = source["errorCount"];
	        this.lastError = source["lastError"];
	        this.lastUpdated = source["lastUpdated"];
	        this.name = source["name"];
	        this.calcs = this.convertValues(source["calcs"], ContractCalcs);
	        this.readResults = source["readResults"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class DetailRendererConfig {
	    key: string;
	    label: string;
	    type: string;
	    detailOrder: number;
	
	    static createFrom(source: any = {}) {
	        return new DetailRendererConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.label = source["label"];
	        this.type = source["type"];
	        this.detailOrder = source["detailOrder"];
	    }
	}
	export class DetailPanelConfig {
	    title: string;
	    collapsed: boolean;
	    fields: DetailRendererConfig[];
	
	    static createFrom(source: any = {}) {
	        return new DetailPanelConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	        this.collapsed = source["collapsed"];
	        this.fields = this.convertValues(source["fields"], DetailRendererConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class FacetChartConfig {
	    seriesStrategy?: string;
	    seriesPrefixLen?: number;
	
	    static createFrom(source: any = {}) {
	        return new FacetChartConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.seriesStrategy = source["seriesStrategy"];
	        this.seriesPrefixLen = source["seriesPrefixLen"];
	    }
	}
	export class RowIdentifier {
	    type: string;
	    fieldName: string;
	    contextKey?: string;
	
	    static createFrom(source: any = {}) {
	        return new RowIdentifier(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.fieldName = source["fieldName"];
	        this.contextKey = source["contextKey"];
	    }
	}
	export class NavigationTarget {
	    view: string;
	    facet: string;
	    rowIndex: number;
	    identifiers?: RowIdentifier[];
	
	    static createFrom(source: any = {}) {
	        return new NavigationTarget(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.view = source["view"];
	        this.facet = source["facet"];
	        this.rowIndex = source["rowIndex"];
	        this.identifiers = this.convertValues(source["identifiers"], RowIdentifier);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class RowActionConfig {
	    type: string;
	    target?: NavigationTarget;
	    customHandler?: string;
	    parameters?: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new RowActionConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.target = this.convertValues(source["target"], NavigationTarget);
	        this.customHandler = source["customHandler"];
	        this.parameters = source["parameters"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MetricConfig {
	    key: string;
	    label: string;
	    bucketsField: string;
	    bytes: boolean;
	
	    static createFrom(source: any = {}) {
	        return new MetricConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.label = source["label"];
	        this.bucketsField = source["bucketsField"];
	        this.bytes = source["bytes"];
	    }
	}
	export class PanelChartConfig {
	    type: string;
	    defaultMetric: string;
	    skipUntil?: string;
	    timeGroupBy?: string;
	    metrics: MetricConfig[];
	
	    static createFrom(source: any = {}) {
	        return new PanelChartConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.defaultMetric = source["defaultMetric"];
	        this.skipUntil = source["skipUntil"];
	        this.timeGroupBy = source["timeGroupBy"];
	        this.metrics = this.convertValues(source["metrics"], MetricConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class FieldConfig {
	    key: string;
	    label: string;
	    type: string;
	    section: string;
	    width: number;
	    sortable: boolean;
	    order: number;
	    detailOrder: number;
	
	    static createFrom(source: any = {}) {
	        return new FieldConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.label = source["label"];
	        this.type = source["type"];
	        this.section = source["section"];
	        this.width = source["width"];
	        this.sortable = source["sortable"];
	        this.order = source["order"];
	        this.detailOrder = source["detailOrder"];
	    }
	}
	export class FacetConfig {
	    name: string;
	    store: string;
	    viewType?: string;
	    dividerBefore: boolean;
	    disabled: boolean;
	    canClose: boolean;
	    fields: FieldConfig[];
	    columns: ColumnConfig[];
	    detailPanels: DetailPanelConfig[];
	    actions: string[];
	    headerActions: string[];
	    panel: string;
	    panelChartConfig?: PanelChartConfig;
	    facetChartConfig?: FacetChartConfig;
	    rowAction?: RowActionConfig;
	
	    static createFrom(source: any = {}) {
	        return new FacetConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.store = source["store"];
	        this.viewType = source["viewType"];
	        this.dividerBefore = source["dividerBefore"];
	        this.disabled = source["disabled"];
	        this.canClose = source["canClose"];
	        this.fields = this.convertValues(source["fields"], FieldConfig);
	        this.columns = this.convertValues(source["columns"], ColumnConfig);
	        this.detailPanels = this.convertValues(source["detailPanels"], DetailPanelConfig);
	        this.actions = source["actions"];
	        this.headerActions = source["headerActions"];
	        this.panel = source["panel"];
	        this.panelChartConfig = this.convertValues(source["panelChartConfig"], PanelChartConfig);
	        this.facetChartConfig = this.convertValues(source["facetChartConfig"], FacetChartConfig);
	        this.rowAction = this.convertValues(source["rowAction"], RowActionConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	
	export class LogCalcs {
	    date: string;
	    isNFT?: boolean;
	    data?: string;
	    articulatedLog?: Record<string, any>;
	    topics?: string[];
	    compressedLog?: string;
	    topic0?: string;
	    topic1?: string;
	    topic2?: string;
	    topic3?: string;
	
	    static createFrom(source: any = {}) {
	        return new LogCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.isNFT = source["isNFT"];
	        this.data = source["data"];
	        this.articulatedLog = source["articulatedLog"];
	        this.topics = source["topics"];
	        this.compressedLog = source["compressedLog"];
	        this.topic0 = source["topic0"];
	        this.topic1 = source["topic1"];
	        this.topic2 = source["topic2"];
	        this.topic3 = source["topic3"];
	    }
	}
	export class Log {
	    address: base.Address;
	    addressName?: string;
	    articulatedLog?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    data?: string;
	    logIndex: number;
	    timestamp?: number;
	    topics?: base.Hash[];
	    transactionHash: base.Hash;
	    transactionIndex: number;
	    calcs?: LogCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Log(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.articulatedLog = this.convertValues(source["articulatedLog"], Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.data = source["data"];
	        this.logIndex = source["logIndex"];
	        this.timestamp = source["timestamp"];
	        this.topics = this.convertValues(source["topics"], base.Hash);
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	        this.calcs = this.convertValues(source["calcs"], LogCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ManifestCalcs {
	
	
	    static createFrom(source: any = {}) {
	        return new ManifestCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class Manifest {
	    chain: string;
	    chunks: ChunkRecord[];
	    specification: string;
	    version: string;
	    // Go type: ManifestCalcs
	    calcs?: any;
	
	    static createFrom(source: any = {}) {
	        return new Manifest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chain = source["chain"];
	        this.chunks = this.convertValues(source["chunks"], ChunkRecord);
	        this.specification = source["specification"];
	        this.version = source["version"];
	        this.calcs = this.convertValues(source["calcs"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MetaDataCalcs {
	    indexHeight: number;
	    nextIndexHeight: number;
	    chainHeight: number;
	    stageHeight: number;
	
	    static createFrom(source: any = {}) {
	        return new MetaDataCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.indexHeight = source["indexHeight"];
	        this.nextIndexHeight = source["nextIndexHeight"];
	        this.chainHeight = source["chainHeight"];
	        this.stageHeight = source["stageHeight"];
	    }
	}
	export class MetaData {
	    client: number;
	    finalized: number;
	    staging: number;
	    ripe: number;
	    unripe: number;
	    chainId?: number;
	    networkId?: number;
	    chain?: string;
	    calcs?: MetaDataCalcs;
	
	    static createFrom(source: any = {}) {
	        return new MetaData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.client = source["client"];
	        this.finalized = source["finalized"];
	        this.staging = source["staging"];
	        this.ripe = source["ripe"];
	        this.unripe = source["unripe"];
	        this.chainId = source["chainId"];
	        this.networkId = source["networkId"];
	        this.chain = source["chain"];
	        this.calcs = this.convertValues(source["calcs"], MetaDataCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class MonitorCalcs {
	    isEmpty?: boolean;
	    isStaged?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new MonitorCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.isEmpty = source["isEmpty"];
	        this.isStaged = source["isStaged"];
	    }
	}
	export class Monitor {
	    address: base.Address;
	    addressName?: string;
	    deleted: boolean;
	    fileSize: number;
	    isEmpty: boolean;
	    isStaged: boolean;
	    lastScanned: number;
	    nRecords: number;
	    name: string;
	    calcs?: MonitorCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Monitor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.deleted = source["deleted"];
	        this.fileSize = source["fileSize"];
	        this.isEmpty = source["isEmpty"];
	        this.isStaged = source["isStaged"];
	        this.lastScanned = source["lastScanned"];
	        this.nRecords = source["nRecords"];
	        this.name = source["name"];
	        this.calcs = this.convertValues(source["calcs"], MonitorCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	
	
	
	export class Payload {
	    collection: string;
	    dataFacet: DataFacet;
	    activeChain?: string;
	    activeAddress?: string;
	    activePeriod?: Period;
	    targetAddress?: string;
	    targetSwitch?: boolean;
	    format?: string;
	    projectPath?: string;
	
	    static createFrom(source: any = {}) {
	        return new Payload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collection = source["collection"];
	        this.dataFacet = source["dataFacet"];
	        this.activeChain = source["activeChain"];
	        this.activeAddress = source["activeAddress"];
	        this.activePeriod = source["activePeriod"];
	        this.targetAddress = source["targetAddress"];
	        this.targetSwitch = source["targetSwitch"];
	        this.format = source["format"];
	        this.projectPath = source["projectPath"];
	    }
	}
	export class ProjectPayload {
	    hasProject: boolean;
	    activeChain: string;
	    activePeriod: Period;
	    activeAddress: string;
	    activeContract: string;
	    lastView: string;
	    lastFacetMap: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new ProjectPayload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hasProject = source["hasProject"];
	        this.activeChain = source["activeChain"];
	        this.activePeriod = source["activePeriod"];
	        this.activeAddress = source["activeAddress"];
	        this.activeContract = source["activeContract"];
	        this.lastView = source["lastView"];
	        this.lastFacetMap = source["lastFacetMap"];
	    }
	}
	
	export class ReceiptCalcs {
	    contractAddress?: base.Address;
	    isError?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ReceiptCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contractAddress = this.convertValues(source["contractAddress"], base.Address);
	        this.isError = source["isError"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Receipt {
	    blockHash?: base.Hash;
	    blockNumber: number;
	    contractAddress?: base.Address;
	    contractAddressName?: string;
	    cumulativeGasUsed?: number;
	    effectiveGasPrice?: number;
	    from?: base.Address;
	    fromName?: string;
	    gasUsed: number;
	    isError?: boolean;
	    logs: Log[];
	    status: number;
	    to?: base.Address;
	    toName?: string;
	    transactionHash: base.Hash;
	    transactionIndex: number;
	    calcs?: ReceiptCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Receipt(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.contractAddress = this.convertValues(source["contractAddress"], base.Address);
	        this.contractAddressName = source["contractAddressName"];
	        this.cumulativeGasUsed = source["cumulativeGasUsed"];
	        this.effectiveGasPrice = source["effectiveGasPrice"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.fromName = source["fromName"];
	        this.gasUsed = source["gasUsed"];
	        this.isError = source["isError"];
	        this.logs = this.convertValues(source["logs"], Log);
	        this.status = source["status"];
	        this.to = this.convertValues(source["to"], base.Address);
	        this.toName = source["toName"];
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	        this.calcs = this.convertValues(source["calcs"], ReceiptCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Rewards {
	    // Go type: base
	    block: any;
	    // Go type: base
	    nephew: any;
	    // Go type: base
	    txFee: any;
	    // Go type: base
	    uncle: any;
	
	    static createFrom(source: any = {}) {
	        return new Rewards(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.block = this.convertValues(source["block"], null);
	        this.nephew = this.convertValues(source["nephew"], null);
	        this.txFee = this.convertValues(source["txFee"], null);
	        this.uncle = this.convertValues(source["uncle"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class RowActionPayload {
	    collection: string;
	    dataFacet: DataFacet;
	    activeChain?: string;
	    activeAddress?: string;
	    activePeriod?: Period;
	    targetAddress?: string;
	    targetSwitch?: boolean;
	    format?: string;
	    projectPath?: string;
	    rowData: Record<string, any>;
	    rowAction?: RowActionConfig;
	    contextValues?: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new RowActionPayload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collection = source["collection"];
	        this.dataFacet = source["dataFacet"];
	        this.activeChain = source["activeChain"];
	        this.activeAddress = source["activeAddress"];
	        this.activePeriod = source["activePeriod"];
	        this.targetAddress = source["targetAddress"];
	        this.targetSwitch = source["targetSwitch"];
	        this.format = source["format"];
	        this.projectPath = source["projectPath"];
	        this.rowData = source["rowData"];
	        this.rowAction = this.convertValues(source["rowAction"], RowActionConfig);
	        this.contextValues = source["contextValues"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class StatementCalcs {
	    // Go type: base
	    amountNet: any;
	    // Go type: base
	    begBalDiff: any;
	    date: string;
	    // Go type: base
	    endBalCalc: any;
	    // Go type: base
	    endBalDiff: any;
	    reconciled: boolean;
	    // Go type: base
	    totalIn: any;
	    // Go type: base
	    totalOut: any;
	    amountInEth?: string;
	    amountNetEth?: string;
	    amountOutEth?: string;
	    begBalDiffEth?: string;
	    begBalEth?: string;
	    correctAmountInEth?: string;
	    correctAmountOutEth?: string;
	    correctBegBalInEth?: string;
	    correctBegBalOutEth?: string;
	    correctEndBalInEth?: string;
	    correctEndBalOutEth?: string;
	    endBalCalcEth?: string;
	    endBalDiffEth?: string;
	    endBalEth?: string;
	    gasOutEth?: string;
	    internalInEth?: string;
	    internalOutEth?: string;
	    minerBaseRewardInEth?: string;
	    minerNephewRewardInEth?: string;
	    minerTxFeeInEth?: string;
	    minerUncleRewardInEth?: string;
	    prefundInEth?: string;
	    prevBalEth?: string;
	    selfDestructInEth?: string;
	    selfDestructOutEth?: string;
	    totalInEth?: string;
	    totalOutEth?: string;
	
	    static createFrom(source: any = {}) {
	        return new StatementCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.amountNet = this.convertValues(source["amountNet"], null);
	        this.begBalDiff = this.convertValues(source["begBalDiff"], null);
	        this.date = source["date"];
	        this.endBalCalc = this.convertValues(source["endBalCalc"], null);
	        this.endBalDiff = this.convertValues(source["endBalDiff"], null);
	        this.reconciled = source["reconciled"];
	        this.totalIn = this.convertValues(source["totalIn"], null);
	        this.totalOut = this.convertValues(source["totalOut"], null);
	        this.amountInEth = source["amountInEth"];
	        this.amountNetEth = source["amountNetEth"];
	        this.amountOutEth = source["amountOutEth"];
	        this.begBalDiffEth = source["begBalDiffEth"];
	        this.begBalEth = source["begBalEth"];
	        this.correctAmountInEth = source["correctAmountInEth"];
	        this.correctAmountOutEth = source["correctAmountOutEth"];
	        this.correctBegBalInEth = source["correctBegBalInEth"];
	        this.correctBegBalOutEth = source["correctBegBalOutEth"];
	        this.correctEndBalInEth = source["correctEndBalInEth"];
	        this.correctEndBalOutEth = source["correctEndBalOutEth"];
	        this.endBalCalcEth = source["endBalCalcEth"];
	        this.endBalDiffEth = source["endBalDiffEth"];
	        this.endBalEth = source["endBalEth"];
	        this.gasOutEth = source["gasOutEth"];
	        this.internalInEth = source["internalInEth"];
	        this.internalOutEth = source["internalOutEth"];
	        this.minerBaseRewardInEth = source["minerBaseRewardInEth"];
	        this.minerNephewRewardInEth = source["minerNephewRewardInEth"];
	        this.minerTxFeeInEth = source["minerTxFeeInEth"];
	        this.minerUncleRewardInEth = source["minerUncleRewardInEth"];
	        this.prefundInEth = source["prefundInEth"];
	        this.prevBalEth = source["prevBalEth"];
	        this.selfDestructInEth = source["selfDestructInEth"];
	        this.selfDestructOutEth = source["selfDestructOutEth"];
	        this.totalInEth = source["totalInEth"];
	        this.totalOutEth = source["totalOutEth"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Statement {
	    accountedFor: base.Address;
	    accountedForName?: string;
	    // Go type: base
	    amountIn?: any;
	    // Go type: base
	    amountOut?: any;
	    asset: base.Address;
	    assetName?: string;
	    // Go type: base
	    begBal: any;
	    blockNumber: number;
	    // Go type: base
	    correctAmountIn?: any;
	    // Go type: base
	    correctAmountOut?: any;
	    // Go type: base
	    correctBegBalIn?: any;
	    // Go type: base
	    correctBegBalOut?: any;
	    // Go type: base
	    correctEndBalIn?: any;
	    // Go type: base
	    correctEndBalOut?: any;
	    correctingReasons?: string;
	    decimals: number;
	    // Go type: base
	    endBal: any;
	    // Go type: base
	    gasOut?: any;
	    // Go type: base
	    internalIn?: any;
	    // Go type: base
	    internalOut?: any;
	    logIndex: number;
	    // Go type: base
	    minerBaseRewardIn?: any;
	    // Go type: base
	    minerNephewRewardIn?: any;
	    // Go type: base
	    minerTxFeeIn?: any;
	    // Go type: base
	    minerUncleRewardIn?: any;
	    // Go type: base
	    prefundIn?: any;
	    // Go type: base
	    prevBal?: any;
	    priceSource: string;
	    recipient: base.Address;
	    recipientName?: string;
	    // Go type: base
	    selfDestructIn?: any;
	    // Go type: base
	    selfDestructOut?: any;
	    sender: base.Address;
	    senderName?: string;
	    // Go type: base
	    spotPrice: any;
	    symbol: string;
	    timestamp: number;
	    transactionHash: base.Hash;
	    transactionIndex: number;
	    calcs?: StatementCalcs;
	    correctionId: number;
	    holder: base.Address;
	    statementId: number;
	
	    static createFrom(source: any = {}) {
	        return new Statement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.accountedFor = this.convertValues(source["accountedFor"], base.Address);
	        this.accountedForName = source["accountedForName"];
	        this.amountIn = this.convertValues(source["amountIn"], null);
	        this.amountOut = this.convertValues(source["amountOut"], null);
	        this.asset = this.convertValues(source["asset"], base.Address);
	        this.assetName = source["assetName"];
	        this.begBal = this.convertValues(source["begBal"], null);
	        this.blockNumber = source["blockNumber"];
	        this.correctAmountIn = this.convertValues(source["correctAmountIn"], null);
	        this.correctAmountOut = this.convertValues(source["correctAmountOut"], null);
	        this.correctBegBalIn = this.convertValues(source["correctBegBalIn"], null);
	        this.correctBegBalOut = this.convertValues(source["correctBegBalOut"], null);
	        this.correctEndBalIn = this.convertValues(source["correctEndBalIn"], null);
	        this.correctEndBalOut = this.convertValues(source["correctEndBalOut"], null);
	        this.correctingReasons = source["correctingReasons"];
	        this.decimals = source["decimals"];
	        this.endBal = this.convertValues(source["endBal"], null);
	        this.gasOut = this.convertValues(source["gasOut"], null);
	        this.internalIn = this.convertValues(source["internalIn"], null);
	        this.internalOut = this.convertValues(source["internalOut"], null);
	        this.logIndex = source["logIndex"];
	        this.minerBaseRewardIn = this.convertValues(source["minerBaseRewardIn"], null);
	        this.minerNephewRewardIn = this.convertValues(source["minerNephewRewardIn"], null);
	        this.minerTxFeeIn = this.convertValues(source["minerTxFeeIn"], null);
	        this.minerUncleRewardIn = this.convertValues(source["minerUncleRewardIn"], null);
	        this.prefundIn = this.convertValues(source["prefundIn"], null);
	        this.prevBal = this.convertValues(source["prevBal"], null);
	        this.priceSource = source["priceSource"];
	        this.recipient = this.convertValues(source["recipient"], base.Address);
	        this.recipientName = source["recipientName"];
	        this.selfDestructIn = this.convertValues(source["selfDestructIn"], null);
	        this.selfDestructOut = this.convertValues(source["selfDestructOut"], null);
	        this.sender = this.convertValues(source["sender"], base.Address);
	        this.senderName = source["senderName"];
	        this.spotPrice = this.convertValues(source["spotPrice"], null);
	        this.symbol = source["symbol"];
	        this.timestamp = source["timestamp"];
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	        this.calcs = this.convertValues(source["calcs"], StatementCalcs);
	        this.correctionId = source["correctionId"];
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.statementId = source["statementId"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class StatusCalcs {
	    caches?: CacheItem[];
	    chains?: Chain[];
	
	    static createFrom(source: any = {}) {
	        return new StatusCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.caches = this.convertValues(source["caches"], CacheItem);
	        this.chains = this.convertValues(source["chains"], Chain);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Status {
	    cachePath?: string;
	    caches: CacheItem[];
	    chain?: string;
	    chainConfig?: string;
	    chainId?: string;
	    chains: Chain[];
	    clientVersion?: string;
	    hasEsKey?: boolean;
	    hasPinKey?: boolean;
	    indexPath?: string;
	    isApi?: boolean;
	    isArchive?: boolean;
	    isScraping?: boolean;
	    isTesting?: boolean;
	    isTracing?: boolean;
	    networkId?: string;
	    progress?: string;
	    rootConfig?: string;
	    rpcProvider?: string;
	    version?: string;
	    calcs?: StatusCalcs;
	    meta?: MetaData;
	    diffs?: MetaData;
	
	    static createFrom(source: any = {}) {
	        return new Status(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cachePath = source["cachePath"];
	        this.caches = this.convertValues(source["caches"], CacheItem);
	        this.chain = source["chain"];
	        this.chainConfig = source["chainConfig"];
	        this.chainId = source["chainId"];
	        this.chains = this.convertValues(source["chains"], Chain);
	        this.clientVersion = source["clientVersion"];
	        this.hasEsKey = source["hasEsKey"];
	        this.hasPinKey = source["hasPinKey"];
	        this.indexPath = source["indexPath"];
	        this.isApi = source["isApi"];
	        this.isArchive = source["isArchive"];
	        this.isScraping = source["isScraping"];
	        this.isTesting = source["isTesting"];
	        this.isTracing = source["isTracing"];
	        this.networkId = source["networkId"];
	        this.progress = source["progress"];
	        this.rootConfig = source["rootConfig"];
	        this.rpcProvider = source["rpcProvider"];
	        this.version = source["version"];
	        this.calcs = this.convertValues(source["calcs"], StatusCalcs);
	        this.meta = this.convertValues(source["meta"], MetaData);
	        this.diffs = this.convertValues(source["diffs"], MetaData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Summary {
	    totalCount: number;
	    facetCounts: Record<string, number>;
	    customData?: Record<string, any>;
	    lastUpdated: number;
	
	    static createFrom(source: any = {}) {
	        return new Summary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.totalCount = source["totalCount"];
	        this.facetCounts = source["facetCounts"];
	        this.customData = source["customData"];
	        this.lastUpdated = source["lastUpdated"];
	    }
	}
	export class TokenCalcs {
	    balanceDec?: string;
	    date?: string;
	    diff?: string;
	    totalSupply?: string;
	
	    static createFrom(source: any = {}) {
	        return new TokenCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.balanceDec = source["balanceDec"];
	        this.date = source["date"];
	        this.diff = source["diff"];
	        this.totalSupply = source["totalSupply"];
	    }
	}
	export class Token {
	    address: base.Address;
	    addressName?: string;
	    // Go type: base
	    balance: any;
	    blockNumber: number;
	    decimals: number;
	    holder: base.Address;
	    holderName?: string;
	    name: string;
	    // Go type: base
	    priorBalance?: any;
	    symbol: string;
	    timestamp: number;
	    // Go type: base
	    totalSupply: any;
	    transactionIndex?: number;
	    type: number;
	    calcs?: TokenCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Token(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.balance = this.convertValues(source["balance"], null);
	        this.blockNumber = source["blockNumber"];
	        this.decimals = source["decimals"];
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.holderName = source["holderName"];
	        this.name = source["name"];
	        this.priorBalance = this.convertValues(source["priorBalance"], null);
	        this.symbol = source["symbol"];
	        this.timestamp = source["timestamp"];
	        this.totalSupply = this.convertValues(source["totalSupply"], null);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	        this.calcs = this.convertValues(source["calcs"], TokenCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class TraceCalcs {
	    date: string;
	    articulatedTrace?: Record<string, any>;
	    "action::from"?: string;
	    "action::to"?: string;
	    "action::value"?: string;
	    "action::ether"?: string;
	    "action::input"?: string;
	    "action::callType"?: string;
	    compressedTrace?: string;
	
	    static createFrom(source: any = {}) {
	        return new TraceCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.articulatedTrace = source["articulatedTrace"];
	        this["action::from"] = source["action::from"];
	        this["action::to"] = source["action::to"];
	        this["action::value"] = source["action::value"];
	        this["action::ether"] = source["action::ether"];
	        this["action::input"] = source["action::input"];
	        this["action::callType"] = source["action::callType"];
	        this.compressedTrace = source["compressedTrace"];
	    }
	}
	export class TraceResultCalcs {
	    code?: string;
	    address?: string;
	
	    static createFrom(source: any = {}) {
	        return new TraceResultCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.address = source["address"];
	    }
	}
	export class TraceResult {
	    address?: base.Address;
	    addressName?: string;
	    code?: string;
	    gasUsed?: number;
	    output?: string;
	    calcs?: TraceResultCalcs;
	
	    static createFrom(source: any = {}) {
	        return new TraceResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.code = source["code"];
	        this.gasUsed = source["gasUsed"];
	        this.output = source["output"];
	        this.calcs = this.convertValues(source["calcs"], TraceResultCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TraceActionCalcs {
	    ether?: string;
	    balanceEth?: string;
	
	    static createFrom(source: any = {}) {
	        return new TraceActionCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ether = source["ether"];
	        this.balanceEth = source["balanceEth"];
	    }
	}
	export class TraceAction {
	    address?: base.Address;
	    addressName?: string;
	    author?: base.Address;
	    authorName?: string;
	    // Go type: base
	    balance?: any;
	    callType: string;
	    from: base.Address;
	    fromName?: string;
	    gas: number;
	    init?: string;
	    input?: string;
	    refundAddress?: base.Address;
	    refundAddressName?: string;
	    rewardType?: string;
	    selfDestructed?: base.Address;
	    selfDestructedName?: string;
	    to: base.Address;
	    toName?: string;
	    // Go type: base
	    value: any;
	    calcs?: TraceActionCalcs;
	
	    static createFrom(source: any = {}) {
	        return new TraceAction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.author = this.convertValues(source["author"], base.Address);
	        this.authorName = source["authorName"];
	        this.balance = this.convertValues(source["balance"], null);
	        this.callType = source["callType"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.fromName = source["fromName"];
	        this.gas = source["gas"];
	        this.init = source["init"];
	        this.input = source["input"];
	        this.refundAddress = this.convertValues(source["refundAddress"], base.Address);
	        this.refundAddressName = source["refundAddressName"];
	        this.rewardType = source["rewardType"];
	        this.selfDestructed = this.convertValues(source["selfDestructed"], base.Address);
	        this.selfDestructedName = source["selfDestructedName"];
	        this.to = this.convertValues(source["to"], base.Address);
	        this.toName = source["toName"];
	        this.value = this.convertValues(source["value"], null);
	        this.calcs = this.convertValues(source["calcs"], TraceActionCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Trace {
	    action?: TraceAction;
	    articulatedTrace?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    error?: string;
	    result?: TraceResult;
	    subtraces: number;
	    timestamp: number;
	    traceAddress: number[];
	    transactionHash: base.Hash;
	    transactionIndex: number;
	    type?: string;
	    calcs?: TraceCalcs;
	    transactionPosition?: number;
	
	    static createFrom(source: any = {}) {
	        return new Trace(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.action = this.convertValues(source["action"], TraceAction);
	        this.articulatedTrace = this.convertValues(source["articulatedTrace"], Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.error = source["error"];
	        this.result = this.convertValues(source["result"], TraceResult);
	        this.subtraces = source["subtraces"];
	        this.timestamp = source["timestamp"];
	        this.traceAddress = source["traceAddress"];
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	        this.calcs = this.convertValues(source["calcs"], TraceCalcs);
	        this.transactionPosition = source["transactionPosition"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	
	
	export class TransactionCalcs {
	    date: string;
	    // Go type: base
	    gasCost: any;
	    articulatedTx?: Record<string, any>;
	    statements?: any[];
	    receipt?: Record<string, any>;
	    traces?: any[];
	    message?: string;
	    ethGasPrice?: string;
	    encoding?: string;
	    compressedTx?: string;
	    nTraces?: number;
	    ether: string;
	
	    static createFrom(source: any = {}) {
	        return new TransactionCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.gasCost = this.convertValues(source["gasCost"], null);
	        this.articulatedTx = source["articulatedTx"];
	        this.statements = source["statements"];
	        this.receipt = source["receipt"];
	        this.traces = source["traces"];
	        this.message = source["message"];
	        this.ethGasPrice = source["ethGasPrice"];
	        this.encoding = source["encoding"];
	        this.compressedTx = source["compressedTx"];
	        this.nTraces = source["nTraces"];
	        this.ether = source["ether"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Transaction {
	    articulatedTx?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    from: base.Address;
	    fromName?: string;
	    gas: number;
	    gasPrice: number;
	    gasUsed: number;
	    hasToken: boolean;
	    hash: base.Hash;
	    input: string;
	    isError: boolean;
	    maxFeePerGas: number;
	    maxPriorityFeePerGas: number;
	    nonce: number;
	    receipt?: Receipt;
	    timestamp: number;
	    to: base.Address;
	    toName?: string;
	    traces: Trace[];
	    transactionIndex: number;
	    type: string;
	    // Go type: base
	    value: any;
	    calcs?: TransactionCalcs;
	    statements?: Statement[];
	
	    static createFrom(source: any = {}) {
	        return new Transaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.articulatedTx = this.convertValues(source["articulatedTx"], Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.fromName = source["fromName"];
	        this.gas = source["gas"];
	        this.gasPrice = source["gasPrice"];
	        this.gasUsed = source["gasUsed"];
	        this.hasToken = source["hasToken"];
	        this.hash = this.convertValues(source["hash"], base.Hash);
	        this.input = source["input"];
	        this.isError = source["isError"];
	        this.maxFeePerGas = source["maxFeePerGas"];
	        this.maxPriorityFeePerGas = source["maxPriorityFeePerGas"];
	        this.nonce = source["nonce"];
	        this.receipt = this.convertValues(source["receipt"], Receipt);
	        this.timestamp = source["timestamp"];
	        this.to = this.convertValues(source["to"], base.Address);
	        this.toName = source["toName"];
	        this.traces = this.convertValues(source["traces"], Trace);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	        this.value = this.convertValues(source["value"], null);
	        this.calcs = this.convertValues(source["calcs"], TransactionCalcs);
	        this.statements = this.convertValues(source["statements"], Statement);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class TransferCalcs {
	    // Go type: base
	    amount: any;
	    amountEth?: string;
	
	    static createFrom(source: any = {}) {
	        return new TransferCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.amount = this.convertValues(source["amount"], null);
	        this.amountEth = source["amountEth"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Transfer {
	    // Go type: base
	    amountIn?: any;
	    // Go type: base
	    amountOut?: any;
	    asset: base.Address;
	    assetName?: string;
	    blockNumber: number;
	    decimals: number;
	    // Go type: base
	    gasOut?: any;
	    holder: base.Address;
	    holderName?: string;
	    // Go type: base
	    internalIn?: any;
	    // Go type: base
	    internalOut?: any;
	    logIndex: number;
	    // Go type: base
	    minerBaseRewardIn?: any;
	    // Go type: base
	    minerNephewRewardIn?: any;
	    // Go type: base
	    minerTxFeeIn?: any;
	    // Go type: base
	    minerUncleRewardIn?: any;
	    // Go type: base
	    prefundIn?: any;
	    recipient: base.Address;
	    recipientName?: string;
	    // Go type: base
	    selfDestructIn?: any;
	    // Go type: base
	    selfDestructOut?: any;
	    sender: base.Address;
	    senderName?: string;
	    transactionIndex: number;
	    calcs?: TransferCalcs;
	    log?: Log;
	    transaction?: Transaction;
	
	    static createFrom(source: any = {}) {
	        return new Transfer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.amountIn = this.convertValues(source["amountIn"], null);
	        this.amountOut = this.convertValues(source["amountOut"], null);
	        this.asset = this.convertValues(source["asset"], base.Address);
	        this.assetName = source["assetName"];
	        this.blockNumber = source["blockNumber"];
	        this.decimals = source["decimals"];
	        this.gasOut = this.convertValues(source["gasOut"], null);
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.holderName = source["holderName"];
	        this.internalIn = this.convertValues(source["internalIn"], null);
	        this.internalOut = this.convertValues(source["internalOut"], null);
	        this.logIndex = source["logIndex"];
	        this.minerBaseRewardIn = this.convertValues(source["minerBaseRewardIn"], null);
	        this.minerNephewRewardIn = this.convertValues(source["minerNephewRewardIn"], null);
	        this.minerTxFeeIn = this.convertValues(source["minerTxFeeIn"], null);
	        this.minerUncleRewardIn = this.convertValues(source["minerUncleRewardIn"], null);
	        this.prefundIn = this.convertValues(source["prefundIn"], null);
	        this.recipient = this.convertValues(source["recipient"], base.Address);
	        this.recipientName = source["recipientName"];
	        this.selfDestructIn = this.convertValues(source["selfDestructIn"], null);
	        this.selfDestructOut = this.convertValues(source["selfDestructOut"], null);
	        this.sender = this.convertValues(source["sender"], base.Address);
	        this.senderName = source["senderName"];
	        this.transactionIndex = source["transactionIndex"];
	        this.calcs = this.convertValues(source["calcs"], TransferCalcs);
	        this.log = this.convertValues(source["log"], Log);
	        this.transaction = this.convertValues(source["transaction"], Transaction);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ViewConfig {
	    viewName: string;
	    disabled: boolean;
	    facets: Record<string, FacetConfig>;
	    actions: Record<string, ActionConfig>;
	    facetOrder: string[];
	    menuOrder?: number;
	
	    static createFrom(source: any = {}) {
	        return new ViewConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.viewName = source["viewName"];
	        this.disabled = source["disabled"];
	        this.facets = this.convertValues(source["facets"], FacetConfig, true);
	        this.actions = this.convertValues(source["actions"], ActionConfig, true);
	        this.facetOrder = source["facetOrder"];
	        this.menuOrder = source["menuOrder"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class WithdrawalCalcs {
	    date: string;
	    ether?: string;
	
	    static createFrom(source: any = {}) {
	        return new WithdrawalCalcs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.ether = source["ether"];
	    }
	}
	export class Withdrawal {
	    address: base.Address;
	    addressName?: string;
	    // Go type: base
	    amount: any;
	    blockNumber: number;
	    index: number;
	    timestamp: number;
	    validatorIndex: number;
	    calcs?: WithdrawalCalcs;
	
	    static createFrom(source: any = {}) {
	        return new Withdrawal(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.addressName = source["addressName"];
	        this.amount = this.convertValues(source["amount"], null);
	        this.blockNumber = source["blockNumber"];
	        this.index = source["index"];
	        this.timestamp = source["timestamp"];
	        this.validatorIndex = source["validatorIndex"];
	        this.calcs = this.convertValues(source["calcs"], WithdrawalCalcs);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace utils {
	
	export class Explorer {
	    name: string;
	    url: string;
	    standard: string;
	
	    static createFrom(source: any = {}) {
	        return new Explorer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.url = source["url"];
	        this.standard = source["standard"];
	    }
	}
	export class NativeCurrency {
	    name: string;
	    symbol: string;
	    decimals: number;
	
	    static createFrom(source: any = {}) {
	        return new NativeCurrency(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.symbol = source["symbol"];
	        this.decimals = source["decimals"];
	    }
	}
	export class ChainListItem {
	    name: string;
	    chain: string;
	    icon: string;
	    rpc: string[];
	    faucets: string[];
	    nativeCurrency: NativeCurrency;
	    infoURL: string;
	    shortName: string;
	    chainId: number;
	    networkId: number;
	    explorers: Explorer[];
	
	    static createFrom(source: any = {}) {
	        return new ChainListItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.chain = source["chain"];
	        this.icon = source["icon"];
	        this.rpc = source["rpc"];
	        this.faucets = source["faucets"];
	        this.nativeCurrency = this.convertValues(source["nativeCurrency"], NativeCurrency);
	        this.infoURL = source["infoURL"];
	        this.shortName = source["shortName"];
	        this.chainId = source["chainId"];
	        this.networkId = source["networkId"];
	        this.explorers = this.convertValues(source["explorers"], Explorer);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChainList {
	    chains: ChainListItem[];
	    ChainsMap: Record<number, ChainListItem>;
	
	    static createFrom(source: any = {}) {
	        return new ChainList(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chains = this.convertValues(source["chains"], ChainListItem);
	        this.ChainsMap = this.convertValues(source["ChainsMap"], ChainListItem, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	

}

