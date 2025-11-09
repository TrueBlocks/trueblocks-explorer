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

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	coreTypes "github.com/TrueBlocks/trueblocks-chifra/v6/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

type Project = project.Project
type AddressList struct {
	Address string
	Thing   string
}

// Model implements the sdk.Modeler interface for AddressList
func (a *AddressList) Model(format string, verbose string, extraOpts bool, extraOptions map[string]any) coreTypes.Model {
	return coreTypes.Model{
		Data: map[string]any{
			"address": a.Address,
			"thing":   a.Thing,
		},
		Order: []string{"address", "thing"},
	}
}

// EXISTING_CODE

var (
	addresslistStore   = make(map[string]*store.Store[AddressList])
	addresslistStoreMu sync.Mutex

	projectsStore   = make(map[string]*store.Store[Project])
	projectsStoreMu sync.Mutex
)

func (c *ProjectsCollection) getAddressListStore(projectID string) *store.Store[AddressList] {
	addresslistStoreMu.Lock()
	defer addresslistStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := fmt.Sprintf("project_%s", projectID)
	theStore := addresslistStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			if c.projectManager == nil {
				return fmt.Errorf("project manager not available")
			}

			project := c.projectManager.GetProjectByID(projectID)
			if project == nil {
				return fmt.Errorf("project %s not found", projectID)
			}

			addresses := project.GetAddresses()
			for _, addr := range addresses {
				item := &AddressList{
					Address: addr.Hex(),
					Thing:   project.GetName(), // You might want to customize this
				}
				ctx.ModelChan <- item
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *AddressList {
			if it, ok := item.(*AddressList); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *AddressList) (key string, includeInMap bool) {
			return "", false
		}

		storeName := fmt.Sprintf("projects-addresslist-project-%s", projectID)
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

func GetProjectsCollection(payload *types.Payload, projectManager *project.Manager) *ProjectsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewProjectsCollection(payload, projectManager)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	// EXISTING_CODE
	return fmt.Sprintf("%s_%s", payload.ActiveChain, payload.ActiveAddress)
}

// EXISTING_CODE
// EXISTING_CODE
