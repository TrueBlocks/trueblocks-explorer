package annotate

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"math"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"git.sr.ht/~sbinet/gg"
	"github.com/lucasb-eyer/go-colorful"
)

// Annotate reads an image and adds a text annotation to it either at the top
// (location == "top") or the bottom (otherwise). The annotation is placed on
// an appropriately colored background and rendered in a text color that
// ensures good contrast and readability.
func Annotate(text, fileName, location string, annoPct float64) (ret string, err error) {
	cleanName := filepath.Clean(fileName)
	if !strings.Contains(cleanName, string(os.PathSeparator)+"generated"+string(os.PathSeparator)) && !strings.HasSuffix(cleanName, string(os.PathSeparator)+"generated"+string(os.PathSeparator)+filepath.Base(cleanName)) {
		return "", fmt.Errorf("invalid image path: %s", fileName)
	}
	file, err := os.Open(cleanName) // #nosec G304 - validated
	if err != nil {
		return "", err
	}
	defer func() { _ = file.Close() }()

	img, _, err := image.Decode(file)
	if err != nil {
		return "", err
	}
	width := img.Bounds().Dx()
	height := img.Bounds().Dy()
	lenText := len(text)
	estimatedFontSize := 30. * (float64(width) / float64(lenText*7.))
	textWidth := float64(width) * 0.95
	lines := math.Ceil(float64(lenText) / (textWidth / estimatedFontSize))
	marginHeight := float64(height) * 0.025
	annoHeight := lines * estimatedFontSize * 1.5
	newHeight := height + int(annoHeight+marginHeight*2)

	newImg := image.NewRGBA(image.Rect(0, 0, width, newHeight))
	draw.Draw(newImg, newImg.Bounds(), img, img.Bounds().Min, draw.Src)

	bgColor, _ := findAverageDominantColor(img)
	col, err := parseHexColor(bgColor)
	if err != nil {
		return "", err
	}

	bgRect := image.Rect(0, height, width, newHeight)
	if location == "top" {
		bgRect = image.Rect(0, 0, width, int(annoHeight+marginHeight*2))
		draw.Draw(newImg, bgRect, &image.Uniform{col}, image.Point{}, draw.Src)
	} else {
		draw.Draw(newImg, bgRect, &image.Uniform{col}, image.Point{}, draw.Src)
	}

	gc := gg.NewContextForImage(newImg)
	if err := gc.LoadFontFace("/System/Library/Fonts/Monaco.ttf", estimatedFontSize); err != nil {
		return "", fmt.Errorf("load font: %w", err)
	}
	borderCol := darkenColor(col)
	gc.SetColor(borderCol)
	gc.SetLineWidth(2)
	if location == "top" {
		gc.DrawLine(0, float64(height)*annoPct, float64(width), float64(height)*annoPct)
	} else {
		gc.DrawLine(0, float64(height), float64(width), float64(height))
	}
	gc.Stroke()

	textColor, _ := contrastColor(col)
	gc.SetColor(textColor)
	gc.DrawStringWrapped(text, float64(width)/2, float64(height)+marginHeight*2, 0.5, 0.35, textWidth, 1.5, gg.AlignLeft)

	outputPath := strings.ReplaceAll(fileName, "generated/", "annotated/")
	outputPath = filepath.Clean(outputPath)
	if !strings.Contains(outputPath, string(os.PathSeparator)+"annotated"+string(os.PathSeparator)) {
		return "", fmt.Errorf("invalid output path: %s", outputPath)
	}
	out, err := os.OpenFile(outputPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o600)
	if err != nil {
		return "", err
	}
	defer func() { _ = out.Close() }()

	if err = png.Encode(out, gc.Image()); err != nil {
		return "", err
	}
	return outputPath, nil
}

func darkenColor(c color.Color) color.Color {
	r, g, b, a := c.RGBA()
	factor := 0.9
	return color.RGBA{R: uint8((uint32(float64(r)*factor) >> 8) & 0xFF), G: uint8((uint32(float64(g)*factor) >> 8) & 0xFF), B: uint8((uint32(float64(b)*factor) >> 8) & 0xFF), A: uint8((a >> 8) & 0xFF)}
}

func parseHexColor(s string) (color.Color, error) {
	c, err := strconv.ParseUint(strings.TrimPrefix(s, "#"), 16, 32)
	if err != nil {
		return nil, err
	}
	return color.RGBA{R: uint8((c >> 16) & 0xFF), G: uint8((c >> 8) & 0xFF), B: uint8(c & 0xFF), A: 0xFF}, nil
}

func findAverageDominantColor(img image.Image) (string, error) {
	colorFrequency := make(map[colorful.Color]int)
	bounds := img.Bounds()
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			col, ok := colorful.MakeColor(img.At(x, y))
			if !ok {
				return "", fmt.Errorf("failed to parse color at %d, %d", x, y)
			}
			colorFrequency[col]++
		}
	}
	type kv struct {
		Key   colorful.Color
		Value int
	}
	ss := make([]kv, 0, len(colorFrequency))
	for k, v := range colorFrequency {
		ss = append(ss, kv{k, v})
	}
	sort.Slice(ss, func(i, j int) bool { return ss[i].Value > ss[j].Value })
	topColors := make([]colorful.Color, 0, 3)
	for i := 0; i < len(ss) && i < 3; i++ {
		topColors = append(topColors, ss[i].Key)
	}
	var r, g, b float64
	for _, col := range topColors {
		tr, tg, tb := col.RGB255()
		r += float64(tr)
		g += float64(tg)
		b += float64(tb)
	}
	count := float64(len(topColors))
	avgColor := colorful.Color{R: r / count / 255, G: g / count / 255, B: b / count / 255}
	return avgColor.Hex(), nil
}

func contrastColor(cIn color.Color) (color.Color, float64) {
	c, _ := colorful.MakeColor(cIn)
	_, _, l := c.Hcl()
	white := colorful.Color{R: 1, G: 1, B: 1}
	black := colorful.Color{R: 0, G: 0, B: 0}
	var contrast colorful.Color
	if l < 0.5 {
		contrast = white
	} else {
		contrast = black
	}
	r, g, b := contrast.RGB255()
	return color.RGBA{R: r, G: g, B: b, A: 255}, l
}
