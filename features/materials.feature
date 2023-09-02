Feature: Materials

  Background:
    Given m ← material()
    And position ← point(0, 0, 0)

  Scenario: The default material
    Given m ← material()
    Then m.color = color(1, 1, 1)
    And m.ambient = 0.1
    And m.diffuse = 0.9
    And m.specular = 0.9
    And m.shininess = 200.0

  Scenario: Reflectivity for the default material
    Given m ← material()
    Then m.reflective = 0.0

  Scenario: Transparency and Refractive Index for the default material
    Given m ← material()
    Then m.transparency = 0.0
    And m.refractive_index = 1.0

  Scenario: Lighting with the eye between the light and the surface
    Given eyev ← vector(0, 0, -1)
    And normalv ← vector(0, 0, -1)
    And light ← point_light(point(0, 0, -10), color(1, 1, 1))
    And in_shadow ← false
    And object ← sphere()
    When result ← lighting(m, object, light, position, eyev, normalv, in_shadow)
    Then result = color(1.9, 1.9, 1.9)

  Scenario: Lighting with the eye between light and surface, eye offset 45°
    #            vector(0, √2/2              , -√2/2)
    Given eyev ← vector(0, 0.7071067811865476, -0.7071067811865476)
    And normalv ← vector(0, 0, -1)
    And light ← point_light(point(0, 0, -10), color(1, 1, 1))
    And object ← sphere()
    And in_shadow ← false
    When result ← lighting(m, object, light, position, eyev, normalv, in_shadow)
    Then result = color(1.0, 1.0, 1.0)

  Scenario: Lighting with eye opposite surface, light offset 45°
    Given eyev ← vector(0, 0, -1)
    And normalv ← vector(0, 0, -1)
    And light ← point_light(point(0, 10, -10), color(1, 1, 1))
    And object ← sphere()
    And in_shadow ← false
    When result ← lighting(m, object, light, position, eyev, normalv, in_shadow)
    Then result = color(0.7364, 0.7364, 0.7364)

  Scenario: Lighting with eye in the path of the reflection vector
    #            vector(0, -√2/2              , -√2/2)
    Given eyev ← vector(0, -0.7071067811865476, -0.7071067811865476)
    And normalv ← vector(0, 0, -1)
    And light ← point_light(point(0, 10, -10), color(1, 1, 1))
    And object ← sphere()
    And in_shadow ← false
    When result ← lighting(m, object, light, position, eyev, normalv, in_shadow)
    Then result = color(1.6364, 1.6364, 1.6364)

  Scenario: Lighting with the light behind the surface
    Given eyev ← vector(0, 0, -1)
    And normalv ← vector(0, 0, -1)
    And light ← point_light(point(0, 0, 10), color(1, 1, 1))
    And object ← sphere()
    And in_shadow ← false
    When result ← lighting(m, object, light, position, eyev, normalv, in_shadow)
    Then result = color(0.1, 0.1, 0.1)


  Scenario: Lighting with the surface in shadow
    Given eyev ← vector(0, 0, -1)
    And normalv ← vector(0, 0, -1)
    And light ← point_light(point(0, 0, -10), color(1, 1, 1))
    And object ← sphere()
    And in_shadow ← true
    When result ← lighting(m, object, light, position, eyev, normalv, in_shadow)
    Then result = color(0.1, 0.1, 0.1)

  Scenario: Lighting with a pattern applied
    Given m.pattern ← stripe_pattern(color(1, 1, 1), color(0, 0, 0))
    And m.ambient ← 1
    And m.diffuse ← 0
    And m.specular ← 0
    And eyev ← vector(0, 0, -1)
    And normalv ← vector(0, 0, -1)
    And light ← point_light(point(0, 0, -10), color(1, 1, 1))
    And object ← sphere()
    When c1 ← lighting(m, object, light, point(0.9, 0, 0), eyev, normalv, false)
    And c2 ← lighting(m, object, light, point(1.1, 0, 0), eyev, normalv, false)
    Then c1 = color(1, 1, 1)
    And c2 = color(0, 0, 0)

  Scenario Outline: lighting() uses light intensity to attenuate color
    Given w ← default_world()
    And w.light ← point_light(point(0, 0, -10), color(1, 1, 1))
    And shape ← the first object in w
    And shape.material.ambient ← 0.1
    And shape.material.diffuse ← 0.9
    And shape.material.specular ← 0
    And shape.material.color ← color(1, 1, 1)
    And pt ← point(0, 0, -1)
    And eyev ← vector(0, 0, -1)
    And normalv ← vector(0, 0, -1)
    When result ← lighting(shape.material, w.light, pt, eyev, normalv, <intensity>)
    Then result = <result>

    Examples:
      | intensity | result                  |
      | 1.0       | color(1, 1, 1)          |
      | 0.5       | color(0.55, 0.55, 0.55) |
      | 0.0       | color(0.1, 0.1, 0.1)    |