Feature: Patterns

  Background:
    Given black ← color(0, 0, 0)
    And white ← color(1, 1, 1)

  Scenario: Creating a stripe pattern
    Given pattern ← stripe_pattern(white, black)
    Then pattern.a = white
    And pattern.b = black

  Scenario: A stripe pattern is constant in y
    Given pattern ← stripe_pattern(white, black)
    Then stripe_at(pattern, point(0, 0, 0)) = white
    And stripe_at(pattern, point(0, 1, 0)) = white
    And stripe_at(pattern, point(0, 2, 0)) = white

  Scenario: A stripe pattern is constant in z
    Given pattern ← stripe_pattern(white, black)
    Then stripe_at(pattern, point(0, 0, 0)) = white
    And stripe_at(pattern, point(0, 0, 1)) = white
    And stripe_at(pattern, point(0, 0, 2)) = white

  Scenario: A stripe pattern alternates in x
    Given pattern ← stripe_pattern(white, black)
    Then stripe_at(pattern, point(0, 0, 0)) = white
    And stripe_at(pattern, point(0.9, 0, 0)) = white
    And stripe_at(pattern, point(1, 0, 0)) = black
    And stripe_at(pattern, point(-0.1, 0, 0)) = black
    And stripe_at(pattern, point(-1, 0, 0)) = black
    And stripe_at(pattern, point(-1.1, 0, 0)) = white

  Scenario: Stripes with an object transformation
    Given object ← sphere()
    And set_transform(object, scaling(2, 2, 2))
    And pattern ← stripe_pattern(white, black)
    When c ← stripe_at_object(pattern, object, point(1.5, 0, 0))
    Then c = white

  Scenario: Stripes with a pattern transformation
    Given object ← sphere()
    And pattern ← stripe_pattern(white, black)
    And set_pattern_transform(pattern, scaling(2, 2, 2))
    When c ← stripe_at_object(pattern, object, point(1.5, 0, 0))
    Then c = white

  Scenario: Stripes with both an object and a pattern transformation
    Given object ← sphere()
    And set_transform(object, scaling(2, 2, 2))
    And pattern ← stripe_pattern(white, black)
    And set_pattern_transform(pattern, translation(0.5, 0, 0))
    When c ← stripe_at_object(pattern, object, point(2.5, 0, 0))
    Then c = white

  Scenario: The default pattern transformation
    Given pattern ← test_pattern()
    Then pattern.transform = identity_matrix

  Scenario: Assigning a transformation
    Given pattern ← test_pattern()
    When set_pattern_transform(pattern, translation(1, 2, 3))
    Then pattern.transform = translation(1, 2, 3)

  Scenario: A pattern with an object transformation
    Given shape ← sphere()
    And set_transform(shape, scaling(2, 2, 2))
    And pattern ← test_pattern()
    When c ← pattern_at_shape(pattern, shape, point(2, 3, 4))
    Then c = color(1, 1.5, 2)

  Scenario: A pattern with a pattern transformation
    Given shape ← sphere()
    And pattern ← test_pattern()
    And set_pattern_transform(pattern, scaling(2, 2, 2))
    When c ← pattern_at_shape(pattern, shape, point(2, 3, 4))
    Then c = color(1, 1.5, 2)

  Scenario: A pattern with both an object and a pattern transformation
    Given shape ← sphere()
    And set_transform(shape, scaling(2, 2, 2))
    And pattern ← test_pattern()
    And set_pattern_transform(pattern, translation(0.5, 1, 1.5))
    When c ← pattern_at_shape(pattern, shape, point(2.5, 3, 3.5))
    Then c = color(0.75, 0.5, 0.25)

  Scenario: A gradient linearly interpolates between colors
    Given pattern ← gradient_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0.25, 0, 0)) = color(0.75, 0.75, 0.75)
    And pattern_at(pattern, point(0.5, 0, 0)) = color(0.5, 0.5, 0.5)
    And pattern_at(pattern, point(0.75, 0, 0)) = color(0.25, 0.25, 0.25)

  Scenario: A ring should extend in both x and z
    Given pattern ← ring_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(1, 0, 0)) = black
    And pattern_at(pattern, point(0, 0, 1)) = black
    # 0.708 = just slightly more than √2/2
    And pattern_at(pattern, point(0.708, 0, 0.708)) = black

  Scenario: Checkers should repeat in x
    Given pattern ← checkers_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0.99, 0, 0)) = white
    And pattern_at(pattern, point(1.01, 0, 0)) = black

  Scenario: Checkers should repeat in y
    Given pattern ← checkers_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0, 0.99, 0)) = white
    And pattern_at(pattern, point(0, 1.01, 0)) = black

  Scenario: Checkers should repeat in z
    Given pattern ← checkers_pattern(white, black)
    Then pattern_at(pattern, point(0, 0, 0)) = white
    And pattern_at(pattern, point(0, 0, 0.99)) = white
    And pattern_at(pattern, point(0, 0, 1.01)) = black

  Scenario Outline: Checker pattern in 2D
    Given checkers ← uv_checkers(2, 2, black, white)
    When color ← uv_pattern_at(checkers, <u>, <v>)
    Then color = <expected>

    Examples:
      | u   | v   | expected |
      | 0.0 | 0.0 | black    |
      | 0.5 | 0.0 | white    |
      | 0.0 | 0.5 | white    |
      | 0.5 | 0.5 | black    |
      | 1.0 | 1.0 | black    |

  Scenario Outline: Using a spherical mapping on a 3D point
    Given p ← <point>
    When (u, v) ← spherical_map(p)
    Then u = <u>
    And v = <v>

    Examples:
      | point                                            | u    | v    |
      | point(0, 0, -1)                                  | 0.0  | 0.5  |
      | point(1, 0, 0)                                   | 0.25 | 0.5  |
      | point(0, 0, 1)                                   | 0.5  | 0.5  |
      | point(-1, 0, 0)                                  | 0.75 | 0.5  |
      | point(0, 1, 0)                                   | 0.5  | 1.0  |
      | point(0, -1, 0)                                  | 0.5  | 0.0  |
      # point(√2/2              , √2/2              , 0) | 0.25 | 0.75 |
      | point(0.7071067811865476, 0.7071067811865476, 0) | 0.25 | 0.75 |

  Scenario Outline: Using a texture map pattern with a spherical map
    Given checkers ← uv_checkers(16, 8, black, white)
    And pattern ← texture_map(checkers, spherical_map)
    Then pattern_at(pattern, <point>) = <color>

    Examples:
      | point                            | color |
      | point(0.4315, 0.4670, 0.7719)    | white |
      | point(-0.9654, 0.2552, -0.0534)  | black |
      | point(0.1039, 0.7090, 0.6975)    | white |
      | point(-0.4986, -0.7856, -0.3663) | black |
      | point(-0.0317, -0.9395, 0.3411)  | black |
      | point(0.4809, -0.7721, 0.4154)   | black |
      | point(0.0285, -0.9612, -0.2745)  | black |
      | point(-0.5734, -0.2162, -0.7903) | white |
      | point(0.7688, -0.1470, 0.6223)   | black |
      | point(-0.7652, 0.2175, 0.6060)   | black |

  Scenario Outline: Using a planar mapping on a 3D point
    Given p ← <point>
    When (u, v) ← planar_map(p)
    Then u = <u>
    And v = <v>

    Examples:
      | point                   | u    | v    |
      | point(0.25, 0, 0.5)     | 0.25 | 0.5  |
      | point(0.25, 0, -0.25)   | 0.25 | 0.75 |
      | point(0.25, 0.5, -0.25) | 0.25 | 0.75 |
      | point(1.25, 0, 0.5)     | 0.25 | 0.5  |
      | point(0.25, 0, -1.75)   | 0.25 | 0.25 |
      | point(1, 0, -1)         | 0.0  | 0.0  |
      | point(0, 0, 0)          | 0.0  | 0.0  |

  Scenario Outline: Using a cylindrical mapping on a 3D point
    Given p ← <point>
    When (u, v) ← cylindrical_map(p)
    Then u = <u>
    And v = <v>

    Examples:
      | point                          | u     | v    |
      | point(0, 0, -1)                | 0.0   | 0.0  |
      | point(0, 0.5, -1)              | 0.0   | 0.5  |
      | point(0, 1, -1)                | 0.0   | 0.0  |
      | point(0.70711, 0.5, -0.70711)  | 0.125 | 0.5  |
      | point(1, 0.5, 0)               | 0.25  | 0.5  |
      | point(0.70711, 0.5, 0.70711)   | 0.375 | 0.5  |
      | point(0, -0.25, 1)             | 0.5   | 0.75 |
      | point(-0.70711, 0.5, 0.70711)  | 0.625 | 0.5  |
      | point(-1, 1.25, 0)             | 0.75  | 0.25 |
      | point(-0.70711, 0.5, -0.70711) | 0.875 | 0.5  |