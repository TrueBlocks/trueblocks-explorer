package comparitoor

import (
	"bufio"
	"bytes"
	_ "embed"
	"encoding/csv"
	"strconv"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

//go:embed testdata/alchemy.csv
var alchemyCSV []byte

//go:embed testdata/chifra.csv
var chifraCSV []byte

//go:embed testdata/etherscan.csv
var etherscanCSV []byte

//go:embed testdata/covalent.csv
var covalentCSV []byte

func parseCSVToTransactions(data []byte) []*Transaction {
	r := csv.NewReader(bufio.NewReader(bytes.NewReader(data)))
	records, err := r.ReadAll()
	if err != nil || len(records) < 2 {
		return nil
	}
	var out []*Transaction
	for _, rec := range records[1:] { // skip header
		if len(rec) < 2 {
			continue
		}
		blk, err1 := strconv.ParseUint(rec[0], 10, 64)
		idx, err2 := strconv.ParseUint(rec[1], 10, 64)
		if err1 != nil || err2 != nil {
			continue
		}
		tx := sdk.Transaction{
			BlockNumber:      base.Blknum(blk),
			TransactionIndex: base.Txnum(idx),
		}
		out = append(out, &tx)
	}
	return out
}

var mockChifra = parseCSVToTransactions(chifraCSV)
var mockEtherscan = parseCSVToTransactions(etherscanCSV)
var mockCovalent = parseCSVToTransactions(covalentCSV)
var mockAlchemy = parseCSVToTransactions(alchemyCSV)
