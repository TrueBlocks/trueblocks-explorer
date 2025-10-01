export namespace abis {
	
	export class AbisPage {
	    facet: types.DataFacet;
	    abis: types.Abi[];
	    functions: types.Function[];
	    totalItems: number;
	    expectedTotal: number;
	    isFetching: boolean;
	    state: types.LoadState;
	
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
	        this.isFetching = source["isFetching"];
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
	    isFetching: boolean;
	    state: types.LoadState;
	
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
	        this.isFetching = source["isFetching"];
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
	
	export class AnnotatedTransaction {
	    articulatedTx?: types.Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    from: base.Address;
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
	    receipt?: types.Receipt;
	    timestamp: number;
	    to: base.Address;
	    traces: types.Trace[];
	    transactionIndex: number;
	    type: string;
	    // Go type: base
	    value: any;
	    statements?: types.Statement[];
	    missing: boolean;
	    unique: boolean;
	
	    static createFrom(source: any = {}) {
	        return new AnnotatedTransaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.articulatedTx = this.convertValues(source["articulatedTx"], types.Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.from = this.convertValues(source["from"], base.Address);
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
	        this.receipt = this.convertValues(source["receipt"], types.Receipt);
	        this.timestamp = source["timestamp"];
	        this.to = this.convertValues(source["to"], base.Address);
	        this.traces = this.convertValues(source["traces"], types.Trace);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	        this.value = this.convertValues(source["value"], null);
	        this.statements = this.convertValues(source["statements"], types.Statement);
	        this.missing = source["missing"];
	        this.unique = source["unique"];
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
	export class ComparitoorPage {
	    facet: types.DataFacet;
	    transaction: AnnotatedTransaction[];
	    totalItems: number;
	    expectedTotal: number;
	    isFetching: boolean;
	    state: types.LoadState;
	    chifra: AnnotatedTransaction[];
	    chifraCount: number;
	    etherscan: AnnotatedTransaction[];
	    etherscanCount: number;
	    covalent: AnnotatedTransaction[];
	    covalentCount: number;
	    alchemy: AnnotatedTransaction[];
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
	        this.transaction = this.convertValues(source["transaction"], AnnotatedTransaction);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.isFetching = source["isFetching"];
	        this.state = source["state"];
	        this.chifra = this.convertValues(source["chifra"], AnnotatedTransaction);
	        this.chifraCount = source["chifraCount"];
	        this.etherscan = this.convertValues(source["etherscan"], AnnotatedTransaction);
	        this.etherscanCount = source["etherscanCount"];
	        this.covalent = this.convertValues(source["covalent"], AnnotatedTransaction);
	        this.covalentCount = source["covalentCount"];
	        this.alchemy = this.convertValues(source["alchemy"], AnnotatedTransaction);
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
	    isFetching: boolean;
	    state: types.LoadState;
	
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
	        this.isFetching = source["isFetching"];
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
	    orientations: string[];
	    gazes: string[];
	    backstyles: string[];
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
	        this.orientations = source["orientations"];
	        this.gazes = source["gazes"];
	        this.backstyles = source["backstyles"];
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
	    isFetching: boolean;
	    state: types.LoadState;
	
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
	        this.isFetching = source["isFetching"];
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
	    approvals: types.Approval[];
	    assets: types.Name[];
	    balances: types.Token[];
	    logs: types.Log[];
	    receipts: types.Receipt[];
	    statements: types.Statement[];
	    traces: types.Trace[];
	    transactions: types.Transaction[];
	    transfers: types.Transfer[];
	    withdrawals: types.Withdrawal[];
	    totalItems: number;
	    expectedTotal: number;
	    isFetching: boolean;
	    state: types.LoadState;
	
	    static createFrom(source: any = {}) {
	        return new ExportsPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.approvals = this.convertValues(source["approvals"], types.Approval);
	        this.assets = this.convertValues(source["assets"], types.Name);
	        this.balances = this.convertValues(source["balances"], types.Token);
	        this.logs = this.convertValues(source["logs"], types.Log);
	        this.receipts = this.convertValues(source["receipts"], types.Receipt);
	        this.statements = this.convertValues(source["statements"], types.Statement);
	        this.traces = this.convertValues(source["traces"], types.Trace);
	        this.transactions = this.convertValues(source["transactions"], types.Transaction);
	        this.transfers = this.convertValues(source["transfers"], types.Transfer);
	        this.withdrawals = this.convertValues(source["withdrawals"], types.Withdrawal);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.isFetching = source["isFetching"];
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
	    isFetching: boolean;
	    state: types.LoadState;
	
	    static createFrom(source: any = {}) {
	        return new MonitorsPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.monitors = this.convertValues(source["monitors"], types.Monitor);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.isFetching = source["isFetching"];
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
	    TAB_CYCLE = "hotkey:tab-cycle",
	    IMAGES_CHANGED = "images:changed",
	    PROJECT_OPENED = "project:opened",
	}

}

export namespace names {
	
	export class NamesPage {
	    facet: types.DataFacet;
	    names: types.Name[];
	    totalItems: number;
	    expectedTotal: number;
	    isFetching: boolean;
	    state: types.LoadState;
	
	    static createFrom(source: any = {}) {
	        return new NamesPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.names = this.convertValues(source["names"], types.Name);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.isFetching = source["isFetching"];
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
	export class AppPreferences {
	    version: string;
	    name: string;
	    lastTheme: string;
	    lastSkin: string;
	    lastFormat: string;
	    lastLanguage: string;
	    lastProject: string;
	    helpCollapsed: boolean;
	    menuCollapsed: boolean;
	    chromeCollapsed: boolean;
	    detailCollapsed: boolean;
	    debugCollapsed: boolean;
	    recentProjects: string[];
	    silencedDialogs: Record<string, boolean>;
	    bounds?: Bounds;
	
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
	        this.lastProject = source["lastProject"];
	        this.helpCollapsed = source["helpCollapsed"];
	        this.menuCollapsed = source["menuCollapsed"];
	        this.chromeCollapsed = source["chromeCollapsed"];
	        this.detailCollapsed = source["detailCollapsed"];
	        this.debugCollapsed = source["debugCollapsed"];
	        this.recentProjects = source["recentProjects"];
	        this.silencedDialogs = source["silencedDialogs"];
	        this.bounds = this.convertValues(source["bounds"], Bounds);
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
	    activePeriod: string;
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
	    smallSize: string;
	    normalSize: string;
	
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
	        this.smallSize = source["smallSize"];
	        this.normalSize = source["normalSize"];
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
	    isFetching: boolean;
	    state: types.LoadState;
	
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
	        this.isFetching = source["isFetching"];
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
	
	export enum DataFacet {
	    DOWNLOADED = "downloaded",
	    KNOWN = "known",
	    FUNCTIONS = "functions",
	    EVENTS = "events",
	    STATS = "stats",
	    INDEX = "index",
	    BLOOMS = "blooms",
	    MANIFEST = "manifest",
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
	    APPROVALS = "approvals",
	    WITHDRAWALS = "withdrawals",
	    ASSETS = "assets",
	    LOGS = "logs",
	    TRACES = "traces",
	    RECEIPTS = "receipts",
	    MONITORS = "monitors",
	    ALL = "all",
	    CUSTOM = "custom",
	    PREFUND = "prefund",
	    REGULAR = "regular",
	    BADDRESS = "baddress",
	    STATUS = "status",
	    CACHES = "caches",
	    CHAINS = "chains",
	}
	export enum LoadState {
	    STALE = "stale",
	    FETCHING = "fetching",
	    PARTIAL = "partial",
	    LOADED = "loaded",
	    PENDING = "pending",
	    ERROR = "error",
	}
	export class Parameter {
	    components?: Parameter[];
	    indexed?: boolean;
	    internalType?: string;
	    name: string;
	    strDefault?: string;
	    type: string;
	    value?: any;
	
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
	
	    static createFrom(source: any = {}) {
	        return new Abi(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
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
	export class Approval {
	    // Go type: base
	    allowance: any;
	    blockNumber: number;
	    lastAppBlock: number;
	    lastAppLogID: number;
	    lastAppTs: number;
	    lastAppTxID: number;
	    owner: base.Address;
	    spender: base.Address;
	    timestamp: number;
	    token: base.Address;
	
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
	        this.spender = this.convertValues(source["spender"], base.Address);
	        this.timestamp = source["timestamp"];
	        this.token = this.convertValues(source["token"], base.Address);
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
	export class CacheItem {
	    items: any[];
	    lastCached?: string;
	    nFiles: number;
	    nFolders: number;
	    path: string;
	    sizeInBytes: number;
	    type: string;
	
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
	    }
	}
	export class RangeDates {
	    firstDate?: string;
	    firstTs?: number;
	    lastDate?: string;
	    lastTs?: number;
	
	    static createFrom(source: any = {}) {
	        return new RangeDates(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.firstDate = source["firstDate"];
	        this.firstTs = source["firstTs"];
	        this.lastDate = source["lastDate"];
	        this.lastTs = source["lastTs"];
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
	export class ChunkIndex {
	    fileSize: number;
	    hash: base.Hash;
	    magic: string;
	    nAddresses: number;
	    nAppearances: number;
	    range: string;
	    rangeDates?: RangeDates;
	
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
	export class ChunkRecord {
	    bloomHash: string;
	    bloomSize: number;
	    indexHash: string;
	    indexSize: number;
	    range: string;
	    rangeDates?: RangeDates;
	
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
	    filterable: boolean;
	    formatter: string;
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
	        this.filterable = source["filterable"];
	        this.formatter = source["formatter"];
	        this.order = source["order"];
	    }
	}
	export class Contract {
	    abi?: Abi;
	    address: base.Address;
	    errorCount: number;
	    lastError: string;
	    lastUpdated: number;
	    name: string;
	    readResults: Record<string, any>;
	
	    static createFrom(source: any = {}) {
	        return new Contract(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.abi = this.convertValues(source["abi"], Abi);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.errorCount = source["errorCount"];
	        this.lastError = source["lastError"];
	        this.lastUpdated = source["lastUpdated"];
	        this.name = source["name"];
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
	export class DetailFieldConfig {
	    key: string;
	    label: string;
	    formatter: string;
	    detailOrder: number;
	
	    static createFrom(source: any = {}) {
	        return new DetailFieldConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.label = source["label"];
	        this.formatter = source["formatter"];
	        this.detailOrder = source["detailOrder"];
	    }
	}
	export class DetailPanelConfig {
	    title: string;
	    collapsed: boolean;
	    fields: DetailFieldConfig[];
	
	    static createFrom(source: any = {}) {
	        return new DetailPanelConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	        this.collapsed = source["collapsed"];
	        this.fields = this.convertValues(source["fields"], DetailFieldConfig);
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
	    formatter: string;
	    section: string;
	    width: number;
	    sortable: boolean;
	    filterable: boolean;
	    order: number;
	    detailOrder: number;
	
	    static createFrom(source: any = {}) {
	        return new FieldConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.label = source["label"];
	        this.formatter = source["formatter"];
	        this.section = source["section"];
	        this.width = source["width"];
	        this.sortable = source["sortable"];
	        this.filterable = source["filterable"];
	        this.order = source["order"];
	        this.detailOrder = source["detailOrder"];
	    }
	}
	export class FacetConfig {
	    name: string;
	    store: string;
	    isForm: boolean;
	    dividerBefore: boolean;
	    disabled: boolean;
	    fields: FieldConfig[];
	    columns: ColumnConfig[];
	    detailPanels: DetailPanelConfig[];
	    actions: string[];
	    headerActions: string[];
	    rendererTypes: string;
	
	    static createFrom(source: any = {}) {
	        return new FacetConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.store = source["store"];
	        this.isForm = source["isForm"];
	        this.dividerBefore = source["dividerBefore"];
	        this.disabled = source["disabled"];
	        this.fields = this.convertValues(source["fields"], FieldConfig);
	        this.columns = this.convertValues(source["columns"], ColumnConfig);
	        this.detailPanels = this.convertValues(source["detailPanels"], DetailPanelConfig);
	        this.actions = source["actions"];
	        this.headerActions = source["headerActions"];
	        this.rendererTypes = source["rendererTypes"];
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
	
	
	export class Log {
	    address: base.Address;
	    articulatedLog?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    data?: string;
	    logIndex: number;
	    timestamp?: number;
	    topics?: base.Hash[];
	    transactionHash: base.Hash;
	    transactionIndex: number;
	
	    static createFrom(source: any = {}) {
	        return new Log(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.articulatedLog = this.convertValues(source["articulatedLog"], Function);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.data = source["data"];
	        this.logIndex = source["logIndex"];
	        this.timestamp = source["timestamp"];
	        this.topics = this.convertValues(source["topics"], base.Hash);
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
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
	export class Manifest {
	    chain: string;
	    chunks: ChunkRecord[];
	    specification: string;
	    version: string;
	
	    static createFrom(source: any = {}) {
	        return new Manifest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chain = source["chain"];
	        this.chunks = this.convertValues(source["chunks"], ChunkRecord);
	        this.specification = source["specification"];
	        this.version = source["version"];
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
	export class MetaData {
	    client: number;
	    finalized: number;
	    staging: number;
	    ripe: number;
	    unripe: number;
	    chainId?: number;
	    networkId?: number;
	    chain?: string;
	
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
	    }
	}
	export class Monitor {
	    address: base.Address;
	    deleted: boolean;
	    fileSize: number;
	    isEmpty: boolean;
	    isStaged: boolean;
	    lastScanned: number;
	    nRecords: number;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Monitor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.deleted = source["deleted"];
	        this.fileSize = source["fileSize"];
	        this.isEmpty = source["isEmpty"];
	        this.isStaged = source["isStaged"];
	        this.lastScanned = source["lastScanned"];
	        this.nRecords = source["nRecords"];
	        this.name = source["name"];
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
	export class Name {
	    address: base.Address;
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
	    // Go type: base
	    prefund?: any;
	    parts?: number;
	
	    static createFrom(source: any = {}) {
	        return new Name(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
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
	
	export class Payload {
	    collection: string;
	    dataFacet: DataFacet;
	    chain?: string;
	    address?: string;
	    period?: string;
	    format?: string;
	    projectPath?: string;
	
	    static createFrom(source: any = {}) {
	        return new Payload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collection = source["collection"];
	        this.dataFacet = source["dataFacet"];
	        this.chain = source["chain"];
	        this.address = source["address"];
	        this.period = source["period"];
	        this.format = source["format"];
	        this.projectPath = source["projectPath"];
	    }
	}
	export class ProjectPayload {
	    hasProject: boolean;
	    activeChain: string;
	    activePeriod: string;
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
	
	export class Receipt {
	    blockHash?: base.Hash;
	    blockNumber: number;
	    contractAddress?: base.Address;
	    cumulativeGasUsed?: number;
	    effectiveGasPrice?: number;
	    from?: base.Address;
	    gasUsed: number;
	    isError?: boolean;
	    logs: Log[];
	    status: number;
	    to?: base.Address;
	    transactionHash: base.Hash;
	    transactionIndex: number;
	
	    static createFrom(source: any = {}) {
	        return new Receipt(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.blockHash = this.convertValues(source["blockHash"], base.Hash);
	        this.blockNumber = source["blockNumber"];
	        this.contractAddress = this.convertValues(source["contractAddress"], base.Address);
	        this.cumulativeGasUsed = source["cumulativeGasUsed"];
	        this.effectiveGasPrice = source["effectiveGasPrice"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.gasUsed = source["gasUsed"];
	        this.isError = source["isError"];
	        this.logs = this.convertValues(source["logs"], Log);
	        this.status = source["status"];
	        this.to = this.convertValues(source["to"], base.Address);
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
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
	export class Statement {
	    accountedFor: base.Address;
	    // Go type: base
	    amountIn?: any;
	    // Go type: base
	    amountOut?: any;
	    asset: base.Address;
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
	    // Go type: base
	    selfDestructIn?: any;
	    // Go type: base
	    selfDestructOut?: any;
	    sender: base.Address;
	    // Go type: base
	    spotPrice: any;
	    symbol: string;
	    timestamp: number;
	    transactionHash: base.Hash;
	    transactionIndex: number;
	    correctionId: number;
	    holder: base.Address;
	    statementId: number;
	
	    static createFrom(source: any = {}) {
	        return new Statement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.accountedFor = this.convertValues(source["accountedFor"], base.Address);
	        this.amountIn = this.convertValues(source["amountIn"], null);
	        this.amountOut = this.convertValues(source["amountOut"], null);
	        this.asset = this.convertValues(source["asset"], base.Address);
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
	        this.selfDestructIn = this.convertValues(source["selfDestructIn"], null);
	        this.selfDestructOut = this.convertValues(source["selfDestructOut"], null);
	        this.sender = this.convertValues(source["sender"], base.Address);
	        this.spotPrice = this.convertValues(source["spotPrice"], null);
	        this.symbol = source["symbol"];
	        this.timestamp = source["timestamp"];
	        this.transactionHash = this.convertValues(source["transactionHash"], base.Hash);
	        this.transactionIndex = source["transactionIndex"];
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
	export class Token {
	    address: base.Address;
	    // Go type: base
	    balance: any;
	    blockNumber: number;
	    decimals: number;
	    holder: base.Address;
	    name: string;
	    // Go type: base
	    priorBalance?: any;
	    symbol: string;
	    timestamp: number;
	    // Go type: base
	    totalSupply: any;
	    transactionIndex?: number;
	    type: number;
	
	    static createFrom(source: any = {}) {
	        return new Token(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.balance = this.convertValues(source["balance"], null);
	        this.blockNumber = source["blockNumber"];
	        this.decimals = source["decimals"];
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.name = source["name"];
	        this.priorBalance = this.convertValues(source["priorBalance"], null);
	        this.symbol = source["symbol"];
	        this.timestamp = source["timestamp"];
	        this.totalSupply = this.convertValues(source["totalSupply"], null);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
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
	export class TraceResult {
	    address?: base.Address;
	    code?: string;
	    gasUsed?: number;
	    output?: string;
	
	    static createFrom(source: any = {}) {
	        return new TraceResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.code = source["code"];
	        this.gasUsed = source["gasUsed"];
	        this.output = source["output"];
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
	export class TraceAction {
	    address?: base.Address;
	    author?: base.Address;
	    // Go type: base
	    balance?: any;
	    callType: string;
	    from: base.Address;
	    gas: number;
	    init?: string;
	    input?: string;
	    refundAddress?: base.Address;
	    rewardType?: string;
	    selfDestructed?: base.Address;
	    to: base.Address;
	    // Go type: base
	    value: any;
	
	    static createFrom(source: any = {}) {
	        return new TraceAction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.author = this.convertValues(source["author"], base.Address);
	        this.balance = this.convertValues(source["balance"], null);
	        this.callType = source["callType"];
	        this.from = this.convertValues(source["from"], base.Address);
	        this.gas = source["gas"];
	        this.init = source["init"];
	        this.input = source["input"];
	        this.refundAddress = this.convertValues(source["refundAddress"], base.Address);
	        this.rewardType = source["rewardType"];
	        this.selfDestructed = this.convertValues(source["selfDestructed"], base.Address);
	        this.to = this.convertValues(source["to"], base.Address);
	        this.value = this.convertValues(source["value"], null);
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
	
	
	export class Transaction {
	    articulatedTx?: Function;
	    blockHash: base.Hash;
	    blockNumber: number;
	    from: base.Address;
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
	    traces: Trace[];
	    transactionIndex: number;
	    type: string;
	    // Go type: base
	    value: any;
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
	        this.traces = this.convertValues(source["traces"], Trace);
	        this.transactionIndex = source["transactionIndex"];
	        this.type = source["type"];
	        this.value = this.convertValues(source["value"], null);
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
	export class Transfer {
	    // Go type: base
	    amountIn?: any;
	    // Go type: base
	    amountOut?: any;
	    asset: base.Address;
	    blockNumber: number;
	    decimals: number;
	    // Go type: base
	    gasOut?: any;
	    holder: base.Address;
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
	    // Go type: base
	    selfDestructIn?: any;
	    // Go type: base
	    selfDestructOut?: any;
	    sender: base.Address;
	    transactionIndex: number;
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
	        this.blockNumber = source["blockNumber"];
	        this.decimals = source["decimals"];
	        this.gasOut = this.convertValues(source["gasOut"], null);
	        this.holder = this.convertValues(source["holder"], base.Address);
	        this.internalIn = this.convertValues(source["internalIn"], null);
	        this.internalOut = this.convertValues(source["internalOut"], null);
	        this.logIndex = source["logIndex"];
	        this.minerBaseRewardIn = this.convertValues(source["minerBaseRewardIn"], null);
	        this.minerNephewRewardIn = this.convertValues(source["minerNephewRewardIn"], null);
	        this.minerTxFeeIn = this.convertValues(source["minerTxFeeIn"], null);
	        this.minerUncleRewardIn = this.convertValues(source["minerUncleRewardIn"], null);
	        this.prefundIn = this.convertValues(source["prefundIn"], null);
	        this.recipient = this.convertValues(source["recipient"], base.Address);
	        this.selfDestructIn = this.convertValues(source["selfDestructIn"], null);
	        this.selfDestructOut = this.convertValues(source["selfDestructOut"], null);
	        this.sender = this.convertValues(source["sender"], base.Address);
	        this.transactionIndex = source["transactionIndex"];
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
	export class Withdrawal {
	    address: base.Address;
	    // Go type: base
	    amount: any;
	    blockNumber: number;
	    index: number;
	    timestamp: number;
	    validatorIndex: number;
	
	    static createFrom(source: any = {}) {
	        return new Withdrawal(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.amount = this.convertValues(source["amount"], null);
	        this.blockNumber = source["blockNumber"];
	        this.index = source["index"];
	        this.timestamp = source["timestamp"];
	        this.validatorIndex = source["validatorIndex"];
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

