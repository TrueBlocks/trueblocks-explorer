package app

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/validation"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// UserInfoStatus represents the status of user information and RPC connectivity for the setup wizard
type UserInfoStatus struct {
	MissingNameEmail bool `json:"missingNameEmail"`
	RPCUnavailable   bool `json:"rpcUnavailable"`
}

// GetUserInfoStatus returns the current status of user information and RPC connectivity
func (a *App) GetUserInfoStatus() UserInfoStatus {
	missingNameEmail := a.Preferences.User.Name == "" || a.Preferences.User.Email == ""

	rpcUnavailable := true
	if !missingNameEmail {
		hasRpcs := false
		for _, chain := range a.Preferences.User.Chains {
			if len(chain.RpcProviders) > 0 {
				hasRpcs = true
				break
			}
		}

		if hasRpcs {
			foundWorkingRpc := false
			for _, chain := range a.Preferences.User.Chains {
				for _, rpcUrl := range chain.RpcProviders {
					result, err := sdk.PingRpc(rpcUrl)
					if err == nil && result.OK {
						foundWorkingRpc = true
						break
					}
				}
				if foundWorkingRpc {
					break
				}
			}
			rpcUnavailable = !foundWorkingRpc
		}
	}

	return UserInfoStatus{
		MissingNameEmail: missingNameEmail,
		RPCUnavailable:   rpcUnavailable,
	}
}

// SetUserInfo validates and sets the user's name and email in preferences
func (a *App) SetUserInfo(name, email string) error {
	name = strings.TrimSpace(name)
	email = strings.TrimSpace(email)

	if err := validation.ValidEmail(email); err != nil {
		return fmt.Errorf("invalid email: %w", err)
	} else if name == "" {
		err = validation.ValidationError{Field: "name", Problem: "cannot be empty"}
		return fmt.Errorf("invalid name: %w", err)
	}

	a.Preferences.User.Name = name
	a.Preferences.User.Email = email

	return preferences.SetUserPreferences(&a.Preferences.User)
}

// SetChain validates and adds or updates a blockchain chain configuration with RPC providers
func (a *App) SetChain(ch preferences.Chain) error {
	if len(ch.RpcProviders) > 0 {
		for i, rpc := range ch.RpcProviders {
			ch.RpcProviders[i] = strings.TrimSpace(rpc)
			if err := validation.ValidRPC(rpc); err != nil {
				return err
			}
		}
	}

	chainID := ch.ChainId
	foundInChain := false

	for i, chain := range a.Preferences.User.Chains {
		if chain.ChainId == chainID {
			// If this chain already exists, update its RPC providers
			for _, existingRpc := range chain.RpcProviders {
				for _, newRpc := range ch.RpcProviders {
					if existingRpc == newRpc {
						// RPC already exists, no need to add it
						continue
					}
				}
			}

			// Add new RPCs at the beginning of the list
			a.Preferences.User.Chains[i].RpcProviders = append(ch.RpcProviders, chain.RpcProviders...)

			// Limit to 5 RPCs
			if len(a.Preferences.User.Chains[i].RpcProviders) > 5 {
				a.Preferences.User.Chains[i].RpcProviders = a.Preferences.User.Chains[i].RpcProviders[:5]
			}

			foundInChain = true
			break
		}
	}

	if !foundInChain {
		// Add new chain
		a.Preferences.User.Chains = append([]preferences.Chain{ch}, a.Preferences.User.Chains...)
	}

	return preferences.SetUserPreferences(&a.Preferences.User)
}
