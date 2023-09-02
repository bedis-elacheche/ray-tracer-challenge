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