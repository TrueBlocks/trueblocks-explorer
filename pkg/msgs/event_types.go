package msgs

type EventType string

const (
	EventStatus         EventType = "statusbar:status"
	EventError          EventType = "statusbar:error"
	EventManager        EventType = "manager:change"
	EventProjectModal   EventType = "project:modal"
	EventAddressChanged EventType = "address:changed"
	EventChainChanged   EventType = "chain:changed"
	EventPeriodChanged  EventType = "period:changed"
	EventDataLoaded     EventType = "data:loaded"
	EventDataReloaded   EventType = "data:reloaded"
	EventTabCycle       EventType = "hotkey:tab-cycle"
	EventImagesChanged  EventType = "images:changed"
	EventProjectOpened  EventType = "project:opened"
	EventRowAction      EventType = "action:row"
)

var AllMessages = []struct {
	Value  EventType `json:"value"`
	TSName string    `json:"tsname"`
}{
	{EventStatus, "STATUS"},
	{EventError, "ERROR"},
	{EventManager, "MANAGER"},
	{EventProjectModal, "PROJECT_MODAL"},
	{EventAddressChanged, "ADDRESS_CHANGED"},
	{EventChainChanged, "CHAIN_CHANGED"},
	{EventPeriodChanged, "PERIOD_CHANGED"},
	{EventDataLoaded, "DATA_LOADED"},
	{EventDataReloaded, "DATA_RELOADED"},
	{EventTabCycle, "TAB_CYCLE"},
	{EventImagesChanged, "IMAGES_CHANGED"},
	{EventProjectOpened, "PROJECT_OPENED"},
	{EventRowAction, "ROW_ACTION"},
}
