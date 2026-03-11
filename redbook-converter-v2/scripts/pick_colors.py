#!/usr/bin/env python3
"""
Simple color picker for template calibration.

Usage:
  python3 scripts/pick_colors.py <image> --roi x,y,w,h [--name label]
  python3 scripts/pick_colors.py <image> --point x,y [--radius 5] [--name label]

Example:
  python3 scripts/pick_colors.py ref.jpg --roi 640,520,60,640 --name outer_bg
"""

import argparse
from pathlib import Path
from PIL import Image
import numpy as np


def rgb_to_hex(rgb):
    r, g, b = [int(round(v)) for v in rgb]
    return f"#{r:02X}{g:02X}{b:02X}"


def summarize(arr):
    flat = arr.reshape(-1, 3).astype(np.float64)
    mean = flat.mean(axis=0)
    median = np.median(flat, axis=0)
    std = flat.std(axis=0)
    return mean, median, std


def parse_csv_ints(s, n):
    vals = [int(x.strip()) for x in s.split(',')]
    if len(vals) != n:
        raise ValueError(f"expected {n} comma-separated ints, got: {s}")
    return vals


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('image')
    ap.add_argument('--roi', help='x,y,w,h')
    ap.add_argument('--point', help='x,y')
    ap.add_argument('--radius', type=int, default=5)
    ap.add_argument('--name', default='sample')
    ap.add_argument('--min-luma', type=float, default=None, help='optional luma lower bound [0-255]')
    ap.add_argument('--max-luma', type=float, default=None, help='optional luma upper bound [0-255]')
    args = ap.parse_args()

    if not args.roi and not args.point:
        ap.error('provide --roi or --point')

    img = Image.open(args.image).convert('RGB')
    a = np.array(img)
    h, w, _ = a.shape

    if args.roi:
        x, y, rw, rh = parse_csv_ints(args.roi, 4)
        x0, y0 = max(0, x), max(0, y)
        x1, y1 = min(w, x + rw), min(h, y + rh)
        region = a[y0:y1, x0:x1]
    else:
        x, y = parse_csv_ints(args.point, 2)
        r = max(0, args.radius)
        x0, y0 = max(0, x - r), max(0, y - r)
        x1, y1 = min(w, x + r + 1), min(h, y + r + 1)
        region = a[y0:y1, x0:x1]

    if region.size == 0:
        raise SystemExit('empty sample region')

    flat = region.reshape(-1, 3).astype(np.float64)
    luma = 0.2126 * flat[:, 0] + 0.7152 * flat[:, 1] + 0.0722 * flat[:, 2]
    keep = np.ones(len(flat), dtype=bool)
    if args.min_luma is not None:
        keep &= luma >= args.min_luma
    if args.max_luma is not None:
        keep &= luma <= args.max_luma
    filtered = flat[keep]
    if len(filtered) == 0:
        filtered = flat

    mean = filtered.mean(axis=0)
    median = np.median(filtered, axis=0)
    std = filtered.std(axis=0)

    print(f"name: {args.name}")
    print(f"pixels_used: {len(filtered)}")
    print(f"mean_rgb: {tuple(round(v,2) for v in mean)}  {rgb_to_hex(mean)}")
    print(f"median_rgb: {tuple(round(v,2) for v in median)}  {rgb_to_hex(median)}")
    print(f"std_rgb: {tuple(round(v,2) for v in std)}")


if __name__ == '__main__':
    main()
