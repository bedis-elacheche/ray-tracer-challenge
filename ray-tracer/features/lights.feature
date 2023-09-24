Feature: Lights

  Scenario: A point light has a position and intensity
    Given intensity ← color(1, 1, 1)
    And position ← point(0, 0, 0)
    When light ← point_light(position, intensity)
    Then light.position = position
    And light.intensity = intensity

  Scenario Outline: Point lights evaluate the light intensity at a given point
    Given w ← default_world()
    And light ← w.light
    And pt ← <point>
    When intensity ← intensity_at(light, pt, w)
    Then intensity = <result>

    Examples:
      | point                | result |
      | point(0, 1.0001, 0)  | 1.0    |
      | point(-1.0001, 0, 0) | 1.0    |
      | point(0, 0, -1.0001) | 1.0    |
      | point(0, 0, 1.0001)  | 0.0    |
      | point(1.0001, 0, 0)  | 0.0    |
      | point(0, -1.0001, 0) | 0.0    |
      | point(0, 0, 0)       | 0.0    |

  Scenario: Creating an area light
    Given corner ← point(0, 0, 0)
    And v1 ← vector(2, 0, 0)
    And v2 ← vector(0, 0, 1)
    When light ← area_light(corner, v1, 4, v2, 2, color(1, 1, 1))
    Then light.corner = corner
    And light.uvec = vector(0.5, 0, 0)
    And light.usteps = 4
    And light.vvec = vector(0, 0, 0.5)
    And light.vsteps = 2
    And light.samples = 8

  Scenario Outline: Finding a single point on an area light
    Given corner ← point(0, 0, 0)
    And v1 ← vector(2, 0, 0)
    And v2 ← vector(0, 0, 1)
    And light ← area_light(corner, v1, 4, v2, 2, color(1, 1, 1))
    When pt ← point_on_light(light, <u>, <v>)
    Then pt = <result>

    Examples:
      | u | v | result               |
      | 0 | 0 | point(0.25, 0, 0.25) |
      | 1 | 0 | point(0.75, 0, 0.25) |
      | 0 | 1 | point(0.25, 0, 0.75) |
      | 2 | 0 | point(1.25, 0, 0.25) |
      | 3 | 1 | point(1.75, 0, 0.75) |

  Scenario Outline: The area light intensity function
    Given w ← default_world()
    And corner ← point(-0.5, -0.5, -5)
    And v1 ← vector(1, 0, 0)
    And v2 ← vector(0, 1, 0)
    And light ← area_light(corner, v1, 2, v2, 2, color(1, 1, 1))
    And pt ← <point>
    When intensity ← intensity_at(light, pt, w)
    Then intensity = <result>

    Examples:
      | point                | result |
      | point(0, 0, 2)       | 0.0    |
      | point(1, -1, 2)      | 0.25   |
      | point(1.5, 0, 2)     | 0.5    |
      | point(1.25, 1.25, 3) | 0.75   |
      | point(0, 0, -2)      | 1.0    |

  Scenario Outline: Finding a single point on a jittered area light
    Given corner ← point(0, 0, 0)
    And v1 ← vector(2, 0, 0)
    And v2 ← vector(0, 0, 1)
    And light ← area_light(corner, v1, 4, v2, 2, color(1, 1, 1))
    And light.jitter_by ← sequence(0.3, 0.7)
    When pt ← point_on_light(light, <u>, <v>)
    Then pt = <result>

    Examples:
      | u | v | result               |
      | 0 | 0 | point(0.15, 0, 0.35) |
      | 1 | 0 | point(0.65, 0, 0.35) |
      | 0 | 1 | point(0.15, 0, 0.85) |
      | 2 | 0 | point(1.15, 0, 0.35) |
      | 3 | 1 | point(1.65, 0, 0.85) |