package manager

import (
	"errors"
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
)

type Manager[T Persistable] struct {
	OpenItems map[string]T
	ActiveID  string
	itemType  string
}

func NewManager[T Persistable](itemType string) *Manager[T] {
	return &Manager[T]{
		OpenItems: make(map[string]T),
		ActiveID:  "",
		itemType:  itemType,
	}
}

func (m *Manager[T]) GetActiveItem() (T, bool) {
	var zero T
	if m.ActiveID == "" {
		return zero, false
	}
	item, exists := m.OpenItems[m.ActiveID]
	return item, exists
}

func (m *Manager[T]) SetActiveItem(id string) error {
	if m.ActiveID == id {
		return nil
	}

	if _, exists := m.OpenItems[id]; !exists {
		return fmt.Errorf("no item with ID %s exists", id)
	}

	if m.ActiveID != "" {
		if prevItem, exists := m.OpenItems[m.ActiveID]; exists {
			m.minimizeInactiveItem(prevItem)
		}
	}

	m.ActiveID = id
	m.emitEvent("activated")
	return nil
}

func (m *Manager[T]) Create(id string, factory func() T) T {
	item := factory()
	m.OpenItems[id] = item
	m.ActiveID = id
	m.emitEvent("created")
	return item
}

func (m *Manager[T]) Open(path string, loader func(string) (T, error)) (T, error) {
	for id, item := range m.OpenItems {
		if item.GetPath() == path {
			m.ActiveID = id
			m.emitEvent("switched")
			return item, nil
		}
	}

	item, err := loader(path)
	if err != nil {
		var zero T
		return zero, err
	}

	id := path
	m.OpenItems[id] = item
	m.ActiveID = id
	m.emitEvent("opened")
	return item, nil
}

func (m *Manager[T]) Close(id string) error {
	if _, exists := m.OpenItems[id]; !exists {
		return fmt.Errorf("no item with ID %s exists", id)
	}

	delete(m.OpenItems, id)

	if m.ActiveID == id {
		m.ActiveID = ""
		for newID := range m.OpenItems {
			m.ActiveID = newID
			break
		}
	}

	m.emitEvent("closed")
	return nil
}

func (m *Manager[T]) CloseAll() {
	m.OpenItems = make(map[string]T)
	m.ActiveID = ""
	m.emitEvent("all_closed")
}

func (m *Manager[T]) SaveActive() error {
	item, ok := m.GetActiveItem()
	if !ok {
		return errors.New("no active item to save")
	}

	err := item.Save()
	if err == nil {
		m.emitEvent("saved")
	}
	return err
}

func (m *Manager[T]) SaveActiveAs(path string) error {
	item, ok := m.GetActiveItem()
	if !ok {
		return errors.New("no active item to save")
	}

	err := item.SaveAs(path)
	if err == nil {
		m.emitEvent("saved_as")
	}
	return err
}

func (m *Manager[T]) GetOpenIDs() []string {
	ids := make([]string, 0, len(m.OpenItems))
	for id := range m.OpenItems {
		ids = append(ids, id)
	}
	return ids
}

func (m *Manager[T]) GetItemByID(id string) (T, bool) {
	item, exists := m.OpenItems[id]
	return item, exists
}

func (m *Manager[T]) GetItemByPath(path string) (T, bool) {
	var zero T
	for _, item := range m.OpenItems {
		if item.GetPath() == path {
			return item, true
		}
	}
	return zero, false
}

func (m *Manager[T]) emitEvent(action string) {
	msgs.EmitManager(m.itemType + "_" + action)
}

func (m *Manager[T]) minimizeInactiveItem(item T) {
	if optimizer, ok := any(item).(interface{ ClearCache() }); ok {
		optimizer.ClearCache()
	}
}
