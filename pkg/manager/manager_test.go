package manager

import "testing"

type MockItem struct {
	name string
	path string
}

func (m *MockItem) Save() error         { return nil }
func (m *MockItem) SaveAs(string) error { return nil }
func (m *MockItem) GetPath() string     { return m.path }
func (m *MockItem) GetName() string     { return m.name }
func (m *MockItem) String() string      { return m.name }

func TestNewManager(t *testing.T) {
	manager := NewManager[*MockItem]("test")
	if manager.ActiveID != "" {
		t.Error("Expected empty ActiveID")
	}
	if len(manager.OpenItems) != 0 {
		t.Error("Expected empty OpenItems")
	}
}

func TestCreate(t *testing.T) {
	manager := NewManager[*MockItem]("test")
	item := manager.Create("test1", func() *MockItem {
		return &MockItem{name: "Test Item", path: "/test"}
	})

	if item.GetName() != "Test Item" {
		t.Error("Expected Test Item")
	}
	if manager.ActiveID != "test1" {
		t.Error("Expected test1 as active")
	}
}

func TestGetActiveItem(t *testing.T) {
	manager := NewManager[*MockItem]("test")

	// No active item
	_, ok := manager.GetActiveItem()
	if ok {
		t.Error("Expected no active item")
	}

	// Create and get active item
	manager.Create("test1", func() *MockItem {
		return &MockItem{name: "Test Item", path: "/test"}
	})

	item, ok := manager.GetActiveItem()
	if !ok {
		t.Error("Expected active item")
	}
	if item.GetName() != "Test Item" {
		t.Error("Expected Test Item")
	}
}

func TestOpen(t *testing.T) {
	manager := NewManager[*MockItem]("test")

	item, err := manager.Open("/test/path", func(path string) (*MockItem, error) {
		return &MockItem{name: "Loaded Item", path: path}, nil
	})

	if err != nil {
		t.Error("Unexpected error")
	}
	if item.GetPath() != "/test/path" {
		t.Error("Expected /test/path")
	}
	if manager.ActiveID != "/test/path" {
		t.Error("Expected /test/path as active ID")
	}
}
