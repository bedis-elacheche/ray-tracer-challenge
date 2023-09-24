Feature: Bounds

    Scenario: Creating an empty bounding box
        Given box ← bounding_box(empty)
        Then box.min = point(infinity, infinity, infinity)
        And box.max = point(-infinity, -infinity, -infinity)

    Scenario: Creating a bounding box with volume
        Given box ← bounding_box(min=point(-1, -2, -3) max=point(3, 2, 1))
        Then box.min = point(-1, -2, -3)
        And box.max = point(3, 2, 1)

    Scenario: Adding points to an empty bounding box
        Given box ← bounding_box(empty)
        And p1 ← point(-5, 2, 0)
        And p2 ← point(7, 0, -3)
        When p1 is added to box
        And p2 is added to box
        Then box.min = point(-5, 0, -3)
        And box.max = point(7, 2, 0)

    Scenario: Adding one bounding box to another
        Given box1 ← bounding_box(min=point(-5, -2, 0) max=point(7, 4, 4))
        And box2 ← bounding_box(min=point(8, -7, -2) max=point(14, 2, 8))
        When box2 is added to box1
        Then box1.min = point(-5, -7, -2)
        And box1.max = point(14, 4, 8)

    Scenario Outline: Checking to see if a box contains a given point
        Given box ← bounding_box(min=point(5, -2, 0) max=point(11, 4, 7))
        And p ← <point>
        Then box_contains_point(box, p) is <result>

        Examples:
            | point           | result |
            | point(5, -2, 0) | true   |
            | point(11, 4, 7) | true   |
            | point(8, 1, 3)  | true   |
            | point(3, 0, 3)  | false  |
            | point(8, -4, 3) | false  |
            | point(8, 1, -1) | false  |
            | point(13, 1, 3) | false  |
            | point(8, 5, 3)  | false  |
            | point(8, 1, 8)  | false  |

    Scenario Outline: Checking to see if a box contains a given box
        Given box ← bounding_box(min=point(5, -2, 0) max=point(11, 4, 7))
        And box2 ← bounding_box(min=<min> max=<max>)
        Then box_contains_box(box, box2) is <result>

        Examples:
            | min              | max             | result |
            | point(5, -2, 0)  | point(11, 4, 7) | true   |
            | point(6, -1, 1)  | point(10, 3, 6) | true   |
            | point(4, -3, -1) | point(10, 3, 6) | false  |
            | point(6, -1, 1)  | point(12, 5, 8) | false  |

    Scenario: Transforming a bounding box
        Given box ← bounding_box(min=point(-1, -1, -1) max=point(1, 1, 1))
        And matrix ← rotation_x(π / 4) * rotation_y(π / 4)
        When box2 ← transform(box, matrix)
        Then box2.min = point(-1.4142, -1.7071, -1.7071)
        And box2.max = point(1.4142, 1.7071, 1.7071)


    Scenario Outline: Intersecting a ray with a bounding box at the origin
        Given box ← bounding_box(min=point(-1, -1, -1) max=point(1, 1, 1))
        And direction ← normalize(<direction>)
        And r ← ray(<origin>, direction)
        Then intersects(box, r) is <result>

        Examples:
            | origin            | direction        | result |
            | point(5, 0.5, 0)  | vector(-1, 0, 0) | true   |
            | point(-5, 0.5, 0) | vector(1, 0, 0)  | true   |
            | point(0.5, 5, 0)  | vector(0, -1, 0) | true   |
            | point(0.5, -5, 0) | vector(0, 1, 0)  | true   |
            | point(0.5, 0, 5)  | vector(0, 0, -1) | true   |
            | point(0.5, 0, -5) | vector(0, 0, 1)  | true   |
            | point(0, 0.5, 0)  | vector(0, 0, 1)  | true   |
            | point(-2, 0, 0)   | vector(2, 4, 6)  | false  |
            | point(0, -2, 0)   | vector(6, 2, 4)  | false  |
            | point(0, 0, -2)   | vector(4, 6, 2)  | false  |
            | point(2, 0, 2)    | vector(0, 0, -1) | false  |
            | point(0, 2, 2)    | vector(0, -1, 0) | false  |
            | point(2, 2, 0)    | vector(-1, 0, 0) | false  |

    Scenario Outline: Intersecting a ray with a non-cubic bounding box
        Given box ← bounding_box(min=point(5, -2, 0) max=point(11, 4, 7))
        And direction ← normalize(<direction>)
        And r ← ray(<origin>, direction)
        Then intersects(box, r) is <result>

        Examples:
            | origin           | direction        | result |
            | point(15, 1, 2)  | vector(-1, 0, 0) | true   |
            | point(-5, -1, 4) | vector(1, 0, 0)  | true   |
            | point(7, 6, 5)   | vector(0, -1, 0) | true   |
            | point(9, -5, 6)  | vector(0, 1, 0)  | true   |
            | point(8, 2, 12)  | vector(0, 0, -1) | true   |
            | point(6, 0, -5)  | vector(0, 0, 1)  | true   |
            | point(8, 1, 3.5) | vector(0, 0, 1)  | true   |
            | point(9, -1, -8) | vector(2, 4, 6)  | false  |
            | point(8, 3, -4)  | vector(6, 2, 4)  | false  |
            | point(9, -1, -2) | vector(4, 6, 2)  | false  |
            | point(4, 0, 9)   | vector(0, 0, -1) | false  |
            | point(8, 6, -1)  | vector(0, -1, 0) | false  |
            | point(12, 5, 4)  | vector(-1, 0, 0) | false  |

    Scenario: Splitting a perfect cube
        Given box ← bounding_box(min=point(-1, -4, -5) max=point(9, 6, 5))
        When (left, right) ← split_bounds(box)
        Then left.min = point(-1, -4, -5)
        And left.max = point(4, 6, 5)
        And right.min = point(4, -4, -5)
        And right.max = point(9, 6, 5)

    Scenario: Splitting an x-wide box
        Given box ← bounding_box(min=point(-1, -2, -3) max=point(9, 5.5, 3))
        When (left, right) ← split_bounds(box)
        Then left.min = point(-1, -2, -3)
        And left.max = point(4, 5.5, 3)
        And right.min = point(4, -2, -3)
        And right.max = point(9, 5.5, 3)

    Scenario: Splitting a y-wide box
        Given box ← bounding_box(min=point(-1, -2, -3) max=point(5, 8, 3))
        When (left, right) ← split_bounds(box)
        Then left.min = point(-1, -2, -3)
        And left.max = point(5, 3, 3)
        And right.min = point(-1, 3, -3)
        And right.max = point(5, 8, 3)

    Scenario: Splitting a z-wide box
        Given box ← bounding_box(min=point(-1, -2, -3) max=point(5, 3, 7))
        When (left, right) ← split_bounds(box)
        Then left.min = point(-1, -2, -3)
        And left.max = point(5, 3, 2)
        And right.min = point(-1, -2, 2)
        And right.max = point(5, 3, 7)