package types

import "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/crud"

type Crud string

var AllCruds = []struct {
	Value  crud.Operation `json:"value"`
	TSName string         `json:"tsname"`
}{
	{crud.Create, "CREATE"},
	{crud.Update, "UPDATE"},
	{crud.Delete, "DELETE"},
	{crud.Undelete, "UNDELETE"},
	{crud.Remove, "REMOVE"},
	{crud.Autoname, "AUTONAME"},
}
