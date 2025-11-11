package manager

type Persistable interface {
	Save() error
	SaveAs(string) error
	GetPath() string
	GetName() string
	String() string
}
