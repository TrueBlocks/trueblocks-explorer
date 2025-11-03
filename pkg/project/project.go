// package project contains the data structures and methods for managing project files
package project

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/file"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// ------------------------------------------------------------------------------------
// Project represents a single project with its metadata and data.
type Project struct {
	mu             sync.RWMutex                 `json:"-"`
	Version        string                       `json:"version"`
	Name           string                       `json:"name"`
	LastOpened     string                       `json:"last_opened"`
	LastView       string                       `json:"lastView"`
	LastFacetMap   map[string]string            `json:"lastFacetMap"`
	Addresses      []base.Address               `json:"addresses"`
	ActiveAddress  base.Address                 `json:"activeAddress"`
	Chains         []string                     `json:"chains"`
	ActiveChain    string                       `json:"activeChain"`
	Contracts      []string                     `json:"contracts"`
	ActiveContract string                       `json:"activeContract"`
	ActivePeriod   types.Period                 `json:"activePeriod"`
	FilterStates   map[ViewStateKey]FilterState `json:"filterStates"`
	Path           string                       `json:"-"`
}

// ------------------------------------------------------------------------------------
// NewProject creates a new project with default values and required active address
func NewProject(name string, activeAddress base.Address, chains []string) *Project {
	addresses := []base.Address{}
	if activeAddress != base.ZeroAddr {
		addresses = append(addresses, activeAddress)
	}
	return &Project{
		Version:        "1.0",
		Name:           name,
		LastOpened:     time.Now().Format(time.RFC3339),
		LastView:       "",
		LastFacetMap:   map[string]string{},
		ActiveAddress:  activeAddress,
		Addresses:      addresses,
		ActiveChain:    chains[0],
		Chains:         chains,
		ActiveContract: "",
		Contracts:      []string{},
		ActivePeriod:   "blockly",
		FilterStates:   make(map[ViewStateKey]FilterState),
	}
}

// ------------------------------------------------------------------------------------
var ErrProjectRecoveryIncomplete = fmt.Errorf("failed to parse project file, recovery attempted but may not be complete")

// ------------------------------------------------------------------------------------
// Load loads a project from the specified file path with optimized deserialization
func Load(path string) (*Project, error) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, fmt.Errorf("project file does not exist: %s", path)
	}

	// Using a buffered read approach for better performance
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open project file: %w", err)
	}
	defer func() { _ = file.Close() }()

	// For small files like our projects, ReadAll is actually quite efficient
	// It avoids multiple small reads and allocations
	data, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read project file: %w", err)
	}

	var project Project
	if err := json.Unmarshal(data, &project); err != nil {
		projectPtr := NewProject("Recovered Project", base.ZeroAddr, []string{"mainnet"})
		projectPtr.Path = path
		if saveErr := projectPtr.Save(); saveErr != nil {
			return nil, fmt.Errorf("failed to parse project file and could not save recovered version: %w (original error: %v)", saveErr, err)
		}
		return nil, ErrProjectRecoveryIncomplete
	}

	// Set in-memory fields
	project.Path = path
	return &project, nil
}

// ------------------------------------------------------------------------------------
// Save persists the project to its file path
func (p *Project) Save() error {
	if p.Path == "" {
		return fmt.Errorf("cannot save project with empty path")
	}
	return p.SaveAs(p.Path)
}

// ------------------------------------------------------------------------------------
// SaveAs saves the project to a new file path and updates the project's path
// with optimized serialization for better performance
func (p *Project) SaveAs(path string) error {
	_ = file.EstablishFolder(filepath.Dir(path))

	p.LastOpened = time.Now().Format(time.RFC3339)

	data, err := json.MarshalIndent(p, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to serialize project: %w", err)
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("failed to write project file: %w", err)
	}

	p.Path = path
	return nil
}

// ------------------------------------------------------------------------------------
// GetPath returns the file path of the project
func (p *Project) GetPath() string {
	return p.Path
}

// ------------------------------------------------------------------------------------
// GetName returns the name of the project
func (p *Project) GetName() string {
	return p.Name
}

// ------------------------------------------------------------------------------------
// SetName updates the project name and writes the project to disk
func (p *Project) SetName(name string) error {
	if p.Name != name {
		p.Name = name
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// GetActiveAddress returns the currently selected address
func (p *Project) GetActiveAddress() base.Address {
	return p.ActiveAddress
}

// ------------------------------------------------------------------------------------
// SetActiveAddress sets the currently selected address (must be in project)
func (p *Project) SetActiveAddress(addr base.Address) error {
	found := false
	for _, existingAddr := range p.Addresses {
		if existingAddr == addr {
			found = true
			break
		}
	}

	needsSave := false
	if !found {
		p.Addresses = append([]base.Address{addr}, p.Addresses...)
		needsSave = true
	}

	if p.ActiveAddress != addr {
		p.ActiveAddress = addr
		needsSave = true
	}

	if needsSave {
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// AddAddress adds a new address to the project
func (p *Project) AddAddress(addr base.Address) error {
	return p.SetActiveAddress(addr)
}

// ------------------------------------------------------------------------------------
// GetAddresses returns all addresses in the project
func (p *Project) GetAddresses() []base.Address {
	return p.Addresses
}

// ------------------------------------------------------------------------------------
// RemoveAddress removes an address from the project
func (p *Project) RemoveAddress(addr base.Address) error {
	for i, existingAddr := range p.Addresses {
		if existingAddr == addr {
			p.Addresses = append(p.Addresses[:i], p.Addresses[i+1:]...)
			if p.ActiveAddress == addr {
				if len(p.Addresses) > 0 {
					p.ActiveAddress = p.Addresses[0]
				} else {
					p.ActiveAddress = base.ZeroAddr
				}
			}
			return p.Save()
		}
	}

	return fmt.Errorf("address %s not found in project", addr.Hex())
}

// ------------------------------------------------------------------------------------
// GetChains returns all chains in the project
func (p *Project) GetChains() []string {
	return p.Chains
}

// ------------------------------------------------------------------------------------
// GetActiveChain returns the currently selected chain
func (p *Project) GetActiveChain() string {
	return p.ActiveChain
}

// ------------------------------------------------------------------------------------
// SetActiveChain sets the currently selected chain (must be in project)
func (p *Project) SetActiveChain(chain string) error {
	if p.ActiveChain != chain {
		p.ActiveChain = chain
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// GetContracts returns all contracts in the project
func (p *Project) GetContracts() []string {
	return p.Contracts
}

// ------------------------------------------------------------------------------------
// GetActiveContract returns the currently selected contract
func (p *Project) GetActiveContract() string {
	// TODO: BOGUS Temporary hardcode - replace with dynamic selection
	return "0x0c316b7042b419d07d343f2f4f5bd54ff731183d"
}

// ------------------------------------------------------------------------------------
// SetActiveContract sets the currently selected contract (must be in project or empty)
func (p *Project) SetActiveContract(contract string) error {
	if contract == "" {
		if p.ActiveContract != contract {
			p.ActiveContract = contract
			return p.Save()
		}
		return nil
	}

	found := false
	for _, existingContract := range p.Contracts {
		if existingContract == contract {
			found = true
			break
		}
	}

	needsSave := false
	if !found {
		p.Contracts = append(p.Contracts, contract)
		needsSave = true
	}

	if p.ActiveContract != contract {
		p.ActiveContract = contract
		needsSave = true
	}

	if needsSave {
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// AddContract adds a new contract to the project
func (p *Project) AddContract(contract string) error {
	return p.SetActiveContract(contract)
}

// ------------------------------------------------------------------------------------
// RemoveContract removes a contract from the project
func (p *Project) RemoveContract(contract string) error {
	for i, existingContract := range p.Contracts {
		if existingContract == contract {
			p.Contracts = append(p.Contracts[:i], p.Contracts[i+1:]...)
			if p.ActiveContract == contract {
				p.ActiveContract = ""
			}
			return p.Save()
		}
	}
	return fmt.Errorf("contract %s not found in project", contract)
}

// ------------------------------------------------------------------------------------
// GetActivePeriod returns the currently selected period
func (p *Project) GetActivePeriod() types.Period {
	if p.ActivePeriod == "" {
		return "blockly" // Default fallback for older projects
	}
	return p.ActivePeriod
}

// ------------------------------------------------------------------------------------
// SetActivePeriod sets the currently selected period
func (p *Project) SetActivePeriod(period types.Period) error {
	if p.ActivePeriod != period {
		p.ActivePeriod = period
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// GetFilterState retrieves filter state for a given key
func (p *Project) GetFilterState(key ViewStateKey) (FilterState, bool) {
	p.mu.RLock()
	defer p.mu.RUnlock()
	state, exists := p.FilterStates[key]
	return state, exists
}

// ------------------------------------------------------------------------------------
// SetFilterState sets filter state for a given key and saves immediately (session state)
func (p *Project) SetFilterState(key ViewStateKey, state FilterState) error {
	if p.FilterStates == nil {
		p.FilterStates = make(map[ViewStateKey]FilterState)
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	p.FilterStates[key] = state
	return p.Save()
}

// ------------------------------------------------------------------------------------
// ClearFilterState removes view state for a given key and saves immediately (session state)
func (p *Project) ClearFilterState(key ViewStateKey) error {
	if p.FilterStates != nil {
		p.mu.Lock()
		defer p.mu.Unlock()
		delete(p.FilterStates, key)
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// ClearAllFilterStates removes all filter states and saves immediately (session state)
func (p *Project) ClearAllFilterStates() error {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.FilterStates = make(map[ViewStateKey]FilterState)
	return p.Save()
}

// ------------------------------------------------------------------------------------
// GetLastView returns the last visited view/route
func (p *Project) GetLastView() string {
	p.mu.RLock()
	defer p.mu.RUnlock()
	return p.LastView
}

// ------------------------------------------------------------------------------------
// SetLastView updates the last visited view/route and saves immediately (session state)
func (p *Project) SetLastView(view string) error {
	if p.LastView != view {
		p.LastView = strings.Trim(view, "/")
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// GetLastFacet returns the last visited facet for a specific view
func (p *Project) GetLastFacet(view string) string {
	p.mu.RLock()
	defer p.mu.RUnlock()
	view = strings.Trim(view, "/")
	return p.LastFacetMap[view]
}

// ------------------------------------------------------------------------------------
// SetLastFacet updates the last visited facet for a specific view and saves immediately (session state)
func (p *Project) SetLastFacet(view, facet string) error {
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.LastFacetMap == nil {
		p.LastFacetMap = make(map[string]string)
	}
	view = strings.Trim(view, "/")
	current := p.LastFacetMap[view]
	if current != facet {
		p.LastFacetMap[view] = facet
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// SetViewAndFacet atomically updates both the last view and facet in a single operation
func (p *Project) SetViewAndFacet(view, facet string) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	viewChanged := false
	facetChanged := false

	// Check if view needs updating
	cleanView := strings.Trim(view, "/")
	if p.LastView != cleanView {
		p.LastView = cleanView
		viewChanged = true
	}

	// Check if facet needs updating
	if p.LastFacetMap == nil {
		p.LastFacetMap = make(map[string]string)
	}
	current := p.LastFacetMap[cleanView]
	if current != facet {
		p.LastFacetMap[cleanView] = facet
		facetChanged = true
	}

	// Only save if something actually changed
	if viewChanged || facetChanged {
		return p.Save()
	}
	return nil
}

// ------------------------------------------------------------------------------------
// GetViewStates safely retrieves all filter states for a given view name
func (p *Project) GetViewStates(viewName string) map[string]FilterState {
	p.mu.RLock()
	defer p.mu.RUnlock()

	result := make(map[string]FilterState)
	for key, state := range p.FilterStates {
		if key.ViewName == viewName {
			result[string(key.FacetName)] = state
		}
	}
	return result
}

// ------------------------------------------------------------------------------------
// SetViewStates safely sets all filter states for a given view name
func (p *Project) SetViewStates(viewName string, states map[string]FilterState) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	// Clear existing states for this view
	for key := range p.FilterStates {
		if key.ViewName == viewName {
			delete(p.FilterStates, key)
		}
	}

	// Set new states
	for facetName, state := range states {
		key := ViewStateKey{
			ViewName:  viewName,
			FacetName: types.DataFacet(facetName),
		}
		p.FilterStates[key] = state
	}

	return p.Save()
}
