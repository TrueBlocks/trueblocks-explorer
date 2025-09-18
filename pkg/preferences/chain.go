package preferences

type Chain struct {
	Chain          string   `json:"chain"`
	ChainId        uint64   `json:"chainId"`
	RemoteExplorer string   `json:"remoteExplorer"`
	RpcProviders   []string `json:"rpcProviders"`
	Symbol         string   `json:"symbol"`
}
