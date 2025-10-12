package types

type Buckets struct {
	Series0      []Bucket    `json:"series0"`
	Series0Stats BucketStats `json:"series0Stats"`

	Series1      []Bucket    `json:"series1"`
	Series1Stats BucketStats `json:"series1Stats"`

	Series2      []Bucket    `json:"series2"`
	Series2Stats BucketStats `json:"series2Stats"`

	Series3      []Bucket    `json:"series3"`
	Series3Stats BucketStats `json:"series3Stats"`

	GridInfo GridInfo `json:"gridInfo"`
}

type Bucket struct {
	BucketKey  string  `json:"bucketIndex"`
	StartBlock uint64  `json:"startBlock"`
	EndBlock   uint64  `json:"endBlock"`
	Total      float64 `json:"total"`
	ColorValue float64 `json:"colorValue"`
}

type BucketStats struct {
	Total   float64 `json:"total"`
	Average float64 `json:"average"`
	Min     float64 `json:"min"`
	Max     float64 `json:"max"`
	Count   int     `json:"count"`
}

type GridInfo struct {
	Rows        int    `json:"rows"`
	Columns     int    `json:"columns"`
	MaxBlock    uint64 `json:"maxBlock"`
	Size        uint64 `json:"size"`
	BucketCount int    `json:"bucketCount"`
}
