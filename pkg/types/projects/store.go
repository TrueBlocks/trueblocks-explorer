// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package projects

// EXISTING_CODE
import (
	"fmt"
	"sync"
	"time"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	coreTypes "github.com/TrueBlocks/trueblocks-chifra/v6/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/manager"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"
)

type Project = project.Project
type AddressList struct {
	Address     string `json:"address"`
	AddressName string `json:"addressName"`
	Name        string `json:"name"`
	Appearances int    `json:"appearances"`
	LastUpdated string `json:"lastUpdated"`
}

// Model implements the sdk.Modeler interface for AddressList
func (a *AddressList) Model(format string, verbose string, extraOpts bool, extraOptions map[string]any) coreTypes.Model {
	return coreTypes.Model{
		Data: map[string]any{
			"address":     a.Address,
			"name":        a.Name,
			"appearances": a.Appearances,
			"lastUpdated": a.LastUpdated,
		},
		Order: []string{"address", "name", "appearances", "lastUpdated"},
	}
}

// EXISTING_CODE

var (
	addresslistStore   = make(map[string]*store.Store[AddressList])
	addresslistStoreMu sync.Mutex

	projectsStore   = make(map[string]*store.Store[Project])
	projectsStoreMu sync.Mutex
)

func (c *ProjectsCollection) getAddressListStore(payload *types.Payload) *store.Store[AddressList] {
	addresslistStoreMu.Lock()
	defer addresslistStoreMu.Unlock()

	// EXISTING_CODE
	facet := payload.DataFacet
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := addresslistStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			projectID := string(payload.DataFacet)
			if c.projectsManager == nil {
				return fmt.Errorf("project manager not available")
			}

			project, ok := c.projectsManager.GetItemByID(projectID)
			if !ok {
				return fmt.Errorf("project %s not found", projectID)
			}

			addresses := project.GetAddresses()
			for _, addr := range addresses {
				// Try to get the actual name for the address from the names database
				addressName := addr.Hex() // default to hex address
				if name, found := names.NameFromAddress(addr); found && name.Name != "" {
					addressName = name.Name
				}

				item := &AddressList{
					Address:     addr.Hex(),
					Name:        addressName,
					Appearances: 0,                               // TODO: Get actual appearances count
					LastUpdated: time.Now().Format(time.RFC3339), // Set current time as placeholder
				}
				ctx.ModelChan <- item
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *AddressList {
			if it, ok := item.(*AddressList); ok {
				it.AddressName = names.NameAddressStr(it.Address)
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *AddressList) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		addresslistStore[storeKey] = theStore
	}

	return theStore
}

func (c *ProjectsCollection) getProjectsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Project] {
	projectsStoreMu.Lock()
	defer projectsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := projectsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// The Projects Manage facet uses useActiveProject hook instead of this store.
			// Projects are managed through dedicated APIs (GetOpenProjects, RestoreProjectContext, etc.)
			// rather than the standard collection/store pattern used by other data facets.
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Project {
			if it, ok := item.(*Project); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Project) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		projectsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ProjectsCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""

	// EXISTING_CODE
	if facet != ProjectsManage {
		return fmt.Sprintf("projects-addresslist-project-%s", string(payload.DataFacet))
	}
	// EXISTING_CODE

	switch facet {
	case ProjectsManage:
		name = "projects-projects"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*ProjectsCollection)
	collectionsMu sync.Mutex
)

func GetProjectsCollection(payload *types.Payload, projectsManager *manager.Manager[*project.Project]) *ProjectsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewProjectsCollection(payload, projectsManager)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	if payload.DataFacet != ProjectsManage {
		return fmt.Sprintf("project_%s", payload.DataFacet)
	}
	// EXISTING_CODE
	return fmt.Sprintf("%s_%s", payload.ActiveChain, payload.ActiveAddress)
}

// EXISTING_CODE
// EXISTING_CODE
