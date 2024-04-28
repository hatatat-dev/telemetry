#!/usr/bin/env -S PYTHONPATH=.:lib python3

from lib.geometry import *
import unittest


class TestGeometry(unittest.TestCase):
    def test_compute_angle(self):
        self.assertEqual(compute_angle(0, 0), 0)
        self.assertEqual(compute_angle(10, 30), 20)

        self.assertEqual(compute_angle(90, 269), 179)
        self.assertEqual(compute_angle(90, 271), -179)

    def test_reverse_heading(self):
        self.assertEqual(reverse_heading(30), 210)
        self.assertEqual(reverse_heading(210), 30)

    def test_compute_dimensions_radius(self):
        self.assertAlmostEqual(
            compute_dimensions_radius(FlatDimensions(100, 100)), 70.71, places=2
        )

    def test_compute_heading_range(self):
        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(0, 0, 0), 0), 1800, places=0
        )
        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(100, 0, 0), 0), 1800, places=0
        )
        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(0, 100, 0), 0), 1700, places=0
        )

        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(200, 300, 0), 0), 1500, places=0
        )
        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(200, 300, 90), 0), 1600, places=0
        )
        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(200, 300, 180), 0), 2100, places=0
        )
        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(200, 300, 270), 0), 2000, places=0
        )

        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(0, 0, 0), 100), 1700, places=2
        )

        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(0, 0, 45), 0), 2545, places=0
        )
        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(0, 0, 45), 100), 2404, places=0
        )

        self.assertAlmostEqual(
            compute_heading_range(FlatPosition(1700, 1700, 45), 100), 2404, places=0
        )


if __name__ == "__main__":
    unittest.main()
