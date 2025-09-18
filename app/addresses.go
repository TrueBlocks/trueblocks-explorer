package app

import (
	"fmt"
	"strings"
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

var ensLock sync.Mutex

func (a *App) ConvertToAddress(addr string) (base.Address, bool) {
	if !strings.HasSuffix(addr, ".eth") {
		ret := base.HexToAddress(addr)
		return ret, ret != base.ZeroAddr
	}

	ensLock.Lock()
	ensAddr, exists := a.ensMap[addr]
	ensLock.Unlock()

	if exists {
		return ensAddr, true
	}

	// Try to get an ENS or return the same input
	opts := sdk.NamesOptions{
		Terms: []string{addr},
	}
	if names, _, err := opts.Names(); err != nil {
		return base.ZeroAddr, false
	} else {
		if len(names) > 0 {
			ensLock.Lock()
			defer ensLock.Unlock()
			a.ensMap[addr] = names[0].Address
			return names[0].Address, true
		} else {
			ret := base.HexToAddress(addr)
			return ret, ret != base.ZeroAddr
		}
	}
}

func (a *App) SetActiveAddress(addrStr string) error {
	if addr, ok := a.ConvertToAddress(addrStr); ok {
		if active := a.GetActiveProject(); active != nil {
			err := active.SetActiveAddress(addr)
			if err == nil {
				msgs.EmitManager("active_address_changed")
			}
			return err
		}
		return fmt.Errorf("no active project")
	}
	return fmt.Errorf("invalid address: %s", addrStr)
}

func (a *App) AddAddressToProject(addrStr string) error {
	if addr, ok := a.ConvertToAddress(addrStr); ok {
		if active := a.GetActiveProject(); active != nil {
			return active.AddAddress(addr)
		}
		return fmt.Errorf("no active project")
	}
	return fmt.Errorf("invalid address: %s", addrStr)
}

func (a *App) AddAddressesToProject(input string) error {
	first := base.Address{}
	addrs := strings.Split(strings.ReplaceAll(strings.ReplaceAll(input, "\n", "|"), ",", "|"), "|")
	for _, addr := range addrs {
		if err := a.AddAddressToProject(addr); err != nil {
			return err
		}
		if first == base.ZeroAddr {
			first = base.HexToAddress(addr)
		}
	}
	if first.IsZero() {
		return fmt.Errorf("no valid addresses found")
	}
	return a.SetActiveAddress(first.Hex())
}

func (a *App) RemoveAddressFromProject(addrStr string) error {
	if addr, ok := a.ConvertToAddress(addrStr); ok {
		if active := a.GetActiveProject(); active != nil {
			return active.RemoveAddress(addr)
		}
		return fmt.Errorf("no active project")
	}
	return fmt.Errorf("invalid address: %s", addrStr)
}

func (a *App) SetActiveContract(contract string) error {
	if active := a.GetActiveProject(); active != nil {
		return active.SetActiveContract(contract)
	}
	return fmt.Errorf("no active project")
}
