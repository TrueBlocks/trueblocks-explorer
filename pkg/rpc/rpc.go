// Package rpc provides utilities for RPC availability and status checking
package rpc

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/rpc"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
)

func CheckRpc() error {
	_, err := CheckRPCStatus()
	if err != nil {
		logging.LogError("RPC unavailable", err)
		return fmt.Errorf("RPC unavailable: %w", err)
	}
	return nil
}

func CheckRPCStatus() (string, error) {
	if userPrefs, err := preferences.GetUserPreferences(); err != nil {
		return "", fmt.Errorf("failed to get user preferences: %w", err)
	} else {
		if len(userPrefs.Chains) == 0 {
			return "", fmt.Errorf("no chains configured")
		}

		var workingRPCs []string
		var failedChains []string

		for _, chain := range userPrefs.Chains {
			chainHasWorkingRPC := false
			for _, rpcUrl := range chain.RpcProviders {
				result, err := rpc.PingRpc(rpcUrl)
				if err == nil && result.OK {
					workingRPCs = append(workingRPCs, rpcUrl)
					chainHasWorkingRPC = true
					break // Found working RPC for this chain, move to next chain
				}
			}
			if !chainHasWorkingRPC {
				failedChains = append(failedChains, chain.Chain)
			}
		}

		if len(failedChains) > 0 {
			err := fmt.Errorf("chains without valid RPC: %v", failedChains)
			logging.LogError("Some chains have no valid RPC endpoints", err)
			return "", err
		}

		if len(workingRPCs) > 0 {
			return workingRPCs[0], nil
		}

		return "", fmt.Errorf("no valid RPC endpoints found")
	}
}
